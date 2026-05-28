import { Component } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar';
import { DocContentComponent } from '../doc-content/doc-content';
import { TocComponent } from '../toc/toc';

@Component({
  selector: 'app-docs',
  standalone: true,
  imports: [SidebarComponent, DocContentComponent, TocComponent],
  templateUrl: './docs.html',
  styleUrl: './docs.scss',
})
export class DocsComponent {}
