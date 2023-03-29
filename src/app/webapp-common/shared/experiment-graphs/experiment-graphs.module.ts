import {NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatLegacySliderModule as MatSliderModule} from '@angular/material/legacy-slider';
import {MatLegacySelectModule as MatSelectModule} from '@angular/material/legacy-select';
import {FormsModule} from '@angular/forms';
import {ResizableModule} from 'angular-resizable-element';
import {ExperimentGraphsComponent} from './experiment-graphs.component';
import {GraphSettingsBarComponent} from './graph-settings-bar/graph-settings-bar.component';
import {GraphScalarDataToMetric} from './graph-scalar-data-to-metric.pipe';
import {GraphPlotDataToMetric} from './graph-plot-data-to-metric.pipe';
import {SharedPipesModule} from '../pipes/shared-pipes.module';
import {SingleValueSummaryTableComponent} from './single-value-summary-table/single-value-summary-table.component';
import {SingleGraphModule} from '@common/shared/single-graph/single-graph.module';
import {MatLegacyInputModule as MatInputModule} from '@angular/material/legacy-input';

const declarations= [
  ExperimentGraphsComponent,
  GraphSettingsBarComponent,
  GraphScalarDataToMetric,
  GraphPlotDataToMetric,
  SingleValueSummaryTableComponent
];
@NgModule({
  declarations,
  exports: declarations,
  imports: [
    CommonModule,
    MatSliderModule,
    MatSelectModule,
    FormsModule,
    ResizableModule,
    SharedPipesModule,
    SingleGraphModule,
    MatInputModule
  ]
})
export class ExperimentGraphsModule { }
