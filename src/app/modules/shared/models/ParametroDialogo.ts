import { BlockScrollStrategy } from '@angular/cdk/overlay';
import { ETipoAccionCRUD } from './tipo-accion';

/***
 *
 */
export class ParametroDialogo<T, U> {

    accion: ETipoAccionCRUD;
    objeto: T;
    idInstanciaPaso?: number;
    objetoReferencia?: U;
    resultado?: string;
    datoAdicional?: any;
    objetosExtra?: any;
    coTablaInstancia?: any;
    idProceso?: number;
    incluyeDocumentos?: boolean;
    esPropia?: boolean
}
