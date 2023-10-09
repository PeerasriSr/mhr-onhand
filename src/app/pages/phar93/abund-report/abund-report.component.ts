import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { AppService } from "src/app/services/app.service";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { MatSort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import * as moment from "moment";

const _window: any = window;

@Component({
  selector: "app-abund-report",
  templateUrl: "./abund-report.component.html",
  styleUrls: ["./abund-report.component.scss"],
})
export class AbundReportComponent implements OnInit {
  @ViewChild("swiperHN") swiperHN!: ElementRef;

  public startDateAll: any = null;
  public endDateAll: any = null;

  public startDateDoc: any = null;
  public endDateDoc: any = null;

  public startDateDep: any = null;
  public endDateDep: any = null;

  public startDateMed: any = null;
  public endDateMed: any = null;

  public today = new Date();
  public patientNo: any;
  public patientName: any;
  public patientAge: any;

  public sumItem: any = 0;
  public sumCost: any = 0;

  public listPatient: Array<any> = [];
  public dataPatient: any = null;
  @ViewChild("sortPatient") sortPatient!: MatSort;
  @ViewChild("paginatorPatient") paginatorPatient!: MatPaginator;
  public displayPatient: string[] = [
    "indexrow",
    "patientNo",
    "patientName",
    "patientAge",
    "option",
  ];

  public listAll: Array<any> = [];
  public dataAll: any = null;
  @ViewChild("sortAll") sortAll!: MatSort;
  @ViewChild("paginatorAll") paginatorAll!: MatPaginator;
  public displayAll: string[] = [
    "vDate",
    "patientNo",
    "patientName",
    "patientSex",
    "age",
    "patientAdd",
    "patientRight",
    "drugName",
    "amount",
    "reasonName",
    "docName",
    "deptEn",
    "phar",
  ];

  public listCost: Array<any> = [];
  public dataCost: any = null;
  @ViewChild("sortCost") sortCost!: MatSort;
  @ViewChild("paginatorCost") paginatorCost!: MatPaginator;
  public displayCost: string[] = [
    "indexrow",
    "Vdate",
    "numItem",
    "cost",
    "option",
  ];

  public listDocc: Array<any> = [];
  public docCode: any;
  public docName: any;
  public listDocReport: Array<any> = [];
  public dataDocReport: any = null;
  @ViewChild("sortDocReport") sortDocReport!: MatSort;
  @ViewChild("paginatorDocReport") paginatorDocReport!: MatPaginator;
  public displayDocReport: string[] = [
    "vDate",
    "patientNo",
    "patientName",
    "patientDB",
    "item",
    "amount",
    "cost",
    "option",
  ];
  public docItem: any = 0;
  public docCost: any = 0;
  public docAmount: any = 0;

  public listDept: Array<any> = [];
  public deptCode: any;
  public deptCodePhar: any;
  public deptName: any;
  public deptNamePhar: any;

  public listDeptReport: Array<any> = [];
  public dataDeptReport: any = null;
  @ViewChild("sortDeptReport") sortDeptReport!: MatSort;
  @ViewChild("paginatorDeptReport") paginatorDeptReport!: MatPaginator;
  public displayDeptReport: string[] = [
    "vDate",
    "docName",
    "item",
    "amount",
    "cost",
    "option",
  ];
  public deptItem: any = 0;
  public deptCost: any = 0;
  public deptAmount: any = 0;

  public listPharReport: Array<any> = [];
  public dataPharReport: any = null;
  @ViewChild("sortPharReport") sortPharReport!: MatSort;
  @ViewChild("paginatorPharReport") paginatorPharReport!: MatPaginator;
  public displayPharReport: string[] = [
    "userName",
    "item",
    "amount",
    "cost",
    "option",
  ];
  public pharItem: any = 0;
  public pharCost: any = 0;
  public pharAmount: any = 0;

  public listMedReport: Array<any> = [];
  public dataMedReport: any = null;
  @ViewChild("sortMedReport") sortMedReport!: MatSort;
  @ViewChild("paginatorMedReport") paginatorMedReport!: MatPaginator;
  public displayMedReport: string[] = [
    "indexrow",
    "drugName",
    "amount",
    "cost",
  ];

  public medCost: any = 0;
  public medAmount: any = 0;

  public listDetail: Array<any> = [];
  public dataDetail: any = null;
  @ViewChild("sortDetail") sortDetail!: MatSort;
  @ViewChild("paginatorDetail") paginatorDetail!: MatPaginator;
  public displayedDetail: string[] = ["drugName", "amount", "cost"];

  constructor(public services: AppService, private http: HttpClient) {
    this.startDateAll =
      (
        parseInt(moment(this.campaignAll.value.start).format("YYYY")) + 543
      ).toString() + moment(this.campaignAll.value.start).format("MMDD");
    this.endDateAll =
      (
        parseInt(moment(this.campaignAll.value.end).format("YYYY")) + 543
      ).toString() + moment(this.campaignAll.value.end).format("MMDD");

    this.startDateDoc =
      (
        parseInt(moment(this.campaignDoc.value.start).format("YYYY")) + 543
      ).toString() + moment(this.campaignDoc.value.start).format("MMDD");
    this.endDateDoc =
      (
        parseInt(moment(this.campaignDoc.value.end).format("YYYY")) + 543
      ).toString() + moment(this.campaignDoc.value.end).format("MMDD");

    this.startDateDep =
      (
        parseInt(moment(this.campaignDep.value.start).format("YYYY")) + 543
      ).toString() + moment(this.campaignDep.value.start).format("MMDD");
    this.endDateDep =
      (
        parseInt(moment(this.campaignDep.value.end).format("YYYY")) + 543
      ).toString() + moment(this.campaignDep.value.end).format("MMDD");

    this.startDateMed =
      (
        parseInt(moment(this.campaignMed.value.start).format("YYYY")) + 543
      ).toString() + moment(this.campaignMed.value.start).format("MMDD");
    this.endDateMed =
      (
        parseInt(moment(this.campaignMed.value.end).format("YYYY")) + 543
      ).toString() + moment(this.campaignMed.value.end).format("MMDD");
  }

  ngOnInit(): void {
    this.reportAll();
    this.getDocc();
    this.getDept();
    this.reportMed();
  }

  public campaignAll = new FormGroup({
    start: new FormControl(new Date()),
    end: new FormControl(new Date()),
  });

  public campaignDoc = new FormGroup({
    start: new FormControl(new Date()),
    end: new FormControl(new Date()),
  });

  public campaignDep = new FormGroup({
    start: new FormControl(new Date()),
    end: new FormControl(new Date()),
  });

  public campaignMed = new FormGroup({
    start: new FormControl(new Date()),
    end: new FormControl(new Date()),
  });

  public startChangeAll(event: any) {
    const momentDate = new Date(event.value);
    this.startDateAll =
      (parseInt(moment(momentDate).format("YYYY")) + 543).toString() +
      moment(momentDate).format("MMDD");
  }
  public async endChangeAll(event: any) {
    const momentDate = new Date(event.value);
    this.endDateAll =
      (parseInt(moment(momentDate).format("YYYY")) + 543).toString() +
      moment(momentDate).format("MMDD");
    this.reportAll();
  }

  public startChangeDoc(event: any) {
    const momentDate = new Date(event.value);
    this.startDateDoc =
      (parseInt(moment(momentDate).format("YYYY")) + 543).toString() +
      moment(momentDate).format("MMDD");
  }
  public async endChangeDoc(event: any) {
    const momentDate = new Date(event.value);
    this.endDateDoc =
      (parseInt(moment(momentDate).format("YYYY")) + 543).toString() +
      moment(momentDate).format("MMDD");
    this.reportDocc();
  }

  public startChangeDep(event: any) {
    const momentDate = new Date(event.value);
    this.startDateDep =
      (parseInt(moment(momentDate).format("YYYY")) + 543).toString() +
      moment(momentDate).format("MMDD");
  }
  public async endChangeDep(event: any) {
    const momentDate = new Date(event.value);
    this.endDateDep =
      (parseInt(moment(momentDate).format("YYYY")) + 543).toString() +
      moment(momentDate).format("MMDD");
    this.reportDept();
  }

  public startChangeMed(event: any) {
    const momentDate = new Date(event.value);
    this.startDateMed =
      (parseInt(moment(momentDate).format("YYYY")) + 543).toString() +
      moment(momentDate).format("MMDD");
  }
  public async endChangeMed(event: any) {
    const momentDate = new Date(event.value);
    this.endDateMed =
      (parseInt(moment(momentDate).format("YYYY")) + 543).toString() +
      moment(momentDate).format("MMDD");
    this.reportMed();
  }

  public getPatient = async (data: any) => {
    // console.log(data)
    if (data) {
      this.listPatient = [];
      this.dataPatient = [];
      let key = new FormData();
      key.append("key", data);
      this.http
        .post(`${environment.apiUrl}OnHand/getPatient`, key)
        .toPromise()
        .then((val: any) => {
          // console.log(val);
          if (val["rowCount"] > 0) {
            this.listPatient = val["result"];
            this.listPatient.forEach((ei, i) => {
              let t = this.listPatient[i]["patientDB"];
              this.listPatient[i]["patientAge"] =
                this.today.getFullYear() - (parseInt(t.substr(0, 4)) - 543);
            });
          }
        })
        .catch((reason) => {
          console.log(reason);
          this.services.alert("error", "ไม่สามารถเขื่อมต่อเชิฟเวอร์ได้", "");
        })
        .finally(() => {
          // console.log(this.listPatient);
          this.dataPatient = new MatTableDataSource(this.listPatient);
          this.dataPatient.sort = this.sortPatient;
          this.dataPatient.paginator = this.paginatorPatient;
        });
    }
  };

  public refesh = async () => {
    this.listPatient = [];
    this.dataPatient = [];
    this.clear();
  };

  public clear = async () => {
    this.listCost = [];
    this.dataCost = [];
    this.patientNo = [];
    this.patientName = [];
    this.patientAge = [];
    this.sumItem = 0;
    this.sumCost = 0;
  };

  public getCost = async (data: any) => {
    // console.log(data);
    this.listCost = [];
    this.dataCost = [];
    this.patientNo = data.patientNo;
    this.patientName = data.patientName;
    this.patientAge = data.patientAge;
    let hn = new FormData();
    hn.append("hn", String(data.patientNo.padStart(7, " ")));
    this.http
      .post(`${environment.apiUrl}OnHand/getCost`, hn)
      .toPromise()
      .then((val: any) => {
        // console.log(val);
        if (val["rowCount"] > 0) {
          this.listCost = val["result"];
          this.listCost.forEach((ei, i) => {
            let t = this.listCost[i]["patientVD"];
            this.listCost[i]["Vdate"] =
              t.substr(6, 2) + "/" + t.substr(4, 2) + "/" + t.substr(0, 4);
            this.sumItem += parseInt(this.listCost[i]["numItem"]);
            this.sumCost =
              parseFloat(this.sumCost) + parseFloat(this.listCost[i]["cost"]);
          });
        }
      })
      .catch((reason) => {
        console.log(reason);
        this.services.alert("error", "ไม่สามารถเขื่อมต่อเชิฟเวอร์ได้", "");
      })
      .finally(() => {
        this.sumCost = this.sumCost.toLocaleString("en-US", {
          maximumFractionDigits: 2,
        });
        this.dataCost = new MatTableDataSource(this.listCost);
        this.dataCost.sort = this.sortCost;
        this.dataCost.paginator = this.paginatorCost;
      });
  };

  public getDocc = async () => {
    this.listDocc = [];
    this.http
      .get(`${environment.apiUrl}OnHand/getDocc`)
      .toPromise()
      .then((val: any) => {
        // console.log(val);
        if (val["rowCount"] > 0) {
          this.listDocc = val["result"];
          // console.log(this.listDocc);
          this.docCode = this.listDocc[0]["docCode"];
          this.docName = this.listDocc[0]["docCode"];
        }
      })
      .catch((reason) => {
        console.log(reason);
        this.services.alert("error", "ไม่สามารถเขื่อมต่อเชิฟเวอร์ได้", "");
      })
      .finally(() => {
        this.reportDocc();
      });
  };

  public reportAll = async () => {
    this.listAll = [];
    this.dataAll = [];
    let data = new FormData();
    data.append("startDate", this.startDateAll);
    data.append("endDate", this.endDateAll);
    this.http
      .post(`${environment.apiUrl}OnHand/reportAll`, data)
      .toPromise()
      .then((val: any) => {
        // console.log(val);
        if (val["rowCount"] > 0) {
          this.listAll = val["result"];
          // console.log(this.listAll)
          this.listAll.forEach((ei, i) => {
            this.dateTH(this.listAll[i]["patientVD"]).then(
              (data) => (this.listAll[i]["vDate"] = data)
            );
            let age = this.listAll[i]["patientDB"];
            this.listAll[i]["age"] =
              this.today.getFullYear() - (parseInt(age.substr(0, 4)) - 543);
          });
        }
      })
      .catch((reason) => {
        console.log(reason);
        this.services.alert("error", "ไม่สามารถเขื่อมต่อเชิฟเวอร์ได้", "");
      })
      .finally(() => {
        this.dataAll = new MatTableDataSource(this.listAll);
        this.dataAll.sort = this.sortAll;
        this.dataAll.paginator = this.paginatorAll;
      });
  };

  public reportDocc = async () => {
    // console.log(this.docCode)
    this.docItem = 0;
    this.docCost = 0;
    this.docAmount = 0;
    this.listDocReport = [];
    this.dataDocReport = [];
    let data = new FormData();
    data.append("startDate", this.startDateDoc);
    data.append("endDate", this.endDateDoc);
    data.append("docCode", String(this.docCode.padStart(6, " ")));
    // data.forEach((value, key) => {
    //   console.log(key + " : " + value);
    // });
    this.http
      .post(`${environment.apiUrl}OnHand/reportDocter`, data)
      .toPromise()
      .then((val: any) => {
        // console.log(val);
        if (val["rowCount"] > 0) {
          this.listDocReport = val["result"];
          // console.log(this.listDocReport)
          this.listDocReport.forEach((ei, i) => {
            this.dateTH(this.listDocReport[i]["patientVD"]).then(
              (data) => (this.listDocReport[i]["vDate"] = data)
            );
            this.calAge(this.listDocReport[i]["patientDB"]).then(
              (data) => (this.listDocReport[i]["patientDB"] = data)
            );
            this.docItem += parseInt(this.listDocReport[i]["item"]);
            this.docCost =
              parseFloat(this.docCost) +
              parseFloat(this.listDocReport[i]["cost"]);
            this.docAmount =
              parseInt(this.docAmount) +
              parseInt(this.listDocReport[i]["amount"]);
          });
        }
      })
      .catch((reason) => {
        console.log(reason);
        this.services.alert("error", "ไม่สามารถเขื่อมต่อเชิฟเวอร์ได้", "");
      })
      .finally(() => {
        this.docItem = this.docItem.toLocaleString("en-US", {
          maximumFractionDigits: 2,
        });
        this.docCost = this.docCost.toLocaleString("en-US", {
          maximumFractionDigits: 2,
        });
        this.docAmount = this.docAmount.toLocaleString("en-US", {
          maximumFractionDigits: 2,
        });
        this.dataDocReport = new MatTableDataSource(this.listDocReport);
        this.dataDocReport.sort = this.sortDocReport;
        this.dataDocReport.paginator = this.paginatorDocReport;
      });
  };

  public selectDocc(e: any) {
    // console.log(e.target.value);
    let str = e.target.value;
    // console.log(str.split(",")[0]);
    this.docCode = str.split(",")[0];
    this.docName = str.split(",")[1];
    this.reportDocc();
  }

  public getDept = async () => {
    this.listDept = [];
    this.http
      .get(`${environment.apiUrl}OnHand/getDept`)
      .toPromise()
      .then((val: any) => {
        // console.log(val);
        if (val["rowCount"] > 0) {
          this.listDept = val["result"];
          // console.log(this.listDept);
          this.deptCode = this.listDept[0]["deptCode"];
          this.deptCodePhar = this.listDept[0]["deptCode"];
          this.deptName = this.listDept[0]["deptEn"];
          this.deptNamePhar = this.listDept[0]["deptEn"];
        }
      })
      .catch((reason) => {
        console.log(reason);
        this.services.alert("error", "ไม่สามารถเขื่อมต่อเชิฟเวอร์ได้", "");
      })
      .finally(() => {
        this.reportDept();
        this.reportPhar();
      });
  };

  public reportDept = async () => {
    // console.log(this.deptCode);
    this.deptItem = 0;
    this.deptCost = 0;
    this.deptAmount = 0;
    this.listDeptReport = [];
    this.dataDeptReport = [];
    let data = new FormData();
    data.append("startDate", this.startDateDep);
    data.append("endDate", this.endDateDep);
    data.append("deptCode", this.deptCode);
    this.http
      .post(`${environment.apiUrl}OnHand/reportClinic`, data)
      .toPromise()
      .then((val: any) => {
        // console.log(val);
        if (val["rowCount"] > 0) {
          this.listDeptReport = val["result"];
          // console.log(this.listDeptReport)
          this.listDeptReport.forEach((ei, i) => {
            this.dateTH(this.listDeptReport[i]["patientVD"]).then(
              (data) => (this.listDeptReport[i]["vDate"] = data)
            );
            this.deptItem += parseInt(this.listDeptReport[i]["item"]);
            this.deptCost =
              parseFloat(this.deptCost) +
              parseFloat(this.listDeptReport[i]["cost"]);
            this.deptAmount =
              parseInt(this.deptAmount) +
              parseInt(this.listDeptReport[i]["amount"]);
          });
        }
      })
      .catch((reason) => {
        console.log(reason);
        this.services.alert("error", "ไม่สามารถเขื่อมต่อเชิฟเวอร์ได้", "");
      })
      .finally(() => {
        this.deptItem = this.deptItem.toLocaleString("en-US", {
          maximumFractionDigits: 2,
        });
        this.deptCost = this.deptCost.toLocaleString("en-US", {
          maximumFractionDigits: 2,
        });
        this.deptAmount = this.deptAmount.toLocaleString("en-US", {
          maximumFractionDigits: 2,
        });
        this.dataDeptReport = new MatTableDataSource(this.listDeptReport);
        this.dataDeptReport.sort = this.sortDeptReport;
        this.dataDeptReport.paginator = this.paginatorDeptReport;
      });
  };

  public selectDept(e: any) {
    // console.log(e.target.value);
    let str = e.target.value;
    // console.log(str.split(",")[0]);
    this.deptCode = str.split(",")[0];
    this.deptName = str.split(",")[1];
    this.reportDept();
  }

  public selectDeptPhar(e: any) {
    // console.log(e.target.value);
    let str = e.target.value;
    // console.log(str.split(",")[0]);
    this.deptCodePhar = str.split(",")[0];
    this.deptNamePhar = str.split(",")[1];
    this.reportPhar();
  }

  public dateTH = async (data: any) => {
    // console.log(data)
    let t = data;
    return t.substr(6, 2) + "/" + t.substr(4, 2) + "/" + t.substr(0, 4);
  };

  public calAge = async (data: any) => {
    let t = data;
    return this.today.getFullYear() - (parseInt(t.substr(0, 4)) - 543);
  };

  public viewDetail = async (data: any) => {
    // console.log(data);
    this.listDetail = [];
    this.dataDetail = [];
    let hn;
    if (data.patientNo) {
      hn = String(data.patientNo.padStart(7, " "));
    } else {
      hn = String(this.patientNo.padStart(7, " "));
    }
    let d1 = new FormData();
    d1.append("patientNo", hn);
    d1.append("patientVD", data.patientVD);
    // d1.forEach((value, key) => {
    //   console.log(key + ":" + value);
    // });
    this.http
      .post(`${environment.apiUrl}OnHand/detailCost`, d1)
      .toPromise()
      .then((val: any) => {
        // console.log(val);
        if (val["rowCount"] > 0) {
          this.listDetail = val["result"];
          _window.$(`#orderDetialModal`).modal("show");
        }
      })
      .catch((reason) => {
        console.log(reason);
        this.services.alert("error", "ไม่สามารถเขื่อมต่อเชิฟเวอร์ได้", "");
      })
      .finally(() => {
        this.dataDetail = new MatTableDataSource(this.listDetail);
        this.dataDetail.sort = this.sortDetail;
        this.dataDetail.paginator = this.paginatorDetail;
      });
  };

  public viewDept = async (data: any) => {
    // console.log(data)
    this.listDetail = [];
    this.dataDetail = [];
    let d1 = new FormData();
    d1.append("docCode", data.docCode);
    d1.append("patientVD", data.patientVD);
    d1.append("deptCode", this.deptCode);
    this.http
      .post(`${environment.apiUrl}OnHand/detailDeptCost`, d1)
      .toPromise()
      .then((val: any) => {
        // console.log(val);s
        if (val["rowCount"] > 0) {
          this.listDetail = val["result"];
          _window.$(`#orderDetialModal`).modal("show");
        }
      })
      .catch((reason) => {
        console.log(reason);
        this.services.alert("error", "ไม่สามารถเขื่อมต่อเชิฟเวอร์ได้", "");
      })
      .finally(() => {
        this.dataDetail = new MatTableDataSource(this.listDetail);
        this.dataDetail.sort = this.sortDetail;
        this.dataDetail.paginator = this.paginatorDetail;
      });
  };

  public reportMed = async () => {
    this.medCost = 0;
    this.medAmount = 0;
    this.listMedReport = [];
    this.dataMedReport = [];
    let data = new FormData();
    data.append("startDate", this.startDateMed);
    data.append("endDate", this.endDateMed);
    this.http
      .post(`${environment.apiUrl}OnHand/reportMed`, data)
      .toPromise()
      .then((val: any) => {
        // console.log(val);
        if (val["rowCount"] > 0) {
          this.listMedReport = val["result"];
          // console.log(this.listMedReport);
          this.listMedReport.forEach((ei, i) => {
            this.medCost =
              parseFloat(this.medCost) +
              parseFloat(this.listMedReport[i]["cost"]);
            this.medAmount =
              parseInt(this.medAmount) +
              parseInt(this.listMedReport[i]["amount"]);
          });
        }
      })
      .catch((reason) => {
        console.log(reason);
        this.services.alert("error", "ไม่สามารถเขื่อมต่อเชิฟเวอร์ได้", "");
      })
      .finally(() => {
        this.medCost = this.medCost.toLocaleString("en-US", {
          maximumFractionDigits: 2,
        });
        this.medAmount = this.medAmount.toLocaleString("en-US", {
          maximumFractionDigits: 2,
        });
        this.dataMedReport = new MatTableDataSource(this.listMedReport);
        this.dataMedReport.sort = this.sortMedReport;
        this.dataMedReport.paginator = this.paginatorMedReport;
      });
  };

  public reportPhar = async () => {
    // console.log(this.deptCodePhar)
    this.pharItem = 0;
    this.pharCost = 0;
    this.pharAmount = 0;
    this.listPharReport = [];
    this.dataPharReport = [];
    let deptCode = new FormData();
    deptCode.append("deptCode", this.deptCodePhar);
    this.http
      .post(`${environment.apiUrl}OnHand/reportPhar`, deptCode)
      .toPromise()
      .then((val: any) => {
        // console.log(val);
        if (val["rowCount"] > 0) {
          this.listPharReport = val["result"];
          // console.log(this.listPharReport)
          this.listPharReport.forEach((ei, i) => {
            this.pharItem += parseInt(this.listPharReport[i]["item"]);
            this.pharCost =
              parseFloat(this.pharCost) +
              parseFloat(this.listPharReport[i]["cost"]);
            this.pharAmount =
              parseInt(this.pharAmount) +
              parseInt(this.listPharReport[i]["amount"]);
          });
        }
      })
      .catch((reason) => {
        console.log(reason);
        this.services.alert("error", "ไม่สามารถเขื่อมต่อเชิฟเวอร์ได้", "");
      })
      .finally(() => {
        this.pharItem = this.pharItem.toLocaleString("en-US", {
          maximumFractionDigits: 2,
        });
        this.pharCost = this.pharCost.toLocaleString("en-US", {
          maximumFractionDigits: 2,
        });
        this.pharAmount = this.pharAmount.toLocaleString("en-US", {
          maximumFractionDigits: 2,
        });
        this.dataPharReport = new MatTableDataSource(this.listPharReport);
        this.dataPharReport.sort = this.sortPharReport;
        this.dataPharReport.paginator = this.paginatorPharReport;
      });
  };

  public pharDetial = async (data: any) => {
    // console.log(data);
    this.listDetail = [];
    this.dataDetail = [];
    let d1 = new FormData();
    d1.append("deptCode", data.deptCode);
    d1.append("pharCode", data.pharCode);
    this.http
      .post(`${environment.apiUrl}OnHand/reportPharDetail`, d1)
      .toPromise()
      .then((val: any) => {
        // console.log(val);s
        if (val["rowCount"] > 0) {
          this.listDetail = val["result"];
          _window.$(`#orderDetialModal`).modal("show");
        }
      })
      .catch((reason) => {
        console.log(reason);
        this.services.alert("error", "ไม่สามารถเขื่อมต่อเชิฟเวอร์ได้", "");
      })
      .finally(() => {
        this.dataDetail = new MatTableDataSource(this.listDetail);
        this.dataDetail.sort = this.sortDetail;
        this.dataDetail.paginator = this.paginatorDetail;
      });
  };
}
