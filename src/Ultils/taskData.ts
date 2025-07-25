import type { TaskPriority, TaskStatus } from "../dtos/taskDto";

export const  TAB_NAV_LIST = [
  { label: "Board", value: "board" },
  { label: "List", value: "list" }
];

export const TASK_STATUSES : {value: TaskStatus, label: string}[] = [
  { value: 'To Do', label: 'To Do' },
  { value: 'In Progress', label: 'In Progress' },
  { value: 'Done', label: 'Done' },
]

export const TASK_PRIORITIES : {value: TaskPriority, label: string}[] = [
  { value: 'Low', label: 'Low' },
  { value: 'Medium', label: 'Medium' },
  { value: 'High', label: 'High' },
]