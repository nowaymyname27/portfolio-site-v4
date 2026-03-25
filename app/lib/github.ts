type GithubPullRequestNode = {
  title: string;
  url: string;
  mergedAt: string;
  repository: {
    nameWithOwner: string;
    isPrivate: boolean;
    url: string;
  };
};

type GithubGraphqlResponse = {
  data?: {
    search: {
      nodes: Array<GithubPullRequestNode | null>;
    };
  };
  errors?: Array<{ message: string }>;
};

type GithubRepository = {
  full_name: string;
  private: boolean;
  html_url: string;
};

type GithubCommit = {
  html_url: string;
  commit: {
    message: string;
    author?: {
      date?: string;
    };
  };
  repository?: {
    full_name?: string;
  };
};

type VercelDeployment = {
  uid: string;
  name: string;
  url?: string;
  alias?: string[];
  createdAt: number;
  target?: string;
  state?: string;
};

type VercelDeploymentsResponse = {
  deployments?: VercelDeployment[];
};

type ContributionType = "PR" | "Commit" | "Deploy";

export type ContributionItem = {
  id: string;
  type: ContributionType;
  title: string;
  url: string;
  occurredAt: string;
  sourceName: string;
  sourceUrl: string;
  isOpenSource?: boolean;
};

export type ContributionColumnsFeed = {
  openSourcePullRequests: ContributionItem[];
  ownRepoCommits: ContributionItem[];
  deployments: ContributionItem[];
  partialError: boolean;
};

const GITHUB_GRAPHQL_ENDPOINT = "https://api.github.com/graphql";
const GITHUB_REST_ENDPOINT = "https://api.github.com";
const VERCEL_REST_ENDPOINT = "https://api.vercel.com";

function getGithubToken(): string {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    throw new Error("Missing GITHUB_TOKEN environment variable.");
  }

  return token;
}

function getCommitTitle(message: string): string {
  const [firstLine] = message.split("\n");
  return firstLine || "Commit";
}

async function getMergedPullRequests(
  username: string,
  limit = 10,
): Promise<ContributionItem[]> {
  const token = getGithubToken();

  const query = `
    query RecentMergedPRs($searchQuery: String!, $first: Int!) {
      search(query: $searchQuery, type: ISSUE, first: $first) {
        nodes {
          ... on PullRequest {
            title
            url
            mergedAt
            repository {
              nameWithOwner
              isPrivate
              url
            }
          }
        }
      }
    }
  `;

  const searchQuery = `is:pr is:merged author:${username} sort:updated-desc`;

  const response = await fetch(GITHUB_GRAPHQL_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      variables: {
        searchQuery,
        first: limit,
      },
    }),
    next: { revalidate: 21600 },
  });

  if (!response.ok) {
    throw new Error(`GitHub GraphQL failed with status ${response.status}.`);
  }

  const result = (await response.json()) as GithubGraphqlResponse;

  if (result.errors?.length) {
    throw new Error(result.errors[0].message);
  }

  const nodes = result.data?.search.nodes ?? [];

  return nodes
    .filter((node): node is GithubPullRequestNode => {
      return Boolean(node?.mergedAt && node?.repository?.nameWithOwner);
    })
    .map((node) => ({
      id: node.url,
      type: "PR",
      title: node.title,
      url: node.url,
      occurredAt: node.mergedAt,
      sourceName: node.repository.nameWithOwner,
      sourceUrl: node.repository.url,
      isOpenSource: !node.repository.isPrivate,
    }));
}

function getRepositoryOwner(nameWithOwner: string): string {
  const [owner] = nameWithOwner.split("/");
  return owner ?? "";
}

