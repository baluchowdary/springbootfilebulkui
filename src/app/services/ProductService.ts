import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { DASHBOARD_CONSTANTS } from '../../constants/Dashboard';
import { Observable } from 'rxjs';
import { IPageResponse } from '../model/IPageResponse';
import { IProduct } from '../model/IProduct';

@Injectable({
  providedIn: 'root',
})
export class ProductService {

  //http = inject(HttpClient);

  constructor(private http: HttpClient) { }


  getProducts(page: number, size: number):  Observable<IPageResponse<IProduct>> {
    debugger;
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<IPageResponse<IProduct>>(DASHBOARD_CONSTANTS.API_URL + DASHBOARD_CONSTANTS.LOAD_FILE_DATA, { params });
  } 

  
  uploadProducts(formData: FormData) {
    return this.http.post(DASHBOARD_CONSTANTS.API_URL + DASHBOARD_CONSTANTS.UPLOAD_FILE, formData, {
      responseType: 'text' // Adjust response type if needed
    });
  }

  // uploadFile(formData: FormData) {
  //   debugger;
  //   return this.http.post(DASHBOARD_CONSTANTS.API_URL + DASHBOARD_CONSTANTS.UPLOAD_FILE, formData, {
  //     responseType: 'text' // Adjust response type if needed
  //   });
  // }

  onClearDatabase(): Observable<any> {
    return this.http.delete(DASHBOARD_CONSTANTS.API_URL + DASHBOARD_CONSTANTS.CLEAR_DATABASE, {
      responseType: 'text' // Adjust response type if needed
    });
  }
  
}
