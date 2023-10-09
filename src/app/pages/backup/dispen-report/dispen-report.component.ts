import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { AppService } from "src/app/services/app.service";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { MatSort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import * as moment from "moment";
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: "app-dispen-report",
  templateUrl: "./dispen-report.component.html",
  styleUrls: ["./dispen-report.component.scss"],
})
export class DispenReportComponent implements OnInit {
  public id: any;
  public dep: any;
  public endDate: any = null;
  public startDate: any = null;
  public hn: any;
  public selectManu = 1;

  public listDeptPCU: Array<any> = [];
  public listCost: Array<any> = [];

  public listPatient: Array<any> = [];
  public dataPatient: any = null;
  @ViewChild("sortPatient") sortPatient!: MatSort;
  @ViewChild("paginatorPatient") paginatorPatient!: MatPaginator;
  public displayPatient: string[] = ["orderitemname", "orderqty", "cost"];
  public patientCost: any;

  public listItem: Array<any> = [];
  public dataItem: any = null;
  @ViewChild("sortItem") sortItem!: MatSort;
  @ViewChild("paginatorItem") paginatorItem!: MatPaginator;
  public displayItem: string[] = ["orderitemname", "orderqty", "cost"];
  public itemCost: any;

  constructor(
    public services: AppService,
    private http: HttpClient,
    private spinner: NgxSpinnerService
  ) {
    this.id = sessionStorage.getItem("id");
    this.dep = sessionStorage.getItem("dep");
    this.startDate =
      (
        parseInt(moment(this.campaignOne.value.start).format("YYYY")) + 543
      ).toString() + moment(this.campaignOne.value.start).format("MMDD");
    this.endDate =
      (
        parseInt(moment(this.campaignOne.value.end).format("YYYY")) + 543
      ).toString() + moment(this.campaignOne.value.end).format("MMDD");
  }

  ngOnInit(): void {
    this.getCost();
    this.spinner.show();
  }

  public campaignOne = new FormGroup({
    start: new FormControl(new Date()),
    end: new FormControl(new Date()),
  });

  public startChange(event: any) {
    const momentDate = new Date(event.value);
    this.startDate =
      (parseInt(moment(momentDate).format("YYYY")) + 543).toString() +
      moment(momentDate).format("MMDD");
  }

  public async endChange(event: any) {
    const momentDate = new Date(event.value);
    this.endDate =
      (parseInt(moment(momentDate).format("YYYY")) + 543).toString() +
      moment(momentDate).format("MMDD");
    this.getDeptPCU();
  }

  public getDeptPCU = async () => {
    this.spinner.show();
    this.listDeptPCU = [];
    let dept = new FormData();
    dept.append("depCode", this.dep);
    dept.append("startDate", this.startDate);
    dept.append("endDate", this.endDate);
    this.http
      .post(`${environment.apiUrl}OnHand/listDeptDispen`, dept)
      .toPromise()
      .then((val: any) => {
        // console.log(result)
        if (val["rowCount"] > 0) {
          this.listDeptPCU = val["result"];
          // console.log(this.listDeptPCU);
          this.hn = this.listDeptPCU[0]["hn"];
          this.getOrdersDispen();
        } else {
          this.spinner.hide();
        }

        // console.log(this.listDeptPCU);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  public selectDept(e: any) {
    this.spinner.show();
    // console.log(e.target.value);
    this.hn = e.target.value;
    this.getOrdersDispen();
  }

  public getOrdersDispen = async () => {
    this.listPatient = [];
    this.listItem = [];
    this.patientCost = 0;
    this.itemCost = 0;
    let dataHN = new FormData();
    dataHN.append("hn", this.hn);
    dataHN.append("depCode", this.dep);
    dataHN.append("startDate", this.startDate);
    dataHN.append("endDate", this.endDate);
    this.http
      .post(`${environment.apiUrl}OnHand/orderDeptDispen`, dataHN)
      .toPromise()
      .then((val: any) => {
        // console.log(val);
        if (val["rowCount"] > 0) {
          this.listPatient = val["result"];
          // console.log(this.listPatient);
          this.listPatient.forEach((ei, i) => {
            this.listCost.forEach((el, j) => {
              if (
                this.listPatient[i]["orderitemcode"] ==
                this.listCost[j]["drugCode"]
              ) {
                this.listPatient[i]["cost"] =
                  parseInt(this.listPatient[i]["orderqty"]) *
                  parseFloat(this.listCost[j]["opd_prc"]);
                // console.log(this.listPatient[i]["cost"]);
                this.patientCost =
                  parseFloat(this.patientCost) +
                  parseFloat(this.listPatient[i]["cost"]);
              }
            });
          });
          this.patientCost = this.patientCost.toLocaleString("en-US", {
            maximumFractionDigits: 2,
          });
          this.dataPatient = new MatTableDataSource(this.listPatient);
          this.dataPatient.sort = this.sortPatient;
          this.dataPatient.paginator = this.paginatorPatient;
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {});
    this.http
      .post(`${environment.apiUrl}OnHand/itemDeptDispen`, dataHN)
      .toPromise()
      .then((val: any) => {
        // console.log(val);
        if (val["rowCount"] > 0) {
          this.listItem = val["result"];
          this.listItem.forEach((ei, i) => {
            this.listCost.forEach((el, j) => {
              if (
                this.listItem[i]["orderitemcode"] ==
                this.listCost[j]["drugCode"]
              ) {
                this.listItem[i]["cost"] =
                  parseInt(this.listItem[i]["orderqty"]) *
                  parseFloat(this.listCost[j]["opd_prc"]);
                // console.log(this.listPatient[i]["cost"]);
                this.itemCost =
                  parseFloat(this.itemCost) +
                  parseFloat(this.listItem[i]["cost"]);
              }
            });
          });
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        this.spinner.hide();
        this.itemCost = this.itemCost.toLocaleString("en-US", {
          maximumFractionDigits: 2,
        });
        this.dataItem = new MatTableDataSource(this.listItem);
        this.dataItem.sort = this.sortItem;
        this.dataItem.paginator = this.paginatorItem;
      });
  };

  public getCost = async () => {
    this.listCost = [];
    this.http
      .get(`${environment.apiUrl}OnHand/allDrugCost`)
      .toPromise()
      .then((val: any) => {
        // console.log(val);
        if (val["rowCount"] > 0) {
          this.listCost = val["result"];
          // console.log(this.listCost);
        }
      })
      .catch((reason) => {
        console.log(reason);
        this.services.alert("error", "ไม่สามารถเขื่อมต่อเชิฟเวอร์ได้", "");
      })
      .finally(() => {
        this.getDeptPCU();
      });
  };

  public changeManu = async (n: any) => {
    this.selectManu = n;
  };
}
