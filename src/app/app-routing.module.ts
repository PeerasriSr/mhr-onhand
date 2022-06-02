import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { NavComponent } from './component/nav/nav.component';
import { AuthGuard } from './guard/auth.guard';
import { ApplicantComponent } from './pages/applicant/applicant.component';
import { ApprovesComponent } from './pages/approves/approves.component';
import { InventoryComponent } from './pages/inventory/inventory.component';
import { SearchComponent } from './pages/search/search.component';
import { SubstockComponent } from './pages/substock/substock.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
      }
    ],
  },
  {
    path: '',
    component: NavComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'Applicant',
        component: ApplicantComponent,
      },
      {
        path: 'Approves',
        component: ApprovesComponent,
      },
      {
        path: 'Inventory',
        component: InventoryComponent,
      },
      {
        path: 'Search',
        component: SearchComponent,
      },
      {
        path: 'SubStock',
        component: SubstockComponent,
      }
    ],
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
