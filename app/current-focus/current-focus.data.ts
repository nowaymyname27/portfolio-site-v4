export type StudyTaskType = "flashcards" | "video" | "lab" | "exam-prep" | "exam";

export type StudyTask = {
  id: string;
  type: StudyTaskType;
  title: string;
  description: string;
  isCatchUp?: boolean;
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

export type SkippedDaySlots = {
  videoSlots: number;
  labSlots: number;
};

export type SkippedDayMap = Record<string, SkippedDaySlots>;

const START_DATE = "2026-06-29";
const TARGET_DATE = "2026-08-19";
const EXAM_DATE = "2026-08-19";
const DEFAULT_SKIPPED_DAY_SLOTS: SkippedDayMap = {
  "2026-07-02": { videoSlots: 1, labSlots: 1 },
  "2026-07-03": { videoSlots: 2, labSlots: 2 },
};

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

function getSkippedDaySlots(skippedDays: SkippedDayMap, date: string): SkippedDaySlots {
  const skippedDay = skippedDays[date];

  if (!skippedDay) {
    return {
      videoSlots: 0,
      labSlots: 0,
    };
  }

  return {
    videoSlots: Math.max(0, skippedDay.videoSlots),
    labSlots: Math.max(0, skippedDay.labSlots),
  };
}

function createFlashcardsTask(date: string): StudyTask {
  return {
    id: `${date}-flashcards`,
    type: "flashcards",
    title: "Flashcards",
    description: "Review CCNA flashcards to reinforce retention and keep core terms active.",
  };
}

function createVideoTask(date: string, topic: string, index: number, isCatchUp = false): StudyTask {
  return {
    id: `video-${index}`,
    type: "video",
    title: `Video: ${topic}`,
    description: `Work through the ${topic.toLowerCase()} lesson and capture the main takeaways.`,
    isCatchUp,
  };
}

function createLabTask(date: string, topic: string, index: number, isCatchUp = false): StudyTask {
  return {
    id: `lab-${index}`,
    type: "lab",
    title: `Lab: ${topic}`,
    description: `Complete the ${topic.toLowerCase()} lab and verify the expected network behavior.`,
    isCatchUp,
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

function createExamTask(date: string): StudyTask {
  return {
    id: `${date}-exam`,
    type: "exam",
    title: "Exam!",
    description: "CCNA exam day. Stay calm, trust your prep, and go close it out.",
  };
}

function isSaturday(dayOfWeek: number): boolean {
  return dayOfWeek === 6;
}

type TaskGenerationResult = {
  tasks: StudyTask[];
  nextVideoIndex: number;
  nextLabIndex: number;
  carryoverVideoSlots: number;
  carryoverLabSlots: number;
};

function createTasksForDay(
  date: string,
  dayOfWeek: number,
  videoTopics: string[],
  labTopics: string[],
  videoIndex: number,
  labIndex: number,
  carryoverVideoSlots: number,
  carryoverLabSlots: number,
  skippedDays: SkippedDayMap,
): TaskGenerationResult {
  if (date === EXAM_DATE) {
    return {
      tasks: [createExamTask(date)],
      nextVideoIndex: videoIndex,
      nextLabIndex: labIndex,
      carryoverVideoSlots,
      carryoverLabSlots,
    };
  }

  const tasks: StudyTask[] = [createFlashcardsTask(date)];
  const topicSlots = getTopicSlotsForDay(dayOfWeek);
  const skippedDay = getSkippedDaySlots(skippedDays, date);
  let nextVideoIndex = videoIndex;
  let nextLabIndex = labIndex;
  let nextCarryoverVideoSlots = carryoverVideoSlots;
  let nextCarryoverLabSlots = carryoverLabSlots;
  let videoSlotsToSchedule = 0;
  let labSlotsToSchedule = 0;
  let markScheduledTasksAsCatchUp = false;

  if (isSaturday(dayOfWeek)) {
    const availableVideoCatchUpSlots = Math.min(1, carryoverVideoSlots);
    const availableLabCatchUpSlots = Math.min(1, carryoverLabSlots);
    const skippedVideoCatchUpSlots = Math.min(skippedDay.videoSlots, availableVideoCatchUpSlots);
    const skippedLabCatchUpSlots = Math.min(skippedDay.labSlots, availableLabCatchUpSlots);

    videoSlotsToSchedule = availableVideoCatchUpSlots - skippedVideoCatchUpSlots;
    labSlotsToSchedule = availableLabCatchUpSlots - skippedLabCatchUpSlots;
    nextCarryoverVideoSlots = carryoverVideoSlots - videoSlotsToSchedule;
    nextCarryoverLabSlots = carryoverLabSlots - labSlotsToSchedule;
    markScheduledTasksAsCatchUp = true;
  } else if (topicSlots > 0) {
    const skippedVideoSlots = Math.min(skippedDay.videoSlots, topicSlots);
    const skippedLabSlots = Math.min(skippedDay.labSlots, topicSlots);

    videoSlotsToSchedule = topicSlots - skippedVideoSlots;
    labSlotsToSchedule = topicSlots - skippedLabSlots;
    nextCarryoverVideoSlots = carryoverVideoSlots + skippedVideoSlots;
    nextCarryoverLabSlots = carryoverLabSlots + skippedLabSlots;
  }

  for (let slot = 0; slot < videoSlotsToSchedule && nextVideoIndex < videoTopics.length; slot += 1) {
    tasks.push(
      createVideoTask(date, videoTopics[nextVideoIndex], nextVideoIndex + 1, markScheduledTasksAsCatchUp),
    );
    nextVideoIndex += 1;
  }

  for (let slot = 0; slot < labSlotsToSchedule && nextLabIndex < labTopics.length; slot += 1) {
    tasks.push(createLabTask(date, labTopics[nextLabIndex], nextLabIndex + 1, markScheduledTasksAsCatchUp));
    nextLabIndex += 1;
  }

  if (topicSlots > 0 && nextVideoIndex >= videoTopics.length) {
    tasks.push(createExamPrepTask(date));
  }

  return {
    tasks,
    nextVideoIndex,
    nextLabIndex,
    carryoverVideoSlots: nextCarryoverVideoSlots,
    carryoverLabSlots: nextCarryoverLabSlots,
  };
}

function mergeSkippedDays(skippedDays?: SkippedDayMap): SkippedDayMap {
  const mergedSkippedDays: SkippedDayMap = { ...DEFAULT_SKIPPED_DAY_SLOTS };

  if (!skippedDays) {
    return mergedSkippedDays;
  }

  for (const [date, slots] of Object.entries(skippedDays)) {
    const existingSlots = mergedSkippedDays[date] ?? { videoSlots: 0, labSlots: 0 };

    mergedSkippedDays[date] = {
      videoSlots: existingSlots.videoSlots + Math.max(0, slots.videoSlots),
      labSlots: existingSlots.labSlots + Math.max(0, slots.labSlots),
    };
  }

  return mergedSkippedDays;
}

function generateStudyDays(
  startedOn: string,
  targetDate: string,
  videoTopics: string[],
  labTopics: string[],
  skippedDays?: SkippedDayMap,
): StudyDay[] {
  const studyDays: StudyDay[] = [];
  const cursor = createUtcDate(startedOn);
  const end = createUtcDate(targetDate);
  const mergedSkippedDays = mergeSkippedDays(skippedDays);
  let videoIndex = 0;
  let labIndex = 0;
  let carryoverVideoSlots = 0;
  let carryoverLabSlots = 0;

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
      carryoverVideoSlots,
      carryoverLabSlots,
      mergedSkippedDays,
    );

    studyDays.push({
      date,
      tasks: taskSet.tasks,
    });

    videoIndex = taskSet.nextVideoIndex;
    labIndex = taskSet.nextLabIndex;
    carryoverVideoSlots = taskSet.carryoverVideoSlots;
    carryoverLabSlots = taskSet.carryoverLabSlots;
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  return studyDays;
}

export function getCurrentFocusGoal(skippedDays?: SkippedDayMap): CurrentFocusGoal {
  return {
    title: "CCNA Certification",
    startedOn: START_DATE,
    targetDate: TARGET_DATE,
    currentPhase: "Daily retention, topic study, and repeated lab practice.",
    cadenceSummary:
      "Flashcards happen daily. Mondays, Tuesdays, and Fridays pull two videos and two labs, while Wednesdays and Thursdays pull one video and one lab. After the video backlog ends with Terraform, weekdays shift into exam prep. Missed video and lab work rolls into Saturdays with one extra video and one extra lab slot.",
    studyDays: generateStudyDays(
      START_DATE,
      TARGET_DATE,
      REMAINING_VIDEOS,
      REMAINING_LABS,
      skippedDays,
    ),
  };
}

export const CURRENT_FOCUS_GOAL: CurrentFocusGoal = getCurrentFocusGoal();

export function isCurrentFocusTaskId(taskId: string): boolean {
  if (/^video-\d+$/.test(taskId)) {
    const index = Number(taskId.slice("video-".length));
    return index >= 1 && index <= REMAINING_VIDEOS.length;
  }

  if (/^lab-\d+$/.test(taskId)) {
    const index = Number(taskId.slice("lab-".length));
    return index >= 1 && index <= REMAINING_LABS.length;
  }

  if (/^\d{4}-\d{2}-\d{2}-(flashcards|exam-prep|exam)$/.test(taskId)) {
    const date = taskId.slice(0, 10);
    return isCurrentFocusDate(date);
  }

  return false;
}

export function isCurrentFocusDate(date: string): boolean {
  return date >= START_DATE && date <= TARGET_DATE;
}

export function isCurrentFocusExamDate(date: string): boolean {
  return date === EXAM_DATE;
}

export function getCurrentFocusSkippedDayMapWithDefaults(skippedDays?: SkippedDayMap): SkippedDayMap {
  return mergeSkippedDays(skippedDays);
}
