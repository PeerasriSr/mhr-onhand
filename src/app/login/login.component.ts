import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

const _window: any = window;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  public inputGroup = new FormGroup({
    id: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  public listDep: Array<any> = [];
  public depID: any;
  public depName: any;
  public depType: any;
  public ip: any;
  public groupName: any;
  public value: any;

  constructor(public services: AppService, private http: HttpClient) {}

  ngOnInit(): void {
    this.getIP();
    // this.getDep();
    this.inputGroup.patchValue({
      id: '',
      password: '',
    });
  }

  public getIP = async () => {
    this.http
      .get(`${environment.apiUrl}getRemoteHost`)
      .toPromise()
      .then((val: any) => {
        // console.log(val);
        if (val) {
          this.ip = val;
          // console.log(this.ip);
        }
      })
      .catch((reason) => {
        console.log(reason);
        this.services.alert('error', 'ไม่สามารถเขื่อมต่อเชิฟเวอร์ได้', '');
      })
      .finally(() => {
        this.checkIP(this.ip);
      });
  };

  public checkIP = async (data: any) => {
    let formData = new FormData();
    formData.append('ip', data);
    this.http
      .post(`${environment.apiUrl}checkIP`, formData)
      .toPromise()
      .then((val: any) => {
        // console.log(val);
        if (val['rowCount'] > 0) {
          // console.log(val["result"][0]["group"]);
          this.getDep(val['result'][0]['group']);
          this.groupName = val['result'][0]['group'].toUpperCase();
        } else {
          _window.$(`#staticBackdrop`).modal('show');
        }
      })
      .catch((reason) => {
        console.log(reason);
        this.services.alert('error', 'ไม่สามารถเขื่อมต่อเชิฟเวอร์ได้', '');
      })
      .finally(() => {});
  };

  public getDep = async (group: any) => {
    // console.log(group);
    this.listDep = [];
    let data = new FormData();
    data.append('group', group);
    this.http
      .post(`${environment.apiUrl}depForLogin`, data)
      .toPromise()
      .then((val: any) => {
        // console.log(val);
        if (val['rowCount'] > 0) {
          this.listDep = val['result'];
          // console.log(this.listDep)
          this.depID = this.listDep[0]['ID'];
          this.depName = this.listDep[0]['Name'];
          this.depType = this.listDep[0]['type'];
        }
      })
      .catch((reason) => {
        console.log(reason);
        this.services.alert('error', 'ไม่สามารถเขื่อมต่อเชิฟเวอร์ได้', '');
      })
      .finally(() => {});
  };

  public submitInput = async () => {
    // console.log(this.inputGroup.value);
    // console.log(this.depID);
    if (this.depID) {
      let loginData = new FormData();
      loginData.append('id', this.inputGroup.value.id);
      loginData.append('password', this.inputGroup.value.password);
      // loginData.append('dep', this.depID);
      this.http
        .post(`${environment.apiUrl}OnHand/login`, loginData)
        .toPromise()
        .then((val: any) => {
          // console.log(val);
          if (val.success) {
            this.services.alertTimer('success', val.message, '');
            sessionStorage.setItem('userLogin', val.userData);
            // console.log(val.userData.jobPositon);
            let str = this.inputGroup.value.id;
            var newstr = str.toUpperCase();
            sessionStorage.setItem('id', newstr);
            sessionStorage.setItem('่job', val.userData.jobPositon);
            sessionStorage.setItem('role', val.userData.role);
            sessionStorage.setItem('user', val.userData.userName);
            sessionStorage.setItem('dep', this.depID);
            sessionStorage.setItem('depName', this.depName);
            sessionStorage.setItem('depType', this.depType);
            sessionStorage.setItem('group', this.groupName);
            val.userData.role
              ? sessionStorage.setItem('role', val.userData.role)
              : sessionStorage.setItem('role', '');
            // console.log(newstr.substring(0,1))
            if (this.depID == 'R93') {
              if (val.userData.note == 'R93') {
                sessionStorage.setItem('selectPage', 'Abundant');
                this.services.navRouter('/Abundant');
              } else {
                this.services.alert(
                  'warning',
                  'บัญชีผู้ใช้ ไม่ได้รับอนุญาติให้เข้าถึง',
                  ''
                );
              }
            } else {
              sessionStorage.setItem('selectPage', 'Inventory');
              this.services.navRouter('/Inventory');
            }
          } else {
            this.services.alert('warning', val.message, '');
            sessionStorage.clear();
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
    } else {
      this.services.alert('warning', 'กรุณาเลือกตำแหน่งของห้อง', '');
    }
  };

  public selectDep(e: any) {
    // console.log(e.target.value);
    this.depID = e.target.value.split(',')[0];
    this.depName = e.target.value.split(',')[1];
    this.depType = e.target.value.split(',')[2];
    // console.log(this.depID);
    // console.log(this.depName);
  }

  public myGroup: any;
  public selectGroup = async (val: any) => {
    // console.log(val);
    this.myGroup = val;
  };

  public submitGoup = async () => {
    // console.log(this.ip);
    // console.log(this.myGroup);
    this.services
      .confirm('warning', 'คุณได้เลือก ' + this.myGroup, 'ยืนยัน ?')
      .then((val: any) => {
        if (val) {
          let regisData = new FormData();
          regisData.append('ip', this.ip);
          regisData.append('group', this.myGroup);
          this.http
            .post(`${environment.apiUrl}registerDevice`, regisData)
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
              this.services.alertTimer('success', 'ลงทะเบียนสำเร็จ');
              setTimeout(() => {
                window.location.reload();
              }, 2000);
            });
        }
      });
  };
}
