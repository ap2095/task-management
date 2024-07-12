import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Task, TaskStatus } from 'src/app/models/task.models';
import { AddEditTaskComponent } from 'src/app/task/add-edit-task/add-edit-task.component';
import { MatDialog } from '@angular/material/dialog';
import { TaskService } from '../services/task-service.service';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { filter, tap } from 'rxjs';

@Component({
  selector: 'app-task-table',
  templateUrl: './task-table.component.html',
  styleUrls: ['./task-table.component.scss']
})
export class TaskTableComponent implements OnInit, AfterViewInit {
  existingTasks!: Task[];
  tasks!: Task[];
  displayedColumns: string[] = ['id', 'title', 'description', 'status', 'dueDate', 'action'];
  dataSource = new MatTableDataSource<Task>();
  taskStatuses: string[] = ['Pending', 'InProgress', 'Completed'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dummyTasks: Task[] = [
    { id: 1, title: 'Task 1', description: 'Description of task 1', status: TaskStatus.Pending, dueDate: '2024-08-30T18:30:00.000Z' },
    { id: 2, title: 'Task 2', description: 'Description of task 2', status: TaskStatus.InProgress, dueDate: '2024-07-30T18:30:00.000Z' },
    { id: 3, title: 'Task 3', description: 'Description of task 3', status: TaskStatus.Completed, dueDate: '2024-09-30T18:30:00.000Z' }
  ];

  constructor(
    private dialog: MatDialog,
    private taskService: TaskService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.initializeTasks();
    this.loadTasks();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  /**
   * Initializes tasks by checking if any tasks exist in the task service.
   * If no tasks exist, it adds dummy tasks to the task service.
   */
  initializeTasks() {
    // Get all tasks from the task service
    this.existingTasks = this.taskService.getAllTasks();

    // Check if any tasks exist
    if (this.existingTasks.length === 0) {
      // If no tasks exist, add dummy tasks to the task service
      this.dummyTasks.forEach((task: Task) => {
        this.taskService.addTask(task);
      });
    }
  }

  /**
   * Loads tasks from the task service and sorts them by id in ascending order.
   * Sets the loaded tasks as the data source for the table.
   */
  loadTasks() {
    // Get all tasks from the task service
    this.tasks = this.taskService.getAllTasks();

    // Sort the tasks by id in ascending order
    this.tasks.sort((a, b) => a.id - b.id);

    // Set the loaded tasks as the data source for the table
    this.dataSource.data = this.tasks;
  }

  /**
   * Applies a filter to the data source based on the input value of the filter field.
   * If a paginator is present, it moves the paginator to the first page.
   *
   * @param {Event} event - The event triggered by the filter field input.
   */
  applyFilter(event: Event) {
    // Get the input value of the filter field
    const filterValue = (event.target as HTMLInputElement).value;

    // Set the filter value for the data source, trimming and converting to lowercase
    this.dataSource.filter = filterValue.trim().toLowerCase();

    // If a paginator is present, move it to the first page
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  /**
   * Filters the data source by task status.
   * If a status is provided, only tasks with that status are shown.
   * If no status is provided, all tasks are shown.
   * Moves the paginator to the first page.
   *
   * @param {string} status - The task status to filter by.
   */
  filterByStatus(status: string) {
    // Filter the tasks by status if a status is provided, otherwise show all tasks
    this.dataSource.data = status ? this.tasks.filter(task => task.status === status) : this.tasks;

    // Move the paginator to the first page if it exists
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  /**
   * Opens the AddEditTaskComponent dialog for editing a task.
   * After the dialog is closed, if a task was edited, it reloads the tasks and displays a success message.
   *
   * @param {Task} taskToEdit - The task to be edited.
   */
  editTask(taskToEdit: Task) {
    // Open the AddEditTaskComponent dialog with the task to edit
    const dialogRef = this.dialog.open(AddEditTaskComponent, {
      width: '700px',
      height: '700px',
      data: taskToEdit
    });

    // After the dialog is closed
    dialogRef.afterClosed()
      // If a task was edited (not null)
      .pipe(
        filter(editedTask => editedTask !== null),
        // Reload the tasks
        tap(() => this.loadTasks())
      )
      // Display a success message
      .subscribe((res: any) => {
        if(res) {
          this.snackBar.open('Task edited successfully.', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        }
      });
  }

  /**
   * Deletes a task after confirming with the user.
   *
   * @param {Task} taskToDelete - The task to be deleted.
   */
  deleteTask(taskToDelete: Task) {
    // Open the confirm dialog with the task to delete
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirm Delete',
        message: 'Are you sure you want to delete this task?',
      }
    });

    // After the dialog is closed
    dialogRef.afterClosed().pipe(
      // If the user confirms the deletion
      filter(result => result),
      // Delete the task
      tap(() => this.taskService.deleteTask(taskToDelete.id))
    ).subscribe(() => {
      // Show a success message and reload the tasks
      this.snackBar.open('Task deletion successful.', 'Close', {
        duration: 3000,
        panelClass: ['success-snackbar']
      });
      this.loadTasks();
    });
  }

  /**
   * Opens the Add/Edit Task dialog and reloads the tasks if the user adds a new task.
   */
  addTask() {
    // Configure the dialog settings
    const dialogConfig = {
      width: '700px', // Set the dialog width
      height: '700px', // Set the dialog height
      data: null // Pass no data to the dialog
    };

    // Open the dialog
    const dialogRef = this.dialog.open(AddEditTaskComponent, dialogConfig);

    // After the dialog is closed
    dialogRef.afterClosed().subscribe((addedTask) => {
      // If the user added a task
      if (addedTask) {
        // Show a success message
        this.snackBar.open('Task added successfully.', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        // Reload the tasks
        this.loadTasks();
      }
    });
  }
}
