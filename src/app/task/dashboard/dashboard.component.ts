import { Component, OnInit, ViewChild } from '@angular/core';
import { TaskService } from '../services/task-service.service';
import { MatDateRangePicker } from '@angular/material/datepicker';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  tasks: any;
  filteredTasks: any;
  taskSummary = [
    { title: 'Total Tasks', count: 0, bgColor: 'bg-primary' },
    { title: 'Completed Tasks', count: 0, bgColor: 'bg-success' },
    { title: 'Pending Tasks', count: 0, bgColor: 'bg-warning' },
    { title: 'In Progress Tasks', count: 0, bgColor: 'bg-info' }
  ];
  dateRange: any = { start: null, end: null };

  @ViewChild('dateRangePicker') dateRangePicker!: MatDateRangePicker<any>;

  constructor(private taskService: TaskService) { }

  ngOnInit() {
    this.loadTasks();
  }

/**
 * Loads all tasks from the task service and updates the filtered tasks and task summary.
 *
 * @return {void} This function does not return a value.
 */
  loadTasks(): void {
    this.tasks = this.taskService.getAllTasks();
    this.filteredTasks = [...this.tasks];
    this.updateTaskSummary();
  }

  /**
   * Updates the task summary by counting the number of tasks based on their status.
   *
   * This function iterates over the `taskSummary` array and updates the `count` property
   * for each element based on the number of tasks in the `tasks` array that have a matching status.
   *
   * @return {void} This function does not return a value.
   */
  updateTaskSummary(): void {
    this.taskSummary[0].count = this.filteredTasks.length;
    this.taskSummary[1].count = this.filteredTasks.filter((task: { status: string; }) => task.status === 'Completed').length;
    this.taskSummary[2].count = this.filteredTasks.filter((task: { status: string; }) => task.status === 'Pending').length;
    this.taskSummary[3].count = this.filteredTasks.filter((task: { status: string; }) => task.status === 'InProgress').length;
  }
  /**
   * Filters the tasks by date range and updates the filtered tasks.
   *
   * @return {void} This function does not return a value.
   */
  filterTasksByDateRange(selectedDate: any, dateType: string): void {
    if (dateType === 'start') {
      this.dateRange.start = selectedDate.value;
    } else {
      this.dateRange.end = selectedDate.value;
    }

    const filteredTasks = this.tasks.filter((task: { dueDate: string | number | Date; }) => {
      const taskDueDate = new Date(task.dueDate);
      const startDate = this.dateRange.start ? new Date(this.dateRange.start) : new Date(0);
      const endDate = this.dateRange.end ? new Date(this.dateRange.end) : new Date(Date.now());
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);

      return taskDueDate >= startDate && taskDueDate <= endDate;
    });

    this.filteredTasks = filteredTasks;
    this.updateTaskSummary();
  }
  /**
   * Opens the date range picker.
   *
   * @return {void} This function does not return a value.
   */
  openDatePicker(): void {
    // Open the date range picker
    this.dateRangePicker.open();
  }

}
