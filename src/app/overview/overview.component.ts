import { Component } from '@angular/core';
import { SubmitLinkModalComponent } from '../submit/submit-link-modal.component';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
})
export class OverviewComponent {
  isModalOpen: boolean = false;

  constructor() {}

  clearLocalStorage(): void {
    localStorage.clear();
  }

  openSubmitLinkModal(): void {
    this.isModalOpen = true;
  }

  closeSubmitLinkModal(): void {
    this.isModalOpen = false;
  }
}
