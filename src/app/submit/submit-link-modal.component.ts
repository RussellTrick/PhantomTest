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
        <div>
          Invalid URL. Accepted domains: .com|.org|.net|.edu|.gov|.co.uk
        </div>
        } @if(linkForm.controls['newLink'].errors?.['duplicateUrl'] &&
        linkForm.controls['newLink'].touched){
        <div>This URL already exists</div>
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
          /^(www\.)?[a-z0-9.-]+\.(com|org|net|edu|gov|co\.uk)(\/.*)?$/i
        ),
      ]),
    });

    // Subscribe to valueChanges to clear duplicateUrl error when value changes
    this.linkForm.controls['newLink'].valueChanges.subscribe(() => {
      if (this.linkForm.controls['newLink'].hasError('duplicateUrl')) {
        this.linkForm.controls['newLink'].setErrors(null);
      }
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

    // If the link doesn't exist, add it to the array and update local storage
    storedLinks.push(newLink);
    localStorage.setItem('links', JSON.stringify(storedLinks));

    this.newLinkSubmitted.emit(newLink);

    this.close();
  }

  close(): void {
    this.closeModal.emit();
  }
}
