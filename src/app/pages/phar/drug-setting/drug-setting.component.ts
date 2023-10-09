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

  listDrugSet: Array<any> = [];
  listINVCode: Array<any> = [];

  listAllDrug: Array<any> = [];
  dataAllDrug: any = null;
  @ViewChild('sortAlldrug') sortAlldrug!: MatSort;
  @ViewChild('paginatorAllDrug') paginatorAllDrug!: MatPaginator;
  displayAllDrug: string[] = ['drugCode', 'invCode', 'drugName', 'chooses'];

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

  getDrugSetting() {
    this.spinner.show();
    this.listDrugSet = [];
    let key = new FormData();
    key.append('group', this.group);
    this.listINVCode = [];
    this.http
      .get(`${environment.apiUrl}listINVcode`)
      .toPromise()
      .then((val: any) => {
        if (val['rowCount'] > 0) {
          // console.log(val);
          this.listINVCode = val['result'];
          // console.log(this.listINVCode);
        }
      })
      .catch((reason) => {
        console.log(reason);
        this.services.alert('error', 'ไม่สามารถเขื่อมต่อเชิฟเวอร์ได้', '');
      })
      .finally(() => {});
    this.http
      .post(`${environment.apiUrl}drugSetting`, key)
      .toPromise()
      .then((val: any) => {
        if (val['rowCount'] > 0) {
          this.listDrugSet = val['result'];
          // console.log(this.listDrugSet);
        }
      })
      .catch((reason) => {
        console.log(reason);
        this.services.alert('error', 'ไม่สามารถเขื่อมต่อเชิฟเวอร์ได้', '');
      })
      .finally(() => {
        this.spinner.hide();
        this.getAllDrug();
      });
  }

  getAllDrug = async () => {
    this.spinner.show();
    this.listAllDrug = [];
    this.dataAllDrug = [];
    this.http
      .get(`${environment.apiUrl}OnHand/allDrugHomeC`)
      .toPromise()
      .then((val: any) => {
        if (val['rowCount'] > 0) {
          // console.log(val);
          this.listAllDrug = val['result'];
          this.listAllDrug.forEach((el) => {
            el.chooses = 'N';
            this.listDrugSet.forEach((h) => {
              if (el.drugCode === h.drugCode || el.inv_code === h.inv_code) {
                // console.log(el.drugCode);
                el.chooses = 'Y';
              }
            });
            this.listINVCode.forEach((c) => {
              if (c.HIS_CODE === el.drugCode) {
                el.img = c.MED_CODE;
              }
            });
          });
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
    console.log(e);
    if (e.chooses === 'Y') {
      this.services
        .confirm('warning', 'ปิดใช้งาน', e.drugCode + ' ' + e.drugName)
        .then((val: any) => {
          if (val) {
          }
        });
    } else {
      this.services
        .confirm('warning', 'เปิดใช้งาน', e.drugCode + ' ' + e.drugName)
        .then((val: any) => {
          if (val) {
            let key = new FormData();
            key.append('group', this.group);
            key.append('inv_code', e.img);
            key.append('drugCode', e.drugCode);
            this.http
              .post(`${environment.apiUrl}insertDrugSet`, key)
              .toPromise()
              .then((val: any) => {
                console.log(val);
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
