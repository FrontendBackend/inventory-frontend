import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TblPersonaDTO } from 'src/app/modules/shared/models/TblPersonaDTO';
import { ETipoAccionCRUD } from 'src/app/modules/shared/models/tipo-accion';
import { PersonaService } from 'src/app/modules/shared/services/persona.service';

@Component({
  selector: 'app-persona-formulario',
  templateUrl: './persona-formulario.component.html',
  styleUrls: ['./persona-formulario.component.scss']
})
export class PersonaFormularioComponent implements OnInit {

  @Input() tipoAccionCrud = ETipoAccionCRUD.NINGUNA;

  /**
   * Indica si el formulario está incluido en un diálogo.
   */
  @Input() incrustadoEnDialogo = 0;

  enProceso: boolean;

  pestaniaSeleccionada = 0;

  @Input() tblPersonaDTO: TblPersonaDTO;

  etiquetaTitulo: string;

  constructor(private router: Router,
    private actividateRoute: ActivatedRoute,
    private personaService: PersonaService,
  ) {
    this.enProceso = false;
  }

  ngOnInit(): void {

    this.actividateRoute.params.subscribe((respuesta: any) => {
      const claveIdMatrizSupervision = 'idPersona';
      const claveNroPestania = 'nroPestania';

      let accion: string;

      if (this.tipoAccionCrud == ETipoAccionCRUD.NINGUNA) {
        accion = this.actividateRoute.snapshot.url[0].path;
      } else {
        accion = this.tipoAccionCrud.toString();
      }


      if (accion === ETipoAccionCRUD.CREAR.toString()) {
        this.tipoAccionCrud = ETipoAccionCRUD.CREAR;
        this.tblPersonaDTO = new TblPersonaDTO();
        this.tblPersonaDTO.idPersona = 0;

        this.etiquetaTitulo = "Persona";

        this.enProceso = false;
      }
      else if (accion === ETipoAccionCRUD.MODIFICAR.toString()) {
        this.tipoAccionCrud = ETipoAccionCRUD.MODIFICAR;

        const idPersona = +respuesta[claveIdMatrizSupervision];
        this.etiquetaTitulo = "Persona";

        if (respuesta[claveNroPestania]) {
          this.pestaniaSeleccionada = +respuesta[claveNroPestania];
        }

        this.obtenerPersonaPorId(idPersona);
      }
      else if (accion === ETipoAccionCRUD.CONSULTAR.toString()) {
        this.tipoAccionCrud = ETipoAccionCRUD.CONSULTAR;
        let idPersona: number;
        if (!this.tblPersonaDTO) {
          idPersona = +respuesta[claveIdMatrizSupervision];

          if (respuesta[claveNroPestania]) {
            this.pestaniaSeleccionada = +respuesta[claveNroPestania];
          }
        } else {
          idPersona = this.tblPersonaDTO.idPersona;
        }

        this.obtenerPersonaPorId(idPersona);
      }

    });

  }

  /**
   * Permite obtener el registro de la matriz de supervisión
   * @param idPersona,
   */
  obtenerPersonaPorId(idPersona: number): void {
    this.enProceso = true;
    this.personaService.obtenerPersonaPorId(idPersona).subscribe((respuesta: any) => {
      if (respuesta) {
        const clave = 'tblPersonaDTO';
        this.tblPersonaDTO = respuesta[clave] as TblPersonaDTO;

        setTimeout(() => {
          this.enProceso = false;
        });
      }
    });
  }

  eventoMatrizSupervisionModificado(tblPersonaModificado: TblPersonaDTO) {
    this.tblPersonaDTO = tblPersonaModificado;
  }

  get habilitarOtrasPestanias(): boolean {
    let habilitar = false;

    if (this.tipoAccionCrud === ETipoAccionCRUD.MODIFICAR || this.tipoAccionCrud === ETipoAccionCRUD.CONSULTAR) {
      habilitar = true;
    }

    return habilitar;
  }

  /**
  * Me permite retornar a la lista de matrices de supervisión
  */
  retornar() {
    this.router.navigate(['/dashboard/persona']);
  }
}
