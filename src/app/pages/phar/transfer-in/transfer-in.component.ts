import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';

const _window: any = window;

@Component({
  selector: 'app-transfer-in',
  templateUrl: './transfer-in.component.html',
  styleUrls: ['./transfer-in.component.scss'],
})
export class TransferInComponent implements OnInit {
  @ViewChild('swiperAmo') swiperAmo!: ElementRef;
  @ViewChild('swiperBar') swiperBar!: ElementRef;

  // tableHeight = (window.innerHeight - 310) / 2;
  startDate: any = null;
  endDate: any = null;
  id: any;
  job: any;
  dep: any;
  group: any;
  depIn: any;
  depName: any;
  drugName: any;
  transDep: any;

  listDrugSetting: Array<any> = [];

  formTransfer = {
    dep: '',
    type: '',
    code: '',
    name: '',
    amount: '',
  };

  listHity: Array<any> = [];
  dataHity: any = null;
  @ViewChild('sortHity') sortHity!: MatSort;
  @ViewChild('paginatorHity') paginatorHity!: MatPaginator;
  displayHity: string[] = [
    'createDate',
    'drugName',
    'amount',
    'miniUnit',
    // "event",
    'fromName',
    'toName',
    // "name_to",
    'idenName',
    'confirm',
  ];

  listAllDrug: Array<any> = [];
  dataAllDrug: any = null;
  @ViewChild('sortAlldrug') sortAlldrug!: MatSort;
  @ViewChild('paginatorAllDrug') paginatorAllDrug!: MatPaginator;
  displayAllDrug: string[] = [
    // 'drugCode',
    'drugName',
  ];

  listFDep: Array<any> = [];
  filterValue: any = '';

  listBarcode: Array<any> = [];
  listDrugStore: Array<any> = [];

  constructor(
    public services: AppService,
    private http: HttpClient,
    private spinner: NgxSpinnerService
  ) {
    this.dep = sessionStorage.getItem('dep');
    this.id = sessionStorage.getItem('id');
    this.job = sessionStorage.getItem('่job');
    this.group = sessionStorage.getItem('group');
    this.depName = sessionStorage.getItem('depName');
    this.startDate = moment(this.campaignOne.value.start).format('YYYY-MM-DD');
    this.endDate = moment(this.campaignOne.value.end).format('YYYY-MM-DD');
  }

  ngOnInit(): void {
    this.getDrugStore();
    this.getHittory();
    this.getFromDep();
    this.getDrugBarcode();
    this.getDrugSetting();
  }

  campaignOne = new FormGroup({
    start: new FormControl(new Date()),
    end: new FormControl(new Date()),
  });

  startChange(event: any) {
    const momentDate = new Date(event.value);
    this.startDate = moment(momentDate).format('YYYY-MM-DD');
  }

  endChange(event: any) {
    const momentDate = new Date(event.value);
    this.endDate = moment(momentDate).format('YYYY-MM-DD');
    if (this.endDate !== '1970-01-01') {
      this.getHittory();
    }
  }

  getDrugStore = async () => {
    this.listDrugStore = [];
    this.http
      .get(`${environment.apiUrl}listDrugStore`)
      .toPromise()
      .then((val: any) => {
        if (val['rowCount'] > 0) {
          // console.log(val);
          this.listDrugStore = val['result'];
          // console.log(this.listDrugStore);
        }
      })
      .catch((reason) => {
        console.log(reason);
        this.services.alert('error', 'ไม่สามารถเขื่อมต่อเชิฟเวอร์ได้', '');
      })
      .finally(() => {});
  };

  getHittory = async () => {
    this.spinner.show();
    this.listHity = [];
    this.dataHity = [];
    let depData = new FormData();
    depData.append('depCode', this.dep);
    depData.append('startDate', this.startDate);
    depData.append('endDate', this.endDate);
    this.http
      .post(`${environment.apiUrl}transferHit`, depData)
      .toPromise()
      .then((val: any) => {
        // console.log(val);
        if (val['rowCount'] > 0) {
          this.listHity = val['result'];
          // console.log(this.listHity);
        }
      })
      .catch((reason) => {
        console.log(reason);
        this.services.alert('error', 'ไม่สามารถเขื่อมต่อเชิฟเวอร์ได้', '');
      })
      .finally(() => {
        this.spinner.hide();
        this.dataHity = new MatTableDataSource(this.listHity);
        this.dataHity.sort = this.sortHity;
        this.dataHity.paginator = this.paginatorHity;
      });
  };

