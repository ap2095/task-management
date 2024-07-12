import { Component, OnDestroy, OnInit } from '@angular/core';
import { TaskService } from './task/services/task-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy{

  private intervalId: any;
  constructor(private taskService: TaskService) {}
  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
  ngOnInit(): void {
    // Check for approaching due dates immediately on start
    this.taskService.checkForApproachingDueDates();

    // Check for approaching due dates every 24 hours
    this.intervalId = setInterval(() => {
      this.taskService.checkForApproachingDueDates();
    }, 24 * 60 * 60 * 1000); // 24 hours in milliseconds , Change to 5 secs for testing purpose
  }
  title = 'task-management';
}
