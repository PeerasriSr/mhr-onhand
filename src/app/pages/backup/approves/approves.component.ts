import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { AppService } from "src/app/services/app.service";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";
import * as XLSX from "xlsx";
import Swal from "sweetalert2";

export interface PeriodicElement {
  drugName: string;
  REQU_QTY: string;
}

@Component({
  selector: "app-approves",
  templateUrl: "./approves.component.html",
  styleUrls: ["./approves.component.scss"],
})
export class ApprovesComponent implements OnInit {
  public selectedValue: any;
  public dispenIndex: any = null;
  public id: any;
  public job: any;
  public dep: any;
  public selectAmount: any;
  public detailNO: any;
  public detailDep: any;
  public detailDepName: any;
  public drugName: any = null;
  public REQU_QTY: any = null;
  public selectHis: any;

  public codeFocus: any = [];
  public lotFocus: any = [];
  public sumLot: any;

  public selectRequest: boolean = false;
  public inputDrug: boolean = false;
  public history: boolean = false;

  @ViewChild("closebutton1") closebutton1: any;
  @ViewChild("closebutton2") closebutton2: any;
  @ViewChild("closebutton3") closebutton3: any;
  @ViewChild("TABLE") table!: ElementRef;

  public listAllLot: Array<any> = [];
  public listLotAllType: Array<any> = [];

  public listRequest: Array<any> = [];
  public dataRequest: any = null;
  @ViewChild("sortRequest") sortRequest!: MatSort;
  @ViewChild("paginatorRequest") paginatorRequest!: MatPaginator;
  public displayRequest: string[] = [
    "NO",
    "applicant_dep",
    "userName",
    "date",
    "time",
    "completeDate",
  ];

  public listDetail: Array<any> = [];
  public dataDetail: any = null;
  @ViewChild("sortDetail") sortDetail!: MatSort;
  @ViewChild("paginatorDetail") paginatorDetail!: MatPaginator;
  public displayDetail: string[] = [
    "rowNum",
    "drugName",
    "REQU_QTY",
    "DISP_QTY",
    "option",
  ];

  public detailINVS: Array<any> = [];
  public listDispen: Array<any> = [];
  public dataDispen: any = null;
  @ViewChild("sortDispen") sortDispen!: MatSort;
  @ViewChild("paginatorDispen") paginatorDispen!: MatPaginator;
  public displayDispen: string[] = [
    "row",
    "drugName",
    "REQU_Dep",
    "REQU_QTY",
    "DISP_Dep",
    "DISP_QTY",
    "LOT_NO",
    "EXP_Date",
    "id",
  ];

  public selectedRowIndex: any;
  public listHistory: Array<any> = [];
  public dataHistory: any = null;
  @ViewChild("sortHistory") sortHistory!: MatSort;
  @ViewChild("paginatorHistory") paginatorHistory!: MatPaginator;
  public displayHistory: string[] = [
    "NO",
    "date",
    "time",
    "applicantName",
    "applicantDep",
    "approvesName",
    // "option",
  ];

  public listAccept: Array<any> = [];
  public dataAccept: any = null;
  @ViewChild("sortAccept") sortAccept!: MatSort;
  @ViewChild("paginatorAccept") paginatorAccept!: MatPaginator;
  public displayAccept: string[] = [
    "drugName",
    "REQU_QTY",
    "DISP_QTY",
    "LOT_NO",
    "EXP_Date",
  ];

  public formpDrug = new FormGroup({
    depCode: new FormControl("", [Validators.required]),
    drugCode: new FormControl("", [Validators.required]),
    drugName: new FormControl("", [Validators.required]),
    LOT_NO: new FormControl("", [Validators.required]),
    EXP_Date: new FormControl("", [Validators.required]),
    amount: new FormControl("", [Validators.required]),
  });
  public formpDispen = new FormGroup({
    NO: new FormControl("", [Validators.required]),
    drugCode: new FormControl("", [Validators.required]),
    drugName: new FormControl("", [Validators.required]),

    LOT_NO: new FormControl("", [Validators.required]),
    EXP_Date: new FormControl("", [Validators.required]),
    stock: new FormControl("", [Validators.required]),
    DISP_QTY: new FormControl("", [Validators.required]),
    DISP_Dep: new FormControl("", [Validators.required]),
    REQU_QTY: new FormControl("", [Validators.required]),
    REQU_Dep: new FormControl("", [Validators.required]),
    id: new FormControl("", [Validators.required]),
  });

