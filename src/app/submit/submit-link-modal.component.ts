import { Component, EventEmitter, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-submit-link-modal',
  standalone: true,
  template: `
    <div>
      <h2>Submit Link</h2>
      <form [formGroup]="linkForm" (ngSubmit)="submitLink()">
        <label for="newLink">Enter a new link:</label>
        <input
          type="text"
          id="newLink"
          name="newLink"
          formControlName="newLink"
          placeholder="Enter a new link here"
          required
        />
        <button type="submit">Submit</button>
        <!-- Error messages -->
        @if(linkForm.controls['newLink'].errors?.['required'] &&
        linkForm.controls['newLink'].touched){
        <div>Link is required.</div>
        } @if(linkForm.controls['newLink'].errors?.['pattern'] &&
        linkForm.controls['newLink'].touched){
        <div>Invalid URL. Please enter a valid URL.</div>
        }
      </form>
    </div>
  `,
  styleUrls: ['./submit-link-modal.component.scss'],
  imports: [ReactiveFormsModule],
})
export class SubmitLinkModalComponent {
  // Close event
  @Output() closeModal: EventEmitter<void> = new EventEmitter<void>();
  // newLink prop pass event
  @Output() newLinkSubmitted: EventEmitter<string> = new EventEmitter<string>();
  newLink?: string;
  linkForm!: FormGroup;

  constructor(private fb: FormBuilder) {
    this.linkForm = this.fb.group({
      newLink: new FormControl('', [
        Validators.required,
        Validators.pattern(
          /^(https:\/\/)?(www\.)?[a-z0-9.-]+\.(com|org|net|edu|gov|co\.uk)(\/.*)?$/
        ),
      ]),
    });
  }

  submitLink(): void {
    if (this.linkForm.invalid) {
      return;
    }
    // TODO: Handle the submitted link (e.g., validate, save, etc.)
    this.newLinkSubmitted.emit(this.linkForm.controls['newLink'].value);
    console.log('Link submitted:', this.linkForm.value);
    this.close();
  }

  close(): void {
    this.closeModal.emit();
  }
}
