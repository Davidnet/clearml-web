import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import * as actions from './select-model.actions';
import * as exSelectors from './select-model.reducer';
import {MODELS_PAGE_SIZE} from '../models/models.consts';
import {catchError, mergeMap, map, switchMap, withLatestFrom} from 'rxjs/operators';
import {get} from 'lodash-es';
import {MODEL_TAGS, MODELS_TABLE_COL_FIELDS} from '../models/shared/models.const';
import {IModelsViewState} from '../models/reducers/models-view.reducer';
import {ApiModelsService} from '~/business-logic/api-services/models.service';
import {requestFailed} from '../core/actions/http.actions';
import {activeLoader, deactivateLoader, setServerError} from '../core/actions/layout.actions';
import {selectRouterParams} from '../core/reducers/router-reducer';
import {addMultipleSortColumns} from '../shared/utils/shared-utils';
import {of} from 'rxjs';
import {FilterMetadata} from 'primeng/api/filtermetadata';
import {ModelsGetAllExRequest} from '~/business-logic/model/models/modelsGetAllExRequest';
import {SortMeta} from 'primeng/api';
import {encodeOrder} from '../shared/utils/tableParamEncode';
import {selectTableSortFields} from './select-model.reducer';
import {escapeRegex} from '@common/shared/utils/escape-regex';

@Injectable()
export class SelectModelEffects {

  constructor(private actions$: Actions, private store: Store<IModelsViewState>, private apiModels: ApiModelsService) {
  }

  activeLoader = createEffect(() => this.actions$.pipe(
    ofType(actions.GET_NEXT_MODELS, actions.GLOBAL_FILTER_CHANGED,
      actions.ALL_PROJECTS_MODE_CHANGED, actions.TABLE_SORT_CHANGED, actions.TABLE_FILTER_CHANGED),
    map(action => activeLoader(action.type))
  ));

  tableSortChange = createEffect(() => this.actions$.pipe(
    ofType(actions.tableSortChanged),
    withLatestFrom(this.store.select(selectTableSortFields)),
    switchMap(([action, oldOrders]) => {
      const orders = addMultipleSortColumns(oldOrders, action.colId, action.isShift);
      return [actions.setTableSort({orders})];
    })
  ));

  modelsFilterChanged = createEffect(() => this.actions$.pipe(
    ofType(actions.GLOBAL_FILTER_CHANGED, actions.ALL_PROJECTS_MODE_CHANGED, actions.TABLE_SORT_CHANGED, actions.TABLE_FILTER_CHANGED),
    switchMap((action) => this.fetchModels$(null)
      .pipe(
        mergeMap(res => [
          new actions.SetNoMoreModels((res.models.length < MODELS_PAGE_SIZE)),
          new actions.SetModels(res.models),
          actions.setCurrentScrollId({scrollId: res.scroll_id}),
          deactivateLoader(action.type)
        ]),
        catchError(error => [requestFailed(error), deactivateLoader(action.type), setServerError(error, null, 'Fetch Models failed')])
      )
    )
  ));

  getModels = createEffect(() => this.actions$.pipe(
    ofType<actions.GetNextModels>(actions.GET_NEXT_MODELS),
    withLatestFrom(this.store.select(exSelectors.selectCurrentScrollId)),
    switchMap(([action, scrollId]) =>
      this.fetchModels$(scrollId)
        .pipe(
          mergeMap(res => [
            new actions.SetNoMoreModels((res.models.length < MODELS_PAGE_SIZE)),
            new actions.AddModels(res.models),
            actions.setCurrentScrollId({scrollId: res.scroll_id}),
            deactivateLoader(action.type)
          ]),
          catchError(error => [requestFailed(error), deactivateLoader(action.type), setServerError(error, null, 'Fetch Models failed')])
        )
    )
  ));

  getGetAllQuery(
    scrollId: string, projectId: string, searchQuery: string, isAllProjects: boolean,
    orderFields: SortMeta[], tableFilters: { [s: string]: FilterMetadata }
  ): ModelsGetAllExRequest {
    const userFilter = get(tableFilters,[MODELS_TABLE_COL_FIELDS.USER, 'value']);
    const tagsFilter = tableFilters?.[MODELS_TABLE_COL_FIELDS.TAGS]?.value;
    const projectFilter = get(tableFilters,[MODELS_TABLE_COL_FIELDS.PROJECT, 'value']);
    const systemTags = tableFilters?.system_tags?.value;
    const systemTagsFilter = ['-' + MODEL_TAGS.HIDDEN].concat(systemTags ? systemTags : []);
    return {
      _any_: searchQuery ? {
        pattern: escapeRegex(searchQuery),
        fields: ['id', 'name', 'framework', 'system_tags', 'uri']
      } : undefined,
      /* eslint-disable @typescript-eslint/naming-convention */
      project:  projectFilter ? projectFilter : ((isAllProjects || !projectId || projectId === '*') ? undefined : [projectId]),
      scroll_id: scrollId || null, // null to create new scroll (undefined doesn't generate scroll)
      size: MODELS_PAGE_SIZE,
      order_by: encodeOrder(orderFields),
      tags: (tagsFilter && tagsFilter.length > 0) ? tagsFilter : [],
      system_tags: (systemTagsFilter && systemTagsFilter.length > 0) ? systemTagsFilter : [],
      only_fields: ['created', 'framework', 'id', 'labels', 'name', 'ready', 'tags', 'system_tags', 'task.name', 'uri', 'user.name', 'parent', 'design', 'company', 'project.name', 'comment', 'last_update'],
      ready: true,
      framework: tableFilters?.[MODELS_TABLE_COL_FIELDS.FRAMEWORK]?.value ?? undefined,
      user: (userFilter && userFilter.length > 0) ? userFilter : undefined
      /* eslint-enable @typescript-eslint/naming-convention */
    };
  }

  fetchModels$(scrollId1: string) {
    return of(scrollId1)
      .pipe(
        withLatestFrom(
          // TODO: refactor with ngrx router.
          this.store.select(selectRouterParams).pipe(map(params => params?.projectId)),
          this.store.select(exSelectors.selectIsAllProjectsMode),
          this.store.select(exSelectors.selectGlobalFilter),
          this.store.select(exSelectors.selectTableSortFields),
          this.store.select(exSelectors.selectTableFilters),
        ),
        switchMap(([scrollId, projectId, isAllProjects, gb, sortFields, filters]) =>
          this.apiModels.modelsGetAllEx(this.getGetAllQuery(scrollId, projectId, gb, isAllProjects, sortFields, filters))
        )
      );
  }

  getReadyFilter(tableFilters) {
    switch (tableFilters?.ready?.value?.length) {
      case 0:
        return null;
      case 1:
        return tableFilters.ready.value[0] === 'true';
      case 2:
        return null;
      default:
        return null;
    }
  }
}
