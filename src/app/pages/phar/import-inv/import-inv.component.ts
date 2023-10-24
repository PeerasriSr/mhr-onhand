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
import { NgxSpinnerService } from 'ngx-spinner';

const _window: any = window;

interface Type {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-import-inv',
  templateUrl: './import-inv.component.html',
  styleUrls: ['./import-inv.component.scss'],
})
export class ImportInvComponent implements OnInit {
  @ViewChild('swiperMonth') swiperMonth!: ElementRef;
  @ViewChild('swiperYear') swiperYear!: ElementRef;
  @ViewChild('closebutton1') closebutton1: any;
  @ViewChild('myAddfile') myAddfile!: ElementRef;

  currentDate: Date = new Date();
  day: string =
    (this.currentDate.getDate() < 10 ? '0' : '') + this.currentDate.getDate();
  month: string =
    (this.currentDate.getMonth() + 1 < 10 ? '0' : '') +
    (this.currentDate.getMonth() + 1);
  year: string = this.currentDate.getFullYear().toString();
  formattedDate: string = `${this.day}-${this.month}-${this.year}`;
  invRemove: boolean = false;

  id: any;
  dep: any;
  role: any;

  types: Type[] = [
    { value: 'C', viewValue: 'ปกติ' },
    { value: 'O', viewValue: 'ระหว่างวัน' },
  ];
  selectType: any = this.types[0].value;
  selectName: any = this.types[0].viewValue;

  listINVNo: Array<any> = [];
  listAllINVNo: Array<any> = [];
  selectINVNo: Array<any> = [];
  dataINVno: any;
  @ViewChild('sortINVno') sortINVno!: MatSort;
  @ViewChild('paginatorINVno') paginatorINVno!: MatPaginator;
  displayedINVno: string[] = ['inv_no', 'userName', 'date', 'time', 'select'];

  findInvNo: boolean = false;
  file: any;
  arrayBuffer: any;
  fileName: any;
  fileDate: any;

  filelist: Array<any> = [];
  dataFile: any = null;
  @ViewChild('sortFile') sortFile!: MatSort;
  @ViewChild('paginatorFile') paginatorFile!: MatPaginator;
  displayedFile: string[] = [
    'inv_code',
    'drugCode',
    'drugName',
    'REQU_QTY',
    'DISP_QTY',
    'STK_Event',
    'LOT_NO',
    'EXP_Date',
  ];

  listAllDrug: Array<any> = [];
  dataAllDrug: any = null;
  @ViewChild('sortAlldrug') sortAlldrug!: MatSort;
  @ViewChild('paginatorAllDrug') paginatorAllDrug!: MatPaginator;
  displayAllDrug: string[] = [
    // "invCode",
    'drugCode',
    'drugName',
    // "drugform",
    // "dform",
    'option',
  ];

  listDrugStore: Array<any> = [];

  drugNotMatch: Array<any> = [];
  dataDNM: any = null;
  @ViewChild('sortDNM') sortDNM!: MatSort;
  @ViewChild('paginatorDNM') paginatorDNM!: MatPaginator;
  displayDNM: string[] = [
    // "invCode",
    'inv_code',
    'drugName',
    'LOT_NO',
    'EXP_Date',
  ];

  listHity: Array<any> = [];
  dataHity: any = null;
  @ViewChild('sortHity') sortHity!: MatSort;
  @ViewChild('paginatorHity') paginatorHity!: MatPaginator;
  displayHity: string[] = [
    'createDate',
    'drugName',
    'amount',
    // "name_from",
    // "event",
    'Name',
    // "name_to",
    'userName',
    'confirm',
  ];

  startDate: any = null;
  endDate: any = null;

  listFDep: Array<any> = [];

