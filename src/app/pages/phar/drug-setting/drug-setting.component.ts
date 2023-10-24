import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-drug-setting',
  templateUrl: './drug-setting.component.html',
  styleUrls: ['./drug-setting.component.scss'],
})
export class DrugSettingComponent implements OnInit {
  group: any;

  // listDrugSet: Array<any> = [];
  // listINVCode: Array<any> = [];

  listAllDrug: Array<any> = [];
  dataAllDrug: any = null;
  @ViewChild('sortAlldrug') sortAlldrug!: MatSort;
  @ViewChild('paginatorAllDrug') paginatorAllDrug!: MatPaginator;
  displayAllDrug: string[] = ['drugCode', 'invCode', 'drugName', 'setting'];

  constructor(
    public services: AppService,
    private http: HttpClient,
    private spinner: NgxSpinnerService
  ) {
    this.group = sessionStorage.getItem('group');
  }

  ngOnInit(): void {
    this.getDrugSetting();
  }

  getDrugSetting = async () => {
    this.spinner.show();
    this.listAllDrug = [];
    this.dataAllDrug = [];
    let key = new FormData();
    key.append('group', this.group);
    this.http
      .post(`${environment.apiUrl}drugSetting`, key)
      .toPromise()
      .then((val: any) => {
        if (val['rowCount'] > 0) {
          // console.log(val);
          this.listAllDrug = val['result'];
        }
      })
      .catch((reason) => {
        console.log(reason);
        this.services.alert('error', 'ไม่สามารถเขื่อมต่อเชิฟเวอร์ได้', '');
      })
      .finally(() => {
        this.spinner.hide();
        this.dataAllDrug = new MatTableDataSource(this.listAllDrug);
        this.dataAllDrug.sort = this.sortAlldrug;
        this.dataAllDrug.paginator = this.paginatorAllDrug;
      });
  };

  filterValue: any = '';
  drugFilter(event: Event) {
    // console.log(event);
    this.filterValue = (event.target as HTMLInputElement).value;
    this.dataAllDrug.filter = this.filterValue.trim().toLowerCase();
  }

  switch(e: any) {
    // console.log(e);
    let key = new FormData();
    key.append('group', this.group);
    key.append('drugCode', e.drugCode);
    if (e.setting === 'N') {
      this.services
        .confirm('warning', 'เปิดใช้งาน', e.drugCode + ' ' + e.drugName)
        .then((val: any) => {
          if (val) {
            this.http
              .post(`${environment.apiUrl}deleteDrugHide`, key)
              .toPromise()
              .then((val: any) => {
                // console.log(val);
              })
              .catch((reason) => {
                console.log(reason);
                this.services.alert(
                  'error',
                  'ไม่สามารถเชื่อมต่อกับเซิฟเวอร์ได้',
                  'โปรดติดต่อผู้ดูแลระบบ'
                );
              })
              .finally(() => {
                this.getDrugSetting();
              });
          }
        });
    } else {
      this.services
        .confirm('warning', 'ปิดใช้งาน', e.drugCode + ' ' + e.drugName)
        .then((val: any) => {
          if (val) {
            this.http
              .post(`${environment.apiUrl}insertDrugHide`, key)
              .toPromise()
              .then((val: any) => {
                // console.log(val);
              })
              .catch((reason) => {
                console.log(reason);
                this.services.alert(
                  'error',
                  'ไม่สามารถเชื่อมต่อกับเซิฟเวอร์ได้',
                  'โปรดติดต่อผู้ดูแลระบบ'
                );
              })
              .finally(() => {
                this.getDrugSetting();
              });
          }
        });
    }
  }
}
