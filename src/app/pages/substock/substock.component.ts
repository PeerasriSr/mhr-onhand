import { Component, OnInit, ViewChild } from "@angular/core";
import { AppService } from "src/app/services/app.service";
import { environment } from "src/environments/environment";
import { HttpClient } from "@angular/common/http";
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";

@Component({
  selector: "app-substock",
  templateUrl: "./substock.component.html",
  styleUrls: ["./substock.component.scss"],
})
export class SubstockComponent implements OnInit {
  public listDepStock: Array<any> = [];
  public listDepID: Array<any> = [];

  public toDep: any = null;
  public selectDrugName: any = null;

  public selectedRowIndex: any;
  public listSubStock: Array<any> = [];
  public dataINV: any = null;
  @ViewChild("sortINV") sortINV!: MatSort;
  @ViewChild("paginatorINV") paginatorINV!: MatPaginator;
  public displayedINV: string[] = ["invCode", "drugCode", "drugName", "amount"];

  public lotSubStock: Array<any> = [];
  public dataLot: any = null;
  @ViewChild("sortLot") sortLot!: MatSort;
  @ViewChild("paginatorLot") paginatorLot!: MatPaginator;
  public displayedLot: string[] = ["LOT_NO", "EXPIRED_DATE", "QTY_ON_HAND"];

  constructor(public services: AppService, private http: HttpClient) {}

  ngOnInit(): void {
    sessionStorage.setItem("selectPage", "SubStock");
    this.getDepStock();
  }

  public getDepStock = async () => {
    this.listDepStock = [];
    this.http
      .get(`${environment.apiUrl}listDepStock`)
      .toPromise()
      .then((val: any) => {
        if (val["rowCount"] > 0) {
          // console.log(val);
          this.listDepStock = val["result"];
          // console.log(this.listDepStock);
        }
      })
      .catch((reason) => {
        console.log(reason);
        this.services.alert("error", "ไม่สามารถเขื่อมต่อเชิฟเวอร์ได้", "");
      })
      .finally(() => {
        this.listDepID.push(this.listDepStock[0]);
        let j = 0;
        this.listDepStock.forEach((ei, i) => {
          if (this.listDepStock[i]["depCode"] != this.listDepID[j]["depCode"]) {
            this.listDepID.push(this.listDepStock[i]);
            j++;
          }
        });
        // console.log(this.listDepID);
        if (this.listDepID.length > 0) {
          // all substock
          // this.getSubStock(this.listDepID[0]["depCode"]);
          // opd only
          this.listDepID = [];
          let dataDep = {
            depCode: "OPD",
            depName: "อาคารผู้ป่วยนอก",
          };
          this.listDepID.push(dataDep);
          this.getSubStock(this.listDepID[0]["depCode"]);
        }
      });
  };

  public selectDep(e: any) {
    // console.log(e.target.value);
    this.getSubStock(e.target.value);
  }

  public getSubStock = async (data: any) => {
    let check = "f";
    this.toDep = data;
    // console.log(data);
    this.listSubStock = [];
    this.listDepStock.forEach((ei, i) => {
      if (this.listDepStock[i]["depCode"] == this.toDep) {
        // console.log(this.listDepStock[i]['DEPT_ID']);
        let subStock: Array<any> = [];
        let depData = new FormData();
        depData.append("DEPT_ID", this.listDepStock[i]["DEPT_ID"]);
        this.http
          .post(`${environment.apiUrl}listSubStock`, depData)
          .toPromise()
          .then((val: any) => {
            // console.log(val);
            if (val["rowCount"] > 0) {
              subStock = val["result"];
              subStock.forEach((ei, i) => {
                this.listSubStock.push(subStock[i]);
              });
              if (check == "f") {
                // console.log(this.listSubStock[0]);
                check = "t";
                this.selectDrug(this.listSubStock[0]);
              }
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
          .finally(() => {
            this.dataINV = new MatTableDataSource(this.listSubStock);
            this.dataINV.sort = this.sortINV;
            this.dataINV.paginator = this.paginatorINV;
          });
      }
    });
  };

  public selectDrug = async (data: any) => {
    // console.log(data);
    this.lotSubStock = [];
    let invCode = data.invCode;
    this.selectDrugName = data.drugName;
    this.selectedRowIndex = data["indexrow"];
    this.listDepStock.forEach((ei, i) => {
      if (this.listDepStock[i]["depCode"] == this.toDep) {
        let lotStock: Array<any> = [];
        let depData = new FormData();
        depData.append("DEPT_ID", this.listDepStock[i]["DEPT_ID"]);
        depData.append("invCode", invCode);
        this.http
          .post(`${environment.apiUrl}selectSubStock`, depData)
          .toPromise()
          .then((val: any) => {
            // console.log(val);
            if (val["rowCount"] > 0) {
              lotStock = val["result"];
              lotStock.forEach((ei, i) => {
                this.lotSubStock.push(lotStock[i]);
              });
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
          .finally(() => {
            // console.log(this.lotSubStock);
            this.dataLot = new MatTableDataSource(this.lotSubStock);
            this.dataLot.sort = this.sortLot;
            this.dataLot.paginator = this.paginatorLot;
          });
      }
    });
  };

  public drugFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataINV.filter = filterValue.trim().toLowerCase();
  }
}