async function getOwnedRepositoryCommits(
  username: string,
  repositoryLimit = 8,
  commitsPerRepository = 2,
): Promise<ContributionItem[]> {
  const token = getGithubToken();

  const repositoriesResponse = await fetch(
    `${GITHUB_REST_ENDPOINT}/users/${username}/repos?type=owner&sort=updated&per_page=${repositoryLimit}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
      },
      next: { revalidate: 21600 },
    },
  );

  if (!repositoriesResponse.ok) {
    throw new Error(`GitHub repos request failed with status ${repositoriesResponse.status}.`);
  }

  const repositories = (await repositoriesResponse.json()) as GithubRepository[];

  const commitResults = await Promise.all(
    repositories.map(async (repository) => {
      const commitsResponse = await fetch(
        `${GITHUB_REST_ENDPOINT}/repos/${repository.full_name}/commits?author=${username}&per_page=${commitsPerRepository}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github+json",
          },
          next: { revalidate: 21600 },
        },
      );

      if (!commitsResponse.ok) {
        return [] as ContributionItem[];
      }

      const commits = (await commitsResponse.json()) as GithubCommit[];

      return commits
        .filter((commit) => Boolean(commit.commit?.author?.date))
        .map((commit) => ({
          id: commit.html_url,
          type: "Commit" as const,
          title: getCommitTitle(commit.commit.message),
          url: commit.html_url,
          occurredAt: commit.commit.author?.date ?? new Date(0).toISOString(),
          sourceName: repository.full_name,
          sourceUrl: repository.html_url,
          isOpenSource: !repository.private,
        }));
    }),
  );

  return commitResults.flat();
}

async function getRecentVercelDeployments(limit = 10): Promise<ContributionItem[]> {
  const token = process.env.VERCEL_TOKEN;

  if (!token) {
    throw new Error("Missing VERCEL_TOKEN environment variable.");
  }

  const teamId = process.env.VERCEL_TEAM_ID;
  const teamQuery = teamId ? `&teamId=${teamId}` : "";

  const response = await fetch(
    `${VERCEL_REST_ENDPOINT}/v6/deployments?limit=${limit}&target=production${teamQuery}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      next: { revalidate: 21600 },
    },
  );

  if (!response.ok) {
    throw new Error(`Vercel deployments request failed with status ${response.status}.`);
  }

  const result = (await response.json()) as VercelDeploymentsResponse;
  const deployments = result.deployments ?? [];

  return deployments
    .filter((deployment) => deployment.state === "READY")
    .map((deployment) => {
      const publicUrl = deployment.alias?.[0]
        ? `https://${deployment.alias[0]}`
        : `https://${deployment.url}`;

      return {
        id: deployment.uid,
        type: "Deploy" as const,
        title: `Deployment for ${deployment.name}`,
        url: publicUrl,
        occurredAt: new Date(deployment.createdAt).toISOString(),
        sourceName: deployment.name,
        sourceUrl: publicUrl,
      };
    });
}

function sortByNewest(items: ContributionItem[]): ContributionItem[] {
  return items
    .slice()
    .sort(
      (left, right) =>
        new Date(right.occurredAt).getTime() - new Date(left.occurredAt).getTime(),
    );
}

function getUniqueItems(items: ContributionItem[]): ContributionItem[] {
  return Array.from(new Map(items.map((item) => [item.id, item])).values());
}

export async function getRecentContributionColumns(
  username: string,
  limitPerColumn = 5,
): Promise<ContributionColumnsFeed> {
  const [prResult, commitResult, deployResult] = await Promise.allSettled([
    getMergedPullRequests(username, Math.max(limitPerColumn * 2, 10)),
    getOwnedRepositoryCommits(username),
    getRecentVercelDeployments(Math.max(limitPerColumn * 2, 10)),
  ]);

  let partialError = false;
  let mergedPullRequests: ContributionItem[] = [];
  let ownRepoCommits: ContributionItem[] = [];
  let deployments: ContributionItem[] = [];

  if (prResult.status === "fulfilled") {
    mergedPullRequests = prResult.value;
  } else {
    partialError = true;
  }

  if (commitResult.status === "fulfilled") {
    ownRepoCommits = commitResult.value;
  } else {
    partialError = true;
  }

  if (deployResult.status === "fulfilled") {
    deployments = deployResult.value;
  } else {
    partialError = true;
  }

  const openSourcePullRequests = mergedPullRequests.filter((pullRequest) => {
    return getRepositoryOwner(pullRequest.sourceName).toLowerCase() !== username.toLowerCase();
  });

  return {
    openSourcePullRequests: sortByNewest(getUniqueItems(openSourcePullRequests)).slice(
      0,
      limitPerColumn,
    ),
    ownRepoCommits: sortByNewest(getUniqueItems(ownRepoCommits)).slice(0, limitPerColumn),
    deployments: sortByNewest(getUniqueItems(deployments)).slice(0, limitPerColumn),
    partialError,
  };
}
