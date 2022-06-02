import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { MatSliderModule } from '@angular/material/slider';
import { AppService } from './services/app.service';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { NavComponent } from './component/nav/nav.component';
import { ApplicantComponent } from './pages/applicant/applicant.component';
import { ApprovesComponent } from './pages/approves/approves.component';
import { InventoryComponent } from './pages/inventory/inventory.component';
import { SearchComponent } from './pages/search/search.component';
import { SubstockComponent } from './pages/substock/substock.component';
import { MaterialModules } from './materialModule';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NavComponent,
    ApplicantComponent,
    ApprovesComponent,
    InventoryComponent,
    SearchComponent,
    SubstockComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatSliderModule,
    MaterialModules,
    NgxSpinnerModule
  ],
  providers: [
    AppService, {
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
