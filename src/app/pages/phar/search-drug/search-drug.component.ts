import { Component, OnInit, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { AppService } from 'src/app/services/app.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-search-drug',
  templateUrl: './search-drug.component.html',
  styleUrls: ['./search-drug.component.scss'],
})
export class SearchDrugComponent implements OnInit {
   key: any = '';
   selectDrugName: any;

   selectedRowIndex: any;
   listINV: Array<any> = [];
   dataINV: any = null;
  @ViewChild('sortINV') sortINV!: MatSort;
  @ViewChild('paginatorINV') paginatorINV!: MatPaginator;
   displayedINV: string[] = [
    'indexrow',
    'drugCode',
    'drugName',
    'Name',
    'amount',
  ];



  constructor(public services: AppService, private http: HttpClient) {}

  ngOnInit(): void {
    setInterval(this.check, 1000);
  }

   check = async () => {
    // console.log(sessionStorage.getItem("search"));
    if (this.key != sessionStorage.getItem('search')) {
      this.selectDrugName = [];
      this.key = sessionStorage.getItem('search');
      // console.log(this.key);
      this.searchDrug();
    }
  };

   searchDrug = async () => {
    this.listINV = [];
    let dataKey = new FormData();
    dataKey.append('key', this.key);
    this.http
      .post(`${environment.apiUrl}OnHand/searchDrug`, dataKey)
      .toPromise()
      .then((val: any) => {
        // console.log(val);
        this.listINV = val['result'];
        // console.log(this.listINV);
        this.dataINV = new MatTableDataSource(this.listINV);
        this.dataINV.sort = this.sortINV;
        this.dataINV.paginator = this.paginatorINV;
      })
      .catch((reason) => {
        console.log(reason);
        this.services.alert(
          'error',
          'ไม่สามารถเชื่อมต่อกับเซิฟเวอร์ได้',
          'โปรดติดต่อผู้ดูแลระบบ'
        );
      })
      .finally(() => {});
  };
}
