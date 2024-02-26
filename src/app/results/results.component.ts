import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-success',
  standalone: true,
  template: `
    <div class="results-container">
      <div class="results-wrapper">
        <h2>Thanks for the submission!</h2>
        <p>You successfully created {{ newLink }}</p>
        <a routerLink="/">Back to overview</a>
      </div>
    </div>
  `,
  styleUrls: ['./results.component.scss'],
  imports: [RouterModule],
})
export class ResultsComponent {
  title = 'Success!';
  newLink!: string;

  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state;

    if (state) {
      this.newLink = state?.['data'];
    }
  }
}
