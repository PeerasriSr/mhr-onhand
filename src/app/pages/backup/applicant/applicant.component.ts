import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { AppService } from "src/app/services/app.service";
import { FormGroup, Validators, FormControl } from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";
import { SelectionModel } from "@angular/cdk/collections";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";

export interface PeriodicElement {
  drugCode: string;
  drugName: string;
}

@Component({
  selector: "app-applicant",
  templateUrl: "./applicant.component.html",
  styleUrls: ["./applicant.component.scss"],
})
export class ApplicantComponent implements OnInit {
  @ViewChild("closebutton1") closebutton1: any;
  @ViewChild("TABLE") table!: ElementRef;

  public history: boolean = false;

  public id: any;
  public dep: any;
  public approves_dep: any;
  public selectHis: any;
  public status: any = [];

  public listDep: Array<any> = [];

  public listAllDrug: Array<any> = [];
  public dataAllDrug: any = null;
  @ViewChild("sortAlldrug") sortAlldrug!: MatSort;
  @ViewChild("paginatorAllDrug") paginatorAllDrug!: MatPaginator;
  public displayAllDrug: string[] = [
    "select",
    "drugCode",
    "drugName",
    "packageSpec",
  ];

  public selectDrug: Array<any> = [];
  public dataSelectDrug: any = null;
  @ViewChild("sortSelectDrug") sortSelectDrug!: MatSort;
  @ViewChild("paginatorSelectDrug") paginatorSelectDrug!: MatPaginator;
  public displaySelectDrug: string[] = [
    "row",
    "drugCode",
    "drugName",
    "approves_dep",
    "stock",
    "amount",
    "dep",
    "id",
  ];

  public listOnHand: Array<any> = [];
  public dataOnHand: any = null;
  @ViewChild("sortOnHand") sortOnHand!: MatSort;
  @ViewChild("paginatorOnHand") paginatorOnHand!: MatPaginator;
  public displayOnHand: string[] = [
    "select",
    // "drugCode",
    "drugName",
    "PACK_RATIO",
    "amount",
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
    "approvesDep",
    "approvesName",
    // "option",
  ];

  public listDetail: Array<any> = [];
  public dataDetail: any = null;
  @ViewChild("sortDetail") sortDetail!: MatSort;
  @ViewChild("paginatorDetail") paginatorDetail!: MatPaginator;
  public displayDetail: string[] = [
    "drugName",
    "REQU_QTY",
    "DISP_QTY",
    "LOT_NO",
    "EXP_Date",
  ];

  public formpDrug = new FormGroup({
    drugCode: new FormControl("", [Validators.required]),
    drugName: new FormControl("", [Validators.required]),
    amount: new FormControl("", [Validators.required]),
  });

  constructor(public services: AppService, private http: HttpClient) {
    this.dep = sessionStorage.getItem("dep");
    this.id = sessionStorage.getItem("id");
  }

  ngOnInit(): void {
    setTimeout(() => {
      // sessionStorage.setItem("selectPage", "Applicant");
      this.getDep();
      this.getHistory();
      this.getOnHand();
      this.getAllDrug();
    }, 0);
  }

  public getDep = async () => {
    this.listDep = [];
    let dataDep = new FormData();
    dataDep.append("depCode", this.dep);
    this.http
      .post(`${environment.apiUrl}selectDep`, dataDep)
      .toPromise()
      .then((val: any) => {
        // console.log(val);
        this.listDep = val["result"];
        // console.log(this.listDep);
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
        this.approves_dep = this.listDep[0]["ID"];
        // console.log(this.approves_dep);
      });
  };

  public getAllDrug = async () => {
    this.listAllDrug = [];
    this.http
      .get(`${environment.apiUrl}OnHand/allDrugHomeC`)
      .toPromise()
      .then((val: any) => {
        if (val["rowCount"] > 0) {
          // console.log(val);
          this.listAllDrug = val["result"];
          // console.log(this.listAllDrug);
        }
      })
      .catch((reason) => {
        console.log(reason);
        this.services.alert("error", "ไม่สามารถเขื่อมต่อเชิฟเวอร์ได้", "");
      })
      .finally(() => {});
  };

