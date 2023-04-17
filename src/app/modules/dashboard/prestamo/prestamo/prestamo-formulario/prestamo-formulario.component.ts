import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { pgimAnimations } from 'src/app/modules/shared/animations/pgim-animations';
import { TblPersonaDTO } from 'src/app/modules/shared/models/TblPersonaDTO';
import { TblPrestamoDTO } from 'src/app/modules/shared/models/TblPrestamoDTO';
import { ETipoAccionCRUD } from 'src/app/modules/shared/models/tipo-accion';
import { PersonaService } from 'src/app/modules/shared/services/persona.service';

@Component({
  selector: 'app-prestamo-formulario',
  templateUrl: './prestamo-formulario.component.html',
  styleUrls: ['./prestamo-formulario.component.css'],
  animations: [pgimAnimations]
})
export class PrestamoFormularioComponent implements OnInit {

  tipoAccionCrud = ETipoAccionCRUD.NINGUNA;

  enProceso: boolean;

  pestaniaSeleccionada = 0;

  @Input() tblPersonaDTO: TblPersonaDTO;
  @Input() idPersona: number;

  tblPrestamoDTO: TblPrestamoDTO;

  ventanaOrigen: number;
  enProcesoPrestamo = false;
  esFormularioSoloLectura = false;
  constructor(private router: Router,
    private actividateRoute: ActivatedRoute,
    private personaService: PersonaService,

  ) {
    this.enProceso = false;
  }

  ngOnInit(): void {

    this.actividateRoute.params.subscribe((respuesta: any) => {
      const claveIdNorma = 'idPersona';
      const claveNroPestania = 'nroPestania';
      const claveIdItemTipificacion = 'idPrestamo';
      const claveVentanaOrigen = 'ventanaOrigen';

      const accion = this.actividateRoute.snapshot.url[1].path;

      if (accion === ETipoAccionCRUD.CREAR.toString()) {
        this.tipoAccionCrud = ETipoAccionCRUD.CREAR;

        this.tblPersonaDTO = new TblPersonaDTO();
        this.tblPersonaDTO.idPersona = +respuesta[claveIdNorma];
        this.idPersona = this.tblPersonaDTO.idPersona;

        this.tblPrestamoDTO = new TblPrestamoDTO();
        this.tblPrestamoDTO.idPrestamo = 0;
        this.tblPrestamoDTO.idPersona = +respuesta[claveIdItemTipificacion];

      }
      else if (accion === ETipoAccionCRUD.MODIFICAR.toString()) {
        this.tipoAccionCrud = ETipoAccionCRUD.MODIFICAR;

        const idPrestamo = +respuesta[claveIdItemTipificacion];

        if (respuesta[claveNroPestania]) {
          this.pestaniaSeleccionada = +respuesta[claveNroPestania];
        }

        this.obtenerPrestamoPorId(idPrestamo);
      }
      else if (accion === ETipoAccionCRUD.CONSULTAR.toString()) {
        this.tipoAccionCrud = ETipoAccionCRUD.CONSULTAR;

        const idPrestamo = +respuesta[claveIdItemTipificacion];

        if (respuesta[claveNroPestania]) {
          this.pestaniaSeleccionada = +respuesta[claveNroPestania];
        }

        if (respuesta[claveVentanaOrigen]) {
          this.ventanaOrigen = +respuesta[claveVentanaOrigen];
        }

        this.obtenerPrestamoPorId(idPrestamo);
      }

    });

  }

  obtenerPrestamoPorId(idPrestamo: number): void {
    this.enProceso = true;
    this.personaService.obtenerPrestamoPorId(idPrestamo).subscribe((respuesta: any) => {
      const clavePgimItemTipificacionDTO = 'tblPrestamoDTO';
      this.tblPrestamoDTO = respuesta[clavePgimItemTipificacionDTO] as TblPrestamoDTO;
      //  this.noCortoNorma = this.tblPersonaDTO.noCortoNorma;
      this.tblPersonaDTO = new TblPersonaDTO();
      this.tblPersonaDTO.idPersona = this.tblPrestamoDTO.idPersona;
      setTimeout(() => {
        this.enProceso = false;
      });
    });
  }

  get habilitarOtrasPestanias(): boolean {
    let habilitar = false;
    if (this.tipoAccionCrud === ETipoAccionCRUD.MODIFICAR || this.tipoAccionCrud === ETipoAccionCRUD.CONSULTAR) {
      habilitar = true;
    }

    return habilitar;
  }

  /**
  * Me permite retornar al formulario de la persona y su prestamo
  */
  retornar() {
    /* A la ventana principal esto retornará en modo modificar, modo simple */
    if (this.tipoAccionCrud === ETipoAccionCRUD.MODIFICAR || this.tipoAccionCrud === ETipoAccionCRUD.CREAR) {
      this.router.navigate([`/dashboard/persona/${ETipoAccionCRUD.MODIFICAR}`, this.tblPersonaDTO.idPersona, 0]);
    }
    /* A la ventana principal esto retornará en modo consulta */
    else if (this.ventanaOrigen === ETipoAccionCRUD.CONSULTAR) {
      this.router.navigate([`/dashboard/persona/${ETipoAccionCRUD.CONSULTAR}`, this.tblPersonaDTO.idPersona, 0]);
    }
    /* A la ventana principal esto retornará en modo modificar */
    else if (this.ventanaOrigen === ETipoAccionCRUD.MODIFICAR) {
      this.router.navigate([`/dashboard/persona/${ETipoAccionCRUD.MODIFICAR}`, this.tblPersonaDTO.idPersona, 0]);
    }
  }


}
