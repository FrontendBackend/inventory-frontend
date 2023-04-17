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
  total: number;
  constructor(private formBuilder: FormBuilder, private personaService: PersonaService,
    private matSnackBar: MatSnackBar,) { }

  ngOnInit(): void {
    this.accion = (this.tipoAccionCrud === ETipoAccionCRUD.MODIFICAR) ? 'MODIFICAR': '';

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

    const total =  Number(this.tblPrestamoDTO.monto) - Number(valorMontoOperar);

    this.total = total;

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

    if(tblPrestamoDTOCU.monto === 0){
      tblPrestamoDTOCU.estado = '1'; // Marca como estado 'cancelado'
    }else{
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

        if(this.frmReactivoPrestamo.value.montoOperar > 0){
          let tblHistorialPrestamoDTOCU = new TblHistorialPrestamoDTO()
          tblHistorialPrestamoDTOCU.idPrestamo = respuesta.idPrestamo;
          tblHistorialPrestamoDTOCU.montoSubtotalOperado = this.tblPrestamoDTO.monto;
          tblHistorialPrestamoDTOCU.montoOperar = this.frmReactivoPrestamo.value.montoOperar;
          this.tblPrestamoDTO = respuesta;
          this.procesarCrearHistorialPrestamo(tblHistorialPrestamoDTOCU)
        }

        this.enProcesoPrestamo = false;
      }
    });
  }

  procesarCrearHistorialPrestamo(tblHistorialPrestamoDTO: TblHistorialPrestamoDTO) {
    this.enProcesoPrestamo = true;

    this.personaService.crearHistorialPrestamo(tblHistorialPrestamoDTO).subscribe(respuesta => {

      console.log({procesarCrearHistorialPrestamo: respuesta});

      if (respuesta.tipoResultado === TipoResultado.SUCCESS.toString()) {
        this.matSnackBar.open(respuesta.mensaje, 'Ok', {
          duration: 4000
        });
        this.prestamoHistorialListaComponent.paginarHistorialPrestamos();
        this.enProcesoPrestamo = false;
      } else if (respuesta.tipoResultado === TipoResultado.ERROR.toString()){
        this.matSnackBar.open('Ocurrió un error al intentar crear el prestamo', 'ERROR', {
          duration: 4000
        });
      }
    });
  }

}
