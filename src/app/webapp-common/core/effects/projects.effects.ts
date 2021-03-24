import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {ApiProjectsService} from '../../../business-logic/api-services/projects.service';
import * as actions from '../actions/projects.actions';
import {
  ResetSelectedProject,
  SetSelectedProjectId,
  UpdateProject,
  ResetProjectSelection,
  RESET_PROJECT_SELECTION,
  setTags, openTagColorsMenu, getTags, setCompanyTags, getCompanyTags
} from '../actions/projects.actions';
import {GetAllProjects} from '../actions/projects.actions';

import {catchError, filter, flatMap, map, mergeMap, switchMap, withLatestFrom} from 'rxjs/operators';
import {RequestFailed} from '../actions/http.actions';
import {DeactiveLoader, SetServerError} from '../actions/layout.actions';
import {SetSelectedExperiments} from '../../experiments/actions/common-experiments-view.actions';
import { SetSelectedModels } from '../../models/actions/models-view.actions';
import {selectProjects} from '../reducers/projects.reducer';
import {TagColorMenuComponent} from '../../shared/ui-components/tags/tag-color-menu/tag-color-menu.component';
import {MatDialog} from '@angular/material/dialog';
import {ApiOrganizationService} from '../../../business-logic/api-services/organization.service';
import {OrganizationGetTagsResponse} from '../../../business-logic/model/organization/organizationGetTagsResponse';
import {selectRouterParams} from '../reducers/router-reducer';
import {forkJoin} from 'rxjs';
import {ProjectsGetTaskTagsResponse} from '../../../business-logic/model/projects/projectsGetTaskTagsResponse';
import {ProjectsGetModelTagsResponse} from '../../../business-logic/model/projects/projectsGetModelTagsResponse';

const ALL_PROJECTS_OBJECT = {id: '*', name: 'All Projects'};

@Injectable()
export class ProjectsEffects {

  constructor(
    private actions$: Actions, private projectsApi: ApiProjectsService, private orgApi: ApiOrganizationService,
    private store: Store<any>, private dialog: MatDialog
  ) {}

  @Effect()
  getProjects$ = this.actions$.pipe(
    ofType<GetAllProjects>(actions.GET_PROJECTS),
    switchMap(() =>
      this.projectsApi.projectsGetAllEx({only_fields:['name', 'company']})
        .pipe(map(res => new actions.SetAllProjects(res.projects)))
    )
  );

  @Effect()
  ResetProjects$ = this.actions$.pipe(
    ofType<ResetSelectedProject>(actions.RESET_SELECTED_PROJECT),
    flatMap(() => [new ResetProjectSelection()])
  );

  @Effect()
  ResetProjectSelections$ = this.actions$.pipe(
    ofType<ResetProjectSelection>(RESET_PROJECT_SELECTION),
    flatMap(() => [new SetSelectedExperiments([]), new SetSelectedModels([])])
  );

  @Effect()
  updateProject$     = this.actions$.pipe(
    ofType<UpdateProject>(actions.UPDATE_PROJECT),
    switchMap((action) =>
      this.projectsApi.projectsUpdate({project: action.payload.id, ...action.payload.changes})
        .pipe(
          flatMap((res) => [
            new actions.UpdateProjectCompleted()
          ]),
          catchError(err => [
            new RequestFailed(err),
            new SetServerError(err, null, 'Update project failed'),
            new actions.SetSelectedProjectId(action.payload.id)
          ])
        )
    )
  );
  @Effect()
  getSelectedProject = this.actions$.pipe(
    ofType<SetSelectedProjectId>(actions.SET_SELECTED_PROJECT_ID),
    withLatestFrom(this.store.select(selectProjects)),
    filter(([action, projects]) => !!action.payload.projectId),
    switchMap(([action, projects]) => {
      if (action.payload.projectId === '*') {
        return [new actions.SetSelectedProject(ALL_PROJECTS_OBJECT)];
      } else {
        const proj = projects.find(proj => proj.id === action.payload.projectId);
        if (proj) {
          return [new actions.SetSelectedProject(proj)];
        } else {
          return this.projectsApi.projectsGetAllEx({id: [action.payload.projectId]})
            .pipe(map(res => new actions.SetSelectedProject(res.projects[0])));
        }
      }
    }));

  @Effect({dispatch: false})
  openTagColor = this.actions$.pipe(
    ofType(openTagColorsMenu),
    map(action => {
      this.dialog.open(TagColorMenuComponent);
    })
  );

  @Effect()
  getAllTags = this.actions$.pipe(
    ofType(getCompanyTags),
    switchMap(() => this.orgApi.organizationGetTags({include_system: true})
      .pipe(
        map((res: OrganizationGetTagsResponse) => setCompanyTags({tags: res.tags, systemTags: res.system_tags})),
        catchError(error => [new RequestFailed(error)])
      )
    )
  );

  @Effect()
  getTagsEffect = this.actions$.pipe(
    ofType(getTags),
    withLatestFrom(this.store.select(selectRouterParams).pipe(
      map(params => (params === null || params?.projectId === '*') ? [] : [params.projectId]))),
    switchMap(([action, projects]) => forkJoin([
      this.projectsApi.projectsGetTaskTags({projects}),
      this.projectsApi.projectsGetModelTags({projects})]
    ).pipe(
      map((res: [ProjectsGetTaskTagsResponse, ProjectsGetModelTagsResponse]) => Array.from(new Set(res[0].tags.concat(res[1].tags))).sort().concat(null)),
      mergeMap((tags: string[]) => [
        setTags({tags}),
        new DeactiveLoader(action.type)
      ]),
      catchError(error => [
        new RequestFailed(error),
        new DeactiveLoader(action.type),
        new SetServerError(error, null, 'Fetch tags failed')]
      )
    ))
  );

}
