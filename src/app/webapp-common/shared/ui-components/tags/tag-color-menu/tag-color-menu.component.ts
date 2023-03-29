import {Component, ElementRef, Inject, OnDestroy, ViewChild} from '@angular/core';
import {Observable, of} from 'rxjs';
import {Store} from '@ngrx/store';
import {selectCompanyTags, selectProjectTags} from '@common/core/reducers/projects.reducer';
import {map, switchMap} from 'rxjs/operators';
import {TagColorService} from '../../../services/tag-color.service';
import {Tag} from '../tag-list/tag-list.component';
import {
  MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA,
  MatLegacyDialogRef as MatDialogRef
} from '@angular/material/legacy-dialog';
import {deactivateEdit} from '@common/experiments/actions/common-experiments-info.actions';
import {cancelModelEdit} from '@common/models/actions/models-info.actions';
import {selectRouterParams} from '@common/core/reducers/router-reducer';

@Component({
  selector: 'sm-tag-color-menu',
  templateUrl: './tag-color-menu.component.html',
  styleUrls: ['./tag-color-menu.component.scss']
})
export class TagColorMenuComponent implements OnDestroy {
  filterText: string;
  public tags$: Observable<Tag[]>;
  defaultColor: string;
  toggle: boolean;
  presetColors = TagColorService.predefined.map(color => color.background) as string[];
  currTag: string;

  @ViewChild('nameInput') nameInput: ElementRef<HTMLInputElement>;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {tags?: string[]},
    private store: Store,
    private colorService: TagColorService,
    private matDialogRef: MatDialogRef<TagColorMenuComponent>,
  ) {
    this.tags$ = this.store.select(selectRouterParams)
      .pipe(
        map(params => params?.projectId),
        switchMap( id => Array.isArray(data.tags) ? of(data.tags) :
          id === '*' ? this.store.select(selectCompanyTags) : this.store.select(selectProjectTags)),
        map((tags: string[]) => tags.map(tag => ({caption: tag, colorObservable: this.colorService.getColor(tag)} as Tag))));
  }

  close() {
    this.matDialogRef.close();
  }

  setForeground(tag: string, color: string) {
    this.colorService.setColor(tag, {foreground: color});
  }

  setBackground(tag: string, color: string) {
    this.colorService.setColor(tag, {background: color});
  }

  openColorPicker(tag: string, color: string) {
    this.currTag = tag;
    this.defaultColor = color;
    this.toggle = true;
  }

  clearSearch() {
    this.filterText = '';
  }

  ngOnDestroy(): void {
    this.store.dispatch(deactivateEdit());
    this.store.dispatch(cancelModelEdit());
  }
}
