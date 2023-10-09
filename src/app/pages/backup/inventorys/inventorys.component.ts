import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';

const _window: any = window;

@Component({
  selector: 'app-inventorys',
  templateUrl: './inventorys.component.html',
  styleUrls: ['./inventorys.component.scss'],
})
export class InventorysComponent implements OnInit {
  public id: any;
  public job: any;
  public dep: any;
  public depAtt: any;
  public startDate: any;
  public endDate: any;
  public role: any;

  public listPosition: Array<any> = [];

  public listINV: Array<any> = [];
  public dataINV: any = null;
  @ViewChild('sortINV') sortINV!: MatSort;
  @ViewChild('paginatorINV') paginatorINV!: MatPaginator;
  public selectedRowIndex: any;
  public displayedINV: string[] = [
    // "invCode",
    'drugCode',
    'drugName',
    // "miniSpec",
    'position',
    'amount',
    'EXP_Date',
    'invPrice',
    'mhrPrice',
    'hit',
  ];

  constructor(
    public services: AppService,
    private http: HttpClient,
    private spinner: NgxSpinnerService
  ) {
    this.dep = sessionStorage.getItem('dep');
    this.id = sessionStorage.getItem('id');
    this.job = sessionStorage.getItem('่job');
    this.depAtt = sessionStorage.getItem('depAtt');
    this.role = sessionStorage.getItem('role');
  }

  ngOnInit(): void {
    setTimeout(() => {
      // sessionStorage.setItem("selectPage", "Inventorys");
      this.spinner.show();
      this.getPosition();
    }, 100);
  }

  public getINV = async () => {
    this.listINV = [];
    let depData = new FormData();
    depData.append('depCode', this.dep);
    depData.append('startDate', this.startDate);
    depData.append('endDate', this.endDate);
    this.http
      .post(`${environment.apiUrl}onhandINV`, depData)
      .toPromise()
      .then((val: any) => {
        // console.log(val);
        if (val['rowCount'] > 0) {
          this.listINV = val['result'];
          this.ceil();
          // console.log(this.listINV);
          this.listINV.forEach((ei, i) => {
            this.listPosition.forEach((el, l) => {
              if (
                this.listINV[i]['drugCode'] == this.listPosition[l]['drugCode']
              ) {
                let t: any;
                if (this.listPosition[l]['positionID'] == null) {
                  t = this.listPosition[l]['deviceName'];
                } else {
                  t =
                    this.listPosition[l]['deviceName'] +
                    ' (' +
                    this.listPosition[l]['positionID'] +
                    ')';
                }
                if (this.listINV[i]['position'].length > 0) {
                  this.listINV[i]['position'] =
                    this.listINV[i]['position'] + ', ';
                }
                this.listINV[i]['position'] = this.listINV[i]['position'] + t;
              }
            });
          });
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
        this.dataINV = new MatTableDataSource(this.listINV);
        this.dataINV.sort = this.sortINV;
        this.dataINV.paginator = this.paginatorINV;
        this.spinner.hide();
      });
  };

  public ceil() {
    this.listINV.forEach((ei, i) => {
      if (parseInt(this.listINV[i]['invPrice']) > 0) {
        this.listINV[i]['invPrice'] = Math.ceil(this.listINV[i]['invPrice']);
      }
    });
  }

  public INVFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataINV.filter = filterValue.trim().toLowerCase();
  }

  public selectPage = async (page: any) => {
    sessionStorage.setItem('selectPage', page);
  };

  public getPosition = async () => {
    this.listPosition = [];
    if (this.dep == 'W8') {
      this.http
        .get(`${environment.apiUrl}deviceAllDrug`)
        .toPromise()
        .then((val: any) => {
          if (val['rowCount'] > 0) {
            this.listPosition = val['result'];
            // console.log(this.listPosition);
          }
        })
        .catch((reason) => {
          console.log(reason);
          this.services.alert('error', 'ไม่สามารถเขื่อมต่อเชิฟเวอร์ได้', '');
        })
        .finally(() => {
          this.getINV();
        });
    } else if (this.dep == 'W9' || this.dep == 'W18') {
      let dep = new FormData();
      dep.append('dep', this.dep);
      this.http
        .post(`${environment.apiUrl}OnHand/getPosition`, dep)
        .toPromise()
        .then((val: any) => {
          // console.log(val);
          if (val['rowCount'] > 0) {
            this.listPosition = val['result'];
            // console.log(this.listPosition);
          }
        })
        .catch((reason) => {
          console.log(reason);
          this.services.alert('error', 'ไม่สามารถเขื่อมต่อเชิฟเวอร์ได้', '');
        })
        .finally(() => {
          this.getINV();
        });
    } else {
      this.getINV();
    }
  };

  public editAmount = async (val: any) => {
    // console.log(val);
    const { value: amountNew } = await Swal.fire({
      input: 'number',
      title: val.drugName,
      text: val.amount + ' ' + val.miniSpec,
      inputLabel: '',
      inputPlaceholder: '',
      confirmButtonText: 'ยืนยัน',
      showCancelButton: true,
      cancelButtonText: 'ยกเลิก',
      confirmButtonColor: '#3085d6',
      allowOutsideClick: false,
      inputValidator: (value) => {
        return new Promise((resolve) => {
          if (value) {
            resolve('');
          } else {
            resolve('กรุณาใส่จำนวน');
          }
        });
      },
    });
    if (amountNew) {
      let editForm = new FormData();
      editForm.append('depCode', this.dep);
      editForm.append('drugCode', val.drugCode);
      editForm.append('amount', amountNew);
      this.http
        .post(`${environment.apiUrl}/editAmount`, editForm)
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
          this.services.alertTimer('success', 'แก้ไขจำนวนสำเร็จ', ' ');
          this.getINV();
        });
    }
  };

  public drugNameHit: any;
  public drugSpecHit: any;
  public drugAmountHit: any;
  public listDrugHit: Array<any> = [];
  public dataDrugHit: any = null;
  @ViewChild('sortDrugHit') sortDrugHit!: MatSort;
  @ViewChild('paginatorDrugHit') paginatorDrugHit!: MatPaginator;
  public displayDrugHit: string[] = [
    'createDate',
    'depFrom',
    'depTo',
    'amount',
    'userName',
  ];
  public drugHistory = async (val: any) => {
    // console.log(val);
    this.drugNameHit = val.drugName;
    this.drugSpecHit = val.miniSpec;
    this.drugAmountHit = val.amount;
    let drugCodeHit = val.drugCode;
    let key = new FormData();
    key.append('drugCode', drugCodeHit);
    key.append('depCode', this.dep);
    this.http
      .post(`${environment.apiUrl}drugHistory`, key)
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
          this.dataDrugHit = new MatTableDataSource(this.listDrugHit);
          this.dataDrugHit.sort = this.sortDrugHit;
          this.dataDrugHit.paginator = this.paginatorDrugHit;
        }
      })
      .catch((reason) => {
        console.log(reason);
        this.services.alert('error', 'ไม่สามารถเขื่อมต่อเชิฟเวอร์ได้', '');
      })
      .finally(() => {});
    _window.$(`#drugHisModal`).modal('show');
  };
}
