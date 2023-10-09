import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { AppService } from "src/app/services/app.service";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { MatSort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";

@Component({
  selector: "app-abundant",
  templateUrl: "./abundant.component.html",
  styleUrls: ["./abundant.component.scss"],
})
export class AbundantComponent implements OnInit {
  @ViewChild("swiperHN") swiperHN!: ElementRef;

  public id: any;
  public dep: any;

  public patientNo: any;
  public patientName: any;
  public patientSex: any;
  public patientAdd: any;
  public patientRig: any;
  public patientBD: any;
  public patientAge: any;
  public patientVD: any;
  public patientVN: any;
  public visitDate: any;
  public docCode: any;
  public deptCode: any;
  public pharCode: any;
  public today = new Date();

  public listDocc: Array<any> = [];
  public listDept: Array<any> = [];
  public listPhar: Array<any> = [];
  public listReason: Array<any> = [];

  public listVN: Array<any> = [];
  public dataVN: any = null;
  @ViewChild("sortNV") sortNV!: MatSort;
  @ViewChild("paginatorVN") paginatorVN!: MatPaginator;
  public displayVN: string[] = ["VN", "VD", "option"];

  public showVNDrug: boolean = false;
  public listVnDrug: Array<any> = [];
  public dataVnDrug: any = null;
  @ViewChild("paginatorVnDrug") paginatorVnDrug!: MatPaginator;
  public displayVnDrug: string[] = [
    "drugName",
    "orderqty",
    "refund",
    "unit",
    "reason",
  ];

  public selectDrug: Array<any> = [];
  public dataSelectDrug: any = null;
  @ViewChild("paginatorSelectDrug") paginatorSelectDrug!: MatPaginator;
  public displaySelectDrug: string[] = ["drugName", "amount", "option"];

  public showAllDrug: boolean = false;
  public listAllDrug: Array<any> = [];
  public dataAllDrug: any = null;
  @ViewChild("sortAlldrug") sortAlldrug!: MatSort;
  @ViewChild("paginatorAllDrug") paginatorAllDrug!: MatPaginator;
  public displayAllDrug: string[] = ["drugName", "option"];

  constructor(public services: AppService, private http: HttpClient) {
    this.id = sessionStorage.getItem("id");
    this.dep = sessionStorage.getItem("dep");
  }

  ngOnInit(): void {
    this.getAllDrug();
    this.getDocc();
    this.getDept();
    this.getPhar();
    this.getReason();
    setTimeout(() => {
      this.swiperHN.nativeElement.focus();
    }, 500);
  }

  public sendHN = async (data: any) => {
    if (data) {
      this.refesh();
      // console.log(data);
      this.listVN = [];
      this.patientNo = [];
      this.patientName = [];
      this.patientSex = [];
      this.patientAdd = [];
      this.patientRig = [];
      this.patientBD = [];
      this.patientAge = [];
      let hn = String(data.padStart(7, " "));
      let fData = new FormData();
      fData.append("hn", hn);
      this.http
        .post(`${environment.apiUrl}OnHand/getVN`, fData)
        .toPromise()
        .then((val: any) => {
          // console.log(val);
          if (val["rowCount"] > 0) {
            this.listVN = val["result"];
            // console.log(this.listVN);
            this.patientNo = this.listVN[0]["hn"];
            this.patientName =
              this.listVN[0]["titleName"] +
              " " +
              this.listVN[0]["firstName"] +
              " " +
              this.listVN[0]["lastName"];
            this.patientSex = this.listVN[0]["sex"];
            this.patientAdd = this.listVN[0]["address"];
            this.patientRig = this.listVN[0]["rightname"];
            let t = this.listVN[0]["birthDay"];
            this.patientBD =
              t.substr(6, 2) + "/" + t.substr(4, 2) + "/" + t.substr(0, 4);
            this.patientAge =
              this.today.getFullYear() - (parseInt(t.substr(0, 4)) - 543);
            this.listVN.forEach((ei, i) => {
              let x = this.listVN[i]["visitDate"];
              this.listVN[i]["visitDate"] =
                x.substr(6, 2) + "/" + x.substr(4, 2) + "/" + x.substr(0, 4);
            });
            this.vdCheck();
            this.dataVN = new MatTableDataSource(this.listVN);
            this.dataVN.sort = this.sortNV;
            this.dataVN.paginator = this.paginatorVN;
            // this.http
            //   .post(`${environment.apiUrl}OnHand/checkVnCard`, hn)
            //   .toPromise()
            //   .then((val: any) => {
            //     // console.log(val);
            //     if (val["rowCount"] > 0) {
            //       checkVN = val["result"];
            //       this.listVN.forEach((ei, i) => {
            //         checkVN.forEach((ej, j) => {
            //           if (this.listVN[i]["vn"] == checkVN[j]["patientVN"]) {
            //             this.listVN[i]["vd_check"] = 1;
            //           }
            //         });
            //       });
            //     }
            //   })
            //   .catch((reason) => {
            //     console.log(reason);
            //     this.services.alert(
            //       "error",
            //       "ไม่สามารถเขื่อมต่อเชิฟเวอร์ได้",
            //       ""
            //     );
            //   })
            //   .finally(() => {});
          } else {
            this.services.alertTimer("warning", "ไม่พบข้อมูลคนไข้", "");
          }
        })
        .catch((reason) => {
          console.log(reason);
          this.services.alert("error", "ไม่สามารถเขื่อมต่อเชิฟเวอร์ได้", "");
        })
        .finally(() => {});
    }
  };

  public vdCheck = async () => {
    let fData = new FormData();
    fData.append("hn", this.patientNo);
    let checkVN: Array<any> = [];
    this.http
      .post(`${environment.apiUrl}OnHand/checkVnCard`, fData)
      .toPromise()
      .then((val: any) => {
        // console.log(val);
        if (val["rowCount"] > 0) {
          checkVN = val["result"];
          this.listVN.forEach((ei, i) => {
            checkVN.forEach((ej, j) => {
              if (this.listVN[i]["vn"] == checkVN[j]["patientVN"]) {
                this.listVN[i]["vd_check"] = 1;
              }
            });
          });
        }
      })
      .catch((reason) => {
        console.log(reason);
        this.services.alert("error", "ไม่สามารถเขื่อมต่อเชิฟเวอร์ได้", "");
      })
      .finally(() => {});
  };

  public sendVN = async (data: any) => {
    // console.log(data);
    this.showVNDrug = true;
    this.listVnDrug = [];
    this.dataVnDrug = [];
    this.visitDate = data.visitDate;
    this.patientVD = data.vd;
    this.patientVN = data.vn;
    let patient = new FormData();
    patient.append("hn", String(data.hn.padStart(7, " ")));
    patient.append("vd", data.vd);
    // patient.forEach((value, key) => {
    //   console.log(key + " : " + value);
    // });
    this.http
      .post(`${environment.apiUrl}OnHand/getVnDrug`, patient)
      .toPromise()
      .then((val: any) => {
        // console.log(val);
        if (val["rowCount"] > 0) {
          this.listVnDrug = val["result"];
          this.listVnDrug.forEach((ei, i) => {
            this.listVnDrug[i]["reason"] = this.listReason[0]["reasonCode"];
          });
          this.dataVnDrug = new MatTableDataSource(this.listVnDrug);
          this.dataVnDrug.paginator = this.paginatorVnDrug;
        } else {
          // this.services.alert(
          //   "warning",
          //   "ไม่พบข้อมูลการสั่งยาของวันที่ท่านเลือก",
          //   ""
          // );
        }
      })
      .catch((reason) => {
        console.log(reason);
        this.services.alert("error", "ไม่สามารถเขื่อมต่อเชิฟเวอร์ได้", "");
      })
      .finally(() => {});
  };

  public refesh = async () => {
    this.listVN = [];
    this.patientNo = [];
    this.patientName = [];
    this.patientSex = [];
    this.patientAdd = [];
    this.patientRig = [];
    this.patientBD = [];
    this.patientAge = [];
    this.clear();
  };

  public clear = async () => {
    this.showVNDrug = false;
    this.listVnDrug = [];
    this.visitDate = [];
    this.dataVnDrug = [];
    this.selectDrug = [];
    this.dataSelectDrug = [];
    this.patientVD = [];
    this.patientVN = [];
    this.getAllDrug();
    this.getDocc();
    this.getDept();
    this.getPhar();
    this.showAllDrug = false;
  };

  public switchAllDrug = async () => {
    this.showAllDrug = !this.showAllDrug;
    // console.log(this.showAllDrug);
  };

  public getAllDrug = async () => {
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
            let bool: boolean = false;
            this.listAllDrug.forEach((ei, i) => {
              this.listAllDrug[i]["chooses"] = bool;
            });
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
      .finally(() => {});
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
        }
      })
      .catch((reason) => {
        console.log(reason);
        this.services.alert("error", "ไม่สามารถเขื่อมต่อเชิฟเวอร์ได้", "");
      })
      .finally(() => {});
  };

  public getPhar = async () => {
    this.listPhar = [];
    this.http
      .get(`${environment.apiUrl}OnHand/getPhar93`)
      .toPromise()
      .then((val: any) => {
        // console.log(val);
        if (val["rowCount"] > 0) {
          this.listPhar = val["result"];
          // console.log(this.listDocc);
        }
      })
      .catch((reason) => {
        console.log(reason);
        this.services.alert("error", "ไม่สามารถเขื่อมต่อเชิฟเวอร์ได้", "");
      })
      .finally(() => {});
  };

  public selectDocc(e: any) {
    // console.log(e.target.value);
    this.docCode = e.target.value;
    // this.docCode = String(e.target.value.padStart(6, " "));
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
        }
      })
      .catch((reason) => {
        console.log(reason);
        this.services.alert("error", "ไม่สามารถเขื่อมต่อเชิฟเวอร์ได้", "");
      })
      .finally(() => {});
  };

  public selectDept(e: any) {
    // console.log(e.target.value);
    this.deptCode = e.target.value;
  }

  public selectPhar(e: any) {
    // console.log(e.target.value);
    this.pharCode = e.target.value;
  }

  public getReason = async () => {
    this.listReason = [];
    this.http
      .get(`${environment.apiUrl}OnHand/getReason`)
      .toPromise()
      .then((val: any) => {
        // console.log(val);
        if (val["rowCount"] > 0) {
          this.listReason = val["result"];
          // console.log(this.listReason);
        }
      })
      .catch((reason) => {
        console.log(reason);
        this.services.alert("error", "ไม่สามารถเขื่อมต่อเชิฟเวอร์ได้", "");
      })
      .finally(() => {});
  };

  public selectReason(e: any, i: any) {
    // console.log(e.target.value);
    // console.log(i);
    this.listVnDrug[i]["reason"] = e.target.value;
  }

  public drugFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataAllDrug.filter = filterValue.toLowerCase();
  }

  public submitVnDrug = async () => {
    let cardNo: any = [];
    console.log(this.docCode);
    console.log(this.deptCode);
    this.services
      .confirm("warning", "ยืนยันการบันทึกข้อมูล ?", "")
      .then((val: any) => {
        if (val) {
          let card = new FormData();
          card.append("patientNo", this.patientNo);
          card.append("patientName", this.patientName);
          card.append("patientVD", this.patientVD);
          card.append("patientVN", this.patientVN);
          card.append("docCode", this.docCode);
          card.append("deptCode", this.deptCode);
          card.append("marker", this.id);
          this.http
            .post(`${environment.apiUrl}OnHand/insertPatient`, card)
            .toPromise()
            .then((val: any) => {
              // console.log(val);
            })
            .catch((reason) => {
              console.log(reason);
              this.services.alert(
                "error",
                "ไม่สามารถเขื่อมต่อเชิฟเวอร์ได้",
                ""
              );
            })
            .finally(() => {
              for (let i = 0; i < this.selectDrug.length; i++) {
                let detail = new FormData();
                detail.append("cardNo", cardNo);
                detail.append("drugCode", this.selectDrug[i]["drugCode"]);
                detail.append("amount", this.selectDrug[i]["amount"]);
                this.http
                  .post(`${environment.apiUrl}OnHand/insertABDdetail`, detail)
                  .toPromise()
                  .then((val: any) => {
                    // console.log(val);
                  })
                  .catch((reason) => {
                    console.log(reason);
                    this.services.alert(
                      "error",
                      "ไม่สามารถเขื่อมต่อเชิฟเวอร์ได้",
                      ""
                    );
                  })
                  .finally(() => {});
                if (i == this.selectDrug.length - 1) {
                  this.services.alertTimer("success", "บันทึกข้อมูลสำเร็จ");
                  this.clear();
                }
              }
            });
        }
      });
  };

  public submitAbundant = async () => {
    if (this.docCode) {
      if (this.deptCode) {
        if (this.pharCode) {
          let num = 0;
          this.listVnDrug.forEach((ei, i) => {
            if (this.listVnDrug[i]["refund"] > 0) {
              num++;
            }
          });
          if (num > 0) {
            this.services
              .confirm(
                "warning",
                "ยืนยันการบันทึกข้อมูล ?",
                "ทั้งหมด " + num + " รายการ"
              )
              .then((val: any) => {
                if (val) {
                  // console.log(this.listVnDrug);
                  let cardNo: any = [];
                  let card = new FormData();
                  card.append("patientNo", this.patientNo);
                  card.append("patientName", this.patientName);
                  card.append("patientBD", this.listVN[0]["birthDay"]);
                  card.append("patientVD", this.patientVD);
                  card.append("patientVN", this.patientVN);
                  card.append("patientSex", this.patientSex);
                  card.append("patientAdd", this.patientAdd);
                  card.append("patientRight", this.patientRig);
                  card.append("docCode", this.docCode);
                  card.append("deptCode", this.deptCode);
                  card.append("pharCode", this.pharCode);
                  card.append("marker", this.id);

                  // card.forEach((value, key) => {
                  //   console.log(key + " : " + value);
                  // });
                  this.http
                    .post(`${environment.apiUrl}OnHand/insertPatient`, card)
                    .toPromise()
                    .then((val: any) => {
                      // console.log(val);
                    })
                    .catch((reason) => {
                      console.log(reason);
                      this.services.alert(
                        "error",
                        "ไม่สามารถเขื่อมต่อเชิฟเวอร์ได้",
                        ""
                      );
                    })
                    .finally(() => {});
                  this.http
                    .post(`${environment.apiUrl}OnHand/insertABDcard`, card)
                    .toPromise()
                    .then((val: any) => {
                      // console.log(val);
                      cardNo = val;
                      // console.log(cardNo);
                    })
                    .catch((reason) => {
                      console.log(reason);
                      this.services.alert(
                        "error",
                        "ไม่สามารถเขื่อมต่อเชิฟเวอร์ได้",
                        ""
                      );
                    })
                    .finally(() => {
                      for (let i = 0; i < this.listVnDrug.length; i++) {
                        if (this.listVnDrug[i]["refund"] > 0) {
                          let detail = new FormData();
                          detail.append("cardNo", cardNo);
                          detail.append(
                            "drugCode",
                            this.listVnDrug[i]["drugCode"]
                          );
                          detail.append("amount", this.listVnDrug[i]["refund"]);
                          detail.append("reason", this.listVnDrug[i]["reason"]);
                          this.http
                            .post(
                              `${environment.apiUrl}OnHand/insertABDdetail`,
                              detail
                            )
                            .toPromise()
                            .then((val: any) => {
                              // console.log(val);
                            })
                            .catch((reason) => {
                              console.log(reason);
                              this.services.alert(
                                "error",
                                "ไม่สามารถเขื่อมต่อเชิฟเวอร์ได้",
                                ""
                              );
                            })
                            .finally(() => {});
                        }
                        if (i == this.listVnDrug.length - 1) {
                          this.services.alertTimer(
                            "success",
                            "บันทึกข้อมูลสำเร็จ"
                          );
                          this.vdCheck();
                          this.clear();
                        }
                      }
                    });
                }
              });
          } else {
            this.services.alert("warning", "ไม่พบจำนวนยาเหลือใช้", "");
          }
        } else {
          this.services.alert("warning", "กรุณาเลือกเถสัชกร", "");
        }
      } else {
        this.services.alert("warning", "กรุณาเลือกคลินิก", "");
      }
    } else {
      this.services.alert("warning", "กรุณาเลือกแพทย์", "");
    }
  };

  public chooses = async (rowNum: any) => {
    let i = parseInt(rowNum) - 1;
    this.listAllDrug[i]["chooses"] = !this.listAllDrug[i]["chooses"];
  };

  public submitAddDrug = async () => {
    // console.log(this.listVnDrug);
    // console.log(this.listAllDrug);
    if (this.listVnDrug.length == 0) {
      this.listAllDrug.forEach((ei, i) => {
        if (this.listAllDrug[i]["chooses"] == true) {
          let formData = {
            drugCode: this.listAllDrug[i]["drugCode"],
            drugName: this.listAllDrug[i]["drugName"],
            orderqty: "-",
            refund: "0",
            dosageunitcode: this.listAllDrug[i]["dosageunitcode"],
            reason: this.listReason[0]["reasonCode"],
          };
          this.listVnDrug.push(formData);
        }
      });
    } else {
      this.listAllDrug.forEach((ei, i) => {
        if (this.listAllDrug[i]["chooses"] == true) {
          let check: boolean = false;
          // console.log(this.listAllDrug[i]);
          for (let j = 0; j < this.listVnDrug.length; j++) {
            if (
              this.listAllDrug[i]["drugCode"] == this.listVnDrug[j]["drugCode"]
            ) {
              check = true;
            }
            if (j == this.listVnDrug.length - 1) {
              if (check == false) {
                let formData = {
                  drugCode: this.listAllDrug[i]["drugCode"],
                  drugName: this.listAllDrug[i]["drugName"],
                  orderqty: "-",
                  refund: "0",
                  dosageunitcode: this.listAllDrug[i]["dosageunitcode"],
                  reason: this.listReason[0]["reasonCode"],
                };
                this.listVnDrug.push(formData);
              }
            }
          }
        }
      });
    }
    this.dataVnDrug = new MatTableDataSource(this.listVnDrug);
    this.dataVnDrug.paginator = this.paginatorVnDrug;
  };
}
