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
import { ApplicantComponent } from './pages/backup/applicant/applicant.component';
import { ApprovesComponent } from './pages/backup/approves/approves.component';

import { SearchComponent } from './pages/backup/search/search.component';
import { SubstockComponent } from './pages/backup/substock/substock.component';
import { MaterialModules } from './materialModule';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ExpdrugComponent } from './pages/backup/expdrug/expdrug.component';
import { MatTableExporterModule } from 'mat-table-exporter';
import { AppointComponent } from './pages/backup/appoint/appoint.component';
import { InventorysComponent } from './pages/backup/inventorys/inventorys.component';
import { InvUpdateComponent } from './pages/backup/inv-update/inv-update.component';
import { AppointsComponent } from './pages/backup/appoints/appoints.component';
import { TransfersComponent } from './pages/backup/transfers/transfers.component';
import { TransReportComponent } from './pages/backup/trans-report/trans-report.component';
import { AbundantComponent } from './pages/phar93/abundant/abundant.component';
import { AbundReportComponent } from './pages/phar93/abund-report/abund-report.component';
import { DispenReportComponent } from './pages/backup/dispen-report/dispen-report.component';
import { InvOtherComponent } from './pages/backup/inv-other/inv-other.component';
import { MapDrugCodeComponent } from './pages/backup/map-drug-code/map-drug-code.component';
import { NavbarComponent } from './component/navbar/navbar.component';
import { InventoryComponent } from './pages/phar/inventory/inventory.component';
import { ImportInvComponent } from './pages/phar/import-inv/import-inv.component';
import { ReportClassifyComponent } from './pages/phar/report-classify/report-classify.component';
import { MapcodeComponent } from './pages/phar/mapcode/mapcode.component';
import { TransferInComponent } from './pages/phar/transfer-in/transfer-in.component';
import { TransferOutComponent } from './pages/phar/transfer-out/transfer-out.component';
import { ReportDrugexpComponent } from './pages/phar/report-drugexp/report-drugexp.component';
import { AppointmentComponent } from './pages/phar/appointment/appointment.component';
import { ReportTransferComponent } from './pages/phar/report-transfer/report-transfer.component';
import { SearchDrugComponent } from './pages/phar/search-drug/search-drug.component';
import { DrugSettingComponent } from './pages/phar/drug-setting/drug-setting.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NavComponent,
    ApplicantComponent,
    ApprovesComponent,

    SearchComponent,
    SubstockComponent,
    ExpdrugComponent,
    AppointComponent,
    InventorysComponent,
    InvUpdateComponent,
    AppointsComponent,
    TransfersComponent,
    TransReportComponent,
    AbundantComponent,
    AbundReportComponent,
    DispenReportComponent,
    InvOtherComponent,
    MapDrugCodeComponent,
    NavbarComponent,
    InventoryComponent,
    ImportInvComponent,
    ReportClassifyComponent,
    MapcodeComponent,
    TransferInComponent,
    TransferOutComponent,
    ReportDrugexpComponent,
    AppointmentComponent,
    ReportTransferComponent,
    SearchDrugComponent,
    DrugSettingComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatSliderModule,
    MaterialModules,
    NgxSpinnerModule,
    MatTableExporterModule,
  ],
  providers: [
    AppService,
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
