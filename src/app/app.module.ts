import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './page/home/home.component';
import { LoginComponent } from './page/login/login.component';
import { RecordSharedComponent } from './page/record/record-shared/record-shared.component';
import { RecordCreateComponent } from './page/record/record-create/record-create.component';
import { DateInputComponent } from './form-input/date-input/date-input.component';
import { SelectInputComponent } from './form-input/select-input/select-input.component';
import { NumberInputComponent } from './form-input/number-input/number-input.component';
import { TextInputComponent } from './form-input/text-input/text-input.component';
import { HttpRequestInterceptor } from './http-interceptor/http-request.interceptor';
import { DatePipe } from '@angular/common';
import { UserProfileComponent } from './page/user/user-profile/user-profile.component';
import { RecordManageComponent } from './page/record/record-manage/record-manage.component';
import { UserConnectionComponent } from './page/user/user-connection/user-connection.component';
import { PatchNotesComponent } from './page/general/patch-notes/patch-notes.component';
import { UserSettingsComponent } from './page/user/user-settings/user-settings.component';
import { LabelResultComponent } from './page/user/user-profile/label-result/label-result.component';
import { NgApexchartsModule } from 'ng-apexcharts';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RecordSharedComponent,
    RecordCreateComponent,
    DateInputComponent,
    SelectInputComponent,
    NumberInputComponent,
    TextInputComponent,
    UserProfileComponent,
    RecordManageComponent,
    UserConnectionComponent,
    PatchNotesComponent,
    UserSettingsComponent,
    LabelResultComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    FontAwesomeModule,
    NgApexchartsModule,
  ],
  providers: [
    DatePipe,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpRequestInterceptor,
      multi: true,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
