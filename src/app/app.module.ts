import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { OverviewComponent } from './overview/overview.component';
import { OverviewChannelComponent } from './overview-channel/overview-channel.component';
import { ProfileComponent } from './profile/profile.component';
import { DateComponent } from './shared/form/date/date.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NumberComponent } from './shared/form/number/number.component';
import { SelectComponent } from './shared/form/select/select.component';
import { TextComponent } from './shared/form/text/text.component';
import { PasswordComponent } from './shared/form/password/password.component';
import { DatePipe } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { HttpRequestInterceptor } from './http-request.interceptor';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ManageComponent } from './manage/manage.component';
import { SettingsComponent } from './settings/settings.component';
import { TextareaComponent } from './shared/form/textarea/textarea.component';


@NgModule({
  declarations: [
    AppComponent,
    OverviewComponent,
    OverviewChannelComponent,
    ProfileComponent,
    DateComponent,
    NumberComponent,
    SelectComponent,
    TextComponent,
    PasswordComponent,
    LoginComponent,
    ManageComponent,
    SettingsComponent,
    TextareaComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    FontAwesomeModule,
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
