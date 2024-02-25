import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-submit-link-modal',
  templateUrl: './submit-link-modal.component.html',
  styleUrls: ['./submit-link-modal.component.scss'],
})
export class SubmitLinkModalComponent {
  @Output() closeModal: EventEmitter<void> = new EventEmitter<void>();

  constructor() {}

  submitLink(): void {
    // TODO: Logic and remove console.log
    console.log('Link submitted');
    this.close();
  }

  close(): void {
    this.closeModal.emit();
  }
}
