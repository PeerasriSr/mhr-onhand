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
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss'],
})
export class InventoryComponent implements OnInit {
  cardHeight = window.innerHeight - 110;
  id: any;
  job: any;
  dep: any;
  group: any;
  depAtt: any;
  startDate: any;
  endDate: any;
  role: any;

  
  listPosition: Array<any> = [];

  listINV: Array<any> = [];
  dataINV: any = null;
  @ViewChild('sortINV') sortINV!: MatSort;
  @ViewChild('paginatorINV') paginatorINV!: MatPaginator;
  selectedRowIndex: any;
  displayedINV: string[] = [
    'invCode',
    'drugCode',
    'drugName',
    // "miniSpec",
    'position',
    'LOT_NO',
    // 'EXP_Date',
    'invPrice',
    'mhrPrice',
    'amount',
    'miniSpec',
    //  'hit',
    'action',
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
    this.group = sessionStorage.getItem('group');
    this.id = sessionStorage.getItem('id');
    this.job = sessionStorage.getItem('่job');
    this.depAtt = sessionStorage.getItem('depAtt');
    this.role = sessionStorage.getItem('role');
  }

  ngOnInit(): void {
    setTimeout(() => {
      // sessionStorage.setItem("selectPage", "Inventorys");

      this.getPosition();
    }, 100);
  }

  getINV = async () => {
    this.spinner.show();
    this.listINV = [];
    let depData = new FormData();
    depData.append('depCode', this.dep);
    depData.append('groupCode', this.group);
    this.http
      .post(`${environment.apiUrl}onhandINV`, depData)
      .toPromise()
      .then((val: any) => {
        // console.log(val);
        if (val['rowCount'] > 0) {
          this.listINV = val['result'];
          this.ceil();
          // console.log(this.listINV);
          this.listINV.forEach((el) => {
            // console.log(el.EXP_Date);
            if (el.LOT_NO) {
              const lotArray: string[] = el.LOT_NO.split(',').map(
                (item: string) => item.trim()
              );
              // el.LOT_NO = lotArray;
              const expArray: string[] = el.EXP_Date.split(',').map(
                (item: string) => item.trim()
              );
              // el.EXP_Date = expArray;
              el.LOT_NO = [];
              lotArray.forEach((e, i) => {
                el.LOT_NO.push(lotArray[i] + ' / ' + expArray[i]);
              });
            }
            // this.listDrugHide.forEach((h, i) => {
            //   if (el.drugCode === h.drugCode || el.inv_code === h.inv_code) {
            //     console.log(el.drugCode)

            //   }
            // });
            if (this.listPosition.length > 0) {
              this.listPosition.forEach((p) => {
                if (el.drugCode === p.drugCode) {
                  // console.log(el.drugCode)
                  let x = p.deviceName;
                  p.positionID ? (x += '-' + p.positionID) : '';
                  let y = [];
                  if (el.position.length === 0) {
                    y.push(x);
                    el.position = y;
                  } else {
                    el.position.push(x);
                  }
                }
              });
            }
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
        // console.log(this.listINV)
        this.dataINV = new MatTableDataSource(this.listINV);
        this.dataINV.sort = this.sortINV;
        this.dataINV.paginator = this.paginatorINV;
        this.spinner.hide();
      });
  };

  ceil() {
    this.listINV.forEach((el) => {
      if (parseInt(el.invPrice) > 0) {
        el.invPrice = Math.ceil(el.invPrice);
        el.invPrice = el.invPrice.toLocaleString('en-US');
      }
      if (parseInt(el.mhrPrice) > 0) {
        el.mhrPrice = Math.ceil(el.mhrPrice);
        el.mhrPrice = el.mhrPrice.toLocaleString('en-US');
      }
    });
  }

  INVFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataINV.filter = filterValue.trim().toLowerCase();
  }

  selectPage = async (page: any) => {
    sessionStorage.setItem('selectPage', page);
  };

  getPosition = async () => {
    this.listPosition = [];
  
    let key = new FormData();
    key.append('group', this.group);
    if (this.dep == 'W8' || this.dep == 'W7') {
      this.http
        .post(`${environment.apiUrl}deviceAllDrug`, key)
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

  editAmount = async (e: any) => {
    // console.log(e.amount);
    const { value: amountNew } = await Swal.fire({
      input: 'number',
      title: e.drugName,
      text: '',
      inputLabel: '',
      inputPlaceholder: '',
      inputValue: e.amount,
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
      let editAmount: any;
      let depOut: any;
      let depIn: any;

      if (amountNew > e.amount) {
        editAmount = amountNew - e.amount;
        // console.log(editAmount);
        depOut = 'EDIT';
        depIn = this.dep;
      } else {
        editAmount = e.amount - amountNew;
        // console.log(editAmount);
        depOut = this.dep;
        depIn = 'EDIT';
      }

      let data = new FormData();
      data.append('depOut', depOut);
      data.append('depIn', depIn);
      data.append('iden', this.id);
      data.append('depCode', this.dep);
      data.append('drugCode', e.drugCode);
      data.append('amount', editAmount);
      data.append('amountNew', amountNew);
      this.http
        .post(`${environment.apiUrl}/OnHand/insertTransfer`, data)
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
      this.http
        .post(`${environment.apiUrl}/editAmount`, data)
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
        .finally(() => {});
    }
  };

  drugHistory = async (val: any) => {
    // console.log(val);
    this.spinner.show();
    this.detailDrugHit = val;
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
  };

  fullLotCode: any = '';
  showFullLot(e: any) {
    // console.log(e);
    if (this.fullLotCode === e) {
      this.fullLotCode = '';
    } else {
      this.fullLotCode = e;
    }
  }
}
