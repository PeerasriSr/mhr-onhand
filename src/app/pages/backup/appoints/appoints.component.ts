import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import * as XLSX from 'xlsx';
import * as moment from 'moment';
import Swal from 'sweetalert2';

import { DateAdapter } from '@angular/material/core';

import { NgxSpinnerService } from 'ngx-spinner';

interface Unit {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-appoints',
  templateUrl: './appoints.component.html',
  styleUrls: ['./appoints.component.scss'],
})
export class AppointsComponent implements OnInit {
  public id: any;
  public dep: any;
  public unitName: any = 'ทั้งหมด';
  public accuracy1: any;
  public accuracy30: any;
  public DISP_DATE: any;
  public DISP_DEPT: any;
  selectAll = true;

  public formatDate: any = null;
  public enDate: any = null;
  public thDate: any = null;
  public enDateNum: any;
  public formattedDateNum = parseInt(moment(new Date()).format('YYYYMMDD'));

  public listINV: Array<any> = [];
  public listDispen: Array<any> = [];
  public listAppoint: Array<any> = [];
  public dataAppoint: any = null;
  @ViewChild('sortAppoint') sortAppoint!: MatSort;
  @ViewChild('paginatorAppoint') paginatorAppoint!: MatPaginator;
  public displayAppoint: string[] = [];
  public displayINV: string[] = [
    'DISP_DATE',
    'MED_CODE',
    'DISP_DEPT',
    'DISP_QTY',
    'DISP_NAME',
  ];

  public units: Unit[] = [
    { value: '0', viewValue: 'ทั้งหมด' },
    { value: '1', viewValue: 'ยาเม็ด' },
    { value: '2', viewValue: 'ยาฉีด' },
    { value: '3', viewValue: 'ยาอื่นๆ' },
  ];
  public selectUnit: any = this.units[0].value;

  constructor(
    public services: AppService,
    private http: HttpClient,
    private spinner: NgxSpinnerService,
    private dateAdapter: DateAdapter<Date>
  ) {
    this.dateAdapter.setLocale('en-GB');
    this.dep = sessionStorage.getItem('dep');
    this.id = sessionStorage.getItem('id');
  }

  ngOnInit(): void {
    setTimeout(() => {
      // sessionStorage.setItem("selectPage", "Appoint");
      this.formatDate = new Date(new Date().setDate(new Date().getDate() + 1));
      this.getAppoint();
    }, 0);
  }

  public campaign = new FormGroup({
    picker: new FormControl(
      new Date(new Date().setDate(new Date().getDate() + 1))
    ),
  });

  public async dateChange(event: any) {
    this.formatDate = new Date(event.value);
    this.getAppoint();
  }

  public appointDisplay = async () => {
    if (this.formattedDateNum >= this.enDateNum) {
      this.displayAppoint = [
        'invCode',
        'drugCode',
        'name',
        'DFORM_NAME',
        'amount',
        'addOn',
        // 'pack',
        // 'onhand',
        'dispen',
        'accuracy1',
        'accuracy30',
        // 'DISP',
        // 'DISP_QTY',
      ];
    } else {
      this.displayAppoint = [
        'invCode',
        'drugCode',
        'name',
        'DFORM_NAME',
        'amount',
        'addOn',
        'pack',
        'onhand',
        // 'dispen',
        // 'accuracy',
        'DISP',
        'DISP_QTY',
      ];
    }
  };

  public getAppoint = async () => {
    this.spinner.show();
    this.listINV = [];
    this.listDispen = [];
    this.listAppoint = [];
    this.enDate = moment(this.formatDate).format('YYYY-MM-DD');
    this.enDateNum = parseInt(moment(this.formatDate).format('YYYYMMDD'));
    this.appointDisplay();
    // console.log(this.enDate);
    this.thDate =
      (parseInt(moment(this.formatDate).format('YYYY')) + 543).toString() +
      moment(this.formatDate).format('MMDD');
    this.DISP_DATE = this.enDate.replaceAll('-', '');
    this.DISP_DEPT = 'W08';
    let formData = new FormData();
    formData.append('enDate', this.enDate);
    formData.append('thDate', this.thDate);
    formData.append('depCode', this.dep);
    // formData.forEach((value, key) => {
    //   console.log(key + " : " + value);
    // });
    this.http
      .post(`${environment.apiUrl}OnHand/getInventory`, formData)
      .toPromise()
      .then((val: any) => {
        // console.log(val);
        this.listINV = val['result'];
        // console.log(this.listINV);
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
        this.http
          .post(`${environment.apiUrl}dispenSelectDay`, formData)
          .toPromise()
          .then((val: any) => {
            // console.log(val);
            this.listDispen = val['result'];
            // console.log(this.listDispen);
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
            this.http
              .post(`${environment.apiUrl}OnHand/getAppointNew`, formData)
              .toPromise()
              .then((val: any) => {
                // console.log(val);
                this.listAppoint = val['result'];
                // console.log(this.listAppoint);
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
                this.calAccuracy(this.selectAll);
                this.spinner.hide();
              });
          });
      });
  };

  selectToDis = async () => {
    this.selectAll = !this.selectAll;
    this.calAccuracy(this.selectAll);
  };

