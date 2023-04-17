import { TipoResultado } from "../enums/tipo-resultado";

export interface ResponseDTO {
    length: number;
    status: string;
    data: any;
    mensaje: string;
    lista: any;
    timestamp: Date;
    id: number;
    valor: number;
    tipoResultado: TipoResultado;
    tipoResultadoCadena: String;
}



