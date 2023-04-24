import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { pgimAnimations } from 'src/app/modules/shared/animations/pgim-animations';
import { TipoResultado } from 'src/app/modules/shared/enums/tipo-resultado';
import { ResponseDTO } from 'src/app/modules/shared/models/ResponseDTO';
import { TblHistorialPrestamoDTO } from 'src/app/modules/shared/models/TblHistorialPrestamoDTO';
import { TblPersonaDTO } from 'src/app/modules/shared/models/TblPersonaDTO';
import { TblPrestamoDTO } from 'src/app/modules/shared/models/TblPrestamoDTO';
import { ETipoAccionCRUD } from 'src/app/modules/shared/models/tipo-accion';
import { PersonaService } from 'src/app/modules/shared/services/persona.service';
import { PrestamoHistorialListaComponent } from '../prestamo-historial-lista/prestamo-historial-lista.component';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-prestamo-general',
  templateUrl: './prestamo-general.component.html',
  styleUrls: ['./prestamo-general.component.css'],
  animations: [pgimAnimations]
})
export class PrestamoGeneralComponent implements OnInit {

  @ViewChild(PrestamoHistorialListaComponent) prestamoHistorialListaComponent: PrestamoHistorialListaComponent;

  @Input() tblPrestamoDTO: TblPrestamoDTO;
  @Input() tblPersonaDTO: TblPersonaDTO;
  @Input() tipoAccionCrud = ETipoAccionCRUD.NINGUNA;
  accion: string;
  esFormularioSoloLectura = false;
  frmReactivoPrestamo: FormGroup;
  enProcesoPrestamo = false
  habilitarMontoPositivo = false
  habilitarLecturaMonto = false
  habilitarLecturaMontoAOperar = false
  total: number;

  /* Seria resta cuando es "false" */
  flOperador = false;
  flOperadorCadena = '0';

  constructor(private formBuilder: FormBuilder, private personaService: PersonaService,
    private matSnackBar: MatSnackBar,) { }

  ngOnInit(): void {
    this.accion = (this.tipoAccionCrud === ETipoAccionCRUD.MODIFICAR) ? 'MODIFICAR' : '';

    this.iniciarFormularioPrestamo();
  }


  tieneError2(campo: string, error: string): boolean {
    if (error === 'any' || error === '') {
      return (
        this.frmReactivoPrestamo.get(campo).invalid
      );
    }

    return (
      this.frmReactivoPrestamo.get(campo).hasError(error)
    );
  }

  iniciarFormularioPrestamo() {

    if (this.tipoAccionCrud === ETipoAccionCRUD.CONSULTAR) {
      this.esFormularioSoloLectura = true;
    }

    this.frmReactivoPrestamo = this.formBuilder.group(
      {
        fePrestamo: [this.tblPrestamoDTO.fePrestamo, [Validators.required]],
        feCancelado: [this.tblPrestamoDTO.feCancelado, [Validators.required]],
        descripcion: [this.tblPrestamoDTO.descripcion, [Validators.required]],
        monto: [this.tblPrestamoDTO.monto, [Validators.required]],
        montoOperar: [''],
        descripcionHistorial: ['', [Validators.required]],
      }
    );

    if (this.esFormularioSoloLectura) {
      Object.values(this.frmReactivoPrestamo.controls).forEach(control => control.disable());
    }
  }

  seCambioMontoSubTotal(valor: any): void {
    this.calcularMontoSubTotal();
  }

  calcularMontoSubTotal(): void {
    const valorMontoOperar = this.frmReactivoPrestamo.value.montoOperar;

    let total = null;

    if (this.flOperador === true) {
      total = Number(this.tblPrestamoDTO.monto) + Number(valorMontoOperar);

    } else if (this.flOperador === false) {
      total = Number(this.tblPrestamoDTO.monto) - Number(valorMontoOperar);
    }

    this.total = total;

    /* El total menor que 0, se deshabilita el botón de modificar y se habilita caja 'monto' para no ser ingresado el valor */
    if (total < 0) {
      this.habilitarMontoPositivo = true;
      this.habilitarLecturaMonto = true;
    }
    /* El total menor que 0, se habilita el botón de modificar y se habilita caja 'monto' para no ser ingresado el valor */
    else if (total === 0) {
      this.habilitarMontoPositivo = false;
      this.habilitarLecturaMonto = true;
    }
    /* El total mayor que 0, se habilita el botón de modificar y se habilita caja 'monto' para no ser ingresado el valor. */
    else if (total > 0) {
      this.habilitarMontoPositivo = false;
      this.habilitarLecturaMonto = true;

      /* Dado que la caja 'monto a restar o sumar' sea = '0' se habilita la caja 'monto' */
      if (valorMontoOperar === 0 || valorMontoOperar === '') {
        this.habilitarLecturaMonto = false;
      }
    }

    this.frmReactivoPrestamo.controls['monto'].setValue(total);
  }

