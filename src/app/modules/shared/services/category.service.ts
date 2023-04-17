import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient) { }

  /**
   * get all categories
   */
  getCategories() {

    const endpoint = `${base_url}/categories`;
    return this.http.get(endpoint);

  }

  /**
   * get all categories
   */
  subirRegistrosExcel(event: any) {

    const endpoint = `${base_url}/import-excel`;

    let file = event.target.files[0];
    let formData = new FormData();
    formData.append('file', file);

    return this.http.post(endpoint, formData);
  }

  /**
   * save the categories
   */
  saveCategorie(body: any) {
    const endpoint = `${base_url}/categories`;
    return this.http.post(endpoint, body);
  }

  /**
   * update categorie
   */
  updateCategorie(body: any, id: any) {
    const endpoint = `${base_url}/categories/ ${id}`;
    return this.http.put(endpoint, body);
  }

  /**
   * update categorie
   */
  deleteCategorie(id: any) {
    const endpoint = `${base_url}/categories/ ${id}`;
    return this.http.delete(endpoint);
  }

  /**
   * update categorie
   */
  getCategorieById(id: any) {
    const endpoint = `${base_url}/categories/ ${id}`;
    return this.http.get(endpoint);
  }
}
