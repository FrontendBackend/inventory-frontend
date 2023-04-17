import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TblPersonaDTO } from 'src/app/modules/shared/models/TblPersonaDTO';
import { ETipoAccionCRUD } from 'src/app/modules/shared/models/tipo-accion';
import { PersonaService } from 'src/app/modules/shared/services/persona.service';

@Component({
  selector: 'app-persona-tarjeta',
  templateUrl: './persona-tarjeta.component.html',
  styleUrls: ['./persona-tarjeta.component.css']
})
export class PersonaTarjetaComponent implements OnInit {

  @Input() tblPersonaDTO: TblPersonaDTO;

  @Input() tipoAccionCrud = ETipoAccionCRUD.NINGUNA;

  @Input() eliminarEsVisible = true;

  @Output() eventoPersonaParaModificar = new EventEmitter<TblPersonaDTO>();

  @Output() eventoPersonaParaConsultar = new EventEmitter<TblPersonaDTO>();

  @Output() eventoPersonalOsiSolicitadoParaEliminar = new EventEmitter<TblPersonaDTO>();

  constructor(
  ) {
  }

  ngOnInit(): void {
  }

  /**
  * Permite visualizar la información del personal de osinergmin y modificarlo
  * @param tblPersonaDTO
  */
  solicitarModificacion(tblPersonaDTO: TblPersonaDTO) {
    this.eventoPersonaParaModificar.emit(tblPersonaDTO);
  }

  /**
   * Permite visualizar la información del personal de osinergmin en modo consulta
   * @param tblPersonaDTO
   */
  solicitarConsulta(tblPersonaDTO: TblPersonaDTO) {
    this.eventoPersonaParaConsultar.emit(tblPersonaDTO);
  }

}
