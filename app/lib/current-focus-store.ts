import { kv } from "@vercel/kv";

const CURRENT_FOCUS_COMPLETIONS_KEY = "current-focus:completed-tasks";

export type TaskCompletionMap = Record<string, true>;

function isKvConfigured(): boolean {
  return Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

export async function getCompletedTasks(): Promise<TaskCompletionMap> {
  if (!isKvConfigured()) {
    return {};
  }

  const completions = await kv.get<TaskCompletionMap>(CURRENT_FOCUS_COMPLETIONS_KEY);
  return completions ?? {};
}

export async function setTaskCompletion(taskId: string, completed: boolean): Promise<TaskCompletionMap> {
  if (!isKvConfigured()) {
    throw new Error("Vercel KV is not configured.");
  }

  const completions = await getCompletedTasks();

  if (completed) {
    completions[taskId] = true;
  } else {
    delete completions[taskId];
  }

  await kv.set(CURRENT_FOCUS_COMPLETIONS_KEY, completions);

  return completions;
}

export async function setManyTaskCompletions(
  taskIds: string[],
  completed: boolean,
): Promise<TaskCompletionMap> {
  if (!isKvConfigured()) {
    throw new Error("Vercel KV is not configured.");
  }

  const completions = await getCompletedTasks();

  for (const taskId of taskIds) {
    if (completed) {
      completions[taskId] = true;
      continue;
    }

    delete completions[taskId];
  }

  await kv.set(CURRENT_FOCUS_COMPLETIONS_KEY, completions);

  return completions;
}