  reverse = async (el: any) => {
    let invCode = '';
    this.listDrugStore.forEach((c) => {
      if (c.HIS_CODE === this.formTransfer.code) {
        invCode = c.MED_CODE;
      }
    });
    let data = new FormData();
    data.append('depOut', el.dep_to);
    data.append('depIn', el.dep_from);
    data.append('drugCode', el.drugCode);
    data.append('amount', el.amount);
    data.append('iden', this.id);
    data.append('trans_no', el.trans_no);
    // data.forEach((value, key) => {
    //   console.log(key + " : " + value);
    // });
    if (this.job != 'E') {
      // console.log(el);
      this.services
        .confirm(
          'warning',
          'ยืนยัน การยกเลิกจำนวน',
          el.drugName + ' = ' + el.amount + ' ' + el.miniUnit
        )
        .then((val: any) => {
          if (val) {
            this.http
              .post(`${environment.apiUrl}OnHand/onhandOut`, data)
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
                this.http
                  .post(`${environment.apiUrl}OnHand/onhandIn`, data)
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
                    this.http
                      .post(`${environment.apiUrl}OnHand/reverseTransfer`, data)
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
                        this.getHittory();
                        this.services.alertTimer('success', 'คืนยาสำเสร็จ');
                      });
                  });
              });
          }
        });
    }
  };

  hitFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataHity.filter = filterValue.trim().toLowerCase();
  }

  getFromDep = async () => {
    this.listFDep = [];
    let depData = new FormData();
    depData.append('depCode', this.dep);
    this.http
      .post(`${environment.apiUrl}listDepTransferIn`, depData)
      .toPromise()
      .then((val: any) => {
        if (val['rowCount'] > 0) {
          this.listFDep = val['result'];
          // console.log(this.listFDep);
        }
      })
      .catch((reason) => {
        console.log(reason);
        this.services.alert('error', 'ไม่สามารถเขื่อมต่อเชิฟเวอร์ได้', '');
      })
      .finally(() => {});
  };

  getDrugSetting() {
    this.listDrugSetting = [];
    let key = new FormData();
    key.append('groupCode', this.group);
    this.http
      .post(`${environment.apiUrl}drugHide`, key)
      .toPromise()
      .then((val: any) => {
        if (val['rowCount'] > 0) {
          this.listDrugSetting = val['result'];
          // console.log(this.listDrugSetting);
        }
      })
      .catch((reason) => {
        console.log(reason);
        this.services.alert('error', 'ไม่สามารถเขื่อมต่อเชิฟเวอร์ได้', '');
      })
      .finally(() => {
        this.getAllDrug();
      });
  }

  getAllDrug = async () => {
    this.spinner.show();
    let arr: Array<any> = [];
    this.listAllDrug = [];
    this.dataAllDrug = [];
    this.http
      .get(`${environment.apiUrl}OnHand/allDrugHomeC`)
      .toPromise()
      .then((val: any) => {
        if (val['rowCount'] > 0) {
          // console.log(val);
          arr = val['result'];
          arr.forEach((el) => {
            let hide = false;
            this.listDrugSetting.forEach((h) => {
              if (el.drugCode === h.drugCode) {
                // console.log(el.drugCode);
                hide = true;
              }
            });
            if (!hide) {
              this.listAllDrug.push(el);
            }
          });
        }
      })
      .catch((reason) => {
        console.log(reason);
        this.services.alert('error', 'ไม่สามารถเขื่อมต่อเชิฟเวอร์ได้', '');
      })
      .finally(() => {
        this.spinner.hide();
        // console.log(this.listAllDrug)
        this.dataAllDrug = new MatTableDataSource(this.listAllDrug);
        this.dataAllDrug.sort = this.sortAlldrug;
        this.dataAllDrug.paginator = this.paginatorAllDrug;
      });
  };

  drugFilter(event: Event) {
    // console.log(event);
    this.filterValue = (event.target as HTMLInputElement).value;
    this.dataAllDrug.filter = this.filterValue.trim().toLowerCase();
  }

  getDrugBarcode = async () => {
    this.listBarcode = [];
    this.http
      .get(`${environment.apiUrl}OnHand/drugBarcodeNew`)
      .toPromise()
      .then((val: any) => {
        // console.log(val);
        if (val.length > 0) {
          let arr1 = val[0].result;
          let arr2 = val[1].result;
          if (arr1) {
            arr1.forEach((el: any) => {
              this.listBarcode.push(el);
            });
          }
          if (arr2) {
            arr2.forEach((el: any) => {
              this.listBarcode.push(el);
            });
          }
          // console.log(this.listBarcode);
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
      .finally(() => {});
  };

  showAllDrug: boolean = false;
  selectDep(e: any) {
    // console.log(e.target.value);
    const selectedValue = e.target.value;
    const [id, type] = selectedValue.split(',');
    // console.log(id)
    this.formTransfer.dep = id;
    this.formTransfer.type = type;
    this.showAllDrug = true;
    this.swiperBar.nativeElement.focus();
  }

  selectDrug = async (data: any) => {
    // console.log(data);
    this.formTransfer.code = data.drugCode;
    this.formTransfer.name = data.drugName;
    this.viewImg();
  };

  sendBCode = async (data: any) => {
    // console.log(data);
    let find = false;
    this.listBarcode.forEach((e) => {
      if (e.Barcode === data) {
        this.formTransfer.code = e.drugCode;
        this.formTransfer.name = e.drugName;
        find = true;
      }
    });
    if (find) {
      this.viewImg();
    } else {
      this.services.alertTimer('warning', 'ไม่พบข้อมูล Barcode');
    }
  };

  arrImg: Array<any> = [];
  viewImg = async () => {
    this.arrImg = [];
    this.formTransfer.amount = '';
    if (this.formTransfer.dep.length > 0) {
      let imgPath = 'http://192.168.185.160:3000/getimages?code=';
      // let imgPath = 'http://localhost:3001/getimages?code=';
      this.http
        .get(imgPath + this.formTransfer.code)
        .toPromise()
        .then((val: any) => {
          // console.log(val);
          if (val[0]) {
            this.arrImg = val;
            // this.arrImg.forEach((e) => {
            //   // console.log(e.pathImage);
            //   e.pathImage =
            //     'http://localhost:89/' +
            //     e.pathImage.substring(
            //       e.pathImage.indexOf('api/assets/drug-imagecenter')
            //     );
            // });
            // console.log(this.arrImg)
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
        .finally(async () => {
          _window.$(`#transfer`).modal('show');
          setTimeout(() => {
            this.swiperAmo.nativeElement.focus();
          }, 500);
        });
    } else {
      this.services.alert('warning', 'กรุณาเลือกแหล่งที่มาของยา');
    }
  };

  transferSubmit() {
    if (parseInt(this.formTransfer.amount) > 0) {
      if (parseInt(this.formTransfer.amount) > 50000) {
        this.services
          .confirm(
            'warning',
            'ตรวจพบจำนวนที่มาก > ' + this.formTransfer.amount,
            'ใช่จำนวนที่ถูกต้องหรือไม่ ?'
          )
          .then((val: any) => {
            if (val) {
              this.transfered();
            }
          });
      } else {
        this.transfered();
      }
    } else {
      this.services.alert('warning', 'กรุณาใส่จำนวน');
    }
  }

  transfered() {
    let invCode = '';
    this.listDrugStore.forEach((c) => {
      if (c.HIS_CODE === this.formTransfer.code) {
        invCode = c.MED_CODE;
      }
    });
    let data = new FormData();
    data.append('depOut', this.formTransfer.dep);
    data.append('depIn', this.dep);
    data.append('drugCode', this.formTransfer.code);
    data.append('invCode', invCode);
    data.append('amount', this.formTransfer.amount);
    data.append('iden', this.id);
    // data.forEach((value, key) => {
    //   console.log(key + ' : ' + value);
    // });
    if (this.formTransfer.type === 'phar') {
      this.http
        .post(`${environment.apiUrl}inventoryOut`, data)
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
    this.http
      .post(`${environment.apiUrl}inventoryIn`, data)
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
    this.http
      .post(`${environment.apiUrl}OnHand/insertTransfer`, data)
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
    this.getHittory();
    _window.$(`#transfer`).modal('hide');
    this.services.alertTimer('success', 'บันทึกข้อมูลสำเร็จ');
    setTimeout(() => {
      this.swiperBar.nativeElement.focus();
    }, 500);
  }
}