  public getOnHand = async () => {
    this.listOnHand = [];
    this.dataOnHand = [];
    let depData = new FormData();
    depData.append("depCode", this.approves_dep);
    this.http
      .post(`${environment.apiUrl}applicantOnHand`, depData)
      .toPromise()
      .then((val: any) => {
        // console.log(val);
        this.listOnHand = val["result"];
        // console.log(this.listOnHand);
        this.dataOnHand = new MatTableDataSource(this.listOnHand);
        this.dataOnHand.sort = this.sortOnHand;
        this.dataOnHand.paginator = this.paginatorOnHand;
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
        this.listOnHand.forEach((ei, i) => {
          this.listAllDrug.forEach((ej, j) => {
            if (
              this.listOnHand[i]["drugCode"] == this.listAllDrug[j]["drugCode"]
            ) {
              this.listOnHand[i]["drugName"] = this.listAllDrug[j]["drugName"];
            }
          });
        });
        // console.log(this.listOnHand);
      });
  };

  public selectDep(e: any) {
    // console.log(e.target.value);
    this.approves_dep = e.target.value;
    this.getOnHand();
    this.selectDrug = [];
    this.dataSelectDrug = [];
  }

  public applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataOnHand.filter = filterValue.trim().toLowerCase();
  }

  selection: any = new SelectionModel<PeriodicElement>(true, []);

  public showOptions = async (val: any) => {
    let check = "f";
    // console.log(e);
    // console.log(val);
    if (this.selectDrug.length > 0) {
      this.selectDrug.forEach((ei, i) => {
        // console.log(this.selectDrug[i]['drugCode'] + " " + val.drugCode.trim())
        if (this.selectDrug[i]["drugCode"] == val.drugCode.trim()) {
          check = "t";
          let index = i;
          if (index > -1) {
            this.selectDrug.splice(index, 1);
          }
        }
      });
    }
    if (check == "f") {
      // console.log(check);
      let drugName = val.drugName.trim();
      const { value: amount } = await Swal.fire({
        input: "number",
        title: `${drugName}`,
        text: "ใส่จำนวน : (เม็ด,หลอด,ขวด ฯลฯ)",
        inputLabel: "",
        inputPlaceholder: "",
        confirmButtonText: "ยืนยัน",
        confirmButtonColor: "#3085d6",
        allowOutsideClick: false,
        inputValidator: (value) => {
          return new Promise((resolve) => {
            if (value) {
              resolve("");
            } else {
              resolve("กรุณาใส่จำนวน");
            }
          });
        },
      });
      // console.log(amount);
      let formData = {
        drugCode: val.drugCode.trim(),
        drugName: val.drugName.trim(),
        stock: val.amount.trim(),
        amount: amount,
        id: this.id,
        dep: this.dep,
        approves_dep: this.approves_dep,
      };
      // console.log(formData);
      this.selectDrug.push(formData);
      // console.log(this.selectDrug);
    }
    this.dataSelectDrug = new MatTableDataSource(this.selectDrug);
    this.dataSelectDrug.sort = this.sortSelectDrug;
    this.dataSelectDrug.paginator = this.paginatorSelectDrug;
  };

  public clear = async () => {
    this.services
      .confirm("warning", "ยึนยันการล้างข้อมูล ?", "")
      .then((val: any) => {
        if (val) {
          this.selectDrug = [];
          this.dataSelectDrug = [];
          this.getOnHand();
          this.services.alertTimer("success", "ล้างข้อมูลสำเร็จ", "");
        }
      });
  };

  public submit = async () => {
    if (this.selectDrug.length > 0) {
      let numOrder = this.selectDrug.length;
      this.services
        .confirm(
          "warning",
          "ยืนยันการบันทึกข้อมูลการขอ ทั้งหมด " + numOrder + " รายการ",
          "! หากยืนยันแล้ว จะไม่สามารถแก้ไขข้อมูลได้"
        )
        .then((val: any) => {
          if (val) {
            let today = new Date();
            let ReqNO =
              today.getFullYear() +
              543 +
              ("0" + (today.getMonth() + 1)).slice(-2) +
              ("0" + today.getDate()).slice(-2) +
              ("0" + today.getHours()).slice(-2) +
              ("0" + today.getMinutes()).slice(-2) +
              ("0" + today.getSeconds()).slice(-2);
            // console.log(ReqNO);
            let ReqNOData = new FormData();
            ReqNOData.append("ReqNO", ReqNO);
            ReqNOData.append("applicant_id", this.id);
            ReqNOData.append("applicant_dep", this.dep);
            ReqNOData.append("approves_dep", this.approves_dep);
            // ReqNOData.forEach((value, key) => {
            //   console.log(key + ' : ' + value);
            // });
            this.http
              .post(`${environment.apiUrl}insertReqNo`, ReqNOData)
              .toPromise()
              .then((val: any) => {
                console.log(val);
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
            this.selectDrug.forEach((ei, i) => {
              let ReqListData = new FormData();
              ReqListData.append("ReqNO", ReqNO);
              ReqListData.append("drugCode", this.selectDrug[i]["drugCode"]);
              ReqListData.append("drugName", this.selectDrug[i]["drugName"]);
              ReqListData.append("REQU_QTY", this.selectDrug[i]["amount"]);
              // ReqListData.forEach((value, key) => {
              //   console.log(key + ' : ' + value);
              // });
              this.http
                .post(`${environment.apiUrl}insertReqList`, ReqListData)
                .toPromise()
                .then((val: any) => {
                  console.log(val);
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
            const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(
              this.table.nativeElement
            );
            const wb: XLSX.WorkBook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
            /* save to file */
            XLSX.writeFile(wb, "ขอยา_" + ReqNO + ".xlsx");
            this.services.alertTimer(
              "success",
              "บันทึกข้อมูลการเบิกสำเร็จ",
              "เลขที่ใบเบิก " + ReqNO
            );
            this.selectDrug = [];
            this.dataSelectDrug = [];
            this.getOnHand();
            this.getHistory();
          }
        });
    } else {
      this.services.alert("error", "กรุณาเลือกรายการยาที่ต้องการเบิก", "");
    }
  };

  public editAmount = async (data: any) => {
    // console.log(data);
    this.formpDrug.patchValue({
      drugCode: data["drugCode"],
      drugName: data["drugName"],
      amount: data["amount"],
    });
  };

  public submitAmount = async () => {
    // console.log(this.formpDrug.value.drugCode);
    if (this.formpDrug.value.amount == null) {
      this.services.alert("warning", "กรุณาใส่จำนวน", "");
    } else {
      this.selectDrug.forEach((ei, i) => {
        if (this.selectDrug[i]["drugCode"] == this.formpDrug.value.drugCode) {
          this.selectDrug[i]["amount"] = this.formpDrug.value.amount;
          this.closebutton1.nativeElement.click();
        }
      });
    }
  };

  public getHistory = async () => {
    this.listHistory = [];
    let dataDep = new FormData();
    dataDep.append("applicant", this.dep);
    this.http
      .post(`${environment.apiUrl}getHistory`, dataDep)
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
      this.viewRequest(this.listHistory[0]);
    }
  };

  public viewRequest = async (data: any) => {
    this.selectedRowIndex = data["indexrow"];
    this.status = [];
    this.listDetail = [];
    this.dataDetail = [];
    this.selectHis = data["NO"];
    // console.log(data);
    let noData = new FormData();
    noData.append("NO", data["NO"]);
    if (data["approvesName"] != null) {
      this.http
        .post(`${environment.apiUrl}selectAccept`, noData)
        .toPromise()
        .then((val: any) => {
          // console.log(val);
          this.listDetail = val["result"];
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
    } else {
      this.status = "อยู่ระหว่างการตรวจสอบ";
      this.http
        .post(`${environment.apiUrl}selectRequest`, noData)
        .toPromise()
        .then((val: any) => {
          // console.log(val);
          this.listDetail = val["result"];
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
    }
  };

  public undo = async () => {
    this.status = [];
    this.listDetail = [];
    this.dataDetail = [];
    this.history = false;
  };
}
