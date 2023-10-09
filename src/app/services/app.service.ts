import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  constructor(private http: HttpClient, private router: Router) {}

  production: boolean = false;

  public alertTimer = (
    icon: 'error' | 'success' | 'warning',
    title: string,
    text: string = ''
  ) => {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
      showConfirmButton: false,
      timer: 2000,
    });
  };

  public alert = (
    icon: 'error' | 'success' | 'warning',
    title: string,
    text: string = ''
  ) => {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
      confirmButtonText: `ตกลง`,
      confirmButtonColor: '#3085d6',
    });
  };

  public confirm = (
    icon: 'error' | 'success' | 'warning',
    title: string,
    text: string = ''
  ) => {
    return new Promise((res) => {
      Swal.fire({
        title: title,
        text: text,
        icon: icon,
        showCancelButton: true,
        cancelButtonColor: '#6c757d',
        confirmButtonColor: '#3085d6',
        cancelButtonText: 'ยกเลิก',
        confirmButtonText: 'ตกลง',
        reverseButtons: true,
        focusCancel: true,
        focusConfirm: false,
      }).then((result) => {
        res(result.isConfirmed);
      });
    });
  };

  public navRouter = (path: string, params: any = {}) => {
    this.router.navigate([`${path}`], { queryParams: params });
  };
}
