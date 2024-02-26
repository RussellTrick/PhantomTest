import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubmitLinkModalComponent } from '../submit/submit-link-modal.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [SubmitLinkModalComponent, CommonModule],
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
})
export class OverviewComponent {
  title = 'Angular Demo';
  isModalOpen: boolean = false;
  currentPage: number = 1;
  pageSize: number = 20;
  links: string[] = [];

  constructor(private router: Router) {
    const storedLinks = localStorage.getItem('links');
    if (storedLinks) {
      this.links = JSON.parse(storedLinks);
    } else {
      this.links = [];
    }
  }

  handleNewLink(newLink: string): void {
    this.links.push(newLink);
    localStorage.setItem('links', JSON.stringify(this.links));
    this.router.navigate(['/success'], { state: { data: newLink } });
  }

  clearLocalStorage(): void {
    localStorage.clear();
    const storedLinks = localStorage.getItem('links');
    if (storedLinks) {
      this.links = JSON.parse(storedLinks);
    } else {
      this.links = [];
    }
  }

  openSubmitLinkModal(): void {
    this.isModalOpen = true;
  }

  closeSubmitLinkModal(): void {
    this.isModalOpen = false;
  }

  get pagedLinks(): string[] {
    // Calculate the start and end index of links for the current page
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    // Return the links for the current page
    return this.links.slice(startIndex, endIndex);
  }

  get totalPages(): number {
    // Calculate the total number of pages based on the total number of links and page size
    return Math.ceil(this.links.length / this.pageSize);
  }

  get pageNumbers(): number[] {
    // Generate an array of page numbers for pagination buttons
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  prevPage(): void {
    // Navigate to the previous page if not on the first page
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    // Navigate to the next page if not on the last page
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  changePage(pageNum: number): void {
    // Change to the specified page
    this.currentPage = pageNum;
  }
}
