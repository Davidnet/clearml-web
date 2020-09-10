import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {AdminService} from '../../../../features/admin/admin.service';
import {Artifact} from '../../../../business-logic/model/tasks/artifact';
import {Store} from '@ngrx/store';
import {BaseClickableArtifact} from '../base-clickable-artifact';

@Component({
  selector: 'sm-experiment-artifact-item-view',
  templateUrl: './experiment-artifact-item-view.component.html',
  styleUrls: ['./experiment-artifact-item-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExperimentArtifactItemViewComponent extends BaseClickableArtifact{

  public isLocalFile: boolean;
  private _artifact: Artifact;

  @Input() editable: boolean;
  public isLinkable: boolean;

  @Input() set artifact(artifact: Artifact) {
    this._artifact = artifact;
    if(artifact){
      this.isLocalFile = artifact.uri && this.adminService.isLocalFile(artifact.uri);
      this.isLinkable = artifact.type_data && ['text/html'].includes(artifact.type_data.content_type);
    }
  }

  get artifact(): Artifact {
    return this._artifact;
  }

  constructor(protected adminService: AdminService, protected store: Store<any>) {
    super(adminService, store);
  }

  linkClicked(event: Event) {
    const signed = this.adminService.signUrlIfNeeded(this.artifact.uri, true);
    const a = document.createElement('a');
    a.href = signed || this.artifact.uri;
    a.target = '_blank';
    a.click();
    event.preventDefault();
  }
}
