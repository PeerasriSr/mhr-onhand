import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { AppService } from "src/app/services/app.service";
import { HttpClient } from "@angular/common/http";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { environment } from "src/environments/environment";
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";
import * as XLSX from "xlsx";
import * as moment from "moment";
import Swal from "sweetalert2";
import { NgxSpinnerService } from "ngx-spinner";
import { DateAdapter } from "@angular/material/core";

interface Unit {
  value: string;
  viewValue: string;
}

@Component({
  selector: "app-appoint",
  templateUrl: "./appoint.component.html",
  styleUrls: ["./appoint.component.scss"],
})
export class AppointComponent implements OnInit {
  public formattedDate = moment(new Date()).format("YYYY-MM-DD");
  public formattedDateNum = parseInt(moment(new Date()).format("YYYYMMDD"));
  public enDateNum: any;
  public id: any;
  public dep: any;
  public formatDate: any = null;
  public enDate: any = null;
  public thDate: any = null;
  public showUnit: any = "ทั้งหมด";

  public listOnhand: Array<any> = [];
  public listDispen: Array<any> = [];

  public listINV: Array<any> = [];
  public dataINV: any = null;
  @ViewChild("sortINV") sortINV!: MatSort;
  @ViewChild("paginatorINV") paginatorINV!: MatPaginator;
  public displayINV: string[] = [
    "DISP_DATE",
    "MED_CODE",
    "DISP_DEPT",
    "DISP_QTY",
    "DISP_NAME",
  ];

  public listAppoint: Array<any> = [];
  public dataAppoint: any = null;
  @ViewChild("sortAppoint") sortAppoint!: MatSort;
  @ViewChild("paginatorAppoint") paginatorAppoint!: MatPaginator;
  public displayAppoint: string[] = [
    "invCode",
    "drugCode",
    "name",
    "DFORM_NAME",
    "amount",
    "addOn",
    "pack",
    "onhand",
    "DISP_QTY",
    "dispen",
    "accuracy",
  ];

  public units: Unit[] = [
    { value: "0", viewValue: "ทั้งหมด" },
    { value: "1", viewValue: "ยาเม็ด" },
    { value: "2", viewValue: "ยาฉีด" },
    { value: "3", viewValue: "ยาอื่นๆ" },
  ];
  public selectUnit: any = this.units[0].value;

  constructor(
    public services: AppService,
    private http: HttpClient,
    private spinner: NgxSpinnerService,
    private dateAdapter: DateAdapter<Date>
  ) {
    this.dateAdapter.setLocale("en-GB");
    this.dep = sessionStorage.getItem("dep");
    this.id = sessionStorage.getItem("id");
  }

  ngOnInit(): void {
    setTimeout(() => {
      // sessionStorage.setItem("selectPage", "Appoint");
      this.formatDate = new Date(new Date().setDate(new Date().getDate() + 1));
      this.getAppoint();
    }, 0);
  }

  public campaign = new FormGroup({
    picker: new FormControl(
      new Date(new Date().setDate(new Date().getDate() + 1))
    ),
  });

  public async dateChange(event: any) {
    this.formatDate = new Date(event.value);
    this.getAppoint();
  }

