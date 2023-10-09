import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { AppService } from "src/app/services/app.service";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { MatSort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import * as moment from "moment";
import { NgxSpinnerService } from 'ngx-spinner';

const _window: any = window;

interface Type {
  value: string;
  viewValue: string;
}

@Component({
  selector: "app-transfers",
  templateUrl: "./transfers.component.html",
  styleUrls: ["./transfers.component.scss"],
})
export class TransfersComponent implements OnInit {
  @ViewChild("swiperAmo") swiperAmo!: ElementRef;
  @ViewChild("swiperBar") swiperBar!: ElementRef;

  public startDate: any = null;
  public endDate: any = null;

  public id: any;
  public job: any;
  public dep: any;
  public depIn: any;
  public depName: any;
  public drugName: any;

  public listBarcode: Array<any> = [];
  public listFDep: Array<any> = [];

  public types: Type[] = [
    { value: "", viewValue: "ทั้งหมด" },
    { value: "in", viewValue: "เข้า" },
    { value: "out", viewValue: "ออก" },
  ];
  public selectType: any = this.types[0].value;
  public selectName: any = this.types[0].viewValue;

  public formpDrug = new FormGroup({
    depOut: new FormControl("", [Validators.required]),
    outName: new FormControl("", [Validators.required]),
    depIn: new FormControl("", [Validators.required]),
    drugCode: new FormControl("", [Validators.required]),
    amount: new FormControl("", [Validators.required]),
    unit: new FormControl("", [Validators.required]),
  });

  public listAllDrug: Array<any> = [];
  public dataAllDrug: any = null;
  @ViewChild("sortAlldrug") sortAlldrug!: MatSort;
  @ViewChild("paginatorAllDrug") paginatorAllDrug!: MatPaginator;
  public displayAllDrug: string[] = [
    // "invCode",
    "drugCode",
    "drugName",
    // "drugform",
    // "dform",
    "option",
  ];

  public listHity: Array<any> = [];
  public dataHity: any = null;
  @ViewChild("sortHity") sortHity!: MatSort;
  @ViewChild("paginatorHity") paginatorHity!: MatPaginator;
  public displayHity: string[] = [
    "createDate",
    "drugName",
    "amount",
    // "name_from",
    // "event",
    "Name",
    // "name_to",
    "userName",
    "confirm",
  ];

  public dataReport: any = null;
  public displayReport: string[] = [
    "date",
    // "time",
    "drugName",
    "amount",
    "miniUnit",
    "name_from",
    "name_to",

    // "depName",
    // "Name",
    "userName",
  ];

  constructor(public services: AppService, private http: HttpClient,private spinner: NgxSpinnerService,) {
    this.dep = sessionStorage.getItem("dep");
    this.id = sessionStorage.getItem("id");
    this.job = sessionStorage.getItem("่job");
    this.depName = sessionStorage.getItem("depName");
    this.startDate = moment(this.campaignOne.value.start).format("YYYY-MM-DD");
    this.endDate = moment(this.campaignOne.value.end).format("YYYY-MM-DD");
  }

  ngOnInit(): void {
    this.getAllDrug();
    this.getDrugBarcode();
    this.getFromDep();
    this.getHittory();
    setTimeout(() => {
      this.swiperBar.nativeElement.focus();
    }, 500);
  }

  public campaignOne = new FormGroup({
    start: new FormControl(new Date()),
    end: new FormControl(new Date()),
  });

  public startChange(event: any) {
    const momentDate = new Date(event.value);
    this.startDate = moment(momentDate).format("YYYY-MM-DD");
  }

  public async endChange(event: any) {
    const momentDate = new Date(event.value);
    this.endDate = moment(momentDate).format("YYYY-MM-DD");
    this.getHittory();
  }

  public getAllDrug = async () => {
    this.spinner.show();
    this.listAllDrug = [];
    this.dataAllDrug = [];
    this.http
      .get(`${environment.apiUrl}OnHand/allDrugHomeC`)
      .toPromise()
      .then((val: any) => {
        if (val["rowCount"] > 0) {
          // console.log(val);
          if (val["rowCount"] > 0) {
            this.listAllDrug = val["result"];
            // console.log(this.listAllDrug);
            this.dataAllDrug = new MatTableDataSource(this.listAllDrug);
            this.dataAllDrug.sort = this.sortAlldrug;
            this.dataAllDrug.paginator = this.paginatorAllDrug;
          }
        }
      })
      .catch((reason) => {
        console.log(reason);
        this.services.alert("error", "ไม่สามารถเขื่อมต่อเชิฟเวอร์ได้", "");
      })
      .finally(() => {
        this.spinner.hide();
      });
  };

  public getHittory = async () => {
    this.listHity = [];
    this.dataHity = [];
    let depData = new FormData();
    depData.append("depCode", this.dep);
    depData.append("startDate", this.startDate);
    depData.append("endDate", this.endDate);
    this.http
      .post(`${environment.apiUrl}hittoryTranfer_new`, depData)
      .toPromise()
      .then((val: any) => {
        // console.log(val);
        if (val["rowCount"] > 0) {
          this.listHity = val["result"];
          // console.log(this.listHity);
          this.dataHity = new MatTableDataSource(this.listHity);
          this.dataHity.sort = this.sortHity;
          this.dataHity.paginator = this.paginatorHity;
        }
      })
      .catch((reason) => {
        console.log(reason);
        this.services.alert("error", "ไม่สามารถเขื่อมต่อเชิฟเวอร์ได้", "");
      })
      .finally(() => {
        this.hittoryReport();
      });
  };

  public hittoryReport = async () => {
    let arr: Array<any> = [];
    this.dataReport = [];
    this.listHity.forEach((ei, i) => {
      if (this.listHity[i]["confirm"] == "Y") {
        arr.push(this.listHity[i]);
      }
    });
    this.dataReport = new MatTableDataSource(arr);
  };

  public drugFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataAllDrug.filter = filterValue.trim().toLowerCase();
  }

  public hitFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataHity.filter = filterValue.trim().toLowerCase();
  }

  public getFromDep = async () => {
    this.listFDep = [];
    let depData = new FormData();
    depData.append("depCode", this.dep);
    this.http
      .post(`${environment.apiUrl}OnHand/depIn`, depData)
      .toPromise()
      .then((val: any) => {
        if (val["rowCount"] > 0) {
          this.listFDep = val["result"];
          // console.log(this.listFDep);
          this.depIn = this.listFDep[0]["ID"];
        }
      })
      .catch((reason) => {
        console.log(reason);
        this.services.alert("error", "ไม่สามารถเขื่อมต่อเชิฟเวอร์ได้", "");
      })
      .finally(() => {});
  };

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
          "error",
          "ไม่สามารถเชื่อมต่อกับเซิฟเวอร์ได้",
          "โปรดติดต่อผู้ดูแลระบบ"
        );
      })
      .finally(() => {});
  };

  public sendBCode = async (data: any) => {
    // console.log(data);
    this.listBarcode.forEach((ei, i) => {
      if (this.listBarcode[i]["Barcode"] == data) {
        this.formpDrug.patchValue({
          depOut: this.dep,
          outName: this.depName,
          drugCode: this.listBarcode[i]["drugCode"],
          unit: data.dosageunitcode,
        });
        this.drugName = this.listBarcode[i]["drugName"];
      }
    });
    if (this.formpDrug.value.drugCode) {
      _window.$(`#staticBackdrop`).modal("show");
      setTimeout(() => {
        this.swiperAmo.nativeElement.focus();
      }, 500);
    } else {
      this.services.alertTimer("warning", "ไม่พบข้อมูล Barcode");
    }
  };

  public clearFormDrug = async () => {
    // console.log('clear')
    this.formpDrug.patchValue({
      depOut: null,
      drugCode: null,
      amount: null,
      unit: null,
    });
    this.drugName = null;
    setTimeout(() => {
      this.swiperBar.nativeElement.focus();
    }, 500);
  };

  public inputFdep(e: any) {
    // console.log(e.target.value);
    this.depIn = e.target.value;
    this.swiperAmo.nativeElement.focus();
  }

  public submitTransfer = async () => {
    this.swiperAmo.nativeElement.focus();
    if (this.formpDrug.value.amount) {
      this.transfer();
    } else {
      this.services.alertTimer("warning", "กรุณาใส่จำนวน");
    }
  };

  public transfer = async () => {
    let data = new FormData();
    data.append("depOut", this.formpDrug.value.depOut);
    data.append("depIn", this.depIn);
    data.append("drugCode", this.formpDrug.value.drugCode);
    data.append("amount", this.formpDrug.value.amount);
    data.append("iden", this.id);
    // data.forEach((value, key) => {
    //   console.log(key + " : " + value);
    // });
    this.http
      .post(`${environment.apiUrl}OnHand/onhandOut`, data)
      .toPromise()
      .then((val: any) => {
        // console.log(val);
      })
      .catch((reason) => {
        console.log(reason);
        this.services.alert(
          "error",
          "ไม่สามารถเชื่อมต่อกับเซิฟเวอร์ได้",
          "โปรดติดต่อผู้ดูแลระบบ"
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
              "error",
              "ไม่สามารถเชื่อมต่อกับเซิฟเวอร์ได้",
              "โปรดติดต่อผู้ดูแลระบบ"
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
                  "error",
                  "ไม่สามารถเชื่อมต่อกับเซิฟเวอร์ได้",
                  "โปรดติดต่อผู้ดูแลระบบ"
                );
              })
              .finally(() => {
                this.clearFormDrug();
                this.getHittory();
                _window.$(`#staticBackdrop`).modal("hide");
                this.services.alertTimer("success", "ขอยาสำเร็จ");
                setTimeout(() => {
                  this.swiperBar.nativeElement.focus();
                }, 500);
              });
          });
      });
  };

  public selectDrug = async (data: any) => {
    // console.log(data);
    this.formpDrug.patchValue({
      depOut: this.dep,
      outName: this.depName,
      drugCode: data.drugCode,
      unit: data.dosageunitcode,
    });
    this.drugName = data.drugName;
    // console.log(this.drugName)
    _window.$(`#staticBackdrop`).modal("show");
    setTimeout(() => {
      this.swiperAmo.nativeElement.focus();
    }, 500);
  };

  public reverse = async (el: any) => {
    let data = new FormData();
    data.append("depOut", el.dep_to);
    data.append("depIn", el.dep_from);
    data.append("drugCode", el.drugCode);
    data.append("amount", el.amount);
    data.append("iden", this.id);
    data.append("trans_no", el.trans_no);
    // data.forEach((value, key) => {
    //   console.log(key + " : " + value);
    // });
    if (this.job != "E") {
      // console.log(el);
      this.services
        .confirm(
          "warning",
          "ยืนยันการยกเลิกคำขอ",
          el.drugName + " = " + el.amount + " " + el.miniUnit
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
                  "error",
                  "ไม่สามารถเชื่อมต่อกับเซิฟเวอร์ได้",
                  "โปรดติดต่อผู้ดูแลระบบ"
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
                      "error",
                      "ไม่สามารถเชื่อมต่อกับเซิฟเวอร์ได้",
                      "โปรดติดต่อผู้ดูแลระบบ"
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
                          "error",
                          "ไม่สามารถเชื่อมต่อกับเซิฟเวอร์ได้",
                          "โปรดติดต่อผู้ดูแลระบบ"
                        );
                      })
                      .finally(() => {
                        this.getHittory();
                        this.services.alertTimer("success", "คืนยาสำเสร็จ");
                      });
                  });
              });
          }
        });
    }
  };

  public selectTyped(event: Event) {
    // console.log((event.target as HTMLSelectElement).value);
    this.selectType = (event.target as HTMLSelectElement).value;
    let arr: Array<any> = [];
    if (this.selectType.length > 0) {
      this.listHity.forEach((ei, i) => {
        if (this.listHity[i]["type"] == this.selectType) {
          arr.push(this.listHity[i]);
        }
      });
    } else {
      arr = this.listHity;
    }
    this.dataHity = new MatTableDataSource(arr);
    this.dataHity.sort = this.sortHity;
    this.dataHity.paginator = this.paginatorHity;
  }
}
