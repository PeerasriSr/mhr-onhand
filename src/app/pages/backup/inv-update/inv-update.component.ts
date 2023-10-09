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
  selector: 'app-inv-update',
  templateUrl: './inv-update.component.html',
  styleUrls: ['./inv-update.component.scss'],
})
export class InvUpdateComponent implements OnInit {
  @ViewChild('swiperMonth') swiperMonth!: ElementRef;
  @ViewChild('swiperYear') swiperYear!: ElementRef;
  @ViewChild('closebutton1') closebutton1: any;
  @ViewChild('myAddfile') myAddfile!: ElementRef;

  public id: any;
  public dep: any;
  public role: any;

  public types: Type[] = [
    { value: 'C', viewValue: 'ปกติ' },
    { value: 'O', viewValue: 'ระหว่างวัน' },
  ];
  public selectType: any = this.types[0].value;
  public selectName: any = this.types[0].viewValue;
  public inputName: any = '';

  public listINVNo: Array<any> = [];
  public listAllINVNo: Array<any> = [];
  public selectINVNo: Array<any> = [];
  public dataINVno: any;
  @ViewChild('sortINVno') sortINVno!: MatSort;
  @ViewChild('paginatorINVno') paginatorINVno!: MatPaginator;
  public displayedINVno: string[] = [
    'inv_no',
    'userName',
    'date',
    'time',
    'select',
  ];

  public findInvNo: boolean = false;
  public file: any;
  public arrayBuffer: any;
  public fileName: any;
  public fileDate: any;