  public calAccuracy = async (e: any) => {
    this.accuracy1 = 0;
    this.accuracy30 = 0;
    this.dataAppoint = [];
    let arr: Array<any> = [];
    for (let i = 0; i < this.listAppoint.length; i++) {
      let total = 0;
      for (let k = 0; k < this.listINV.length; k++) {
        if (this.listAppoint[i]['drugCode'] == this.listINV[k]['drugCode']) {
          this.listAppoint[i]['onhand'] = this.listINV[k]['amount'];

          if (
            parseInt(this.listAppoint[i]['addOn']) >
            parseInt(this.listINV[k]['amount'])
          ) {
            total =
              parseInt(this.listAppoint[i]['addOn']) -
              this.listINV[k]['amount'];
          }
          this.listAppoint[i]['DISP'] = total;

          // this.listAppoint[i]["DISP_QTY"] =
          //   Math.ceil(total / this.listAppoint[i]["pack"]) *
          //   this.listAppoint[i]["pack"];
        }
      }

      this.listAppoint[i]['DISP_QTY'] =
        Math.ceil(this.listAppoint[i]['DISP'] / this.listAppoint[i]['pack']) *
        this.listAppoint[i]['pack'];
      for (let j = 0; j < this.listDispen.length; j++) {
        if (this.listAppoint[i]['drugCode'] == this.listDispen[j]['drugCode']) {
          this.listAppoint[i]['dispen'] = this.listDispen[j]['amount'];
          if (
            parseInt(this.listAppoint[i]['addOn']) >
            parseInt(this.listDispen[j]['amount'])
          ) {
            this.listAppoint[i]['accuracy30'] = (
              (this.listDispen[j]['amount'] * 100) /
              this.listAppoint[i]['addOn']
            ).toFixed(2);
          }
          if (
            parseInt(this.listAppoint[i]['addOn']) <=
            parseInt(this.listDispen[j]['amount'])
          ) {
            this.listAppoint[i]['accuracy1'] = (
              (this.listAppoint[i]['amount'] * 100) /
              this.listDispen[j]['amount']
            ).toFixed(2);
            this.listAppoint[i]['accuracy30'] = (
              (this.listAppoint[i]['addOn'] * 100) /
              this.listDispen[j]['amount']
            ).toFixed(2);
          }
          if (
            parseInt(this.listAppoint[i]['amount']) >
            parseInt(this.listDispen[j]['amount'])
          ) {
            this.listAppoint[i]['accuracy1'] = (
              (this.listDispen[j]['amount'] * 100) /
              this.listAppoint[i]['amount']
            ).toFixed(2);
          }
          if (
            parseInt(this.listAppoint[i]['amount']) <=
            parseInt(this.listDispen[j]['amount'])
          ) {
            this.listAppoint[i]['accuracy1'] = (
              (this.listAppoint[i]['amount'] * 100) /
              this.listDispen[j]['amount']
            ).toFixed(2);
          }
          if (e) {
            this.accuracy1 += parseInt(this.listAppoint[i]['accuracy1']);
            this.accuracy30 += parseInt(this.listAppoint[i]['accuracy30']);
          } else {
            if (this.listAppoint[i]['dispen'] > 0) {
              arr.push(this.listAppoint[i]);
              this.accuracy1 += parseInt(this.listAppoint[i]['accuracy1']);
              this.accuracy30 += parseInt(this.listAppoint[i]['accuracy30']);
            }
          }
        }
      }

      if (i == this.listAppoint.length - 1) {
        if (e) {
          this.accuracy1 = (this.accuracy1 / this.listAppoint.length).toFixed(
            2
          );
          this.accuracy30 = (this.accuracy30 / this.listAppoint.length).toFixed(
            2
          );
          this.dataAppoint = new MatTableDataSource(this.listAppoint);
        } else {
          this.accuracy1 = (this.accuracy1 / arr.length).toFixed(2);
          this.accuracy30 = (this.accuracy30 / arr.length).toFixed(2);
          this.dataAppoint = new MatTableDataSource(arr);
        }

        this.dataAppoint.sort = this.sortAppoint;
        this.dataAppoint.paginator = this.paginatorAppoint;
      }
    }
  };

  public changeUnit(e: any) {
    // console.log(e.target.value);
    // console.log(this.listAppoint);
    let arr: Array<any> = [];
    this.dataAppoint = [];
    if (e.target.value == 1) {
      this.unitName = 'ยาเม็ด';
      this.listAppoint.forEach((ei, i) => {
        if (this.listAppoint[i]['type'] == '4') {
          arr.push(this.listAppoint[i]);
        }
      });
    } else if (e.target.value == 2) {
      this.unitName = 'ยาฉีด';
      this.listAppoint.forEach((ei, i) => {
        if (this.listAppoint[i]['type'] == '3') {
          arr.push(this.listAppoint[i]);
        }
      });
      // console.log(arr);
    } else if (e.target.value == 3) {
      this.unitName = 'ยาอื่นๆ';
      this.listAppoint.forEach((ei, i) => {
        if (
          this.listAppoint[i]['type'] != '4' &&
          this.listAppoint[i]['type'] != '3'
        ) {
          arr.push(this.listAppoint[i]);
        }
      });
      console.log(arr);
    } else {
      this.unitName = 'ทั้งหมด';
      arr = this.listAppoint;
    }
    this.dataAppoint = new MatTableDataSource(arr);
    this.dataAppoint.sort = this.sortAppoint;
    this.dataAppoint.paginator = this.paginatorAppoint;
  }

  public appointFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataAppoint.filter = filterValue.trim().toLowerCase();
  }
}
