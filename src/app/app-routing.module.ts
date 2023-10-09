import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { NavComponent } from './component/nav/nav.component';
import { AuthGuard } from './guard/auth.guard';
import { AppointComponent } from './pages/backup/appoint/appoint.component';
import { ApplicantComponent } from './pages/backup/applicant/applicant.component';
import { ApprovesComponent } from './pages/backup/approves/approves.component';

import { SearchComponent } from './pages/backup/search/search.component';
import { SubstockComponent } from './pages/backup/substock/substock.component';
import { ExpdrugComponent } from './pages/backup/expdrug/expdrug.component';
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

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'login',
        component: LoginComponent,
      },
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    component: NavbarComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'Inventory',
        component: InventoryComponent,
      },
      {
        path: 'ImportInv',
        component: ImportInvComponent,
      },
      {
        path: 'ReportClassify',
        component: ReportClassifyComponent,
      },
      {
        path: 'MapCode',
        component: MapcodeComponent,
      },
      {
        path: 'DrugSetting',
        component: DrugSettingComponent,
      },
      {
        path: 'TransferIn',
        component: TransferInComponent,
      },
      {
        path: 'TransferOut',
        component: TransferOutComponent,
      },
      {
        path: 'ReportDrugExp',
        component: ReportDrugexpComponent,
      },
      {
        path: 'Appointment',
        component: AppointmentComponent,
      },
      {
        path: 'ReportTransfer',
        component: ReportTransferComponent,
      },
      {
        path: 'SearchDrug',
        component: SearchDrugComponent,
      },

      // {
      //   path: 'Transfers',
      //   component: TransfersComponent,
      // },
      // {
      //   path: 'Trans/Report',
      //   component: TransReportComponent,
      // },

      // {
      //   path: 'INV/Other',
      //   component: InvOtherComponent,
      // },
      // {
      //   path: 'INV/Update',
      //   component: InvUpdateComponent,
      // },
      // {
      //   path: 'Appoints',
      //   component: AppointsComponent,
      // },
      // {
      //   path: 'MapDrugCode',
      //   component: MapDrugCodeComponent,
      // },
      // {
      //   path: 'Applicant',
      //   component: ApplicantComponent,
      // },
      // {
      //   path: 'Appoint',
      //   component: AppointComponent,
      // },
      // {
      //   path: 'Approves',
      //   component: ApprovesComponent,
      // },
      // {
      //   path: 'Inventory',
      //   component: InventoryComponent,
      // },
      // {
      //   path: 'Search',
      //   component: SearchComponent,
      // },
      // {
      //   path: 'SubStock',
      //   component: SubstockComponent,
      // },
      {
        path: 'Abundant',
        component: AbundantComponent,
      },
      {
        path: 'Abundant/Report',
        component: AbundReportComponent,
      },
      // {
      //   path: 'ExpDrug',
      //   component: ExpdrugComponent,
      // },
      // {
      //   path: 'Dispens',
      //   component: DispenReportComponent,
      // },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