  constructor(
    public services: AppService,
    private http: HttpClient,
    private formBuilder: FormBuilder
  ) {
    this.dep = sessionStorage.getItem("dep");
    this.id = sessionStorage.getItem("id");
    this.job = sessionStorage.getItem("job");
  }

  ngOnInit(): void {
    setTimeout(() => {
      // sessionStorage.setItem("selectPage", "Approves");

      this.getRequest();
      this.getHistory();
      this.getAllLot();
      this.getLotAllType();
    }, 0);
    setInterval(() => {
      this.getRequest();
    }, 300000);
  }

  public getRequest = async () => {
    this.listRequest = [];
    this.dataRequest = [];
    let depData = new FormData();
    depData.append("dep", this.dep);
    this.http
      .post(`${environment.apiUrl}listRequest`, depData)
      .toPromise()
      .then((val: any) => {
        // console.log(val);
        this.listRequest = val["result"];
        // console.log(this.listRequest);
        this.dataRequest = new MatTableDataSource(this.listRequest);
        this.dataRequest.sort = this.sortRequest;
        this.dataRequest.paginator = this.paginatorRequest;
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

  public viewRequest = async (data: any) => {
    // console.log(data);
    this.inputDrug = false;
    this.selectRequest = true;
    this.detailNO = data["NO"];
    this.detailDep = data["applicant_dep"];
    this.detailDepName = data["applicant_Name"];
    this.listDetail = [];
    this.listDispen = [];
    let noData = new FormData();
    noData.append("NO", data["NO"]);
    // noData.forEach((value, key) => {
    //   console.log(key + ' : ' + value);
    // });
    this.http
      .post(`${environment.apiUrl}selectRequest`, noData)
      .toPromise()
      .then((val: any) => {
        // console.log(val);
        this.listDetail = val["result"];
        this.listDetail.forEach((ei, i) => {
          this.listDetail[i]["rowNum"] = i;
          // console.log(this.listDetail[i]['rowNum']);
        });
        // console.log(this.listDetail);
        this.dataDetail = new MatTableDataSource(this.listDetail);
        this.dataDetail.sort = this.sortDetail;
        this.dataDetail.paginator = this.paginatorDetail;
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

  public clearRequest = async () => {
    this.services
      .confirm(
        "warning",
        "ต้องการย้อนกลับใช่หรือไม่ ?",
        "หากย้อนกลับการสร้างรายการจ่ายจะถูกคืนค่า"
      )
      .then((val: any) => {
        if (val) {
          this.listDetail = [];
          this.dataDetail = [];
          this.selectRequest = false;
          this.detailNO = [];
          this.detailDep = [];
          this.listDispen = [];
          this.dataDispen = [];
        }
      });
  };

  public formAmountUpdate = async (data: any) => {
    // console.log(data);
    this.formpDrug.patchValue({
      depCode: this.dep,
      drugCode: data["drugCode"],
      drugName: data["drugName"],
      LOT_NO: data["LOT_NO"],
      EXP_Date: data["EXP_Date"],
      amount: data["amount"],
    });
  };

  public getAllLot = async () => {
    this.listAllLot = [];
    let drugData = new FormData();
    drugData.append("depCode", this.dep);
    this.http
      .post(`${environment.apiUrl}listAllLot`, drugData)
      .toPromise()
      .then((val: any) => {
        // console.log(val);
        this.listAllLot = val["result"];
        // console.log(this.listAllLot);
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

  public getLotAllType = async () => {
    this.listLotAllType = [];
    let drugData = new FormData();
    drugData.append("depCode", this.dep);
    this.http
      .post(`${environment.apiUrl}lotAllType`, drugData)
      .toPromise()
      .then((val: any) => {
        // console.log(val);
        this.listLotAllType = val["result"];
        // console.log(this.listLotAllType);
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

  public formAmountDispen = async (data: any) => {
    // console.log(data);
    this.detailINVS = [];
    this.drugName = data["drugName"];
    this.REQU_QTY = data["REQU_QTY"];
    this.dispenIndex = data["rowNum"];
    this.formpDispen.patchValue({
      NO: this.detailNO,
      drugCode: data["drugCode"],
      drugName: data["drugName"],
      REQU_QTY: data["REQU_QTY"],
      REQU_Dep: this.detailDep,
      DISP_Dep: this.dep,
      id: this.id,
    });
    this.listAllLot.forEach((ei, i) => {
      if (this.listAllLot[i]["drugCode"] == data["drugCode"]) {
        if (this.listAllLot[i]["amount"] > 0) {
          this.detailINVS.push(this.listAllLot[i]);
        }
      }
    });
    if (this.detailINVS.length > 0) {
      this.sumLot = 0;
      this.detailINVS.forEach((ei, i) => {
        this.sumLot += parseInt(this.detailINVS[i]["amount"]);
      });
      if (this.codeFocus != data["drugCode"]) {
        this.formpDispen.patchValue({
          LOT_NO: this.detailINVS[0]["LOT_NO"],
          EXP_Date: this.detailINVS[0]["EXP_Date"],

          stock: this.detailINVS[0]["amount"],
          DISP_QTY: "",
        });
        this.codeFocus = data["drugCode"];
      }
      if (this.lotFocus.length == 0) {
        this.formpDispen.patchValue({
          LOT_NO: this.detailINVS[0]["LOT_NO"],

          EXP_Date: this.detailINVS[0]["EXP_Date"],
          stock: this.detailINVS[0]["amount"],
          DISP_QTY: "",
        });
      }
    }
    // console.log(this.detailINVS);
  };

  public selectLot(e: any) {
    // console.log(e.target.value);
    this.lotFocus = e.target.value;
    this.detailINVS.forEach((ei, i) => {
      if (this.detailINVS[i]["LOT_NO"] == this.lotFocus) {
        this.formpDispen.patchValue({
          LOT_NO: this.detailINVS[i]["LOT_NO"],
          EXP_Date: this.detailINVS[i]["EXP_Date"],
          stock: this.detailINVS[i]["amount"],
          DISP_QTY: "",
        });
      }
    });
  }

  public updateLOT = async () => {
    // console.log(this.formpDrug.value);
    if (this.formpDrug.value.LOT_NO != null) {
      if (this.formpDrug.value.EXP_Date != null) {
        if (this.formpDrug.value.amount != null) {
          this.services
            .confirm(
              "warning",
              "ยึนยันการบันทึกข้อมูล",
              this.formpDrug.value.drugName +
                " Lot. NO : " +
                this.formpDrug.value.LOT_NO +
                " EXP. Date : " +
                this.formpDrug.value.EXP_Date +
                " จำนวน : " +
                this.formpDrug.value.amount
            )
            .then((val: any) => {
              if (val) {
                let drugData = new FormData();
                drugData.append("depCode", this.formpDrug.value.depCode);
                drugData.append("drugCode", this.formpDrug.value.drugCode);
                drugData.append("drugName", this.formpDrug.value.drugName);
                drugData.append("LOT_NO", this.formpDrug.value.LOT_NO);
                drugData.append("EXP_Date", this.formpDrug.value.EXP_Date);
                drugData.append("amount", this.formpDrug.value.amount);
                // drugData.forEach((value, key) => {
                //   console.log(key + ' : ' + value);
                // });
                this.http
                  .post(`${environment.apiUrl}updateINVS`, drugData)
                  .toPromise()
                  .then((val: any) => {
                    this.services.alertTimer("success", "บันทึกข้อมูลสำเร็จ");
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
                    this.closebutton1.nativeElement.click();
                  });
              }
            });
        } else {
          this.services.alert("warning", "กรุณาใส่ จำนวน", "");
        }
      } else {
        this.services.alert("warning", "กรุณาใส่ EXP. Date", "");
      }
    } else {
      this.services.alert("warning", "กรุณาใส่ LOT NO", "");
    }
  };

  public addDispen = async () => {
    // console.log(this.formpDispen.value);
    // console.log(this.formpDispen.value['DISP_QTY']);
    if (this.formpDispen.value["DISP_QTY"] == "") {
      this.services.alert("warning", "กรุณาใส่จำนวน", "");
    } else {
      if (
        this.formpDispen.value["DISP_QTY"] > this.formpDispen.value["stock"]
      ) {
        this.services.alert(
          "warning",
          "LOT : " +
            this.formpDispen.value["LOT_NO"] +
            " จำนวนคงเหลือไม่เพียงพอต่อการให้",
          "กรุณาตรวจสอบข้อมูลอีกครั้ง"
        );
      } else {
        this.listAllLot.forEach((ei, i) => {
          if (
            this.listAllLot[i]["drugCode"] ==
              this.formpDispen.value["drugCode"] &&
            this.listAllLot[i]["LOT_NO"] == this.formpDispen.value["LOT_NO"]
          ) {
            this.listAllLot[i]["amount"] -= this.formpDispen.value["DISP_QTY"];
          }
        });
        let check = false;
        if (this.listDispen.length > 0) {
          this.listDispen.forEach((ei, i) => {
            if (
              this.listDispen[i]["drugCode"] ==
                this.formpDispen.value["drugCode"] &&
              this.listDispen[i]["LOT_NO"] == this.formpDispen.value["LOT_NO"]
            ) {
              this.listDispen[i]["DISP_QTY"] +=
                this.formpDispen.value["DISP_QTY"];
              check = true;
            }
          });
        }
        if (check == false) {
          this.listDispen.push(this.formpDispen.value);
        }
        this.dataDispen = new MatTableDataSource(this.listDispen);
        this.dataDispen.sort = this.sortDispen;
        this.dataDispen.paginator = this.paginatorDispen;
        // console.log(this.dispenIndex);
        this.sumDispen(this.formpDispen.value["drugCode"]);
        let numStock = this.formpDispen.value["stock"];
        let numDispen = this.formpDispen.value["DISP_QTY"];
        this.formpDispen.patchValue({
          stock: numStock - numDispen,
        });
        this.closebutton2.nativeElement.click();
        // console.log(this.listDispen);
      }
    }
  };

  public delDispen = async (data: any) => {
    // console.log(data);
    this.services
      .confirm(
        "warning",
        "ยึนยันการลบ ?",
        data["drugName"] + " (" + data["LOT_NO"] + ") จำนวน " + data["DISP_QTY"]
      )
      .then((val: any) => {
        if (val) {
          this.listAllLot.forEach((ei, i) => {
            if (
              this.listAllLot[i]["drugCode"] == data["drugCode"] &&
              this.listAllLot[i]["LOT_NO"] == data["LOT_NO"]
            ) {
              this.listAllLot[i]["amount"] += data["DISP_QTY"];
            }
          });
          this.listDispen.forEach((ei, i) => {
            if (
              this.listDispen[i]["drugCode"] == data["drugCode"] &&
              this.listDispen[i]["LOT_NO"] == data["LOT_NO"]
            ) {
              let index = i;
              if (index > -1) {
                this.listDispen.splice(index, 1);
                this.dataDispen = new MatTableDataSource(this.listDispen);
                this.dataDispen.sort = this.sortDispen;
                this.dataDispen.paginator = this.paginatorDispen;
                this.sumDispen(data["drugCode"]);
              }
            }
          });
        }
      });
  };

  public sumDispen = async (data: any) => {
    let drugCode = data;
    let sumDispen = 0;
    this.listDispen.forEach((el, i) => {
      // console.log(this.listDispen[i]['drugCode']);
      if (this.listDispen[i]["drugCode"] == drugCode) {
        sumDispen = sumDispen + this.listDispen[i]["DISP_QTY"];
      }
      // console.log(sumDispen);
    });
    if (sumDispen == 0) {
      this.listDetail[this.dispenIndex]["DISP_QTY"] = "-";
    } else {
      this.listDetail[this.dispenIndex]["DISP_QTY"] = sumDispen;
    }
  };

  public setZero = async () => {
    this.services
      .confirm(
        "warning",
        "ยืนยันการจ่าย " + this.formpDispen.value["drugName"] + " จำนวน : 0",
        ""
      )
      .then((val: any) => {
        if (val) {
          this.formpDispen.patchValue({
            DISP_QTY: 0,
            EXP_Date: "-",
            LOT_NO: "-",
          });
          // console.log(this.formpDispen.value);
          let check = false;
          if (this.listDispen.length > 0) {
            this.listDispen.forEach((ei, i) => {
              if (
                this.listDispen[i]["drugCode"] ==
                  this.formpDispen.value["drugCode"] &&
                this.listDispen[i]["LOT_NO"] == this.formpDispen.value["LOT_NO"]
              ) {
                check = true;
              }
            });
          }
          if (check == false) {
            this.listDispen.push(this.formpDispen.value);
          }
          this.dataDispen = new MatTableDataSource(this.listDispen);
          this.dataDispen.sort = this.sortDispen;
          this.dataDispen.paginator = this.paginatorDispen;
          this.listDetail[this.dispenIndex]["DISP_QTY"] = 0;
          this.closebutton2.nativeElement.click();
        }
      });
  };

  public submit = async () => {
    let checkList = true;
    if (this.listDispen.length > 0) {
      this.listDetail.forEach((el, i) => {
        if (this.listDetail[i]["DISP_QTY"] == "-") {
          checkList = false;
          this.services.alert(
            "error",
            "สร้างรายการจ่ายไม่ครบ",
            "กรุณาตรวจสอบรายการ"
          );
        }
      });
      if (checkList == true) {
        // console.log(this.listDispen);
        let NO = this.listDispen[0]["NO"];
        this.services
          .confirm(
            "warning",
            "ยืนยันการบันทึกข้อมูลการจ่าย",
            "! ถ้าบันทึกแล้วจะไม่สามารถแก้ไขได้"
          )
          .then((val: any) => {
            if (val) {
              let ReqNOData = new FormData();
              ReqNOData.append("NO", NO);
              ReqNOData.append("id", this.id);
              // ReqNOData.forEach((value, key) => {
              //   console.log(key + " : " + value);
              // });
              this.http
                .post(`${environment.apiUrl}updateReqNo`, ReqNOData)
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
                .finally(() => {});
              this.listDispen.forEach((el, i) => {
                let total = parseInt(this.listDispen[i]["DISP_QTY"]);
                this.listLotAllType.forEach((ej, j) => {
                  if (total > 0) {
                    if (
                      this.listDispen[i]["drugCode"] ==
                        this.listLotAllType[j]["drugCode"] &&
                      this.listDispen[i]["LOT_NO"] ==
                        this.listLotAllType[j]["LOT_NO"] &&
                      this.listDispen[i]["EXP_Date"] ==
                        this.listLotAllType[j]["EXP_Date"]
                    ) {
                      if (total <= this.listLotAllType[j]["amount"]) {
                        this.listLotAllType[j]["amount"] =
                          parseInt(this.listLotAllType[j]["amount"]) - total;
                        total = 0;
                      } else {
                        total -= parseInt(this.listLotAllType[j]["amount"]);
                        this.listLotAllType[j]["amount"] = 0;
                      }
                      let ApprovData = new FormData();
                      ApprovData.append(
                        "amount",
                        this.listLotAllType[j]["amount"]
                      );
                      ApprovData.append("depCode", this.dep);
                      ApprovData.append(
                        "drugCode",
                        this.listLotAllType[j]["drugCode"]
                      );
                      ApprovData.append(
                        "LOT_NO",
                        this.listLotAllType[j]["LOT_NO"]
                      );
                      ApprovData.append(
                        "depFrom",
                        this.listLotAllType[j]["depFrom"]
                      );
                      // ApprovData.forEach((value, key) => {
                      //   console.log(key + " : " + value);
                      // });
                      this.http
                        .post(`${environment.apiUrl}approvesINV`, ApprovData)
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
                        .finally(() => {});
                    }
                  }
                });
                let AcceptData = new FormData();
                AcceptData.append("depCode", this.detailDep);
                AcceptData.append("canDep", this.detailDep);
                AcceptData.append("rovDep", this.dep);
                AcceptData.append("depFrom", this.dep);
                AcceptData.append("ReqNO", NO);
                AcceptData.append("drugCode", this.listDispen[i]["drugCode"]);
                AcceptData.append("drugName", this.listDispen[i]["drugName"]);
                AcceptData.append("REQU_QTY", this.listDispen[i]["REQU_QTY"]);
                AcceptData.append("amount", this.listDispen[i]["DISP_QTY"]);
                AcceptData.append("DISP_QTY", this.listDispen[i]["DISP_QTY"]);
                AcceptData.append("LOT_NO", this.listDispen[i]["LOT_NO"]);
                AcceptData.append("EXP_Date", this.listDispen[i]["EXP_Date"]);
                // AcceptData.forEach((value, key) => {
                //   console.log(key + " : " + value);
                // });
                this.http
                  .post(`${environment.apiUrl}insertAccept`, AcceptData)
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
                  .finally(() => {});
                this.http
                  .post(`${environment.apiUrl}applicantINV`, AcceptData)
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
                  .finally(() => {});
              });
              Swal.fire({
                title: "บันทึกข้อมูลการจ่ายสำเร็จ",
                text: "เลขที่ใบเบิก" + NO,
                icon: "success",
                showCancelButton: false,
                confirmButtonColor: "#0d6efd",
                confirmButtonText: "ตกลง",
              }).then((result) => {
                if (result.isConfirmed) {
                  const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(
                    this.table.nativeElement
                  );
                  const wb: XLSX.WorkBook = XLSX.utils.book_new();
                  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
                  /* save to file */
                  XLSX.writeFile(wb, "ให้ยา" + NO + ".xlsx");
                  location.reload();
                }
              });
            }
          });
      }
    } else {
      this.services.alert("error", "กรุณาเลือกรายการยาที่ต้องการจ่าย", "");
    }
    this.services.navRouter("/Approves");
  };

  public editAmount = async (data: any) => {
    // console.log(data);
    this.formpDispen.patchValue({
      drugCode: data["drugCode"],
      drugName: data["drugName"],
      LOT_NO: data["LOT_NO"],
      EXP_Date: data["EXP_Date"],
      DISP_QTY: data["DISP_QTY"],
    });
    this.detailINVS = [];

    let drugData = new FormData();
    drugData.append("drugCode", data["drugCode"]);
    drugData.append("LOT_NO", data["LOT_NO"]);
    drugData.append("depCode", this.dep);
    this.http
      .post(`${environment.apiUrl}selectLOT`, drugData)
      .toPromise()
      .then((val: any) => {
        // console.log(val);
        if (val["result"].length > 0) {
          this.detailINVS = val["result"];
          this.selectAmount = this.detailINVS[0]["amount"];
        } else {
          this.selectAmount = 0;
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

  public submitAmount = async () => {
    // console.log(this.formpDispen.value.drugCode);
    this.listDispen.forEach((ei, i) => {
      if (
        this.listDispen[i]["drugCode"] == this.formpDispen.value.drugCode &&
        this.listDispen[i]["LOT_NO"] == this.formpDispen.value.LOT_NO
      ) {
        this.listDispen[i]["DISP_QTY"] = this.formpDispen.value.DISP_QTY;
        this.sumDispen(this.formpDispen.value["drugCode"]);
        this.closebutton3.nativeElement.click();
      }
    });
  };

  public getHistory = async () => {
    this.listHistory = [];
    let dataDep = new FormData();
    dataDep.append("approves", this.dep);
    this.http
      .post(`${environment.apiUrl}acceptHistory`, dataDep)
      .toPromise()
      .then((val: any) => {
        // console.log(val);
        this.listHistory = val["result"];
        // console.log(this.listHistory);
        this.dataHistory = new MatTableDataSource(this.listHistory);
        this.dataHistory.sort = this.sortHistory;
        this.dataHistory.paginator = this.paginatorHistory;
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

  public showHistory = async () => {
    this.history = true;
    if (this.listHistory.length > 0) {
      this.viewAccept(this.listHistory[0]);
    }
  };

  public viewAccept = async (data: any) => {
    this.selectedRowIndex = data["indexrow"];
    this.listAccept = [];
    this.dataAccept = [];
    this.selectHis = data["NO"];
    // console.log(data);
    let noData = new FormData();
    noData.append("NO", data["NO"]);
    this.http
      .post(`${environment.apiUrl}selectAccept`, noData)
      .toPromise()
      .then((val: any) => {
        // console.log(val);
        this.listAccept = val["result"];
        // console.log(this.listAccept);
        this.dataAccept = new MatTableDataSource(this.listAccept);
        this.dataAccept.sort = this.sortAccept;
        this.dataAccept.paginator = this.paginatorAccept;
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

  public undo = async () => {
    this.listAllLot = [];
    this.listAccept = [];
    this.dataAccept = [];
    this.history = false;
  };
}
