import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import * as moment from 'moment';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';

const _window: any = window;

@Component({
  selector: 'app-report-classify',
  templateUrl: './report-classify.component.html',
  styleUrls: ['./report-classify.component.scss'],
})
export class ReportClassifyComponent implements OnInit {
  id: any;
  job: any;
  dep: any;
  depName: any;
  depAtt: any;
  startDate: any = null;
  endDate: any = null;
  role: any;
  group: any;

  listMedType: Array<any> = [];
  medType: any;
  medTypeNm: any;

  listINV: Array<any> = [];
  dataINV: any = null;
  @ViewChild('sortINV') sortINV!: MatSort;
  @ViewChild('paginatorINV') paginatorINV!: MatPaginator;
  selectedRowIndex: any;
  displayedINV: string[] = [
    // 'indexrow',
    // "invCode",
    // 'drugCode',
    'drugName',
    // "position",
    'invPrice',
    'mhrPrice',
    'amount',
    'miniSpec',
    'action',
  ];

  listGroup: Array<any> = [];
  dataGroup: any = null;
  @ViewChild('sortGroup') sortGroup!: MatSort;
  @ViewChild('paginatorGroup') paginatorGroup!: MatPaginator;
  displayedGroup: string[] = [
    // 'indexrow',
    // "invCode",
    // 'drugCode',
    'drugName',
    // "position",
    'invPrice',
    'mhrPrice',
    'amount',
    'miniSpec',
    'action',
  ];

  listIdenWard: Array<any> = [];
  dataIdenWard: any = null;
  @ViewChild('sortIdenWard') sortIdenWard!: MatSort;
  @ViewChild('paginatorIdenWard') paginatorIdenWard!: MatPaginator;
  displayedIdenWard: string[] = [
    // 'indexrow',
    'userName',
    // 'drugCode',
    'drugName',
    // "position",
    'invPrice',
    'mhrPrice',
    'amount',
    'miniSpec',
    // 'action',
  ];

  listIdenGroup: Array<any> = [];
  dataIdenGroup: any = null;
  @ViewChild('sortIdenGroup') sortIdenGroup!: MatSort;
  @ViewChild('paginatorIdenGroup') paginatorIdenGroup!: MatPaginator;
  displayedIdenGroup: string[] = [
    // 'indexrow',
    'userName',
    // 'drugCode',
    'drugName',
    // "position",
    'invPrice',
    'mhrPrice',
    'amount',
    'miniSpec',
    // 'action',
  ];

  listDrugHit: Array<any> = [];
  dataDrugHit: any = null;
  detailDrugHit: any = null;
  @ViewChild('sortDrugHit') sortDrugHit!: MatSort;
  @ViewChild('paginatorDrugHit') paginatorDrugHit!: MatPaginator;
  displayDrugHit: string[] = [
    'createDate',
    'depFrom',
    'depTo',
    'amount',
    'userName',
  ];

  constructor(
    public services: AppService,
    private http: HttpClient,
    private spinner: NgxSpinnerService
  ) {
    this.dep = sessionStorage.getItem('dep');
    this.depName = sessionStorage.getItem('depName');
    // console.log(this.dep)
    this.id = sessionStorage.getItem('id');
    this.job = sessionStorage.getItem('่job');
    this.depAtt = sessionStorage.getItem('depAtt');
    this.role = sessionStorage.getItem('role');
    this.group = sessionStorage.getItem('group');
  }

  ngOnInit(): void {
    this.getMedType();
    this.startDate = moment(this.campaignOne.value.start).format('YYYY-MM-DD');
    this.endDate = moment(this.campaignOne.value.end).format('YYYY-MM-DD');
  }

  campaignOne = new FormGroup({
    start: new FormControl(new Date()),
    end: new FormControl(new Date()),
  });

  startChange(event: any) {
    const momentDate = new Date(event.value);
    this.startDate = moment(momentDate).format('YYYY-MM-DD');
  }

  async endChange(event: any) {
    const momentDate = new Date(event.value);
    this.endDate = moment(momentDate).format('YYYY-MM-DD');
  }

  getMedType = async () => {
    this.listMedType = [];
    this.http
      .get(`${environment.apiUrl}medRoom`)
      .toPromise()
      .then((val: any) => {
        if (val['rowCount'] > 0) {
          this.listMedType = val['result'];
          // console.log(this.listMedType);
        }
      })
      .catch((reason) => {
        console.log(reason);
        this.services.alert('error', 'ไม่สามารถเขื่อมต่อเชิฟเวอร์ได้', '');
      })
      .finally(() => {});
  };

  selectInvType(e: any) {
    // console.log(e.value);
    this.medType = e.value.split(',')[0];
    this.medTypeNm = e.value.split(',')[1];
  }

