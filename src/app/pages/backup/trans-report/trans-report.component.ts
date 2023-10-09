import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { AppService } from "src/app/services/app.service";
import { HttpClient } from "@angular/common/http";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { environment } from "src/environments/environment";
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";
import * as moment from "moment";
import { DateAdapter } from "@angular/material/core";
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: "app-trans-report",
  templateUrl: "./trans-report.component.html",
  styleUrls: ["./trans-report.component.scss"],
})
export class TransReportComponent implements OnInit {
  public startDate: any = null;
  public endDate: any = null;
  public idenName: any = null;

  public listTranf: Array<any> = [];
  public dataTarnf: any = null;
  @ViewChild("sortTranf") sortTranf!: MatSort;
  @ViewChild("paginTranf") paginTranf!: MatPaginator;
  public displayTranf: string[] = [
    "createDate",
    "nameFrom",
    "nameTo",
    "drugName",
    "amount",
    "userName",
  ];

  public listIden: Array<any> = [];
  public dataIden: any = null;
  @ViewChild("sortIden") sortIden!: MatSort;
  @ViewChild("paginatorIden") paginatorIden!: MatPaginator;
  public displayedIden: string[] = [
    // "indexrow",
    "userName",
    "qty",
    "option",
  ];

  public allDetial: Array<any> = [];
  public dataDetial: any = null;
  public DetialLength: any = null;
  @ViewChild("sortDetial") sortDetial!: MatSort;
  @ViewChild("paginatorDetial") paginatorDetial!: MatPaginator;
  public displayedDetial: string[] = [
    // "indexrow",
    "createDate",
    "drugName",
    "amount",
    // "miniUnit",
    "dep_from",
    "dep_to",
  ];

  constructor(public services: AppService, private http: HttpClient,private spinner: NgxSpinnerService,) {
    this.startDate = moment(this.campaignOne.value.start).format("YYYY-MM-DD");
    this.endDate = moment(this.campaignOne.value.end).format("YYYY-MM-DD");
  }

  ngOnInit(): void {
    this.transReport();
    this.spinner.show();
  }

  public reportFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataTarnf.filter = filterValue.trim().toLowerCase();
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
    this.transReport();
  }

  public transReport = async () => {
    // this.listIden = [];
    // this.dataIden = [];
    // this.idenName = [];
    // this.dataDetial = [];
    // this.DetialLength = 0;
    this.listTranf = [];
    this.dataTarnf = [];
    let formData = new FormData();
    formData.append("startDate", this.startDate);
    formData.append("endDate", this.endDate);
    // this.http
    //   .post(`${environment.apiUrl}OnHand/idenReport`, formData)
    //   .toPromise()
    //   .then((val: any) => {
    //     // console.log(val);
    //     if (val["rowCount"] > 0) {
    //       this.listIden = val["result"];
    //       this.allDetial = val["detial"];
    //       // console.log(this.allDetial);
    //       this.dataIden = new MatTableDataSource(this.listIden);
    //       this.dataIden.sort = this.sortIden;
    //       this.dataIden.paginator = this.paginatorIden;
    //     }
    //   })
    //   .catch((reason) => {
    //     console.log(reason);
    //     this.services.alert(
    //       "error",
    //       "ไม่สามารถเชื่อมต่อกับเซิฟเวอร์ได้",
    //       "โปรดติดต่อผู้ดูแลระบบ"
    //     );
    //   })
    //   .finally(() => {
    //     this.viewDetial(this.listIden[0]);
    //   });
    this.http
      .post(`${environment.apiUrl}tranReport`, formData)
      .toPromise()
      .then((val: any) => {
        // console.log(val);
        if (val["rowCount"] > 0) {
          this.listTranf = val["result"];
          // console.log(this.listTranf);
          this.dataTarnf = new MatTableDataSource(this.listTranf);
          this.dataTarnf.sort = this.sortTranf;
          this.dataTarnf.paginator = this.paginTranf;
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
        this.spinner.hide();
      });
  };

  public viewDetial = async (data: any) => {
    // console.log(data);
    this.idenName = data.userName;
    let arr: Array<any> = [];
    this.allDetial.forEach((ei, i) => {
      if (this.allDetial[i]["iden"] == data.iden) {
        arr.push(this.allDetial[i]);
        this.DetialLength++;
      }
    });
    this.dataDetial = new MatTableDataSource(arr);
    this.dataDetial.sort = this.sortDetial;
    this.dataDetial.paginator = this.paginatorDetial;
  };
}
