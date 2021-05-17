import { BrowserModule }            from '@angular/platform-browser';
import { BrowserAnimationsModule }  from '@angular/platform-browser/animations';
import { HttpClientModule }         from '@angular/common/http';
import { NgModule }                 from '@angular/core';

import { SharedModule }             from './shared/shared.module';

import { AppRoutingModule }         from './app-routing.module';
import { AppComponent }             from './app.component';
import { PageNotFoundComponent }    from './pages/page-not-found/page-not-found.component';
import { ProfileComponent }         from './pages/profile/profile.component';
import { SidebarComponent }         from './components/sidebar/sidebar.component';


@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    ProfileComponent,
    SidebarComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    SharedModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
