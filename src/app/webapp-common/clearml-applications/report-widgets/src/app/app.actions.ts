import {createAction, props} from '@ngrx/store';
import {ExtFrame} from '@common/shared/single-graph/plotly-graph-base';
import {DebugSample} from '@common/shared/debug-sample/debug-sample.reducer';
import {ReportsApiMultiplotsResponse} from '@common/clearml-applications/report-widgets/src/app/app.reducer';
import {Task} from '~/business-logic/model/tasks/task';

export const getPlot = createAction('[App] getPlot', props<{
  tasks: string[];
  iterations: number[];
  metrics: string[];
  variants: string[];
  company: string;
  otherSearchParams?: URLSearchParams;
}>());

export const getScalar = createAction('[App] getScalar', props<{
  tasks: string[];
  iterations: number[];
  metrics: string[];
  variants: string[];
  company: string;
  otherSearchParams?: URLSearchParams;
}>());
export const getSample = createAction('[App] getSample', props<{
  tasks: string[];
  iterations: number[];
  metrics: string[];
  variants: string[];
  company: string;
  otherSearchParams?: URLSearchParams;
}>());
export const getParcoords = createAction('[App] getParcoords', props<{
  tasks: string[];
  iterations: number[];
  metrics: string[];
  variants: string[];
  company: string;
  otherSearchParams?: URLSearchParams;
}>());
export const setPlotData = createAction('[App] setPlot', props<{ data: ReportsApiMultiplotsResponse }>());
export const setScalarData = createAction('[App] setScalar', props<{ data: ExtFrame[] }>());
export const setSampleData = createAction('[App] setSample', props<{ data: DebugSample }>());
export const setParallelCoordinateExperiments = createAction('[App] setParcoor', props<{ data: Task[] }>());

export const reportsPlotlyReady = createAction('[App] plotly ready');
export const setSignIsNeeded = createAction('[App] set sign is needed');
export const setNoPermissions = createAction('[App] set no permissions');
