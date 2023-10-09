import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import * as moment from 'moment';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';

interface Type {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-inv-other',
  templateUrl: './inv-other.component.html',
  styleUrls: ['./inv-other.component.scss'],
})
export class InvOtherComponent implements OnInit {
  @ViewChild('swiperAmo') swiperAmo!: ElementRef;
  @ViewChild('swiperBar') swiperBar!: ElementRef;

  public selectManu = 1;

  public id: any;
  public job: any;
  public dep: any;
  public depName: any;
  public depAtt: any;
  public startDate: any = null;
  public endDate: any = null;
  public role: any;
  public group: any;

  public listMedType: Array<any> = [];
  public medType: any;
  public medTypeNm: any;

  public listBarcode: Array<any> = [];
  public drugName: any;

  public listINV: Array<any> = [];
  public dataINV: any = null;
  @ViewChild('sortINV') sortINV!: MatSort;
  @ViewChild('paginatorINV') paginatorINV!: MatPaginator;
  public selectedRowIndex: any;
  public displayedINV: string[] = [
    'indexrow',
    // "invCode",
    'drugCode',
    'drugName',
    // "miniSpec",
    // "position",
    'amount',
    'invPrice',
    'mhrPrice',
  ];

  public listINVDep: Array<any> = [];
  public dataINVDep: any = null;
  @ViewChild('sortINVDep') sortINVDep!: MatSort;
  @ViewChild('paginatorINVDep') paginatorINVDep!: MatPaginator;
  public selectedRowIndexDep: any;
  public displayedINVDep: string[] = [
    'indexrow',
    "depName",
    'drugCode',
    'drugName',
    // "miniSpec",
    // "position",
    'amount',
    'invPrice',
    'mhrPrice',
  ];

  public listAllDrug: Array<any> = [];
  public dataAllDrug: any = null;
  @ViewChild('sortAlldrug') sortAlldrug!: MatSort;
  @ViewChild('paginatorAllDrug') paginatorAllDrug!: MatPaginator;
  public displayAllDrug: string[] = [
    // "invCode",
    'drugCode',
    'drugName',
    // "drugform",
    // "dform",
    'option',
  ];

  public listHity: Array<any> = [];
  public dataHity: any = null;
  @ViewChild('sortHity') sortHity!: MatSort;
  @ViewChild('paginatorHity') paginatorHity!: MatPaginator;
  public displayHity: string[] = [
    'createDate',
    'drugName',
    'amount',
    'userName',
    'confirm',
  ];

  public types: Type[] = [
    { value: '', viewValue: 'ทั้งหมด' },
    { value: 'in', viewValue: 'เข้า' },
    { value: 'out', viewValue: 'ออก' },
  ];
  public selectType: any = this.types[0].value;
  public selectName: any = this.types[0].viewValue;

  constructor(public services: AppService, private http: HttpClient,private spinner: NgxSpinnerService,) {
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
    this.startDate = moment(this.campaignOne.value.start).format('YYYY-MM-DD');
    this.endDate = moment(this.campaignOne.value.end).format('YYYY-MM-DD');
    this.getMedType();
    this.getDrugBarcode();
    this.getAllDrug();
    this.getInvDep();
    this.spinner.show();
  }

  public changeManu = async (n: any) => {
    this.selectManu = n;
    if (n == 2) {
      setTimeout(() => {
        this.swiperBar.nativeElement.focus();
      }, 500);
    }
  };

