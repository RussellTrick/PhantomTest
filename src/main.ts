import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { OverviewComponent } from './app/overview/overview.component';

bootstrapApplication(OverviewComponent, appConfig).catch((err) =>
  console.error(err)
);
