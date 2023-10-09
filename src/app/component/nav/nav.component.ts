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

  public interval: any;

  public id: any;
  public job: any;
  public user: any;
  public dep: any;
  public depName: any;
  public depAtt: any;
  public page: any;
  public numBadge = 0;
  public alertExpBadge = 0;

  public disp: Array<any> = [];
  public stk: Array<any> = [];

  constructor(public services: AppService, private http: HttpClient) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.id = sessionStorage.getItem("id");
      this.job = sessionStorage.getItem("่job");
      // console.log(this.job);
      this.user = sessionStorage.getItem("user");
      this.dep = sessionStorage.getItem("dep");
      this.depName = sessionStorage.getItem("depName");
      this.depAtt = sessionStorage.getItem("depAtt");
      this.page = sessionStorage.getItem("selectPage");
      this.searchGroup.patchValue({
        key: "",
      });
      this.getRequest();
      this.getAretExp();
      this.timerOut(1);
    }, 500);
    setInterval(() => {
      this.getRequest();
    }, 60000);
    setInterval(() => {
      this.page = sessionStorage.getItem("selectPage");
    }, 500);
  }

  public timerOut = async (data: any) => {
    if (this.id) {
      clearInterval(this.interval);
      this.interval = setInterval(() => {
        // console.log(data);
        if (data == 60 * 10) {
          clearInterval(this.interval);
          this.services.alertTimer("error", "หมดเวลาการใช้งาน");
          setTimeout(() => {
            sessionStorage.clear();
            this.services.navRouter("/");
            window.location.reload();
          }, 2000);
        } else {
          data++;
        }
      }, 1000);
    }
  };

  public LogOut = async () => {
    this.services.confirm("warning", "ออกจากระบบ ", "").then((val: any) => {
      if (val) {
        sessionStorage.clear();
        this.services.navRouter("/");
        window.location.reload();
        // this.services.alert("error", "ออกจากระบบ", "");
      }
    });
  };

  public submitISearch = async () => {
    this.selectPage("Search");
    // console.log(this.searchGroup.value);
    sessionStorage.setItem("search", this.searchGroup.value.key);
    this.services.navRouter("/Search");
    // window.location.reload();
    this.searchGroup.patchValue({
      key: "",
    });
  };

  public selectPage = async (data: any) => {
    // console.log(data);
    if (data == "robot") {
      sessionStorage.setItem("dep", "W8");
      window.location.href = "http://192.168.185.160/RobotINV";
    } else {
      if (this.page != data) {
        this.page = data;
        sessionStorage.setItem("selectPage", data);
      }
    }
  };

  public getRequest = async () => {
    let depData = new FormData();
    depData.append("dep", this.dep);
    this.http
      .post(`${environment.apiUrl}listRequest`, depData)
      .toPromise()
      .then((val: any) => {
        // console.log(val["result"].length);
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

  public getAretExp = async () => {
    let depData = new FormData();
    depData.append("depCode", this.dep);
    this.http
      .post(`${environment.apiUrl}OnHand/getAretExp`, depData)
      .toPromise()
      .then((val: any) => {
        // console.log(val);
        this.alertExpBadge = val["result"].length;
        // console.log(this.alertExpBadge);
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

  public test = async () => {
    this.disp = [];
    this.stk = [];
    this.http
      .get(`${environment.apiUrl}dispenAllDay`)
      .toPromise()
      .then((val: any) => {
        if (val["rowCount"] > 0) {
          // console.log(val);
          this.disp = val["result"];
          // console.log(this.disp);
        }
      })
      .catch((reason) => {
        console.log(reason);
        this.services.alert("error", "ไม่สามารถเขื่อมต่อเชิฟเวอร์ได้", "");
      })
      .finally(() => {
        this.http
          .get(`${environment.apiUrl}invAllDay`)
          .toPromise()
          .then((val: any) => {
            if (val["rowCount"] > 0) {
              // console.log(val);
              this.stk = val["result"];
              // console.log(this.stk);
            }
          })
          .catch((reason) => {
            console.log(reason);
            this.services.alert("error", "ไม่สามารถเขื่อมต่อเชิฟเวอร์ได้", "");
          })
          .finally(() => {
            this.match();
          });
      });
  };

  public match = async () => {
    this.disp.forEach((ei, i) => {
      let finish = false;
      console.log(this.disp[i]);
      this.stk.forEach((ej, j) => {
        if (finish == false) {
          if (
            this.disp[i]["drugCode"] == this.stk[j]["drugCode"] &&
            this.disp[i]["dep"] == this.stk[j]["depCode"]
          ) {
            console.log(
              "befor " +
                this.stk[j]["depCode"] +
                " " +
                this.stk[j]["drugCode"] +
                " " +
                this.stk[j]["LOT_NO"] +
                " " +
                this.stk[j]["amount"]
            );
            if (
              parseInt(this.disp[i]["amount"]) <=
              parseInt(this.stk[j]["amount"])
            ) {
              this.stk[j]["amount"] =
                parseInt(this.stk[j]["amount"]) -
                parseInt(this.disp[i]["amount"]);
              finish = true;
            } else {
              this.disp[i]["amount"] =
                parseInt(this.disp[i]["amount"]) -
                parseInt(this.stk[j]["amount"]);
              this.stk[j]["amount"] = 0;
            }
            console.log(
              "after " +
                this.stk[j]["depCode"] +
                " " +
                this.stk[j]["drugCode"] +
                " " +
                this.stk[j]["LOT_NO"] +
                " " +
                this.stk[j]["amount"]
            );
          }
        }
      });
    });
  };
}
