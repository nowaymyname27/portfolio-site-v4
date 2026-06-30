export type StudyTaskType = "flashcards" | "video" | "lab" | "exam-prep";

export type StudyTask = {
  id: string;
  type: StudyTaskType;
  title: string;
  description: string;
};

export type StudyDay = {
  date: string;
  tasks: StudyTask[];
};

export type CurrentFocusGoal = {
  title: string;
  startedOn: string;
  targetDate: string;
  currentPhase: string;
  cadenceSummary: string;
  studyDays: StudyDay[];
};

const START_DATE = "2026-06-29";
const TARGET_DATE = "2026-08-18";

const REMAINING_VIDEOS = [
  "Floating Static Routes",
  "RIP and EIGRP",
  "OSPF Part 1",
  "OSPF Part 2",
  "OSPF Part 3",
  "First Hop Redundancy Protocols",
  "TCP and UDP",
  "IPv6 Part 1",
  "IPv6 Part 2",
  "IPv6 Part 3",
  "Standard ACLs",
  "Extended ACLs",
  "CDP and LLDP",
  "NTP",
  "DNS",
  "DHCP",
  "SNMP",
  "Syslog",
  "SSH",
  "FTP and TFTP",
  "NAT Part 1",
  "NAT Part 2",
  "QoS Part 1",
  "QoS Part 2",
  "Security Fundamentals",
  "Port Security",
  "DHCP Snooping",
  "Dynamic ARP Inspection",
  "LAN Architectures",
  "WAN Architectures",
  "Virtualization and Cloud",
  "Containers",
  "VRF",
  "Wireless Fundamentals",
  "Wireless Architectures",
  "Wireless Security",
  "Wireless Configuration",
  "Network Automation Basics",
  "AI and Machine Learning",
  "JSON, XML, and YAML",
  "REST APIs",
  "REST API Authentication",
  "Software-Defined Networking",
  "Ansible, Puppet, and Chef",
  "Terraform",
];

const REMAINING_LABS = [
  "Floating Static Routes",
  "EIGRP Configuration",
  "OSPF Configuration Part 1",
  "OSPF Configuration Part 2",
  "OSPF Configuration Part 3",
  "HSRP Configuration",
  "TCP and UDP Wireshark",
  "IPv6 Configuration Part 1",
  "IPv6 Configuration Part 2",
  "IPv6 Configuration Part 3",
  "Standard ACLs",
  "Extended ACLs",
  "CDP and LLDP",
  "NTP",
  "DNS",
  "DHCP",
  "SNMP",
  "Syslog",
  "SSH",
  "FTP and TFTP",
  "Static NAT",
  "Dynamic NAT",
  "Voice VLANs",
  "QoS",
  "Kali Linux Demo",
  "Port Security",
  "DHCP Snooping",
  "Dynamic ARP Inspection",
  "STP and FHRP Synchronization",
  "GRE Tunnels",
  "Oracle VirtualBox",
  "Wireless LANs",
  "CCNA Mega Lab",
];

function createUtcDate(date: string): Date {
  return new Date(`${date}T00:00:00Z`);
}

function formatDateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function getTopicSlotsForDay(dayOfWeek: number): number {
  if (dayOfWeek === 1 || dayOfWeek === 2 || dayOfWeek === 5) {
    return 2;
  }

  if (dayOfWeek === 3 || dayOfWeek === 4) {
    return 1;
  }

  return 0;
}

function createFlashcardsTask(date: string): StudyTask {
  return {
    id: `${date}-flashcards`,
    type: "flashcards",
    title: "Flashcards",
    description: "Review CCNA flashcards to reinforce retention and keep core terms active.",
  };
}

function createVideoTask(date: string, topic: string, index: number): StudyTask {
  return {
    id: `${date}-video-${index}`,
    type: "video",
    title: `Video: ${topic}`,
    description: `Work through the ${topic.toLowerCase()} lesson and capture the main takeaways.`,
  };
}

function createLabTask(date: string, topic: string, index: number): StudyTask {
  return {
    id: `${date}-lab-${index}`,
    type: "lab",
    title: `Lab: ${topic}`,
    description: `Complete the ${topic.toLowerCase()} lab and verify the expected network behavior.`,
  };
}

function createExamPrepTask(date: string): StudyTask {
  return {
    id: `${date}-exam-prep`,
    type: "exam-prep",
    title: "Exam Prep",
    description:
      "Use this block for focused CCNA review, weak-area reinforcement, and final exam preparation.",
  };
}

function createTasksForDay(
  date: string,
  dayOfWeek: number,
  videoTopics: string[],
  labTopics: string[],
  videoIndex: number,
  labIndex: number,
): { tasks: StudyTask[]; nextVideoIndex: number; nextLabIndex: number } {
  const tasks: StudyTask[] = [createFlashcardsTask(date)];
  const topicSlots = getTopicSlotsForDay(dayOfWeek);

  if (topicSlots === 0) {
    return {
      tasks,
      nextVideoIndex: videoIndex,
      nextLabIndex: labIndex,
    };
  }

  let nextVideoIndex = videoIndex;
  let nextLabIndex = labIndex;

  for (let slot = 0; slot < topicSlots && nextVideoIndex < videoTopics.length; slot += 1) {
    tasks.push(createVideoTask(date, videoTopics[nextVideoIndex], nextVideoIndex + 1));
    nextVideoIndex += 1;
  }

  for (let slot = 0; slot < topicSlots && nextLabIndex < labTopics.length; slot += 1) {
    tasks.push(createLabTask(date, labTopics[nextLabIndex], nextLabIndex + 1));
    nextLabIndex += 1;
  }

  if (nextVideoIndex >= videoTopics.length) {
    tasks.push(createExamPrepTask(date));
  }

  return {
    tasks,
    nextVideoIndex,
    nextLabIndex,
  };
}

function generateStudyDays(
  startedOn: string,
  targetDate: string,
  videoTopics: string[],
  labTopics: string[],
): StudyDay[] {
  const studyDays: StudyDay[] = [];
  const cursor = createUtcDate(startedOn);
  const end = createUtcDate(targetDate);
  let videoIndex = 0;
  let labIndex = 0;

  while (cursor <= end) {
    const date = formatDateKey(cursor);
    const dayOfWeek = cursor.getUTCDay();
    const taskSet = createTasksForDay(
      date,
      dayOfWeek,
      videoTopics,
      labTopics,
      videoIndex,
      labIndex,
    );

    studyDays.push({
      date,
      tasks: taskSet.tasks,
    });

    videoIndex = taskSet.nextVideoIndex;
    labIndex = taskSet.nextLabIndex;
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  return studyDays;
}

export const CURRENT_FOCUS_GOAL: CurrentFocusGoal = {
  title: "CCNA Certification",
  startedOn: START_DATE,
  targetDate: TARGET_DATE,
  currentPhase: "Daily retention, topic study, and repeated lab practice.",
  cadenceSummary:
    "Flashcards happen daily. Mondays, Tuesdays, and Fridays pull two videos and two labs, while Wednesdays and Thursdays pull one video and one lab. After the video backlog ends with Terraform, weekdays shift into exam prep.",
  studyDays: generateStudyDays(
    START_DATE,
    TARGET_DATE,
    REMAINING_VIDEOS,
    REMAINING_LABS,
  ),
};

export const CURRENT_FOCUS_TASK_IDS = new Set(
  CURRENT_FOCUS_GOAL.studyDays.flatMap((studyDay) => studyDay.tasks.map((task) => task.id)),
);
