import { Component, EventEmitter, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-edit-link-modal',
  standalone: true,
  template: `
    <div>
      <button (click)="close()">&times;</button>
      <h2>Edit Link {{ link }}</h2>
      <form [formGroup]="linkForm" (ngSubmit)="submitLink()">
        <label for="newLink">Enter a new link:</label>
        <input
          type="text"
          id="newLink"
          name="newLink"
          formControlName="newLink"
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
  styleUrls: ['./edit-link-modal.component.scss'],
  imports: [ReactiveFormsModule],
})
export class EditLinkModalComponent {
  @Output() closeModal: EventEmitter<void> = new EventEmitter<void>();
  // newLink prop pass event
  @Output() newLinkSubmitted: EventEmitter<string> = new EventEmitter<string>();
  @Output() update: EventEmitter<void> = new EventEmitter<void>();
  newLink?: string;
  linkForm!: FormGroup;
  link: string | null = null;

  constructor(private fb: FormBuilder) {
    this.linkForm = this.fb.group({
      newLink: new FormControl('', [
        Validators.required,
        Validators.pattern(
          /^(www\.)?[a-z0-9.-]+\.(com|org|net|edu|gov|co\.uk)(\/.*)?$/i
        ),
      ]),
    });

    this.link = localStorage.getItem('editLink');
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
    const updatedLinks = storedLinks.map((link) =>
      link === this.link ? newLink : link
    );
    localStorage.setItem('links', JSON.stringify(updatedLinks));

    this.close();
    this.update.emit();
  }

  close(): void {
    this.closeModal.emit();
  }
}
