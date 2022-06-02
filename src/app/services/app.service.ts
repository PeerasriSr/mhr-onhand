import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  constructor(private router: Router) { }

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
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'ตกลง',
        cancelButtonText: 'ยกเลิก',
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
