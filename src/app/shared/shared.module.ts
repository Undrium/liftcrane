import {ModuleWithProviders, NgModule}              from '@angular/core';
import { CommonModule }                             from '@angular/common';
import { FormsModule, ReactiveFormsModule }         from '@angular/forms';

import { CompareCrawlPipe }                         from './pipes/compare-crawl.pipe';
import { PercentDifferencePipe }                    from './pipes/percent-difference.pipe';
// Components
import { CrawlComponent }                           from '../components/crawl/crawl.component';
import { NavComponent }                             from '../components/nav/nav.component';


@NgModule({
  imports:      [
    CommonModule,
    ReactiveFormsModule
  ],
  declarations: [
    CompareCrawlPipe,
    CrawlComponent,
    NavComponent,
    PercentDifferencePipe
  ],
  exports: [
    CompareCrawlPipe,
    PercentDifferencePipe,
    CommonModule,
    CrawlComponent,
    FormsModule,
    NavComponent,
    ReactiveFormsModule,
  ]
})

export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: []
    };
  }
}
