import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ResponseDTO } from '../models/ResponseDTO';
import { Observable, map } from 'rxjs';
import { PageResponse } from '../models/PageResponse';
import { TblPersonaDTO } from '../models/TblPersonaDTO';
import { Paginador } from '../models/Paginador';
import { TblPrestamoDTO } from '../models/TblPrestamoDTO';
import { TblHistorialPrestamoDTO } from '../models/TblHistorialPrestamoDTO';

@Injectable({
  providedIn: 'root'
})
export class PersonaService {

  url = `${environment.HOST}/personas`;

  private httpHeaders: HttpHeaders;

  constructor(private httpClient: HttpClient) {
    this.httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
  }


  /*
 * -----------------------------------------------
 * ----------- CRUD de persona -------------------
 * -----------------------------------------------
 */
  paginarPersonas(paginador: Paginador): Observable<PageResponse<TblPersonaDTO>> {
    const endPoint = `${this.url}/paginarPersonas`;
    const parametros = new HttpParams()
      .set('page', paginador.page.toString())
      .set('size', paginador.size.toString())
      .set('sort', paginador.sort);
    return this.httpClient.post<PageResponse<TblPersonaDTO>>(endPoint,
      paginador, { headers: this.httpHeaders, params: parametros });
  }

  crearPersona(tblPersonaDTO: TblPersonaDTO): Observable<TblPersonaDTO> {
    const urlEndPoint = `${this.url}/crearPersona`;
    const clave = 'tblPersonaDTOCreado';

    return this.httpClient.post<TblPersonaDTO>(urlEndPoint, tblPersonaDTO, { headers: this.httpHeaders })
      .pipe(
        map((respuesta: any) => respuesta[clave] as TblPersonaDTO)
      );
  }

  modificarPersona(tblPersonaDTO: TblPersonaDTO): Observable<TblPersonaDTO> {
    const urlEndPoint = `${this.url}/modificarPersona`;

    return this.httpClient.put<TblPersonaDTO>(urlEndPoint, tblPersonaDTO, { headers: this.httpHeaders })
      .pipe(
        map((respuesta: any) => respuesta['tblPersonaDTOModificado'] as TblPersonaDTO)
      );
  }

  eliminarPersona(idPersona: number): Observable<ResponseDTO> {
    return this.httpClient.post<ResponseDTO>(`${this.url}/eliminarPersona/${idPersona}`, idPersona);
  }

  obtenerPersonaPorId(idPersona: number): Observable<any> {
    const urlEndPoint = `${this.url}/obtenerPersonaPorId/${idPersona}`;

    return this.httpClient.get<any[]>(urlEndPoint);
  }







  /*
 * -----------------------------------------------
 * ----------- CRUD de prestamo ------------------
 * -----------------------------------------------
 */
  paginarPrestamos(idPersona: number, paginador: Paginador): Observable<ResponseDTO> {
    const endPoint = `${this.url}/paginarPrestamos/${idPersona}`;
    const parametros = new HttpParams()
      .set('page', paginador.page.toString())
      .set('size', paginador.size.toString())
      .set('sort', paginador.sort);
    return this.httpClient.post<ResponseDTO>(endPoint,
      idPersona, { headers: this.httpHeaders, params: parametros });
  }

  crearPrestamo(tblPrestamoDTO: TblPrestamoDTO): Observable<TblPrestamoDTO> {
    const urlEndPoint = `${this.url}/crearPrestamo`;
    const clave = 'tblPrestamoDTOCreado';

    return this.httpClient.post<TblPrestamoDTO>(urlEndPoint, tblPrestamoDTO, { headers: this.httpHeaders })
      .pipe(
        map((respuesta: any) => respuesta[clave] as TblPrestamoDTO)
      );
  }

  modificarPrestamo(tblPrestamoDTO: TblPrestamoDTO): Observable<TblPrestamoDTO> {
    const urlEndPoint = `${this.url}/modificarPrestamo`;

    return this.httpClient.put<TblPrestamoDTO>(urlEndPoint, tblPrestamoDTO, { headers: this.httpHeaders })
      .pipe(
        map((respuesta: any) => respuesta['tblPrestamoDTOModificado'] as TblPrestamoDTO)
      );
  }

  eliminarPrestamo(idPrestamo: number): Observable<ResponseDTO> {
    return this.httpClient.post<ResponseDTO>(`${this.url}/eliminarPrestamo/${idPrestamo}`, idPrestamo);
  }

  obtenerPrestamoPorId(idPrestamo: number): Observable<any> {
    const urlEndPoint = `${this.url}/obtenerPrestamoPorId/${idPrestamo}`;

    return this.httpClient.get<any[]>(urlEndPoint);
  }






  /*
 * -----------------------------------------------
 * ----------- CRUD de historial prestamo --------
 * -----------------------------------------------
 */
  paginarHistorialPrestamos(idPrestamo: number, paginador: Paginador): Observable<ResponseDTO> {
    const endPoint = `${this.url}/paginarHistorialPrestamos`;
    const parametros = new HttpParams()
      .set('page', paginador.page.toString())
      .set('size', paginador.size.toString())
      .set('sort', paginador.sort);
    return this.httpClient.post<ResponseDTO>(endPoint,
      idPrestamo, { headers: this.httpHeaders, params: parametros });
  }

  crearHistorialPrestamo(tblHistorialPrestamoDTO: TblHistorialPrestamoDTO): Observable<ResponseDTO> {
    const urlEndPoint = `${this.url}/crearHistorialPrestamo`;
    return this.httpClient.post<ResponseDTO>(urlEndPoint, tblHistorialPrestamoDTO, { headers: this.httpHeaders });
  }

  modificarHistorialPrestamo(tblHistorialPrestamoDTO: TblHistorialPrestamoDTO): Observable<TblHistorialPrestamoDTO> {
    const urlEndPoint = `${this.url}/modificarHistorialPrestamo`;

    return this.httpClient.put<TblHistorialPrestamoDTO>(urlEndPoint, tblHistorialPrestamoDTO, { headers: this.httpHeaders })
      .pipe(
        map((respuesta: any) => respuesta['tblHistorialPrestamoDTOModificado'] as TblHistorialPrestamoDTO)
      );
  }

  eliminarHistorialPrestamo(idHistorialPrestamo: number): Observable<ResponseDTO> {
    return this.httpClient.post<ResponseDTO>(`${this.url}/eliminarHistorialPrestamo/${idHistorialPrestamo}`, idHistorialPrestamo);
  }

  obtenerHistorialPrestamoPorId(idHistorialPrestamo: number): Observable<any> {
    const urlEndPoint = `${this.url}/obtenerHistorialPrestamoPorId/${idHistorialPrestamo}`;

    return this.httpClient.get<any[]>(urlEndPoint);
  }

}
