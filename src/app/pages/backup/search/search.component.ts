import { Component, OnInit, ViewChild } from "@angular/core";
import { environment } from "src/environments/environment";
import { HttpClient } from "@angular/common/http";
import { AppService } from "src/app/services/app.service";
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";

@Component({
  selector: "app-search",
  templateUrl: "./search.component.html",
  styleUrls: ["./search.component.scss"],
})
export class SearchComponent implements OnInit {
  public key: any = "";
  public selectDrugName: any;

  public selectedRowIndex: any;
  public listINV: Array<any> = [];
  public dataINV: any = null;
  @ViewChild("sortINV") sortINV!: MatSort;
  @ViewChild("paginatorINV") paginatorINV!: MatPaginator;
  public displayedINV: string[] = [
    "indexrow",
    "drugCode",
    "drugName",
    "Name",
    "amount",
  ];

  // public AllLot: Array<any> = [];
  // public detailINV: Array<any> = [];
  // public dataSelectINVS: any = null;
  // @ViewChild("sortSelectINV") sortSelectINV!: MatSort;
  // @ViewChild("paginatorSelectINV") paginatorSelectINV!: MatPaginator;
  // public displaySelectINVS: string[] = ["LOT_NO", "EXP_Date", "amount"];

  constructor(public services: AppService, private http: HttpClient) {}

  ngOnInit(): void {
    setInterval(this.check, 1000);
  }

  public check = async () => {
    // console.log(sessionStorage.getItem("search"));
    if (this.key != sessionStorage.getItem("search")) {
      this.selectDrugName = [];
      this.key = sessionStorage.getItem("search");
      // console.log(this.key);
      this.searchDrug();
    }
  };

  public searchDrug = async () => {
    this.listINV = [];
    let dataKey = new FormData();
    dataKey.append("key", this.key);
    this.http
      .post(`${environment.apiUrl}OnHand/searchDrug`, dataKey)
      .toPromise()
      .then((val: any) => {
        // console.log(val);
        this.listINV = val["result"];
        // console.log(this.listINV);
        this.dataINV = new MatTableDataSource(this.listINV);
        this.dataINV.sort = this.sortINV;
        this.dataINV.paginator = this.paginatorINV;
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

  // public selectDrug = async (data: any) => {
  //   // console.log(data);
  //   // this.detailINV = [];
  //   this.selectDrugName = data["drugName"];

  //   this.selectedRowIndex = data["indexrow"];
  //   // let drugData = new FormData();
  //   // drugData.append("drugCode", data["drugCode"]);
  //   // drugData.append("depCode", data["depCode"]);
  //   // this.http
  //   //   .post(`${environment.apiUrl}selectINVS`, drugData)
  //   //   .toPromise()
  //   //   .then((val: any) => {
  //   //     // console.log(val);
  //   //     this.detailINV = val["result"];
  //   //     // console.log(this.detailINV);
  //   //     this.dataSelectINVS = new MatTableDataSource(this.detailINV);
  //   //     this.dataSelectINVS.sort = this.sortSelectINV;
  //   //     this.dataSelectINVS.paginator = this.paginatorSelectINV;
  //   //   })
  //   //   .catch((reason) => {
  //   //     console.log(reason);
  //   //     this.services.alert(
  //   //       "error",
  //   //       "ไม่สามารถเชื่อมต่อกับเซิฟเวอร์ได้",
  //   //       "โปรดติดต่อผู้ดูแลระบบ"
  //   //     );
  //   //   })
  //   //   .finally(() => {});
  //   this.AllLot.forEach((ei, i) => {
  //     if (
  //       this.AllLot[i]["depCode"] == data["depCode"] &&
  //       this.AllLot[i]["drugCode"] == data["drugCode"]
  //     ) {
  //       this.detailINV.push(this.AllLot[i]);
  //     }
  //   });
  //   this.dataSelectINVS = new MatTableDataSource(this.detailINV);
  //   this.dataSelectINVS.sort = this.sortSelectINV;
  //   this.dataSelectINVS.paginator = this.paginatorSelectINV;
  // };
}