  public filelist: Array<any> = [];
  public dataFile: any = null;
  @ViewChild('sortFile') sortFile!: MatSort;
  @ViewChild('paginatorFile') paginatorFile!: MatPaginator;
  public displayedFile: string[] = [
    'drugName',
    'REQU_QTY',
    'DISP_QTY',
    'STK_Event',
    'LOT_NO',
    'EXP_Date',
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

  public listINVCode: Array<any> = [];

  public drugNotMatch: Array<any> = [];
  public dataDNM: any = null;
  @ViewChild('sortDNM') sortDNM!: MatSort;
  @ViewChild('paginatorDNM') paginatorDNM!: MatPaginator;
  public displayDNM: string[] = [
    // "invCode",
    'INV_Code',
    'drugName',
    'LOT_NO',
    'EXP_Date',
  ];

  public listHity: Array<any> = [];
  public dataHity: any = null;
  @ViewChild('sortHity') sortHity!: MatSort;
  @ViewChild('paginatorHity') paginatorHity!: MatPaginator;
  public displayHity: string[] = [
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

  public startDate: any = null;
  public endDate: any = null;

  // public formpDrug = new FormGroup({
  //   depCode: new FormControl("", [Validators.required]),
  //   drugCode: new FormControl("", [Validators.required]),
  //   drugName: new FormControl("", [Validators.required]),
  //   PACK_RATIO: new FormControl("", [Validators.required]),
  //   day: new FormControl("", [Validators.required]),
  //   month: new FormControl("", [Validators.required]),
  //   year: new FormControl("", [Validators.required]),
  //   LOT_NO: new FormControl("", [Validators.required]),
  //   unitPrice: new FormControl("", [Validators.required]),
  //   unitValue: new FormControl("", [Validators.required]),
  //   LOT_Old: new FormControl("", [Validators.required]),
  //   EXP_Date: new FormControl("", [Validators.required]),
  //   amount: new FormControl("", [Validators.required]),
  //   depFrom: new FormControl("", [Validators.required]),
  //   depFromName: new FormControl("", [Validators.required]),
  // });

  public listFDep: Array<any> = [];

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
      this.getINVCode();
      this.getAllDrug();
      this.getFromDep();
      this.getHittory();
    }, 100);
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
    this.getHittory();
  }

  public getHittory = async () => {
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

  public hitFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataHity.filter = filterValue.trim().toLowerCase();
  }

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

  public selectInput(e: any) {
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

  public getINVCode = async () => {
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
  };

  public clearInputExcel = async () => {
    this.file = [];
    this.arrayBuffer = [];
    this.fileName = [];
    this.filelist = [];
    this.dataFile = [];
    this.myAddfile.nativeElement.value = '';
  };

  // public clearInputDrug = async () => {
  //   this.inputDrug = false;
  //   this.showHistory = false;
  // };

  public addfile(event: any) {
    this.findInvNo = false;
    this.inputName = 'นำเข้าไฟล์เบิก';
    // this.inputExcel = true;
    this.file = [];
    this.arrayBuffer = [];
    this.fileName = [];
    this.filelist = [];
    this.dataFile = [];
    this.file = event.target.files[0];
    // console.log(this.file.name);
    let fileReader = new FileReader();
    fileReader.readAsArrayBuffer(this.file);
    fileReader.onload = (e) => {
      this.arrayBuffer = fileReader.result;
      var data = new Uint8Array(this.arrayBuffer);
      var arr = new Array();
      var arraylist = new Array();
      for (var i = 0; i != data.length; ++i)
        arr[i] = String.fromCharCode(data[i]);
      var bstr = arr.join('');
      var workbook = XLSX.read(bstr, { type: 'binary' });
      var first_sheet_name = workbook.SheetNames[0];
      var worksheet = workbook.Sheets[first_sheet_name];
      arraylist = XLSX.utils.sheet_to_json(worksheet, { raw: true });
      let txtName = this.file.name.split('.x')[0];
      // console.log(this.file.name)
      // console.log(txtName)
      let start = txtName.length - 10;
      this.fileName = txtName.substring(start);
      // เช็คเลขใบเบิกในระบบ
      this.checkInvNo();
      // console.log(this.fileName);
      this.fileDate = parseInt('25' + this.fileName.substr(0, 2)) - 543;
      this.fileDate =
        this.fileDate.toString() +
        '-' +
        this.fileName.substr(2, 2) +
        '-' +
        this.fileName.substr(4, 2);
      for (let i = 0; i < arraylist.length; i++) {
        let homCode = null;
        // console.log(arraylist[i]['รหัส'])
        for (let j of this.listINVCode) {
          if (j.MED_CODE === arraylist[i]['รหัส']) {
            homCode = j.HIS_CODE;
          }
        }
        let price = 0;
        arraylist[i]['ราคา'] ? (price = arraylist[i]['ราคา']) : '';
        arraylist[i]['จำนวนเงิน'] ? (price = arraylist[i]['จำนวนเงิน']) : '';
        let fileData = {
          INV_Code: arraylist[i]['รหัส'],
          drugName: arraylist[i]['ชื่อสามัญ/ชื่อการค้า'],
          REQU_QTY: arraylist[i]['จน.ขอ x pack'],
          DISP_QTY: arraylist[i]['จน.จ่าย x pack'],
          STK_Event: arraylist[i]['คงคลังปัจจุบัน'],
          LOT_NO: arraylist[i]['Lot no.'],
          EXP_Date: arraylist[i]['วันที่หมดอายุ'],
          price: price,
          value: arraylist[i]['มูลค่า'],
          drugCode: homCode,
          amount: null,
        };
        this.filelist.push(fileData);
      }
      // console.log(this.filelist);
      this.dataFile = new MatTableDataSource(this.filelist);
      this.dataFile.sort = this.sortFile;
      this.dataFile.paginator = this.paginatorFile;
      _window.$(`#invHistory`).modal('show');
      // เรียกใช้ฟังก์ชัน จับคู่โค้ด inv
      // this.matchCode();
    };
  }

  public checkInvNo = async () => {
    // console.log(this.listAllINVNo);
    this.listAllINVNo.forEach((el) => {
      if (el.inv_no == this.fileName) {
        this.findInvNo = true;
      }
    });
  };

  // public matchCode = async () => {
  //   let numfilelist = this.filelist.length;
  //   this.filelist.forEach((ei, i) => {
  //     this.listINVCode.forEach((ej, j) => {
  //       if (this.filelist[i]['INV_Code'] == this.listINVCode[j]['MED_CODE']) {
  //         // console.log(this.listINVCode[j]["invCode"]);
  //         this.filelist[i]['drugCode'] =
  //           this.listINVCode[j]['DRUG_CODE'].toUpperCase();
  //       }
  //     });
  //     numfilelist--;
  //     if (numfilelist < 1) {
  //       _window.$(`#invHistory`).modal('show');
  //       // console.log(this.filelist);
  //     }
  //   });
  // };

  public submitINV = async () => {
    _window.$(`#invHistory`).modal('hide');
    this.drugNotMatch = [];
    this.services
      .confirm(
        'warning',
        'ยึนยันการบันทึกข้อมูล ?',
        'เลขที่ ' + this.fileName + ' > ' + this.selectName
      )
      .then((val: any) => {
        if (val) {
          // insert -> INVNo
          let invData = new FormData();
          invData.append('inv_no', this.fileName);
          invData.append('dep', this.dep);
          invData.append('id', this.id);
          invData.append('inv_type', this.selectType);
          // invData.forEach((value, key) => {
          //     console.log(key + " : " + value);
          //   });
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
          let amount: any = [];
          let plus: any = [];
          let numfilelist = this.filelist.length;
          // console.log(this.filelist)
          this.filelist.forEach((el, i) => {
            // set ข้อมูล inv
            let invDetailData = new FormData();
            invDetailData.append('SUB_PO_NO', this.fileName);
            invDetailData.append('depCode', this.dep);
            invDetailData.append('INV_Code', this.filelist[i]['INV_Code']);
            invDetailData.append('drugCode', this.filelist[i]['drugCode']);
            invDetailData.append('drugName', this.filelist[i]['drugName']);
            if (this.dep == 'W19') {
              amount = this.filelist[i]['DISP_QTY'];
            } else {
              amount = this.filelist[i]['REQU_QTY'];
            }
            let x = parseInt(amount.split(' ')[0]);
            let y = parseInt(amount.split(' ')[2]);
            amount = x * y;
            if (this.filelist[i]['REQU_QTY'].indexOf('+') > 0) {
              plus = this.filelist[i]['REQU_QTY'];
              plus = plus.split('+')[1];
              plus = plus.split(')')[0];
              plus = parseInt(plus);
              amount = amount + plus;
            }
            invDetailData.append('amount', amount);
            invDetailData.append('REQU_QTY', this.filelist[i]['REQU_QTY']);
            invDetailData.append('DISP_QTY', this.filelist[i]['DISP_QTY']);
            invDetailData.append('LOT_NO', this.filelist[i]['LOT_NO']);
            invDetailData.append('EXP_Date', this.filelist[i]['EXP_Date']);
            invDetailData.append('STK_Event', this.filelist[i]['STK_Event']);
            invDetailData.append('price', this.filelist[i]['price']);
            let unitPrice: any = parseInt(this.filelist[i]['price']) / amount;
            invDetailData.append('unitPrice', unitPrice.toFixed(2));
            invDetailData.append('value', this.filelist[i]['value']);
            let unitValue: any = parseInt(this.filelist[i]['value']) / amount;
            invDetailData.append('unitValue', unitValue.toFixed(2));
            invDetailData.append('depFrom', 'INV');
            invDetailData.append('createDate', this.fileDate);
            // invDetailData.forEach((value, key) => {
            //   console.log(key + " : " + value);
            // });
            // inser -> INVDetail
            this.http
              .post(`${environment.apiUrl}insertINVdetail`, invDetailData)
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
            // เช็คโค้ดที่จับคู่ไม่ได้
            if (this.filelist[i]['drugCode'] === null) {
              this.drugNotMatch.push(this.filelist[i]);
            } else {
              //update -> INVS
              this.http
                .post(`${environment.apiUrl}updateINVS`, invDetailData)
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
                .post(
                  `${environment.apiUrl}/OnHand/updateInventory`,
                  invDetailData
                )
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
              //update -> LOT
              if (this.filelist[i]['LOT_NO'] != '-') {
                this.http
                  .post(`${environment.apiUrl}updateLOT`, invDetailData)
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
            }
            numfilelist--;
            if (numfilelist < 1) {
              this.services.alertTimer('success', 'นำเข้าข้อมูลสำเร็จ');
              if (this.drugNotMatch.length > 0) {
                // console.log(this.drugNotMatch);
                this.dataDNM = new MatTableDataSource(this.drugNotMatch);
                this.dataDNM.sort = this.sortDNM;
                this.dataDNM.paginator = this.paginatorDNM;
                _window.$(`#drugNotMatch`).modal('show');
              }
              this.getInvNo();
              this.getINVCode();
              this.clearInputExcel();
            }
          });
        }
      });
  };

  public returnINV = async () => {
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
          // invData.append("dep", this.dep);
          // invData.append("id", this.id);
          // invData.append("inv_type", this.selectType);
          // invData.forEach((value, key) => {
          //     console.log(key + " : " + value);
          //   });
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
          let amount: any = [];
          let plus: any = [];
          let numfilelist = this.filelist.length;
          this.filelist.forEach((el, i) => {
            // set ข้อมูล inv
            let invDetailData = new FormData();
            invDetailData.append('SUB_PO_NO', this.fileName);
            invDetailData.append('depCode', this.dep);
            invDetailData.append('invCode', this.filelist[i]['inv_code']);
            if (this.dep == 'W19') {
              amount = this.filelist[i]['DISP_QTY'];
            } else {
              amount = this.filelist[i]['REQU_QTY'];
            }
            let x = parseInt(amount.split(' ')[0]);
            let y = parseInt(amount.split(' ')[2]);
            amount = x * y;
            if (this.filelist[i]['REQU_QTY'].indexOf('+') > 0) {
              plus = this.filelist[i]['REQU_QTY'];
              plus = plus.split('+')[1];
              plus = plus.split(')')[0];
              plus = parseInt(plus);
              amount = amount + plus;
            }
            invDetailData.append('amount', amount);
            // invDetailData.forEach((value, key) => {
            //   console.log(key + " : " + value);
            // });
            // delete -> INVDetail
            this.http
              .post(`${environment.apiUrl}deleteINVdetail`, invDetailData)
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
            // return -> inventory
            this.http
              .post(`${environment.apiUrl}/deleteInventory`, invDetailData)
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
            numfilelist--;
            if (numfilelist < 1) {
              this.services.alertTimer('success', 'ยกเลิกไฟล์เบิกสำเร็จ');
              this.getInvNo();
              this.getINVCode();
              this.clearInputExcel();
            }
          });
        }
      });
  };

  public getInvNo = async () => {
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
          this.spinner.hide();
        }
      })
      .catch((reason) => {
        console.log(reason);
        this.services.alert('error', 'ไม่สามารถเขื่อมต่อเชิฟเวอร์ได้', '');
      })
      .finally(() => {});
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

  public viewDetialINV = async (data: any) => {
    // console.log(data)
    this.inputName = 'ประวัติการเบิก';
    this.filelist = [];
    this.dataFile = [];
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
        this.checkInvNo();
        _window.$(`#invHistory`).modal('show');
      });
  };

  public drugFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataAllDrug.filter = filterValue.trim().toLowerCase();
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

  // public formUpdateOnhand = async (data: any) => {
  //   // console.log(data);
  //   this.formpDrug.patchValue({
  //     depCode: this.dep,
  //     depFrom: this.listFDep[0]["ID"],
  //     drugCode: data["drugCode"],
  //     drugName: data["drugName"],
  //     PACK_RATIO: data["PACK_RATIO"],
  //     // LOT_NO: '-',
  //     LOT_NO: data["LOT_NO"],
  //     unitPrice: data["LOT_NO"],
  //     unitValue: data["LOT_NO"],
  //     LOT_Old: data["LOT_NO"],
  //     EXP_Date: data["EXP_Date"],
  //     year: data["year"],
  //     month: data["month"],
  //     day: data["day"],
  //     amount: data["amount"],
  //   });
  //   //  console.log(this.formpDrug.value);
  // };

  public getFromDep = async () => {
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

  // public inputFdep(e: any) {
  //   // console.log(e.target.value);
  //   this.formpDrug.patchValue({
  //     depFrom: e.target.value,
  //   });
  // }

  public inputDay(event: Event) {
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

  public inputMonth(event: Event) {
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

  public inputYear(event: Event) {
    if ((event.target as HTMLInputElement).value.length == 4) {
      this.swiperYear.nativeElement.blur();
    }
  }

  public selectDrug = async (result: any) => {
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

  // public updateOnhand = async () => {
  //   // console.log(this.formpDrug.value);
  //   if (this.formpDrug.value.LOT_NO != null) {
  //     if (this.formpDrug.value.day > 0) {
  //       // const momentDate = new Date(this.formpDrug.value.EXP_Date);
  //       // const formattedDate = moment(momentDate).format("YYYY-MM-DD");
  //       let y = String(this.formpDrug.value.year);
  //       let m = String(this.formpDrug.value.month);
  //       let d = String(this.formpDrug.value.day);
  //       let formattedDate: any;
  //       if (y.length == 1) {
  //         this.services.alert(
  //           "warning",
  //           "รูปแบบปีไม่ถูกต้อง",
  //           "โปรดตรวจสอบข้อมูล"
  //         );
  //       } else if (y.length == 3) {
  //         this.services.alert(
  //           "warning",
  //           "รูปแบบปีไม่ถูกต้อง",
  //           "โปรดตรวจสอบข้อมูล"
  //         );
  //       } else {
  //         if (y.length == 2) {
  //           y = "20" + y;
  //         }
  //         if (d.length < 2) {
  //           d = "0" + d;
  //         }
  //         if (m.length < 2) {
  //           m = "0" + m;
  //         }
  //         formattedDate = y + "-" + m + "-" + d;
  //       }
  //       if (this.formpDrug.value.amount != null) {
  //         //

  //         let drugData = new FormData();
  //         drugData.append("depCode", this.formpDrug.value.depCode);
  //         drugData.append("drugCode", this.formpDrug.value.drugCode);
  //         drugData.append("drugName", this.formpDrug.value.drugName);
  //         drugData.append("LOT_NO", this.formpDrug.value.LOT_NO);
  //         drugData.append("unitPrice", this.formpDrug.value.unitPrice);
  //         drugData.append("unitValue", this.formpDrug.value.unitValue);
  //         drugData.append("LOT_Old", this.formpDrug.value.LOT_Old);
  //         drugData.append("EXP_Date", formattedDate);
  //         drugData.append("PACK_RATIO", this.formpDrug.value.PACK_RATIO);
  //         drugData.append("amount", this.formpDrug.value.amount);
  //         drugData.append("depFrom", this.formpDrug.value.depFrom);
  //         // drugData.forEach((value, key) => {
  //         //   console.log(key + " : " + value);
  //         // });
  //         // this.http
  //         //   .post(`${environment.apiUrl}delEmsLot`, drugData)
  //         //   .toPromise()
  //         //   .then((val: any) => {
  //         //     // console.log(val);
  //         //   })
  //         //   .catch((reason) => {
  //         //     console.log(reason);
  //         //     this.services.alert(
  //         //       "error",
  //         //       "ไม่สามารถเชื่อมต่อกับเซิฟเวอร์ได้",
  //         //       "โปรดติดต่อผู้ดูแลระบบ"
  //         //     );
  //         //   })
  //         //   .finally(() => {});
  //         this.http
  //           .post(`${environment.apiUrl}updateINVS`, drugData)
  //           .toPromise()
  //           .then((val: any) => {
  //             // console.log(val);
  //           })
  //           .catch((reason) => {
  //             console.log(reason);
  //             this.services.alert(
  //               "error",
  //               "ไม่สามารถเชื่อมต่อกับเซิฟเวอร์ได้",
  //               "โปรดติดต่อผู้ดูแลระบบ"
  //             );
  //           })
  //           .finally(() => {
  //             setTimeout(() => {
  //               this.closebutton1.nativeElement.click();
  //               this.services.alertTimer("success", "อับเดตข้อมูลสำเร็จ");
  //             }, 100);
  //           });
  //       } else {
  //         this.services.alert("warning", "กรุณาใส่ จำนวน", "");
  //       }
  //     } else {
  //       this.services.alert("warning", "กรุณาใส่ EXP. Date", "");
  //     }
  //   } else {
  //     this.services.alert("warning", "กรุณาใส่ LOT NO", "");
  //   }
  // };
}
