import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import * as moment from 'moment';
import { DateAdapter } from '@angular/material/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-report-drugexp',
  templateUrl: './report-drugexp.component.html',
  styleUrls: ['./report-drugexp.component.scss'],
})
export class ReportDrugexpComponent implements OnInit {
   id: any;
   dep: any;
   role: any;

   startDate: any = null;
   endDate: any = null;
   formattedDate = moment(new Date()).format('YYYY-MM-DD');

   listAlertExp: Array<any> = [];
   dataAlertExp: any = null;
  @ViewChild('sortAlertExp') sortAlertExp!: MatSort;
  @ViewChild('paginatorAlertExp') paginatorAlertExp!: MatPaginator;
   displayAlertExp: string[] = [
    // "drugCode",
    'drugName',
    'LOT_NO',
    'EXP_Date',
    'action',
  ];

   listAllExp: Array<any> = [];
   dataAllExp: any = null;
  @ViewChild('sortAllExp') sortAllExp!: MatSort;
  @ViewChild('paginatorAllExp') paginatorAllExp!: MatPaginator;
   displayAllExp: string[] = [
    // "drugCode",
    'drugName',
    'LOT_NO',
    'EXP_Date',
    "action",
  ];

  constructor(
    public services: AppService,
    private http: HttpClient,
    private dateAdapter: DateAdapter<Date>,
    private spinner: NgxSpinnerService
  ) {
    this.dateAdapter.setLocale('en-GB');
    this.dep = sessionStorage.getItem('dep');
    this.id = sessionStorage.getItem('id');
    this.startDate = moment(this.campaignOne.value.start).format('YYYY-MM-DD');
    this.endDate = moment(this.campaignOne.value.end).format('YYYY-MM-DD');
    this.role = sessionStorage.getItem('role');
  }

  ngOnInit(): void {
    this.getAretExp();
    this.getDrugEXP();
  }

   campaignOne = new FormGroup({
    start: new FormControl(new Date()),
    end: new FormControl(
      new Date(new Date().setMonth(new Date().getMonth() + 6))
    ),
  });

   startChange(event: any) {
    const momentDate = new Date(event.value);
    this.startDate = moment(momentDate).format('YYYY-MM-DD');
  }

   async endChange(event: any) {
    const momentDate = new Date(event.value);
    this.endDate = moment(momentDate).format('YYYY-MM-DD');
    if (this.endDate !== '1970-01-01') {
      this.getDrugEXP();
    }
  }

   getAretExp = async () => {
    this.spinner.show();
    this.listAlertExp = [];
    this.dataAlertExp = null;
    let depData = new FormData();
    depData.append('depCode', this.dep);
    this.http
      .post(`${environment.apiUrl}listDrugExpNow`, depData)
      .toPromise()
      .then((val: any) => {
        // console.log(val);
        this.listAlertExp = val['result'];
        // console.log(this.listAlertExp);
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
        this.spinner.hide();
        this.dataAlertExp = new MatTableDataSource(this.listAlertExp);
        this.dataAlertExp.sort = this.sortAlertExp;
        this.dataAlertExp.paginator = this.paginatorAlertExp;
      });
  };

   editAmount = async (val: any) => {
    // console.log(val.drugCode);
    let drugCode = val.drugCode;
    let LOT_NO = val.LOT_NO;
    this.services
      .confirm(
        'warning',
        'ลบ Lot.' + val.LOT_NO + ' Exp.' + val.EXP_Date,
        val.drugName
      )
      .then((val: any) => {
        if (val) {
          let drug = new FormData();
          drug.append('drugCode', drugCode);
          drug.append('LOT_NO', LOT_NO);
          // drug.forEach((value, key) => {
          //     console.log(key + " : " + value);
          //   });
          this.http
            .post(`${environment.apiUrl}deleteLOT`, drug)
            .toPromise()
            .then((val: any) => {
              // console.log(val);
              if (val.isQuery) {
                this.services.alertTimer('success', 'ลบรายการสำเร็จ');
              }
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
              this.getAretExp();
              this.getDrugEXP();
            });
        }
      });
  };

   getDrugEXP = async () => {
    this.spinner.show();
    this.listAllExp = [];
    this.dataAllExp = [];
    let depData = new FormData();
    depData.append('depCode', this.dep);
    depData.append('startDate', this.startDate);
    depData.append('endDate', this.endDate);
    this.http
      .post(`${environment.apiUrl}AllLotExp`, depData)
      .toPromise()
      .then((val: any) => {
        // console.log(val);
        this.listAllExp = val['result'];
        // console.log(this.listAllExp);
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
        this.spinner.hide();
        this.dataAllExp = new MatTableDataSource(this.listAllExp);
        this.dataAllExp.sort = this.sortAllExp;
        this.dataAllExp.paginator = this.paginatorAllExp;
      });
  };
}
