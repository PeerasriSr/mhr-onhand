import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Location } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';

const _window: any = window;

@Component({
  selector: 'app-mapcode',
  templateUrl: './mapcode.component.html',
  styleUrls: ['./mapcode.component.scss'],
})
export class MapcodeComponent implements OnInit {
  INV_MD: Array<any> = [];
  listINVCode: Array<any> = [];
  dataINVCode: any = null;
  @ViewChild('sortINVCode') sortINVCode!: MatSort;
  @ViewChild('paginatorINVCode') paginatorINVCode!: MatPaginator;
  displayINVCode: string[] = ['WORKING_CODE', 'HIS_CODE', 'DRUG_NAME', 'edit'];

  searchInv = new FormGroup({
    invCode: new FormControl('', [Validators.required]),
  });
  invDrug = {
    code: '',
    name: '',
    id: '',
    form: '',
    trade: '',
    pack: '',
  };

  searchHomc = new FormGroup({
    homCode: new FormControl('', [Validators.required]),
  });
  homcDrug = {
    code: '',
    name: '',
  };

  role: any;
  mapType: boolean = false;

  formCode = new FormGroup({
    invCode: new FormControl('', [Validators.required]),
    homCode: new FormControl('', [Validators.required]),
  });

  constructor(
    public services: AppService,
    private http: HttpClient,
    private spinner: NgxSpinnerService,
    private location: Location
  ) {
    this.role = sessionStorage.getItem('role');
  }

  ngOnInit(): void {
    this.spinner.show();
    this.getINVCode();
  }

  getINVCode = async () => {
    this.listINVCode = [];
    this.http
      .get(`${environment.apiUrl}INV_MD`)
      .toPromise()
      .then((val: any) => {
        if (val['rowCount'] > 0) {
          // console.log(val);
          this.listINVCode = val['result'];
        }
      })
      .catch((reason) => {
        console.log(reason);
        this.services.alert('error', 'ไม่สามารถเขื่อมต่อเชิฟเวอร์ได้', '');
      })
      .finally(() => {
        this.http
          .get(`${environment.apiUrl}listINVcode`)
          .toPromise()
          .then((val: any) => {
            if (val['rowCount'] > 0) {
              let arr: Array<any> = [];
              // console.log(val);
              arr = val['result'];
              this.listINVCode.forEach((i) => {
                arr.forEach((j) => {
                  if (i.WORKING_CODE === j.MED_CODE) {
                    i.HIS_CODE = j.HIS_CODE;
                  }
                });
              });
              // console.log(this.listINVCode);
              this.dataINVCode = new MatTableDataSource(this.listINVCode);
              this.dataINVCode.sort = this.sortINVCode;
              this.dataINVCode.paginator = this.paginatorINVCode;
            }
          })
          .catch((reason) => {
            console.log(reason);
            this.services.alert('error', 'ไม่สามารถเขื่อมต่อเชิฟเวอร์ได้', '');
          })
          .finally(() => {
            // this.testMatchCode();
            this.spinner.hide();
          });
      });
  };

  drugFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataINVCode.filter = filterValue.trim().toLowerCase();
  }

  mapCode() {
    this.mapType = false;
    _window.$(`#mapCode`).modal('show');
  }

  submitISearchHomc = async () => {
    // console.log(this.searchHomc.value.homCode);
    let key = new FormData();
    key.append('homCode', this.searchHomc.value.homCode);
    this.http
      .post(`${environment.apiUrl}searchDrugHomeC`, key)
      .toPromise()
      .then((val: any) => {
        // console.log(val);
        if (val.rowCount > 0) {
          this.homcDrug = {
            code: val.result[0]['drugCode'],
            name: val.result[0]['drugName'],
          };
        } else {
          this.homcDrug = {
            code: '',
            name: 'ไม่พบข้อมูล !',
          };
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

  cancelMatching() {
    // console.log('cancel');
    this.searchInv.patchValue({
      invCode: '',
    });
    this.searchHomc.patchValue({
      homCode: '',
    });
    this.invDrug = {
      code: '',
      name: '',
      id: '',
      form: '',
      trade: '',
      pack: '',
    };
    this.homcDrug = {
      code: '',
      name: '',
    };
    _window.$(`#mapCode`).modal('hide');
  }

  submitMatching() {
    this.services
      .confirm(
        'warning',
        'ยืนยันการจับคู่',
        this.invDrug.code + ' = ' + this.homcDrug.code
      )
      .then((val: any) => {
        if (val) {
          let key = new FormData();
          key.append('DRUG_CODE', this.homcDrug.code);
          key.append('MED_CODE', this.invDrug.code);
          key.append('DRUG_NAME', this.invDrug.name);
          key.append('DFORM_ID', this.invDrug.id);
          key.append('DFORM_NAME', this.invDrug.form);
          key.append('LAST_PACK_RATIO', this.invDrug.pack);
          key.append('TRADE_CODE', this.invDrug.trade);
          // key.forEach((value, key) => {
          //   console.log(key + ' : ' + value);
          // });
          this.http
            .post(`${environment.apiUrl}insertInvHomc`, key)
            .toPromise()
            .then((val: any) => {
              // console.log(val);
              if (val.isQuery) {
                _window.$(`#mapCode`).modal('hide');
                this.getINVCode();
                this.services.alertTimer('success', 'บันทึกข้อมูลสำเร็จ');
              } else {
                this.services.alertTimer(
                  'error',
                  'บันทึกข้อมูลไม่สำเร็จ',
                  'โปรดติดต่อผู้ดูแลระบบ'
                );
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
        }
      });
  }

  removeMap() {
    this.services
      .confirm('warning', 'ยืนยันลบการจับคู่', this.invDrug.code)
      .then((val: any) => {
        if (val) {
          let key = new FormData();
          key.append('DRUG_CODE', this.homcDrug.code);
          key.append('MED_CODE', this.invDrug.code);
          key.append('DRUG_NAME', this.invDrug.name);
          key.append('DFORM_ID', this.invDrug.id);
          key.append('DFORM_NAME', this.invDrug.form);
          key.append('LAST_PACK_RATIO', this.invDrug.pack);
          key.append('TRADE_CODE', this.invDrug.trade);
          // key.forEach((value, key) => {
          //   console.log(key + ' : ' + value);
          // });
          this.http
            .post(`${environment.apiUrl}deleteInvHomc`, key)
            .toPromise()
            .then((val: any) => {
              // console.log(val);
              if (val.isQuery) {
                _window.$(`#mapCode`).modal('hide');
                this.getINVCode();
                this.services.alertTimer('success', 'ยกเลิกสำเร็จ');
              } else {
                this.services.alertTimer(
                  'error',
                  'บันทึกข้อมูลไม่สำเร็จ',
                  'โปรดติดต่อผู้ดูแลระบบ'
                );
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
        }
      });
  }

  submitISearchInv = async () => {
    // console.log(this.searchInv.value.invCode);
    let key = new FormData();
    key.append('invCode', this.searchInv.value.invCode);
    this.http
      .post(`${environment.apiUrl}searchINV_MD`, key)
      .toPromise()
      .then((val: any) => {
        // console.log(val);
        if (val.rowCount > 0) {
          this.invDrug = {
            code: val.result[0]['WORKING_CODE'],
            name: val.result[0]['DRUG_NAME'],
            id: val.result[0]['DFORM_ID'],
            form: val.result[0]['DFORM_NAME'],
            trade: val.result[0]['TRADE_CODE'],
            pack: val.result[0]['LAST_PACK_RATIO'],
          };
        } else {
          this.invDrug = {
            code: '',
            name: 'ไม่พบข้อมูล !',
            id: '',
            form: '',
            trade: '',
            pack: '',
          };
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

  editCode(e: any) {
    this.mapType = true;
    // console.log(e);
    this.invDrug = {
      code: e.WORKING_CODE,
      name: e.DRUG_NAME,
      id: e.DFORM_ID,
      form: e.DFORM_NAME,
      trade: e.TRADE_CODE,
      pack: e.LAST_PACK_RATIO,
    };
    this.searchInv.patchValue({
      invCode: e.WORKING_CODE,
    });
    this.searchHomc.patchValue({
      homCode: e.HIS_CODE,
    });
    this.submitISearchHomc();
    _window.$(`#mapCode`).modal('show');
  }

  goBack(): void {
    this.location.back();
  }
}
