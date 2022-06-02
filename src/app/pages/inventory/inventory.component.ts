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

const _window: any = window;

@Component({
  selector: "app-inventory",
  templateUrl: "./inventory.component.html",
  styleUrls: ["./inventory.component.scss"],
})
export class InventoryComponent implements OnInit {
  @ViewChild("myAddfile") myAddfile!: ElementRef;
  @ViewChild("tableRefillSE") tableRefillSE!: ElementRef;
  @ViewChild("tableRefillMan") tableRefillMan!: ElementRef;
  @ViewChild("tableDrugNotMatch") tableDrugNotMatch!: ElementRef;

  public id: any;
  public dep: any;
  public file: any;
  public fileName: any;
  public arrayBuffer: any;
  public selectDrugName: any;

  public selectExcel: any = "allday";
  public selectEMS: any = "all";
  public fileDate: any;
  public expEMS: any;
  public iM: any;
  public amount: any;

  public inputDrug: boolean = false;
  public inputExcel: boolean = false;
  public showHistory: boolean = false;
  // public checkAppointSE: boolean = false;
  // public checkFinish: boolean = false;

  public listINVCode: Array<any> = [];
  public drugNotMatch: Array<any> = [];
  public drugNotOnhand: Array<any> = [];
  public appointSE: Array<any> = [];
  public refillSE: Array<any> = [];
  public refillManual: Array<any> = [];
  public listStaff: Array<any> = [];
  public listdeviceAllDrug: Array<any> = [];

  @ViewChild("closebutton1") closebutton1: any;
  @ViewChild("closebutton2") closebutton2: any;

  public listINV: Array<any> = [];
  public dataINV: any = null;
  @ViewChild("sortINV") sortINV!: MatSort;
  @ViewChild("paginatorINV") paginatorINV!: MatPaginator;
  public selectedRowIndex: any;
  public displayedINV: string[] = [
    "drugCode",
    "drugName",
    "PACK_RATIO",
    "amount",
  ];

  public listEMS: Array<any> = [];
  public dataEMS: any = null;
  @ViewChild("sortEMS") sortEMS!: MatSort;
  @ViewChild("paginatorEMS") paginatorEMS!: MatPaginator;
  public displayedEMS: string[] = [
    "drugCode",
    "drugName",
    "LOT_NO",
    "amount",
    "option",
  ];

  public detailINV: Array<any> = [];
  public dataSelectINVS: any = null;
  @ViewChild("sortSelectINV") sortSelectINV!: MatSort;
  @ViewChild("paginatorSelectINV") paginatorSelectINV!: MatPaginator;
  public displaySelectINVS: string[] = ["LOT_NO", "EXP_Date", "amount"];

  public listAllDrug: Array<any> = [];
  public dataAllDrug: any = null;
  @ViewChild("sortAlldrug") sortAlldrug!: MatSort;
  @ViewChild("paginatorAllDrug") paginatorAllDrug!: MatPaginator;
  public displayAllDrug: string[] = [
    "invCode",
    "drugCode",
    "drugName",
    "PACK_RATIO",
    "dform",
    "option",
  ];

  public filelist: Array<any> = [];
  public dataFile: any = null;
  @ViewChild("sortFile") sortFile!: MatSort;
  @ViewChild("paginatorFile") paginatorFile!: MatPaginator;
  public displayedFile: string[] = [
    "drugName",
    "REQU_QTY",
    // "DISP_QTY",
    // "STK_Event",
    "LOT_NO",
    "EXP_Date",
  ];

  public listINVNo: Array<any> = [];
  public selectINVNo: Array<any> = [];
  public dataINVno: any = null;
  @ViewChild("sortINVno") sortINVno!: MatSort;
  @ViewChild("paginatorINVno") paginatorINVno!: MatPaginator;
  public displayedINVno: string[] = [
    "inv_no",
    "userName",
    "date",
    "time",
    "select",
  ];

  public listOneDay: Array<any> = [];
  public groupOneDay: Array<any> = [];

  public listDetialINV: Array<any> = [];
  public dataDetialINV: any = null;
  @ViewChild("sortDetialINV") sortDetialINV!: MatSort;
  @ViewChild("paginatorDetialINV") paginatorDetialINV!: MatPaginator;
  public displayedDispno: string[] = ["disp_name", "date", "time", "select"];

