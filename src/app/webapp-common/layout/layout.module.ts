import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SMSharedModule} from '../shared/shared.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {ProjectContextNavbarComponent} from './project-context-navbar/project-context-navbar.component';
import {LoggedOutAlertComponent} from './logged-out-alert/logged-out-alert.component';
import {S3AccessDialogComponent} from './s3-access-dialog/s3-access-dialog.component';
import {S3AccessResolverComponent} from './s3-access-resolver/s3-access-resolver.component';
import {StoreModule} from '@ngrx/store';
import {LayoutReducer} from './layout.reducer';
import {ServerNotificationDialogContainerComponent} from './server-notification-dialog-container/server-notification-dialog-container.component';
import {BreadcrumbsComponent} from './breadcrumbs/breadcrumbs.component';
import {CommonSearchModule} from '../common-search/common-search.module';
import {HeaderComponent} from './header/header.component';
import { UiUpdateDialogComponent } from './ui-update-dialog/ui-update-dialog.component';
import {SharedModule} from '../../shared/shared.module';


@NgModule({
    imports: [
        CommonModule,
        SMSharedModule,
        FormsModule,
        ReactiveFormsModule,
        CommonSearchModule,
        RouterModule,
        StoreModule.forFeature('layout', LayoutReducer),
        SharedModule,
    ],
  declarations: [HeaderComponent, BreadcrumbsComponent, ProjectContextNavbarComponent, LoggedOutAlertComponent, S3AccessResolverComponent, S3AccessDialogComponent, ServerNotificationDialogContainerComponent, UiUpdateDialogComponent],
  exports     : [HeaderComponent, BreadcrumbsComponent, ProjectContextNavbarComponent, LoggedOutAlertComponent, S3AccessResolverComponent, S3AccessDialogComponent, ServerNotificationDialogContainerComponent, UiUpdateDialogComponent]
})
export class CommonLayoutModule {
}
