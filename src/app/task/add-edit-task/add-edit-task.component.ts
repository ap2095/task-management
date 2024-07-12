import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TaskService } from '../services/task-service.service';

@Component({
  selector: 'app-add-edit-task',
  templateUrl: './add-edit-task.component.html',
  styleUrls: ['./add-edit-task.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddEditTaskComponent implements OnInit {
  taskForm!: FormGroup;
  isEditMode!: boolean;
  minDate!: Date;

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private dialogRef: MatDialogRef<AddEditTaskComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {

  }

  ngOnInit(): void {
    this.minDate = new Date();
    this.isEditMode = !!this.data;
    this.taskForm = this.fb.group({
      title: [this.data?.title || '', Validators.required],
      description: [this.data?.description || '', [Validators.maxLength(300)]],
      id: [this.data?.id || null],
      status: [this.data?.status || 'Pending', Validators.required],
      dueDate: [this.data?.dueDate || null, Validators.required],
    });
  }

  /**
   * Handles form submission.
   * Marks all fields as touched to show validation messages.
   * If the form is valid, it either updates an existing task or adds a new one.
   * Closes the dialog with the form value.
   */
  onSubmit() {
    this.markAllFieldsAsTouched();
    // Check if the form is valid
    if (this.taskForm.valid) {
      // Update an existing task if in edit mode
      if (this.isEditMode) {
        this.taskService.updateTask(this.taskForm.value);
      } else { // Add a new task if not in edit mode
        this.taskService.addTask(this.taskForm.value);
      }
      // Close the dialog with the form value
      this.dialogRef.close(this.taskForm.value);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
  /**
   * Marks all form fields as touched, triggering validation messages.
   * This is useful when submitting the form programmatically.
   */
  markAllFieldsAsTouched() {
    // Iterate over all form controls
    Object.keys(this.taskForm.controls).forEach(field => {
      // Get the control for the current field
      const control = this.taskForm.get(field);
      // Mark the control as touched (show validation messages)
      // Setting `onlySelf` to true prevents marking ancestor controls as touched
      control?.markAsTouched({ onlySelf: true });
    });
  }
  blockDatesBeforeToday = (d: Date | null): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return d ? d >= today : false;
  }
}
