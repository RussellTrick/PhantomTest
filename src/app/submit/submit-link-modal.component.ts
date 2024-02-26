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
    <div class="modal-container">
      <div class="modal-content">
        <button class="close-button" (click)="close()">&times;</button>
        <h2>Submit Link</h2>
        <form
          class="submit-form"
          [formGroup]="linkForm"
          (ngSubmit)="submitLink()"
        >
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
        </form>
        <!-- Error messages -->
        @if(linkForm.controls['newLink'].errors?.['required'] &&
        linkForm.controls['newLink'].touched){
        <div class="error">Link is required.</div>
        } @if(linkForm.controls['newLink'].errors?.['pattern'] &&
        linkForm.controls['newLink'].touched){
        <div class="error">
          Invalid URL. Accepted domains: .com|.org|.net|.edu|.gov|.co.uk
        </div>
        } @if(linkForm.controls['newLink'].errors?.['duplicateUrl'] &&
        linkForm.controls['newLink'].touched){
        <div class="error">This URL already exists</div>
        }
      </div>
    </div>
  `,
  styleUrls: ['./submit-link-modal.component.scss'],
  imports: [ReactiveFormsModule],
})
export class SubmitLinkModalComponent {
  @Output() closeModal: EventEmitter<void> = new EventEmitter<void>();
  @Output() newLinkSubmitted: EventEmitter<string> = new EventEmitter<string>();
  newLink?: string;
  linkForm!: FormGroup;

  constructor(private fb: FormBuilder) {
    this.linkForm = this.fb.group({
      newLink: new FormControl('', [
        Validators.required,
        Validators.pattern(
          /^(www\.)?[a-z0-9.-]+\.(com|org|net|edu|gov|co\.uk)(\/.*)?$/i
        ),
      ]),
    });
  }

  formatURL(input: String) {
    // Check if the input starts with "http://" or "https://"
    if (input.toLowerCase().startsWith('http://')) {
      // Remove "http://" and prepend "https://www."
      return 'https://www.' + input.substring(7).toLowerCase();
    } else if (input.toLowerCase().startsWith('https://')) {
      // Remove "https://" and prepend "https://www."
      return 'https://www.' + input.substring(8).toLowerCase();
    } else if (input.toLowerCase().startsWith('www.')) {
      // Prepend "https://"
      return 'https://' + input.toLowerCase();
    } else {
      // Input is not in the desired format, prepend "https://www."
      return 'https://www.' + input.toLowerCase();
    }
  }

  submitLink(): void {
    if (this.linkForm.invalid) {
      return;
    }

    const newLink = this.formatURL(this.linkForm.controls['newLink'].value);

    const storedLinks = JSON.parse(
      localStorage.getItem('links') || '[]'
    ) as string[];

    if (storedLinks.includes(newLink)) {
      this.linkForm.controls['newLink'].setErrors({ duplicateUrl: true });
      return;
    }

    this.newLinkSubmitted.emit(newLink);

    this.close();
  }

  close(): void {
    this.closeModal.emit();
  }
}
