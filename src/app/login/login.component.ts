import { Component, OnInit } from "@angular/core";
import { AppService } from "src/app/services/app.service";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  public inputGroup = new FormGroup({
    id: new FormControl("", [Validators.required]),
    password: new FormControl("", [Validators.required]),
  });

  public listDep: Array<any> = [];
  public depID: any;
  public depName: any;

  constructor(public services: AppService, private http: HttpClient) {}

  ngOnInit(): void {
    this.getDep();
    this.inputGroup.patchValue({
      id: "",
      password: "",
    });
  }

  public getDep = async () => {
    this.listDep = [];
    this.http
      .get(`${environment.apiUrl}getDep`)
      .toPromise()
      .then((val: any) => {
        if (val["rowCount"] > 0) {
          this.listDep = val["result"];
          // console.log(this.listDep);
        }
      })
      .catch((reason) => {
        console.log(reason);
        this.services.alert("error", "ไม่สามารถเขื่อมต่อเชิฟเวอร์ได้", "");
      })
      .finally(() => {
        this.depID = this.listDep[0]["ID"];
      });
  };

  public submitInput = async () => {
    // console.log(this.inputGroup.value);
    // console.log(this.depID);
    let loginData = new FormData();
    loginData.append("id", this.inputGroup.value.id);
    loginData.append("password", this.inputGroup.value.password);
    // loginData.append('dep', this.depID);
    this.listDep.forEach((ei, i) => {
      if (this.listDep[i]["ID"] == this.depID) {
        this.depName = this.listDep[i]["Name"];
      }
    });
    this.http
      .post(`${environment.apiUrl}onhandlogin`, loginData)
      .toPromise()
      .then((val: any) => {
        // console.log(val);
        if (val.success) {
          this.services.alert("success", val.message, "");
          sessionStorage.setItem("userLogin", val.userData);
          // console.log(val.userData.userName);
          let str = this.inputGroup.value.id;
          var newstr = str.toUpperCase();
          sessionStorage.setItem("id", newstr);
          sessionStorage.setItem("user", val.userData.userName);
          sessionStorage.setItem("dep", this.depID);
          sessionStorage.setItem("depName", this.depName);
          sessionStorage.setItem("selectPage", "Inventory");
          this.services.navRouter("/Inventory");
          // this.services.navRouter('/Applicant');
        } else {
          this.services.alert("warning", val.message, "");
          sessionStorage.clear();
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
      .finally(() => {});
  };

  public selectDep(e: any) {
    // console.log(e.target.value);
    this.depID = e.target.value;
  }
}
