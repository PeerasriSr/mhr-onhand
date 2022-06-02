import { Component, OnInit } from "@angular/core";
import { AppService } from "src/app/services/app.service";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-nav",
  templateUrl: "./nav.component.html",
  styleUrls: ["./nav.component.scss"],
})
export class NavComponent implements OnInit {
  public searchGroup = new FormGroup({
    key: new FormControl("", [Validators.required]),
  });

  public id: any;
  public user: any;
  public dep: any;
  public depName: any;
  public page: any;
  public numBadge = 0;

  public disp: Array<any> = [];
  public stk: Array<any> = [];

  constructor(public services: AppService, private http: HttpClient) {
    this.id = sessionStorage.getItem("id");
    this.user = sessionStorage.getItem("user");
    this.dep = sessionStorage.getItem("dep");
    this.depName = sessionStorage.getItem("depName");
    this.page = sessionStorage.getItem("selectPage");
  }

  ngOnInit(): void {
    this.searchGroup.patchValue({
      key: "",
    });
    this.getRequest();
    this.delAmountZero();
    setInterval(() => {
      this.getRequest();
    }, 300000);
    // this.test();
  }

  public LogOut = async () => {
    this.services.confirm("warning", "ออกจากระบบ ", "").then((val: any) => {
      if (val) {
        sessionStorage.clear();
        this.services.navRouter("/");
        this.services.alert("error", "ออกจากระบบ", "");
      }
    });
  };

  public submitISearch = async () => {
    this.page = [];
    // console.log(this.searchGroup.value);
    sessionStorage.setItem("search", this.searchGroup.value.key);
    this.services.navRouter("/Search");
    // window.location.reload();
    this.searchGroup.patchValue({
      key: "",
    });
  };

  public selectPage = async (data: any) => {
    if (this.page != data) {
      this.page = data;
    }
  };

  public getRequest = async () => {
    let depData = new FormData();
    depData.append("dep", this.dep);
    this.http
      .post(`${environment.apiUrl}listRequest`, depData)
      .toPromise()
      .then((val: any) => {
        // console.log(val['result'].length);
        this.numBadge = val["result"].length;
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

  public delAmountZero = async () => {
    this.http
      .get(`${environment.apiUrl}delAmountZero`)
      .toPromise()
      .then((val: any) => {
        if (val["rowCount"] > 0) {
          // console.log(val);
        }
      })
      .catch((reason) => {
        console.log(reason);
        this.services.alert("error", "ไม่สามารถเขื่อมต่อเชิฟเวอร์ได้", "");
      })
      .finally(() => {});
  };

  // public test = async () => {
  //   this.disp = [];
  //   this.stk = [];
  //   this.http
  //     .get(`${environment.apiUrl}refillSEAllDay`)
  //     .toPromise()
  //     .then((val: any) => {
  //       if (val["rowCount"] > 0) {
  //         // console.log(val);
  //         this.disp = val["result"];
  //         console.log(this.disp);
  //       }
  //     })
  //     .catch((reason) => {
  //       console.log(reason);
  //       this.services.alert("error", "ไม่สามารถเขื่อมต่อเชิฟเวอร์ได้", "");
  //     })
  //     .finally(() => {
  //       this.http
  //         .get(`${environment.apiUrl}stockSEAllDay`)
  //         .toPromise()
  //         .then((val: any) => {
  //           if (val["rowCount"] > 0) {
  //             // console.log(val);
  //             this.stk = val["result"];
  //             console.log(this.stk);
  //           }
  //         })
  //         .catch((reason) => {
  //           console.log(reason);
  //           this.services.alert("error", "ไม่สามารถเขื่อมต่อเชิฟเวอร์ได้", "");
  //         })
  //         .finally(() => {
  //           this.match();
  //         });
  //     });
  // };

  // public match = async () => {
  //   this.disp.forEach((ei, i) => {
  //     console.log(
  //         this.disp[i]["drugCode"] +
  //         " / จำนวน " +
  //         this.disp[i]["Quantity"]
  //     );
  //     let finish = "f";
  //     this.stk.forEach((ej, j) => {
  //       if (finish == "f") {
  //         if (this.disp[i]["drugCode"] == this.stk[j]["drugCode"]) {
  //           console.log(
  //             "ก่อน LOT " +
  //               this.stk[j]["LOT_NO"] +
  //               " / จำนวน " +
  //               this.stk[j]["Quantity"]
  //           );
  //           if (
  //             parseInt(this.disp[i]["Quantity"]) <=
  //             parseInt(this.stk[j]["Quantity"])
  //           ) {
  //             this.stk[j]["Quantity"] =
  //               parseInt(this.stk[j]["Quantity"]) -
  //               parseInt(this.disp[i]["Quantity"]);
  //             finish = "t";
  //           } else {
  //             this.disp[i]["Quantity"] =
  //               parseInt(this.disp[i]["Quantity"]) -
  //               parseInt(this.stk[j]["Quantity"]);
  //             this.stk[j]["Quantity"] = 0;
  //           }
  //           console.log(
  //             "หลัง LOT " +
  //               this.stk[j]["LOT_NO"] +
  //               " / จำนวน " +
  //               this.stk[j]["Quantity"]
  //           );
  //         }
  //       }
  //     });
  //   });
  // };
}