  public getAppoint = async () => {
    this.listOnhand = [];
    this.listDispen = [];
    this.listAppoint = [];
    this.dataAppoint = [];
    this.enDate = moment(this.formatDate).format("YYYY-MM-DD");
    this.enDateNum = parseInt(moment(this.formatDate).format("YYYYMMDD"));
    // console.log(this.enDate);
    this.thDate =
      (parseInt(moment(this.formatDate).format("YYYY")) + 543).toString() +
      moment(this.formatDate).format("MMDD");
    let formData = new FormData();
    formData.append("enDate", this.enDate);
    formData.append("thDate", this.thDate);
    formData.append("depINV", "W08");
    formData.append("depCode", "W8");
    formData.append("depFrom", "");
    this.http
      .post(`${environment.apiUrl}dispenSelectDay`, formData)
      .toPromise()
      .then((val: any) => {
        // console.log(val);
        this.listDispen = val["result"];
        // console.log(this.listDispen);
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
          .post(`${environment.apiUrl}OnHand/getAppoint`, formData)
          .toPromise()
          .then((val: any) => {
            // console.log(val);
            this.listAppoint = val["result"];
            // console.log(this.listAppoint);
            this.dataAppoint = new MatTableDataSource(this.listAppoint);
            this.dataAppoint.sort = this.sortAppoint;
            this.dataAppoint.paginator = this.paginatorAppoint;
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
            this.calAccuracy();
          });
      });
    this.http
      .post(`${environment.apiUrl}OnHand/OnhandAllDrug`, formData)
      .toPromise()
      .then((val: any) => {
        // console.log(val);
        this.listOnhand = val["result"];
        // console.log(this.listOnhand);
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

  public calAccuracy = async () => {
    for (let i = 0; i < this.listAppoint.length; i++) {
      this.listOnhand.forEach((ek, k) => {
        if (this.listAppoint[i]["drugCode"] == this.listOnhand[k]["drugCode"]) {
          this.listAppoint[i]["onhand"] = this.listOnhand[k]["amount"];
          this.listAppoint[i]["DISP_QTY"] =
            parseInt(this.listAppoint[i]["DISP_QTY"]) -
            parseInt(this.listOnhand[k]["amount"]);
          if (parseInt(this.listAppoint[i]["DISP_QTY"]) < 0) {
            this.listAppoint[i]["DISP_QTY"] = 0;
          }
        }
        this.listAppoint[i]["DISP_QTY"] =
          Math.ceil(
            this.listAppoint[i]["DISP_QTY"] / this.listAppoint[i]["pack"]
          ) * this.listAppoint[i]["pack"];
      });
      this.listDispen.forEach((ej, j) => {
        if (this.listAppoint[i]["drugCode"] == this.listDispen[j]["drugCode"]) {
          this.listAppoint[i]["dispen"] = this.listDispen[j]["amount"];
          if (
            parseInt(this.listAppoint[i]["addOn"]) >
            parseInt(this.listDispen[j]["amount"])
          ) {
            this.listAppoint[i]["accuracy"] = (
              (this.listDispen[j]["amount"] * 100) /
              this.listAppoint[i]["addOn"]
            ).toFixed(2);
          } else {
            this.listAppoint[i]["accuracy"] = (
              (this.listAppoint[i]["addOn"] * 100) /
              this.listDispen[j]["amount"]
            ).toFixed(2);
          }
        }
      });
      if (i == this.listAppoint.length - 1) {
        this.inv(this.listAppoint);
      }
    }
  };

  public inv = async (data: any) => {
    let arr: Array<any> = [];
    arr = data;
    this.listINV = [];
    this.dataINV = [];
    arr.forEach((ei, i) => {
      if (parseInt(arr[i]["DISP_QTY"]) > 0 && arr[i]["invCode"].length > 0) {
        this.listINV.push(arr[i]);
      }
    });
    this.dataINV = new MatTableDataSource(this.listINV);
    this.dataINV.sort = this.sortINV;
    this.dataINV.paginator = this.paginatorINV;
    // console.log(this.listINV);
  };

  public changeUnit(e: any) {
    let arr: Array<any> = [];
    // console.log(e.target.value);
    // this.getAppoint();
    if (e.target.value == 1) {
      this.showUnit = "ยาเม็ด";
      this.listAppoint.forEach((ei, i) => {
        if (this.listAppoint[i]["type"] == "4") {
          arr.push(this.listAppoint[i]);
        }
      });
    } else if (e.target.value == 2) {
      this.showUnit = "ยาฉีด";
      this.listAppoint.forEach((ei, i) => {
        if (this.listAppoint[i]["type"] == "3") {
          arr.push(this.listAppoint[i]);
        }
      });
      // console.log(arr);
    } else if (e.target.value == 3) {
      this.showUnit = "ยาอื่นๆ";
      this.listAppoint.forEach((ei, i) => {
        if (
          this.listAppoint[i]["type"] != "4" &&
          this.listAppoint[i]["type"] != "3"
        ) {
          arr.push(this.listAppoint[i]);
        }
      });
      console.log(arr);
    } else {
      this.showUnit = "ทั้งหมด";
      arr = this.listAppoint;
    }
    this.inv(arr);
    this.dataAppoint = new MatTableDataSource(arr);
    this.dataAppoint.sort = this.sortAppoint;
    this.dataAppoint.paginator = this.paginatorAppoint;
  }

  public appointFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataAppoint.filter = filterValue.trim().toLowerCase();
  }
}
