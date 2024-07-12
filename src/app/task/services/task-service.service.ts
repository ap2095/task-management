// src/app/services/task.service.ts

import { Injectable } from '@angular/core';
import { Task } from 'src/app/models/task.models';
import { NotificationService } from 'src/app/notification.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private readonly localStorageKey = 'tasks';

  constructor(
    private notificationService: NotificationService
  ) { }

  private getTasksFromStorage(): Task[] {
    const tasksJson = localStorage.getItem(this.localStorageKey);
    return tasksJson ? JSON.parse(tasksJson) : [];
  }

  private saveTasksToStorage(tasks: Task[]): void {
    localStorage.setItem(this.localStorageKey, JSON.stringify(tasks));
  }

  getAllTasks(): Task[] {
    return this.getTasksFromStorage();
  }

  getTaskById(id: number): Task | undefined {
    const tasks = this.getTasksFromStorage();
    return tasks.find(task => task.id === id);
  }

  addTask(task: Task): void {
    let tasks = this.getTasksFromStorage();
    const newId = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
    task.id = newId;
    tasks.push(task);
    this.saveTasksToStorage(tasks);
    this.notificationService.addNotification(`New task "${task.title}" has been created.`);
  }

  updateTask(updatedTask: Task): void {
    let tasks = this.getTasksFromStorage();
    const index = tasks.findIndex(task => task.id === updatedTask.id);

    if (index !== -1) {
      const oldTask = tasks[index];
      const oldStatus = oldTask.status;
      const newStatus = updatedTask.status;

      if (oldStatus !== newStatus) {
        this.notificationService.addNotification(`Task "${updatedTask.title}" status has been updated to "${newStatus}".`);
      }

      tasks[index] = updatedTask;
      this.saveTasksToStorage(tasks);
    }
  }

  deleteTask(id: number): void {
    let tasks = this.getTasksFromStorage();
    tasks = tasks.filter(task => task.id !== id);
    this.saveTasksToStorage(tasks);
  }
  checkTaskDueDates() {
    let tasks = this.getTasksFromStorage();
    const now = new Date();
    tasks.forEach(task => {
      const dueDate = new Date(task.dueDate);
      const diff = (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
      if (diff <= 1 && diff >= 0) { // Task is due within the next day
        this.notificationService.addNotification(`Task "${task.title}" is due soon.`);
      }
    });
  }
  checkForApproachingDueDates(): void {
    const tasks = this.getTasksFromStorage();
    const today = new Date();
    tasks.forEach(task => {
      const dueDate = new Date(task.dueDate);
      const timeDiff = dueDate.getTime() - today.getTime();
      const dayDiff = timeDiff / (1000 * 3600 * 24);

      if (dayDiff <= 5 && dayDiff > 0) {
        this.notificationService.addNotification(`Task "${task.title}" is due in ${Math.ceil(dayDiff)} days.`);
      }
    });
  }
}