  constructor(
    public services: AppService,
    private http: HttpClient,
    private spinner: NgxSpinnerService
  ) {
    this.dep = sessionStorage.getItem('dep');
    this.id = sessionStorage.getItem('id');
    this.role = sessionStorage.getItem('role');
    // console.log(this.role)
    this.startDate = moment(this.campaignOne.value.start).format('YYYY-MM-DD');
    this.endDate = moment(this.campaignOne.value.end).format('YYYY-MM-DD');
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.getInvNo();
      this.getDrugStore();
      this.getAllDrug();
      this.getFromDep();
      this.getHittory();
    }, 100);
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
    this.getHittory();
  }

  getHittory = async () => {
    this.listHity = [];
    this.dataHity = [];
    let depData = new FormData();
    depData.append('depCode', this.dep);
    depData.append('startDate', this.startDate);
    depData.append('endDate', this.endDate);
    this.http
      .post(`${environment.apiUrl}hitManUpdateINV`, depData)
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

  hitFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataHity.filter = filterValue.trim().toLowerCase();
  }

  reverse = async (el: any) => {
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
                      this.getHittory();
                      this.services.alertTimer('success', 'ยกเลิกสำเร็จ');
                    });
                });
            });
        }
      });
  };

  selectInput(e: any) {
    // console.log(e.target.value);
    this.dataINVno = [];
    let arr: Array<any> = [];
    // this.clearInputExcel();
    this.selectType = e.target.value;
    for (let i = 0; i < this.listINVNo.length; i++) {
      if (this.listINVNo[i]['inv_type'] == this.selectType) {
        arr.push(this.listINVNo[i]);
      }
    }
    this.dataINVno = new MatTableDataSource(arr);
    this.dataINVno.sort = this.sortINVno;
    this.dataINVno.paginator = this.paginatorINVno;
    this.types.forEach((ei, i) => {
      if (this.types[i].value == this.selectType) {
        this.selectName = this.types[i].viewValue;
      }
    });
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

  clearInputExcel = async () => {
    this.file = [];
    this.arrayBuffer = [];
    this.fileName = [];
    this.filelist = [];
    this.dataFile = [];
    this.myAddfile.nativeElement.value = '';
  };

  addfile(event: any) {
    this.filelist = [];
    this.findInvNo = false;
    this.fileName = [];
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const binaryString = e.target.result;
      const workbook = XLSX.read(binaryString, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      let data: Array<any> = [];
      data = XLSX.utils.sheet_to_json(worksheet, { raw: true });
      let txtName = file.name.split('.x')[0];
      let start = txtName.length - 10;
      this.fileName = txtName.substring(start);
      // console.log(this.fileName);
      this.checkInvNo();
      data.forEach((e, i) => {
        let price = 0;
        data[i]['ราคา'] ? (price = data[i]['ราคา']) : '';
        data[i]['จำนวนเงิน'] ? (price = data[i]['จำนวนเงิน']) : '';
        let homcCode = null;
        this.listDrugStore.forEach((c) => {
          if (c.MED_CODE === data[i]['รหัส']) {
            homcCode = c.HIS_CODE;
          }
        });
        let fileData = {
          inv_code: data[i]['รหัส'],
          drugName: data[i]['ชื่อสามัญ/ชื่อการค้า'],
          REQU_QTY: data[i]['จน.ขอ x pack'],
          DISP_QTY: data[i]['จน.จ่าย x pack'],
          STK_Event: data[i]['คงคลังปัจจุบัน'],
          LOT_NO: data[i]['Lot no.'],
          EXP_Date: data[i]['วันที่หมดอายุ'],
          price: price,
          value: data[i]['มูลค่า'],
          drugCode: homcCode,
          amount: 0,
        };
        this.filelist.push(fileData);
        this.dataFile = new MatTableDataSource(this.filelist);
        this.dataFile.sort = this.sortFile;
        this.dataFile.paginator = this.paginatorFile;
        _window.$(`#invHistory`).modal('show');
      });
      // console.log(this.filelist);
    };

    reader.readAsBinaryString(file);
  }

  checkInvNo = async () => {
    // console.log(this.listAllINVNo);
    this.listAllINVNo.forEach((el) => {
      if (el.inv_no === this.fileName) {
        this.findInvNo = true;
      }
    });
  };

  submitINV = async () => {
    _window.$(`#invHistory`).modal('hide');
    this.drugNotMatch = [];
    this.services
      .confirm('warning', 'ยึนยันการบันทึกข้อมูล ?', 'เลขที่ ' + this.fileName)
      .then(async (val: any) => {
        if (val) {
          this.spinner.show();
          // insert -> INVNo
          let inv_no = this.fileName;
          let invData = new FormData();
          invData.append('inv_no', inv_no);
          invData.append('dep', this.dep);
          invData.append('id', this.id);
          invData.append('inv_type', this.selectType);
          this.http
            .post(`${environment.apiUrl}insertINVNo`, invData)
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

          // console.log(this.filelist)
          let i = 0;
          let interval: any;
          // console.log(this.filelist.length);
          await this.filelist.forEach((e, j) => {
            let req_amount: any = [];
            let dis_amount: any = [];
            // set ข้อมูล inv
            let key = new FormData();
            key.append('inv_no', inv_no);
            key.append('depCode', this.dep);
            key.append('inv_code', e.inv_code);
            key.append('drugCode', e.drugCode);
            key.append('drugName', e.drugName);
            req_amount = this.cal_amount(e.REQU_QTY);
            dis_amount = this.cal_amount(e.DISP_QTY);
            key.append('req_amount', req_amount);
            key.append('dis_amount', dis_amount);
            key.append('REQU_QTY', e.REQU_QTY);
            key.append('DISP_QTY', e.DISP_QTY);
            key.append('LOT_NO', e.LOT_NO);
            key.append('EXP_Date', e.EXP_Date);
            key.append('STK_Event', e.STK_Event);
            key.append('price', e.price);
            let unitPrice: any = parseInt(e.price) / dis_amount;
            key.append('unitPrice', unitPrice.toFixed(2));
            key.append('value', e.value);
            let unitValue: any = parseInt(e.value) / dis_amount;
            key.append('unitValue', unitValue.toFixed(2));
            key.append('depFrom', 'INV');

            // key.forEach((value, key) => {
            //   console.log(key + ' : ' + value);
            // });

            this.http
              .post(`${environment.apiUrl}insertINVdetail`, key)
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

            if (e.LOT_NO != '-') {
              this.http
                .post(`${environment.apiUrl}updateLOT`, key)
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

            // เช็คโค้ดที่จับคู่ไม่ได้
            if (e.drugCode === null) {
              this.drugNotMatch.push(e);
              i++;
              // e.drugCode = '';
              // key.append('drugCode', e.drugCode);
              // this.http
              //   .post(`${environment.apiUrl}insertNewINV`, key)
              //   .toPromise()
              //   .then((val: any) => {
              //     // console.log(val);
              //   })
              //   .catch((reason) => {
              //     console.log(reason);
              //     this.services.alert(
              //       'error',
              //       'ไม่สามารถเชื่อมต่อกับเซิฟเวอร์ได้',
              //       'โปรดติดต่อผู้ดูแลระบบ'
              //     );
              //   })
              //   .finally(() => {
              //     i++;
              //     // console.log(i);
              //   });
            } else {
              this.http
                .post(`${environment.apiUrl}insertNewINV`, key)
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
                  i++;
                  // console.log(i);
                });
              // let x = [];
              // this.http
              //   .post(`${environment.apiUrl}checkInvNow`, key)
              //   .toPromise()
              //   .then((val: any) => {
              //     // console.log(val);
              //     if (val['rowCount'] > 0) {
              //       x = val['result'];
              //       let up = new FormData();
              //       up.append('up_invCode', x[0]['invCode']);
              //       up.append('up_drugCode', x[0]['drugCode']);
              //       up.append('amount', req_amount);
              //       up.append('depCode', this.dep);
              //       up.append('inv_code', e.inv_code);
              //       up.append('drugCode', e.drugCode);
              //       // up.forEach((value, up) => {
              //       //   console.log(up + ' : ' + value);
              //       // });
              //       this.http
              //         .post(`${environment.apiUrl}updateNewINV`, up)
              //         .toPromise()
              //         .then((val: any) => {
              //           // console.log(val);
              //         })
              //         .catch((reason) => {
              //           console.log(reason);
              //           this.services.alert(
              //             'error',
              //             'ไม่สามารถเชื่อมต่อกับเซิฟเวอร์ได้',
              //             'โปรดติดต่อผู้ดูแลระบบ'
              //           );
              //         })
              //         .finally(() => {
              //           i++;
              //           // console.log(i);
              //         });
              //     } else {
              //       this.http
              //         .post(`${environment.apiUrl}insertNewINV`, key)
              //         .toPromise()
              //         .then((val: any) => {
              //           // console.log(val);
              //         })
              //         .catch((reason) => {
              //           console.log(reason);
              //           this.services.alert(
              //             'error',
              //             'ไม่สามารถเชื่อมต่อกับเซิฟเวอร์ได้',
              //             'โปรดติดต่อผู้ดูแลระบบ'
              //           );
              //         })
              //         .finally(() => {
              //           i++;
              //           // console.log(i);
              //         });
              //     }
              //   })
              //   .catch((reason) => {
              //     console.log(reason);
              //     this.services.alert(
              //       'error',
              //       'ไม่สามารถเชื่อมต่อกับเซิฟเวอร์ได้',
              //       'โปรดติดต่อผู้ดูแลระบบ'
              //     );
              //   })
              //   .finally(() => {});
            }

            interval = setInterval(() => {
              if (this.filelist.length === i) {
                clearInterval(interval);
                this.spinner.hide();
                this.getInvNo();
                this.getDrugStore();
                this.clearInputExcel();
                this.services.alertTimer('success', 'นำเข้าข้อมูลสำเร็จ');
                if (this.drugNotMatch.length > 0) {
                  this.dataDNM = new MatTableDataSource(this.drugNotMatch);
                  this.dataDNM.sort = this.sortDNM;
                  this.dataDNM.paginator = this.paginatorDNM;
                  _window.$(`#drugNotMatch`).modal('show');
                }
              }
            }, 500);
          });
        }
      });
  };

  cal_amount(e: any) {
    let x = parseInt(e.split('x')[0]);
    let y = parseInt(e.split('x')[1]);
    let z = x * y;
    if (e.indexOf('+') > 0) {
      let plus = e;
      plus = plus.split('+')[1];
      plus = plus.split(')')[0];
      z += parseInt(plus);
    }
    return z;
  }

  returnINV = async () => {
    // console.log(this.filelist);
    _window.$(`#invHistory`).modal('hide');
    this.services
      .confirm(
        'warning',
        'ยึนยันการยกเลิกไฟล์เบิก ?',
        'เลขที่ ' + this.fileName
      )
      .then(async (val: any) => {
        if (val) {
          let invData = new FormData();
          invData.append('inv_no', this.fileName);
          invData.append('dep', this.dep);
          invData.append('id', this.id);
          invData.append('inv_type', this.selectType);
          // invData.forEach((value, key) => {
          //   console.log(key + ' : ' + value);
          // });
          // delete -> INVNo
          this.http
            .post(`${environment.apiUrl}deleteINVNo`, invData)
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
            .post(`${environment.apiUrl}deleteINVdetail`, invData)
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

          this.filelist.forEach((e, i) => {
            // set ข้อมูล inv
            let key = new FormData();
            let n: any = this.cal_amount(e.REQU_QTY);
            key.append('SUB_PO_NO', this.fileName);
            key.append('depCode', this.dep);
            key.append('invCode', e.inv_code);
            key.append('drugCode', e.drugCode ? e.drugCode : '');
            key.append('amount', n);

            // key.forEach((value, key) => {
            //   console.log(key + ' : ' + value);
            // });
            // return -> inventory
            this.http
              .post(`${environment.apiUrl}/deleteInventory`, key)
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
          });
          this.services.alertTimer('success', 'ยกเลิกไฟล์เบิกสำเร็จ');
          this.getInvNo();
          this.getDrugStore();
          this.clearInputExcel();
        }
      });
  };

  getInvNo = async () => {
    this.spinner.show();
    let arr: Array<any> = [];
    this.dataINVno = [];
    this.listINVNo = [];
    // this.selectINVNo = [];
    this.dataINVno = [];
    let depData = new FormData();
    depData.append('depCode', this.dep);
    this.http
      .post(`${environment.apiUrl}getINVNo`, depData)
      .toPromise()
      .then((val: any) => {
        if (val['rowCount'] > 0) {
          // console.log(val);
          this.listINVNo = val['result'];
          // console.log(this.listINVNo);
          for (let i = 0; i < this.listINVNo.length; i++) {
            if (this.listINVNo[i]['inv_type'] == this.types[0].value) {
              arr.push(this.listINVNo[i]);
            }
          }
          this.dataINVno = new MatTableDataSource(arr);
          this.dataINVno.sort = this.sortINVno;
          this.dataINVno.paginator = this.paginatorINVno;
        }
      })
      .catch((reason) => {
        console.log(reason);
        this.services.alert('error', 'ไม่สามารถเขื่อมต่อเชิฟเวอร์ได้', '');
      })
      .finally(() => {
        this.spinner.hide();
      });
    this.http
      .get(`${environment.apiUrl}getAllINVNo`)
      .toPromise()
      .then((val: any) => {
        if (val['rowCount'] > 0) {
          // console.log(val);
          this.listAllINVNo = val['result'];
        }
      })
      .catch((reason) => {
        console.log(reason);
        this.services.alert('error', 'ไม่สามารถเขื่อมต่อเชิฟเวอร์ได้', '');
      })
      .finally(() => {});
  };

  viewDetialINV = async (data: any) => {
    this.clearInputExcel();
    // console.log(data);
    this.fileName = data.inv_no;
    let invData = new FormData();
    invData.append('inv_no', data.inv_no);
    this.http
      .post(`${environment.apiUrl}viewDetialINV`, invData)
      .toPromise()
      .then((val: any) => {
        // console.log(val);
        this.filelist = val['result'];
        // console.log(this.filelist);
        // console.log(this.listDrugStore);
        this.filelist.forEach((e) => {
          this.listDrugStore.forEach((c) => {
            if (c.MED_CODE === e.inv_code) {
              e.drugCode = c.HIS_CODE;
            }
          });
        });

        this.dataFile = new MatTableDataSource(this.filelist);
        this.dataFile.sort = this.sortFile;
        this.dataFile.paginator = this.paginatorFile;
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
        this.findInvNo = true;
        this.invRemove = true;
        // data.date === this.formattedDate ? (this.invRemove = true) : false;
        _window.$(`#invHistory`).modal('show');
      });
  };

  drugFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataAllDrug.filter = filterValue.trim().toLowerCase();
  }

  getAllDrug = async () => {
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

  getFromDep = async () => {
    this.listFDep = [];
    let depData = new FormData();
    depData.append('depCode', this.dep);
    this.http
      .post(`${environment.apiUrl}fromDep`, depData)
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

  inputDay(event: Event) {
    // console.log((event.target as HTMLInputElement).value);
    if ((event.target as HTMLInputElement).value.length == 2) {
      if (parseInt((event.target as HTMLInputElement).value) > 31) {
        this.services.alert(
          'warning',
          'รูปแบบวันที่ไม่ถูกต้อง',
          'โปรดตรวจสอบข้อมูล'
        );
      } else {
        this.swiperMonth.nativeElement.focus();
      }
    }
  }

  inputMonth(event: Event) {
    if ((event.target as HTMLInputElement).value.length == 2) {
      if (parseInt((event.target as HTMLInputElement).value) > 12) {
        this.services.alert(
          'warning',
          'รูปแบบเดือนไม่ถูกต้อง',
          'โปรดตรวจสอบข้อมูล'
        );
      } else {
        this.swiperYear.nativeElement.focus();
      }
    }
  }

  inputYear(event: Event) {
    if ((event.target as HTMLInputElement).value.length == 4) {
      this.swiperYear.nativeElement.blur();
    }
  }

  selectDrug = async (result: any) => {
    let val = JSON.parse(JSON.stringify(result));
    // console.log(val.drugCode);
    const { value: amount } = await Swal.fire({
      input: 'number',
      title: val.drugName,
      text: 'ใส่จำนวน',
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
      data.append('depOut', 'INV');
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
                  this.services.alertTimer('success', 'นำเข้าข้อมูลสำเร็จ');
                });
            });
        });
    } else {
    }
  };
  
  reloadPage(){
    window.location.reload();
  }
  
}