  getInvType = async () => {
    this.spinner.show();

    this.listINV = [];
    this.dataINV = null;
    this.listGroup = [];
    this.dataGroup = null;
    let formData = new FormData();
    formData.append('med', this.medType);
    formData.append('group', this.group);
    formData.append('dep', this.dep);
    formData.append('startDate', this.startDate);
    formData.append('endDate', this.endDate);
    // formData.forEach((value, key) => {
    //   console.log(key + ' : ' + value);
    // });
    this.http
      .post(`${environment.apiUrl}getInvType`, formData)
      .toPromise()
      .then((val: any) => {
        // console.log(val);
        if (val['rowCount'] > 0) {
          this.listINV = this.ceil(val['result']);
          // console.log(this.listINV);
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
        this.spinner.hide();
        this.dataINV = new MatTableDataSource(this.listINV);
        this.dataINV.sort = this.sortINV;
        this.dataINV.paginator = this.paginatorINV;
      });
    this.http
      .post(`${environment.apiUrl}listInvGroup`, formData)
      .toPromise()
      .then((val: any) => {
        // console.log(val);
        if (val['rowCount'] > 0) {
          this.listGroup = this.ceil(val['result']);
          // console.log(this.listGroup);
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
        this.dataGroup = new MatTableDataSource(this.listGroup);
        this.dataGroup.sort = this.sortGroup;
        this.dataGroup.paginator = this.paginatorGroup;
      });
    this.http
      .post(`${environment.apiUrl}idenImportType`, formData)
      .toPromise()
      .then((val: any) => {
        // console.log(val);
        if (val['rowCount'] > 0) {
          this.listIdenWard = this.ceil(val['result']);
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
        this.dataIdenWard = new MatTableDataSource(this.listIdenWard);
        this.dataIdenWard.sort = this.sortIdenWard;
        this.dataIdenWard.paginator = this.paginatorIdenWard;
      });
    this.http
      .post(`${environment.apiUrl}listInvGroupIdent`, formData)
      .toPromise()
      .then((val: any) => {
        // console.log(val);
        if (val['rowCount'] > 0) {
          this.listIdenGroup = this.ceil(val['result']);
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
        this.dataIdenGroup = new MatTableDataSource(this.listIdenGroup);
        this.dataIdenGroup.sort = this.sortIdenGroup;
        this.dataIdenGroup.paginator = this.paginatorIdenGroup;
      });
  };

  ceil(e: any) {
    let arr: Array<any> = [];
    arr = e;
    arr.forEach((el) => {
      if (parseInt(el.invPrice) > 0) {
        el.invPrice = Math.ceil(el.invPrice);
        el.invPrice = el.invPrice.toLocaleString('en-US');
      }
      if (parseInt(el.mhrPrice) > 0) {
        el.mhrPrice = Math.ceil(el.mhrPrice);
        el.mhrPrice = el.mhrPrice.toLocaleString('en-US');
      }
    });
    return arr;
  }

  reportFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataINV.filter = filterValue.trim().toLowerCase();
  }

  depHistory = async (val: any, n: any) => {
    this.spinner.show();
    // console.log(val);
    this.detailDrugHit = val;
    let formData = new FormData();
    formData.append('drugCode', val.drugCode);
    formData.append('depCode', this.dep);
    formData.append('med', this.medType);
    formData.append('group', this.group);
    formData.append('startDate', this.startDate);
    formData.append('endDate', this.endDate);
    // formData.forEach((value, key) => {
    //   console.log(key + ' : ' + value);
    // });
    if (n === 1) {
      this.http
        .post(`${environment.apiUrl}depHitINV`, formData)
        .toPromise()
        .then((val: any) => {
          // console.log(val);
          if (val['rowCount'] > 0) {
            this.listDrugHit = val['result'];
            // console.log(this.listDrugHit);
            this.listDrugHit.forEach((el) => {
              if (el.drugFrom == 'INV') {
                let amount = el.amount.replace(/\s/g, '');
                let total = 0;
                let x = parseInt(amount.split('x')[0]);
                // console.log(amount.split('x')[0]);
                x > 0 ? (total += x) : '';
                let y = parseInt(amount.split('x')[1]);
                y > 0 ? (total *= y) : '';
                let z = parseInt(amount.split('+')[1]);
                z > 0 ? (total += z) : '';
                // console.log(el.createDate + ' ' + total);
                el.amount = total;
              }
            });
          }
        })
        .catch((reason) => {
          console.log(reason);
          this.services.alert('error', 'ไม่สามารถเขื่อมต่อเชิฟเวอร์ได้', '');
        })
        .finally(() => {
          this.dataDrugHit = new MatTableDataSource(this.listDrugHit);
          this.dataDrugHit.sort = this.sortDrugHit;
          this.dataDrugHit.paginator = this.paginatorDrugHit;
          _window.$(`#drugHisModal`).modal('show');
          this.spinner.hide();
        });
    } else {
      this.http
        .post(`${environment.apiUrl}groupHitINV`, formData)
        .toPromise()
        .then((val: any) => {
          // console.log(val);
          if (val['rowCount'] > 0) {
            this.listDrugHit = val['result'];
            // console.log(this.listDrugHit);
            this.listDrugHit.forEach((el) => {
              if (el.drugFrom == 'INV') {
                let amount = el.amount.replace(/\s/g, '');
                let total = 0;
                let x = parseInt(amount.split('x')[0]);
                // console.log(amount.split('x')[0]);
                x > 0 ? (total += x) : '';
                let y = parseInt(amount.split('x')[1]);
                y > 0 ? (total *= y) : '';
                let z = parseInt(amount.split('+')[1]);
                z > 0 ? (total += z) : '';
                // console.log(el.createDate + ' ' + total);
                el.amount = total;
              }
            });
          }
        })
        .catch((reason) => {
          console.log(reason);
          this.services.alert('error', 'ไม่สามารถเขื่อมต่อเชิฟเวอร์ได้', '');
        })
        .finally(() => {
          this.dataDrugHit = new MatTableDataSource(this.listDrugHit);
          this.dataDrugHit.sort = this.sortDrugHit;
          this.dataDrugHit.paginator = this.paginatorDrugHit;
          _window.$(`#drugHisModal`).modal('show');
          this.spinner.hide();
        });
    }
  };
}