  public reportFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataINV.filter = filterValue.trim().toLowerCase();
  }
  public drugFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataAllDrug.filter = filterValue.trim().toLowerCase();
  }

  public hitFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataHity.filter = filterValue.trim().toLowerCase();
  }
  public depFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataINVDep.filter = filterValue.trim().toLowerCase();
  }
  public campaignOne = new FormGroup({
    start: new FormControl(new Date()),
    end: new FormControl(new Date()),
  });

  public startChange(event: any) {
    const momentDate = new Date(event.value);
    this.startDate = moment(momentDate).format('YYYY-MM-DD');
  }

  public async endChange(event: any) {
    const momentDate = new Date(event.value);
    this.endDate = moment(momentDate).format('YYYY-MM-DD');
    this.getInvType();
    this.getHittory();
    this.getInvDep();
  }

  public getAllDrug = async () => {
    this.listAllDrug = [];
    this.dataAllDrug = [];
    this.http
      .get(`${environment.apiUrl}OnHand/allDrugHomeC`)
      .toPromise()
      .then((val: any) => {
        if (val['rowCount'] > 0) {
          // console.log(val);
          if (val['rowCount'] > 0) {
            this.listAllDrug = val['result'];
            // console.log(this.listAllDrug);
            this.dataAllDrug = new MatTableDataSource(this.listAllDrug);
            this.dataAllDrug.sort = this.sortAlldrug;
            this.dataAllDrug.paginator = this.paginatorAllDrug;
          }
        }
      })
      .catch((reason) => {
        console.log(reason);
        this.services.alert('error', 'ไม่สามารถเขื่อมต่อเชิฟเวอร์ได้', '');
      })
      .finally(() => {});
  };

  public getHittory = async () => {
    this.listHity = [];
    this.dataHity = [];
    let depData = new FormData();
    depData.append('medType', this.medType);
    depData.append('depCode', this.dep);
    depData.append('startDate', this.startDate);
    depData.append('endDate', this.endDate);
    this.http
      .post(`${environment.apiUrl}HitTranSelcet`, depData)
      .toPromise()
      .then((val: any) => {
        // console.log(val);
        if (val['rowCount'] > 0) {
          this.listHity = val['result'];
          // console.log(this.listHity);
          this.dataHity = new MatTableDataSource(this.listHity);
          this.dataHity.sort = this.sortHity;
          this.dataHity.paginator = this.paginatorHity;
        }
      })
      .catch((reason) => {
        console.log(reason);
        this.services.alert('error', 'ไม่สามารถเขื่อมต่อเชิฟเวอร์ได้', '');
      })
      .finally(() => {});
  };

  public getMedType = async () => {
    this.listMedType = [];
    this.http
      .get(`${environment.apiUrl}medRoom`)
      .toPromise()
      .then((val: any) => {
        if (val['rowCount'] > 0) {
          this.listMedType = val['result'];
          // console.log(this.listMedType);
          this.medType = this.listMedType[0]['ID'];
          this.medTypeNm = this.listMedType[0]['Name'];
        }
      })
      .catch((reason) => {
        console.log(reason);
        this.services.alert('error', 'ไม่สามารถเขื่อมต่อเชิฟเวอร์ได้', '');
      })
      .finally(() => {
        this.getInvType();
        this.getHittory();
      });
  };

  public selectInvType(e: any) {
    // console.log(e.target.value);
    this.medType = e.target.value.split(',')[0];
    this.medTypeNm = e.target.value.split(',')[1];
    // console.log(this.medTypeNm)
    this.getInvType();
    this.getHittory();
  }

  public getInvType = async () => {
    this.listINV = [];
    this.dataINV = null;
    let formData = new FormData();
    formData.append('med', this.medType);
    formData.append('dep', this.dep);
    formData.append('startDate', this.startDate);
    formData.append('endDate', this.endDate);
    // formData.forEach((value, key) => {
    //   console.log(key + " : " + value);
    // });
    this.http
      .post(`${environment.apiUrl}getInvType`, formData)
      .toPromise()
      .then((val: any) => {
        // console.log(val);
        if (val['rowCount'] > 0) {
          this.listINV = val['result'];
          this.ceil();
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
        this.dataINV = new MatTableDataSource(this.listINV);
        this.dataINV.sort = this.sortINV;
        this.dataINV.paginator = this.paginatorINV;
      });
  };

  public getInvDep = async () => {
    this.listINVDep = [];
    this.dataINVDep = null;
    let formData = new FormData();
    formData.append('med', this.medType);
    formData.append('group', this.group);
    formData.append('startDate', this.startDate);
    formData.append('endDate', this.endDate);
    // formData.forEach((value, key) => {
    //   console.log(key + ' : ' + value);
    // });
    this.http
      .post(`${environment.apiUrl}getInvDep`, formData)
      .toPromise()
      .then((val: any) => {
        // console.log(val);
        if (val['rowCount'] > 0) {
          this.listINVDep = val['result'];
          this.ceil();
          // console.log(this.listINVDep);
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
        this.dataINVDep = new MatTableDataSource(this.listINVDep);
        this.dataINVDep.sort = this.sortINVDep;
        this.dataINVDep.paginator = this.paginatorINVDep;
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

  public getDrugBarcode = async () => {
    this.listBarcode = [];
    this.http
      .get(`${environment.apiUrl}OnHand/drugBarcodeNew`)
      .toPromise()
      .then((val: any) => {
        // console.log(val);
        if (val.length > 0) {
          let arr1 = val[0].result;
          let arr2 = val[1].result;
          arr1.forEach((el: any) => {
            this.listBarcode.push(el);
          });
          arr2.forEach((el: any) => {
            this.listBarcode.push(el);
          });
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

  public sendBCode = async (data: any) => {
    // console.log(data);
    let findBarcode: boolean = false;
    await this.listBarcode.forEach((ei, i) => {
      if (this.listBarcode[i]['Barcode'] == data) {
        let jsData = {
          drugCode: this.listBarcode[i]['drugCode'],
          drugName: this.listBarcode[i]['drugName'],
        };
        this.selectDrug(jsData);
        findBarcode = true;
      }
    });
    if (findBarcode) {
    } else {
      this.services.alertTimer('warning', 'ไม่พบข้อมูล Barcode');
    }
  };

  public selectDrug = async (result: any) => {
    let val = JSON.parse(JSON.stringify(result));
    // console.log(val.drugCode);
    const { value: amount } = await Swal.fire({
      input: 'number',
      title: val.drugName,
      text: 'ใส่จำนวน' + this.medTypeNm,
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
    if (amount) {
      let data = new FormData();
      data.append('depOut', this.medType);
      data.append('depIn', this.dep);
      data.append('drugCode', val.drugCode);
      data.append('amount', amount);
      data.append('iden', this.id);
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
                .finally(() => {
                  this.getInvType();
                  this.getHittory();
                  this.services.alertTimer(
                    'success',
                    'นำเข้า' + this.medTypeNm + 'สำเร็จ'
                  );
                  setTimeout(() => {
                    this.swiperBar.nativeElement.focus();
                  }, 500);
                });
            });
        });
    } else {
      setTimeout(() => {
        this.swiperBar.nativeElement.focus();
      }, 500);
    }
  };

  public reverse = async (el: any) => {
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
          'ยืนยันการยกเลิกคำขอ',
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
                        this.getInvType();
                        this.getHittory();
                        this.services.alertTimer('success', 'ยกเลิกสำเสร็จ');
                      });
                  });
              });
          }
        });
    }
  };
}
