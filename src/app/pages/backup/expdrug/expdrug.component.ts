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
import Swal from 'sweetalert2';

import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-expdrug',
  templateUrl: './expdrug.component.html',
  styleUrls: ['./expdrug.component.scss'],
})
export class ExpdrugComponent implements OnInit {
  public id: any;
  public dep: any;
  public role: any;

  public startDate: any = null;
  public endDate: any = null;
  public formattedDate = moment(new Date()).format('YYYY-MM-DD');

  public listdeviceAllDrug: Array<any> = [];

  public listAllExp: Array<any> = [];
  public dataAllExp: any = null;
  @ViewChild('sortAllExp') sortAllExp!: MatSort;
  @ViewChild('paginatorAllExp') paginatorAllExp!: MatPaginator;
  public displayAllExp: string[] = [
    // "drugCode",
    'drugName',
    'LOT_NO',
    'EXP_Date',
    // "amount",
  ];

  public listAlertExp: Array<any> = [];
  public dataAlertExp: any = null;
  @ViewChild('sortAlertExp') sortAlertExp!: MatSort;
  @ViewChild('paginatorAlertExp') paginatorAlertExp!: MatPaginator;
  public displayAlertExp: string[] = [
    // "drugCode",
    'drugName',
    'LOT_NO',
    'EXP_Date',
    // "amount",
  ];

  constructor(
    public services: AppService,
    private http: HttpClient,
    private dateAdapter: DateAdapter<Date>,
    private spinner: NgxSpinnerService,
  ) {
    this.dateAdapter.setLocale('en-GB');
    this.dep = sessionStorage.getItem('dep');
    this.id = sessionStorage.getItem('id');
    this.startDate = moment(this.campaignOne.value.start).format('YYYY-MM-DD');
    this.endDate = moment(this.campaignOne.value.end).format('YYYY-MM-DD');
    this.role = sessionStorage.getItem('role');
  }

  ngOnInit(): void {
    setTimeout(() => {
      // sessionStorage.setItem("selectPage", "ExpDrug");
      this.getAretExp();
      this.getDrugEXP();
      this.spinner.show();
    }, 0);
  }

  public campaignOne = new FormGroup({
    start: new FormControl(new Date()),
    end: new FormControl(new Date()),
  });

  public getAretExp = async () => {
    // console.log(data);
    this.listAlertExp = [];
    this.dataAlertExp = [];
    let depData = new FormData();
    depData.append('depCode', this.dep);
    this.http
      .post(`${environment.apiUrl}OnHand/getAretExp`, depData)
      .toPromise()
      .then((val: any) => {
        // console.log(val);
        this.listAlertExp = val['result'];
        // console.log(this.listAlertExp);
        this.dataAlertExp = new MatTableDataSource(this.listAlertExp);
        this.dataAlertExp.sort = this.sortAlertExp;
        this.dataAlertExp.paginator = this.paginatorAlertExp;
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
        // this.deviceAllDrug();
      });
  };

  public deviceAllDrug = async () => {
    this.listdeviceAllDrug = [];
    this.http
      .get(`${environment.apiUrl}deviceAllDrug`)
      .toPromise()
      .then((val: any) => {
        if (val['rowCount'] > 0) {
          // console.log(val);
          this.listdeviceAllDrug = val['result'];
          // console.log(this.listdeviceAllDrug);
        }
      })
      .catch((reason) => {
        console.log(reason);
        this.services.alert('error', 'ไม่สามารถเขื่อมต่อเชิฟเวอร์ได้', '');
      })
      .finally(() => {
        this.matchDevice1();
      });
  };

  public getDrugEXP = async () => {
    // console.log(data);
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
        this.dataAllExp = new MatTableDataSource(this.listAllExp);
        this.dataAllExp.sort = this.sortAllExp;
        this.dataAllExp.paginator = this.paginatorAllExp;
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
        this.matchDevice2();
        this.spinner.hide();
      });
  };

  public matchDevice1 = async () => {
    this.listAlertExp.forEach((ei, i) => {
      this.listdeviceAllDrug.forEach((ej, j) => {
        if (
          this.listAlertExp[i]['drugCode'] ==
          this.listdeviceAllDrug[j]['drugCode']
        ) {
          if (this.listAlertExp[i]['robot'].length > 0) {
            this.listAlertExp[i]['robot'] += ', ';
          }
          this.listAlertExp[i]['robot'] +=
            this.listdeviceAllDrug[j]['deviceName'];
          if (this.listdeviceAllDrug[j]['positionID'] != null) {
            this.listAlertExp[i]['robot'] +=
              '-' + this.listdeviceAllDrug[j]['positionID'];
          }
        }
      });
    });
  };

  public matchDevice2 = async () => {
    this.listAllExp.forEach((ei, i) => {
      this.listdeviceAllDrug.forEach((ej, j) => {
        if (
          this.listAllExp[i]['drugCode'] ==
          this.listdeviceAllDrug[j]['drugCode']
        ) {
          if (this.listAllExp[i]['robot'].length > 0) {
            this.listAllExp[i]['robot'] += ', ';
          }
          this.listAllExp[i]['robot'] +=
            this.listdeviceAllDrug[j]['deviceName'];
          if (this.listdeviceAllDrug[j]['positionID'] != null) {
            this.listAllExp[i]['robot'] +=
              '-' + this.listdeviceAllDrug[j]['positionID'];
          }
        }
      });
    });

  };

  public selectInput(e: any) {
    console.log(e.target.value);
  }

  public startChange(event: any) {
    const momentDate = new Date(event.value);
    this.startDate = moment(momentDate).format('YYYY-MM-DD');
  }

  public async endChange(event: any) {
    const momentDate = new Date(event.value);
    this.endDate = moment(momentDate).format('YYYY-MM-DD');
    this.getDrugEXP();
  }

  public expFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataAlertExp.filter = filterValue.trim().toLowerCase();
  }

  public editAmount = async (val: any) => {
    // console.log(val.drugCode);
    let drugCode = val.drugCode
    let LOT_NO = val.LOT_NO   
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
}
