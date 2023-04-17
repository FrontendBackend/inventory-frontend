import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  /* data: string[][] | any; */

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
  }

  /* upload(event: any) {
     let file = event.target.files[0];
     let formData = new FormData();
     formData.append('file', file);

     this.http.post('http://localhost:1999/inv/api/v1/import-excel', formData)
        .subscribe( (data: string[][] | any) => {
         this.data = data;
      });
  } */

}
