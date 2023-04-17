export class TblHistorialPrestamoDTO {

  /*
   * Identificador primario de la tabla
   */
  idHistorialPrestamo: number;

  /*
   * Identificador foranea de la tabla prestamo
   */
  idPrestamo: number;

  /*
   * Fecha de prestamo como historial que se va a generar, debe ser dd/MM/yyyy HH:mm
   */
  fePrestamoHistorial: Date;

  /*
   * Descripción del historial del prestamo
   */
  descripcionHistorial: string;

  /*
   * El monto subtotal que se obtiene, será restado(-) o sumado(+) y sera registrado como copia en esta tabla
   */
  montoSubtotalOperado: number;

  /*
   * Monto que se va a operar cuando lo cancela totalmente o de adelantado
   */
  montoOperar: number;

  /*
   * Me permite ver si es sumado(+) o restado(-) el subtotal
   */
  flagOperador: string;

  /*
   * Me permite mostrar el estado del registro
   */
  esRegistro: string;
}
