import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './page/home/home.component';
import { LoginComponent } from './page/login/login.component';
import { RecordSharedComponent } from './page/record/record-shared/record-shared.component';
import { RecordCreateComponent } from './page/record/record-create/record-create.component';
import { UserProfileComponent } from './page/user/user-profile/user-profile.component';
import { RecordManageComponent } from './page/record/record-manage/record-manage.component';
import { UserConnectionComponent } from './page/user/user-connection/user-connection.component';
import { PatchNotesComponent } from './page/general/patch-notes/patch-notes.component';
import { UserSettingsComponent } from './page/user/user-settings/user-settings.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'shared', component: RecordSharedComponent },
  { path: 'create', component: RecordCreateComponent },
  { path: 'manage', component: RecordManageComponent },
  { path: 'settings', component: UserSettingsComponent },
  { path: 'profile/:userid', component: UserProfileComponent },
  { path: 'patch-notes', component: PatchNotesComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