  public INVFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataINV.filter = filterValue.trim().toLowerCase();
  }

  public EMSFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataEMS.filter = filterValue.trim().toLowerCase();
  }

  public formpDrug = new FormGroup({
    depCode: new FormControl("", [Validators.required]),
    drugCode: new FormControl("", [Validators.required]),
    drugName: new FormControl("", [Validators.required]),
    PACK_RATIO: new FormControl("", [Validators.required]),
    LOT_NO: new FormControl("", [Validators.required]),
    LOT_Old: new FormControl("", [Validators.required]),
    EXP_Date: new FormControl("", [Validators.required]),
    amount: new FormControl("", [Validators.required]),
  });

  constructor(
    public services: AppService,
    private http: HttpClient,
    private spinner: NgxSpinnerService
  ) {
    this.dep = sessionStorage.getItem("dep");
    this.id = sessionStorage.getItem("id");
  }

  ngOnInit(): void {
    sessionStorage.setItem("selectPage", "Inventory");
    this.getINV();
    this.getEMS();
    this.getINVCode();
    this.getInvNo();
    this.deviceAllDrug();
    // this.getDispNo();
  }

  public getINV = async () => {
    this.listINV = [];
    this.dataINV = [];
    let depData = new FormData();
    depData.append("depCode", this.dep);
    this.http
      .post(`${environment.apiUrl}listINV`, depData)
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
      .finally(() => {
        if (this.listINV.length > 0) {
          this.selectDrug(this.listINV[0]);
        }
      });
  };

  public getEMS = async () => {
    this.listEMS = [];
    this.dataEMS = [];
    // console.log(this.dep);
    let depData = new FormData();
    depData.append("depCode", this.dep);
    this.http
      .post(`${environment.apiUrl}listEMS`, depData)
      .toPromise()
      .then((val: any) => {
        // console.log(val);
        this.listEMS = val["result"];
        // console.log(this.listEMS);
        this.dataEMS = new MatTableDataSource(this.listEMS);
        this.dataEMS.sort = this.sortEMS;
        this.dataEMS.paginator = this.paginatorEMS;
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
        // if (this.listINV.length > 0) {
        //   this.selectDrug(this.listINV[0]);
        // }
      });
  };

  public selectDrug = async (data: any) => {
    // console.log(data);
    this.selectedRowIndex = data["indexrow"];
    this.selectDrugName = data["drugName"];
    let drugData = new FormData();
    drugData.append("drugCode", data["drugCode"]);
    drugData.append("depCode", this.dep);
    // drugData.forEach((value, key) => {
    //   console.log(key + ' : ' + value);
    // });
    this.http
      .post(`${environment.apiUrl}selectINVS`, drugData)
      .toPromise()
      .then((val: any) => {
        // console.log(val);
        this.detailINV = val["result"];
        // console.log(this.detailINV);
        this.dataSelectINVS = new MatTableDataSource(this.detailINV);
        this.dataSelectINVS.sort = this.sortSelectINV;
        this.dataSelectINVS.paginator = this.paginatorSelectINV;
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

  public showAllDrug = async () => {
    this.inputDrug = true;
  };

  public deviceAllDrug = async () => {
    this.listdeviceAllDrug = [];
    this.http
      .get(`${environment.apiUrl}deviceAllDrug`)
      .toPromise()
      .then((val: any) => {
        if (val["rowCount"] > 0) {
          // console.log(val);
          this.listdeviceAllDrug = val["result"];
          // console.log(this.listdeviceAllDrug);
        }
      })
      .catch((reason) => {
        console.log(reason);
        this.services.alert("error", "ไม่สามารถเขื่อมต่อเชิฟเวอร์ได้", "");
      })
      .finally(() => {});
  };

  public getINVCode = async () => {
    this.listINVCode = [];
    this.dataAllDrug = [];
    this.http
      .get(`${environment.apiUrl}getINVCode`)
      .toPromise()
      .then((val: any) => {
        if (val["rowCount"] > 0) {
          // console.log(val);
          this.listINVCode = val["result"];
          // console.log(this.listINVCode);
          this.dataAllDrug = new MatTableDataSource(this.listINVCode);
          this.dataAllDrug.sort = this.sortAlldrug;
          this.dataAllDrug.paginator = this.paginatorAllDrug;
        }
      })
      .catch((reason) => {
        console.log(reason);
        this.services.alert("error", "ไม่สามารถเขื่อมต่อเชิฟเวอร์ได้", "");
      })
      .finally(() => {});
  };

  public getAppointSE = async () => {
    this.appointSE = [];
    let dataDate = new FormData();
    dataDate.append("keyDate", this.fileDate);
    this.http
      .post(`${environment.apiUrl}appointSE`, dataDate)
      .toPromise()
      .then((val: any) => {
        // console.log(val);
        this.appointSE = val["result"];
        // console.log(this.appointSE);
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
        // this.checkAppointSE = true;
      });
  };

  public drugFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataAllDrug.filter = filterValue.trim().toLowerCase();
  }

  public clearInputDrug = async () => {
    this.inputDrug = false;
    this.showHistory = false;
  };

  public formAmountUpdate = async (data: any) => {
    // console.log(data);
    this.formpDrug.patchValue({
      depCode: this.dep,
      drugCode: data["drugCode"],
      drugName: data["drugName"],
      PACK_RATIO: data["PACK_RATIO"],
      LOT_NO: data["LOT_NO"],
      LOT_Old: data["LOT_NO"],
      EXP_Date: data["EXP_Date"],
      amount: data["amount"],
    });
  };

  public updateLOT = async () => {
    // console.log(this.formpDrug.value);
    if (this.formpDrug.value.LOT_NO != null) {
      if (this.formpDrug.value.EXP_Date != null) {
        const momentDate = new Date(this.formpDrug.value.EXP_Date);
        const formattedDate = moment(momentDate).format("YYYY-MM-DD");
        if (this.formpDrug.value.amount != null) {
          this.services
            .confirm(
              "warning",
              "ยึนยันการบันทึกข้อมูล",
              this.formpDrug.value.drugName +
                " Lot. NO : " +
                this.formpDrug.value.LOT_NO +
                " EXP. Date : " +
                formattedDate +
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
                drugData.append("LOT_Old", this.formpDrug.value.LOT_Old);
                drugData.append("EXP_Date", formattedDate);
                drugData.append("PACK_RATIO", this.formpDrug.value.PACK_RATIO);
                drugData.append("amount", this.formpDrug.value.amount);
                // drugData.forEach((value, key) => {
                //   console.log(key + " : " + value);
                // });
                this.http
                  .post(`${environment.apiUrl}delEmsLot`, drugData)
                  .toPromise()
                  .then((val: any) => {
                    this.services.alert("success", "บันทึกข้อมูลสำเร็จ");
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
                    this.getEMS();
                    this.closebutton1.nativeElement.click();
                  });
                this.http
                  .post(`${environment.apiUrl}updateINVS`, drugData)
                  .toPromise()
                  .then((val: any) => {
                    this.services.alert("success", "บันทึกข้อมูลสำเร็จ");
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
                    this.getINV();
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

  public clearInputExcel = async () => {
    this.inputExcel = false;
    this.file = [];
    this.arrayBuffer = [];
    this.fileName = [];
    this.filelist = [];
    this.dataFile = [];
    this.myAddfile.nativeElement.value = "";
    this.showHistory = false;
    this.listDetialINV = [];
    this.dataDetialINV = [];
    this.refillSE = [];
    this.refillManual = [];
  };

  // อ่านไฟล์ Excel
  public addfile(event: any) {
    // this.checkAppointSE = false;
    this.inputExcel = true;
    this.file = [];
    this.arrayBuffer = [];
    this.fileName = [];
    this.filelist = [];
    this.dataFile = [];
    this.listOneDay = [];
    this.groupOneDay = [];
    this.file = event.target.files[0];
    // console.log(this.file.name);
    let fileReader = new FileReader();
    fileReader.readAsArrayBuffer(this.file);
    fileReader.onload = (e) => {
      this.arrayBuffer = fileReader.result;
      var data = new Uint8Array(this.arrayBuffer);
      var arr = new Array();
      var arraylist = new Array();
      for (var i = 0; i != data.length; ++i)
        arr[i] = String.fromCharCode(data[i]);
      var bstr = arr.join("");
      var workbook = XLSX.read(bstr, { type: "binary" });
      var first_sheet_name = workbook.SheetNames[0];
      var worksheet = workbook.Sheets[first_sheet_name];
      arraylist = XLSX.utils.sheet_to_json(worksheet, { raw: true });
      this.fileName = this.file.name.split("_")[1];
      this.fileName = this.fileName.split(".")[0];
      // console.log(this.fileName);
      this.fileDate = parseInt("25" + this.fileName.substr(0, 2)) - 543;
      this.fileDate =
        this.fileDate.toString() +
        "-" +
        this.fileName.substr(2, 2) +
        "-" +
        this.fileName.substr(4, 2);
      this.expEMS = parseInt("25" + this.fileName.substr(0, 2)) - 542;
      this.expEMS =
        this.expEMS.toString() +
        "-" +
        this.fileName.substr(2, 2) +
        "-" +
        this.fileName.substr(4, 2);
      // console.log(this.expEMS);
      this.getAppointSE();
      for (let i = 0; i < arraylist.length; i++) {
        let fileData = {
          INV_Code: arraylist[i]["รหัส"],
          drugName: arraylist[i]["ชื่อสามัญ/ชื่อการค้า"],
          drugCode: null,
          amount: parseInt(arraylist[i]["จน.ขอ x pack"].split(" ")[0]),
          PACK_RATIO: arraylist[i]["จน.ขอ x pack"].split(" ")[2],
          REQU_QTY: arraylist[i]["จน.ขอ x pack"],
          DISP_QTY: arraylist[i]["จน.จ่าย x pack"],
          STK_Event: arraylist[i]["คงคลังปัจจุบัน"],
          LOT_NO: arraylist[i]["Lot no."],
          EXP_Date: arraylist[i]["วันที่หมดอายุ"],
          price: arraylist[i]["ราคา"],
          value: arraylist[i]["มูลค่า"],
        };
        this.filelist.push(fileData);
      }
      // console.log(this.filelist);
      this.dataFile = new MatTableDataSource(this.filelist);
      this.dataFile.sort = this.sortFile;
      this.dataFile.paginator = this.paginatorFile;
      // เรียกใช้ฟังก์ชัน จับคู่โค้ด inv
      this.matchCode();
    };
  }

  // นำเข้าข้อมูลไฟล์ Excel
  public submitINV = async () => {
    this.drugNotMatch = [];
    let checkNo = "f";
    this.services
      .confirm("warning", "ยึนยันการบันทึกข้อมูล ?", "เลขที่ " + this.fileName)
      .then((val: any) => {
        if (val) {
          // เช็คเลขที่ใบเบิกในระบบ
          for (let i = 0; i < this.listINVNo.length; i++) {
            if (this.listINVNo[i]["inv_no"] == this.fileName) {
              checkNo = "t";
            }
          }
          if (checkNo == "f") {
            // insert -> INVNo
            let invData = new FormData();
            invData.append("inv_no", this.fileName);
            invData.append("dep", this.dep);
            invData.append("id", this.id);
            this.http
              .post(`${environment.apiUrl}insertINVNo`, invData)
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
            this.iM = 0;
            this.amount = [];
            let plus: any;
            for (let i = 0; i < this.filelist.length; i++) {
              // set ข้อมูล inv
              let invDetailData = new FormData();
              invDetailData.append("SUB_PO_NO", this.fileName);
              invDetailData.append("depCode", this.dep);
              invDetailData.append("INV_Code", this.filelist[i]["INV_Code"]);
              invDetailData.append("drugCode", this.filelist[i]["drugCode"]);
              invDetailData.append("drugName", this.filelist[i]["drugName"]);
              this.amount = this.filelist[i]["REQU_QTY"];
              let x = parseInt(this.amount.split(" ")[0]);
              let y = parseInt(this.amount.split(" ")[2]);
              this.amount = x * y;
              if (this.filelist[i]["REQU_QTY"].indexOf("+") > 0) {
                plus = this.filelist[i]["REQU_QTY"];
                plus = plus.split("+")[1];
                plus = plus.split(")")[0];
                plus = parseInt(plus);
                this.amount = this.amount + plus;
              }
              invDetailData.append("amount", this.amount);
              invDetailData.append("REQU_QTY", this.filelist[i]["REQU_QTY"]);
              invDetailData.append("DISP_QTY", this.filelist[i]["DISP_QTY"]);
              if (this.filelist[i]["LOT_NO"] == "-") {
                this.filelist[i]["LOT_NO"] = "EMS-" + this.fileName;
                this.filelist[i]["EXP_Date"] = this.expEMS;
              }
              invDetailData.append("LOT_NO", this.filelist[i]["LOT_NO"]);
              invDetailData.append("EXP_Date", this.filelist[i]["EXP_Date"]);
              invDetailData.append(
                "PACK_RATIO",
                this.filelist[i]["PACK_RATIO"]
              );
              invDetailData.append("STK_Event", this.filelist[i]["STK_Event"]);
              invDetailData.append("price", this.filelist[i]["price"]);
              invDetailData.append("value", this.filelist[i]["value"]);
              invDetailData.append("createDate", this.fileDate);
              // invDetailData.forEach((value, key) => {
              //   console.log(key + " : " + value);
              // });

              // inser -> INVDetail
              this.http
                .post(`${environment.apiUrl}insertINVdetail`, invDetailData)
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

              // เช็คโค้ดที่จับคู่ไม่ได้
              if (this.filelist[i]["drugCode"] == null) {
                this.drugNotMatch.push(this.filelist[i]);
              } else {
                //update -> INVS
                this.http
                  .post(`${environment.apiUrl}updateINVS`, invDetailData)
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
                    this.closebutton1.nativeElement.click();
                  });
                // เช็คการเบิก
                if (this.selectExcel == "allday") {
                  if (this.dep == "W8") {
                    this.matchRefill(this.filelist[i], this.amount);
                  }
                } else {
                  // ดึงตำแหน่งของยา
                  const qty = this.amount / this.filelist[i]["PACK_RATIO"];
                  let arrDurg: Array<any> = [];
                  let dataDrug = new FormData();
                  dataDrug.append("drugCode", this.filelist[i]["drugCode"]);
                  this.http
                    .post(`${environment.apiUrl}drugLocations`, dataDrug)
                    .toPromise()
                    .then((val: any) => {
                      // console.log(val);
                      if (val["rowCount"] > 0) {
                        arrDurg = val["result"];
                        for (let j = 0; j < arrDurg.length; j++) {
                          let data = {
                            drugCode: arrDurg[j]["drugCode"],
                            drugName: arrDurg[j]["drugName"],
                            deviceCode: arrDurg[j]["deviceCode"],
                            deviceName: arrDurg[j]["deviceName"],
                            active: arrDurg[j]["active"],
                            amount: qty,
                            LOT_NO: this.filelist[i]["LOT_NO"],
                            EXP_Date: this.filelist[i]["EXP_Date"],
                          };
                          this.listOneDay.push(data);
                          this.setOneDay(data);
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
                      // console.log(this.listOneDay);
                    });
                }
              }
            }

            // console.log(this.filelist.length*20);
            let m = this.filelist.length * 30;

            if (this.selectExcel == "allday") {
              this.spinner.show();
              setTimeout(() => {
                this.spinner.hide();
                this.services.alert("success", "นำเข้าข้อมูลสำเร็จ");
                if (this.dep == "W8") {
                  if (this.refillSE.length > 0) {
                    this.exporRefillSE();
                  }
                  if (this.refillManual.length > 0) {
                    this.exporRefillMan();
                  }
                }
                if (this.drugNotMatch.length > 0) {
                  this.exporDrugNotMatch();
                }
                this.getINV();
                this.getInvNo();
                this.clearInputExcel();
              }, m);
            } else {
              if (this.dep == "W8") {
                _window.$(`#listOneDay`).modal("show");
              } else {
                this.spinner.show();
                setTimeout(() => {
                  this.spinner.hide();
                  this.services.alert("success", "นำเข้าข้อมูลสำเร็จ");
                  if (this.drugNotMatch.length > 0) {
                    this.exporDrugNotMatch();
                  }
                  this.getINV();
                  this.getInvNo();
                  this.clearInputExcel();
                }, m);
              }
            }
          } else {
            this.services.alert("warning", "มีการบันทึกข้อมูลนี้แล้ว", "");
          }
        }
      });
  };

  public matchRefill = async (arrfilelist: any, amount: any) => {
    let total = amount / arrfilelist["PACK_RATIO"];
    let checkLot = arrfilelist["LOT_NO"];
    let checkEXP = arrfilelist["EXP_Date"];
    // เติม SE
    for (let j = 0; j < this.appointSE.length; j++) {
      if (arrfilelist["drugCode"] == this.appointSE[j]["drugCode"]) {
        if (this.appointSE[j]["amount"] > total) {
          this.appointSE[j]["amount"] = total;
          total = 0;
        } else {
          total -= this.appointSE[j]["amount"];
        }
        let data = {
          drugCode: this.appointSE[j]["drugCode"],
          drugName: this.appointSE[j]["drugName"],
          amount: this.appointSE[j]["amount"],
          lot: arrfilelist["LOT_NO"],
          exp: arrfilelist["EXP_Date"],
        };
        this.refillSE.push(data);
        // update -> SE-Stock
        let dataSE = new FormData();
        dataSE.append("drugCode", this.appointSE[j]["drugCode"]);
        dataSE.append("LOT_NO", data.lot);
        dataSE.append("EXP_Date", data.exp);
        dataSE.append("Quantity", this.appointSE[j]["amount"]);
        // dataSE.forEach((value, key) => {
        //   console.log(key + " : " + value);
        // });
        this.http
          .post(`${environment.apiUrl}updateXMedStock`, dataSE)
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
    // เติม Manual
    let checkMannual: boolean = false;
    for (let k = 0; k < this.listdeviceAllDrug.length; k++) {
      if (checkMannual == false) {
        if (arrfilelist["drugCode"] == this.listdeviceAllDrug[k]["drugCode"]) {
          // console.log(this.listdeviceAllDrug[k]);
          checkMannual = true;
          if (total > 0) {
            let data = {
              staffCode: "",
              staffName: "",
              drugCode: arrfilelist["drugCode"],
              drugName: arrfilelist["drugName"],
              lot: checkLot,
              exp: checkEXP,
              pack: arrfilelist["PACK_RATIO"],
              amount: total,
              device: this.listdeviceAllDrug[k]["deviceCode"],
              position: this.listdeviceAllDrug[k]["positionID"],
            };
            this.refillManual.push(data);
            // console.log(this.refillManual);
            // match staff
            this.listStaff = [];
            let devideData = new FormData();
            devideData.append(
              "deviceCode",
              this.listdeviceAllDrug[k]["deviceCode"]
            );
            this.http
              .post(`${environment.apiUrl}deviceStaff`, devideData)
              .toPromise()
              .then((val: any) => {
                // console.log(val);
                this.listStaff = val["result"];
                // console.log(this.listStaff);
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
                this.refillManual[this.iM]["device"] =
                  this.listStaff[0]["deviceName"];
                for (let m = 0; m < this.listStaff.length; m++) {
                  let codeST = this.listStaff[m]["staff"];
                  let nameST = this.listStaff[m]["staffName"];
                  this.refillManual[this.iM]["staffCode"] += codeST;
                  this.refillManual[this.iM]["staffName"] += nameST;
                  if (this.listStaff.length > m + 1) {
                    this.refillManual[this.iM]["staffCode"] += ", ";
                    this.refillManual[this.iM]["staffName"] += ", ";
                  }
                }
                // console.log(this.refillManual[iM]);
                this.iM++;
                let sortStaff = this.refillManual.sort((a, b) =>
                  parseInt(a.staffCode.split(",")[0].substr(1)) <
                  parseInt(b.staffCode.split(",")[0].substr(1))
                    ? -1
                    : 1
                );
                this.refillManual = [];
                this.refillManual = sortStaff;
              });
          }
        }
      }
    }
  };

  public setOneDay = async (data: any) => {
    let check = "f";
    if (this.groupOneDay.length > 0) {
      for (let i = 0; i < this.groupOneDay.length; i++) {
        if (data.drugCode == this.groupOneDay[i]["drugCode"]) {
          check = "t";
        }
      }
      if (check == "f") {
        this.groupOneDay.push(data);
      }
    } else {
      this.groupOneDay.push(data);
    }
  };

  public changeActive = async (data: any) => {
    for (let i = 0; i < this.listOneDay.length; i++) {
      if (data.drugCode == this.listOneDay[i]["drugCode"]) {
        if (data.deviceCode == this.listOneDay[i]["deviceCode"]) {
          this.listOneDay[i]["active"] = 1;
        } else {
          this.listOneDay[i]["active"] = 0;
        }
      }
    }
  };

  public submitOneDay = async () => {
    console.log(this.listOneDay);
    for (let i = 0; i < this.listOneDay.length; i++) {
      if (this.listOneDay[i]["active"] > 0) {
        if (this.listOneDay[i]["deviceCode"] == "Xmed1") {
          let data = {
            drugCode: this.listOneDay[i]["drugCode"],
            drugName: this.listOneDay[i]["drugName"],
            amount: this.listOneDay[i]["amount"],
            lot: this.listOneDay[i]["LOT_NO"],
            exp: this.listOneDay[i]["EXP_Date"],
          };
          this.refillSE.push(data);
          // update -> SE-Stock
          let dataSE = new FormData();
          dataSE.append("drugCode", this.listOneDay[i]["drugCode"]);
          dataSE.append("LOT_NO", this.listOneDay[i]["LOT_NO"]);
          dataSE.append("EXP_Date", this.listOneDay[i]["EXP_Date"]);
          dataSE.append("Quantity", this.listOneDay[i]["amount"]);
          // dataSE.forEach((value, key) => {
          //   console.log(key + " : " + value);
          // });
          this.http
            .post(`${environment.apiUrl}updateXMedStock`, dataSE)
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
        } else {
          let checkMannual: boolean = false;
          for (let k = 0; k < this.listdeviceAllDrug.length; k++) {
            if (checkMannual == false) {
              if (
                this.listOneDay[i]["drugCode"] ==
                this.listdeviceAllDrug[k]["drugCode"]
              ) {
                checkMannual = true;
                let data = {
                  staffCode: "",
                  staffName: "",
                  drugCode: this.listOneDay[i]["drugCode"],
                  drugName: this.listOneDay[i]["drugName"],
                  lot: this.listOneDay[i]["LOT_NO"],
                  exp: this.listOneDay[i]["EXP_Date"],
                  amount: this.listOneDay[i]["amount"],
                  device: this.listdeviceAllDrug[k]["deviceCode"],
                  position: this.listdeviceAllDrug[k]["positionID"],
                };
                this.refillManual.push(data);
                this.listStaff = [];
                let devideData = new FormData();
                devideData.append(
                  "deviceCode",
                  this.listdeviceAllDrug[k]["deviceCode"]
                );
                this.http
                  .post(`${environment.apiUrl}deviceStaff`, devideData)
                  .toPromise()
                  .then((val: any) => {
                    // console.log(val);
                    this.listStaff = val["result"];
                    // console.log(this.listStaff);
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
                    this.refillManual[this.iM]["device"] =
                      this.listStaff[0]["deviceName"];
                    for (let m = 0; m < this.listStaff.length; m++) {
                      let codeST = this.listStaff[m]["staff"];
                      let nameST = this.listStaff[m]["staffName"];
                      this.refillManual[this.iM]["staffCode"] += codeST;
                      this.refillManual[this.iM]["staffName"] += nameST;
                      if (this.listStaff.length > m + 1) {
                        this.refillManual[this.iM]["staffCode"] += ", ";
                        this.refillManual[this.iM]["staffName"] += ", ";
                      }
                    }
                    // console.log(this.refillManual[iM]);
                    this.iM++;
                    let sortStaff = this.refillManual.sort((a, b) =>
                      parseInt(a.staffCode.split(",")[0].substr(1)) <
                      parseInt(b.staffCode.split(",")[0].substr(1))
                        ? -1
                        : 1
                    );
                    this.refillManual = [];
                    this.refillManual = sortStaff;
                  });
              }
            }
          }
        }
      }
    }
    _window.$(`#listOneDay`).modal("hide");
    let m = this.listOneDay.length * 30;
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
      this.services.alert("success", "นำเข้าข้อมูลสำเร็จ");
      if (this.refillSE.length > 0) {
        this.exporRefillSE();
      }
      if (this.refillManual.length > 0) {
        this.exporRefillMan();
      }
      if (this.drugNotMatch.length > 0) {
        this.exporDrugNotMatch();
      }
      this.getINV();
      this.getInvNo();
      this.clearInputExcel();
    }, m);
  };

  public matchCode = async () => {
    for (let i = 0; i < this.filelist.length; i++) {
      for (let j = 0; j < this.listINVCode.length; j++) {
        if (this.filelist[i]["INV_Code"] == this.listINVCode[j]["invCode"]) {
          // console.log(this.listINVCode[j]["invCode"]);
          this.filelist[i]["drugCode"] = this.listINVCode[j]["drugCode"];
          // this.filelist[i]["PACK_RATIO"] = this.listINVCode[j]["PACK_RATIO"];
        }
      }
    }
  };

  public selectInput(e: any) {
    if (this.selectExcel != e.target.value) {
      this.clearInputExcel();
    }
    // console.log(e.target.value);
    this.selectExcel = e.target.value;
  }

  public selectShowDrug(e: any) {
    // console.log(e.target.value);
    this.selectEMS = e.target.value;
  }

  public getInvNo = async () => {
    this.listINVNo = [];
    this.selectINVNo = [];
    this.dataINVno = [];
    // let depData = new FormData();
    // depData.append("dep", this.dep);
    this.http
      .get(`${environment.apiUrl}getINVNo`)
      .toPromise()
      .then((val: any) => {
        if (val["rowCount"] > 0) {
          // console.log(val);
          this.listINVNo = val["result"];
          // console.log(this.listINVNo);
          for (let i = 0; i < this.listINVNo.length; i++) {
            if (this.listINVNo[i]["depCode"] == this.dep) {
              this.selectINVNo.push(this.listINVNo[i]);
            }
          }
          // console.log(this.selectINVNo);
          this.dataINVno = new MatTableDataSource(this.selectINVNo);
          this.dataINVno.sort = this.sortINVno;
          this.dataINVno.paginator = this.paginatorINVno;
        }
      })
      .catch((reason) => {
        console.log(reason);
        this.services.alert("error", "ไม่สามารถเขื่อมต่อเชิฟเวอร์ได้", "");
      })
      .finally(() => {});
  };

  public submitAmount = async () => {
    // console.log(this.formpDrug.value);
    if (this.formpDrug.value.amount == null) {
      this.services.alert("warning", "กรุณาใส่ จำนวน", "");
    } else {
      this.services
        .confirm(
          "warning",
          "ยึนยันการแก้ไขจำนวน ?",
          this.formpDrug.value.drugName +
            " ( LOT : " +
            this.formpDrug.value.LOT_NO +
            ") จำนวน : " +
            this.formpDrug.value.amount
        )
        .then((val: any) => {
          if (val) {
            let editLotData = new FormData();
            editLotData.append("depCode", this.dep);
            editLotData.append("drugCode", this.formpDrug.value.drugCode);
            editLotData.append("LOT_NO", this.formpDrug.value.LOT_NO);
            editLotData.append("EXP_Date", this.formpDrug.value.EXP_Date);
            editLotData.append("amount", this.formpDrug.value.amount);
            this.http
              .post(`${environment.apiUrl}updateLOT`, editLotData)
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
                this.services.alert("success", "แก้ไชจำนวนสำเร็จ", "");
                this.closebutton2.nativeElement.click();
                this.getINV();
              });
          }
        });
    }
  };

  public viewDetialINV = async (data: any) => {
    this.showHistory = true;
    this.listDetialINV = [];
    this.dataDetialINV = [];
    // console.log(data);
    let invData = new FormData();
    invData.append("inv_no", data.inv_no);
    this.http
      .post(`${environment.apiUrl}selectINVNo`, invData)
      .toPromise()
      .then((val: any) => {
        // console.log(val);
        this.listDetialINV = val["result"];
        // console.log(this.listDetialINV);
        this.dataDetialINV = new MatTableDataSource(this.listDetialINV);
        this.dataDetialINV.sort = this.sortDetialINV;
        this.dataDetialINV.paginator = this.paginatorDetialINV;
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

  public editAmount = async (data: any) => {
    // console.log(data);
    this.formpDrug.patchValue({
      drugCode: data["drugCode"],
      drugName: data["drugName"],
      LOT_NO: data["LOT_NO"],
      EXP_Date: data["EXP_Date"],
      amount: data["amount"],
    });
  };

  public exporRefillSE = async () => {
    // console.log(this.fileName);
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(
      this.tableRefillSE.nativeElement
    );
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, this.fileName);
    /* save to file */
    XLSX.writeFile(wb, "รายการเติมยา_SE-MED_" + this.fileName + ".xlsx");
  };

  public exporRefillMan = async () => {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(
      this.tableRefillMan.nativeElement
    );
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, this.fileName);
    /* save to file */
    XLSX.writeFile(wb, "รายการเติมยา_จนท._" + this.fileName + ".xlsx");
  };

  public exporDrugNotMatch = async () => {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(
      this.tableDrugNotMatch.nativeElement
    );
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, this.fileName);
    /* save to file */
    XLSX.writeFile(wb, "รายการยานำเข้าไม่สำเร็จ_" + this.fileName + ".xlsx");
  };
}
