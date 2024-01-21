import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OverviewComponent } from './overview/overview.component';
import { OverviewChannelComponent } from './overview-channel/overview-channel.component';
import { ProfileComponent } from './profile/profile.component';
import { LoginComponent } from './login/login.component';
import { ManageComponent } from './manage/manage.component';

const routes: Routes = [
  { path: '', component: OverviewComponent },
  { path: 'login', component: LoginComponent },
  { path: 'channel/overview', component: OverviewChannelComponent },
  { path: 'profile/:userId', component: ProfileComponent },
  { path: 'manage', component: ManageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
