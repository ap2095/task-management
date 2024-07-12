export interface Task {
  id: number;              // Unique identifier for the task
  title: string;           // Title of the task
  description: string;     // Description of the task
  status: TaskStatus;      // Status of the task (e.g., pending, completed)
  dueDate: string;           // Due date of the task
}

// Define the possible statuses for a task
export enum TaskStatus {
  Pending = 'Pending',
  InProgress = 'InProgress',
  Completed = 'Completed',
  Archived = 'Archived'
}