  enviarPrestamo() {
    if (this.frmReactivoPrestamo.invalid) {
      Object.values(this.frmReactivoPrestamo.controls).forEach(control => control.markAllAsTouched());

      this.matSnackBar.open('Existen datos incorrectos o faltantes, por favor verifique', 'CERRAR', {
        duration: 4000
      });
      return;
    }

    let tblPrestamoDTOCU = new TblPrestamoDTO();

    tblPrestamoDTOCU = this.frmReactivoPrestamo.value;

    tblPrestamoDTOCU.fePrestamo = this.frmReactivoPrestamo.controls['fePrestamo'].value;
    tblPrestamoDTOCU.feCancelado = this.frmReactivoPrestamo.controls['feCancelado'].value;

    if (tblPrestamoDTOCU.monto === 0) {
      tblPrestamoDTOCU.estado = '1'; // Marca como estado 'cancelado'
    } else {
      tblPrestamoDTOCU.estado = '0'; // Marca como estado 'pendiente'
    }
    // Recuperando las propiedades originales
    tblPrestamoDTOCU.idPrestamo = this.tblPrestamoDTO.idPrestamo;
    tblPrestamoDTOCU.idPersona = this.tblPersonaDTO.idPersona;

    this.procesarModificarPrestamo(tblPrestamoDTOCU);
  }

  procesarModificarPrestamo(tblPrestamoDTO: TblPrestamoDTO) {
    this.enProcesoPrestamo = true;

    this.personaService.modificarPrestamo(tblPrestamoDTO).subscribe(respuesta => {

      if (respuesta) {
        this.matSnackBar.open('El prestamo ha sido modificado', 'Ok', {
          duration: 4000
        });

        if (this.frmReactivoPrestamo.value.montoOperar > 0) {
          let tblHistorialPrestamoDTOCU = new TblHistorialPrestamoDTO()
          tblHistorialPrestamoDTOCU.idPrestamo = respuesta.idPrestamo;
          tblHistorialPrestamoDTOCU.montoSubtotalOperado = this.tblPrestamoDTO.monto;
          tblHistorialPrestamoDTOCU.descripcionHistorial = this.frmReactivoPrestamo.value.descripcionHistorial;
          tblHistorialPrestamoDTOCU.flagOperador = this.flOperadorCadena;
          tblHistorialPrestamoDTOCU.montoOperar = this.frmReactivoPrestamo.value.montoOperar;
          this.tblPrestamoDTO = respuesta;
          this.procesarCrearHistorialPrestamo(tblHistorialPrestamoDTOCU)

          this.frmReactivoPrestamo.controls['montoOperar'].setValue(0);
        }

        this.enProcesoPrestamo = false;
      }
    });
  }

  procesarCrearHistorialPrestamo(tblHistorialPrestamoDTO: TblHistorialPrestamoDTO) {
    this.enProcesoPrestamo = true;

    this.personaService.crearHistorialPrestamo(tblHistorialPrestamoDTO).subscribe(respuesta => {

      // console.log({ procesarCrearHistorialPrestamo: respuesta });

      if (respuesta.tipoResultado === TipoResultado.SUCCESS.toString()) {

        this.matSnackBar.open(respuesta.mensaje, 'Ok', {
          duration: 4000
        });
        this.prestamoHistorialListaComponent.paginarHistorialPrestamos();
        this.enProcesoPrestamo = false;

      } else if (respuesta.tipoResultado === TipoResultado.ERROR.toString()) {
        this.matSnackBar.open('Ocurrió un error al intentar crear el prestamo', 'ERROR', {
          duration: 4000
        });
      }
    });
  }

  cambiarOperadorSumarOResta(event: MatSlideToggleChange) {

    console.log({ eventoSumaresta: event });
    if (event.checked) {
      this.flOperador = true;
      this.flOperadorCadena = '1'; //Modo suma
      this.matSnackBar.open('Cambió a tipo operador sumar', 'Ok', {
        duration: 4000
      });
      this.calcularMontoSubTotal();
    } else {
      this.flOperador = false;
      this.flOperadorCadena = '0'; //Modo resta
      this.matSnackBar.open('Cambió a tipo operador restar', 'Ok', {
        duration: 4000
      });
      this.calcularMontoSubTotal();
    }
  }
}
