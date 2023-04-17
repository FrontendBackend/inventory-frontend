import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ParametroDialogo } from 'src/app/modules/shared/models/ParametroDialogo';
import { TblPersonaDTO } from 'src/app/modules/shared/models/TblPersonaDTO';
import { ETipoAccionCRUD } from 'src/app/modules/shared/models/tipo-accion';
import { PersonaService } from 'src/app/modules/shared/services/persona.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-persona-dialogo',
  templateUrl: './persona-dialogo.component.html',
  styleUrls: ['./persona-dialogo.component.css']
})
export class PersonaDialogoComponent implements OnInit {

  frmReactivo: FormGroup;

  controlesNovalidos: any[];

  tblPersonaDTO: TblPersonaDTO;

  enProceso: boolean;

  esFormularioSoloLectura = false;

  nombreAccion: string;

  mostrarReglas = false;

  cantidadTDRBase: number = 0;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public parametroDialogo: ParametroDialogo<TblPersonaDTO, any>,
    private formBuilder: FormBuilder,
    private personaService: PersonaService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<PersonaDialogoComponent>
  ) { }

  ngOnInit(): void {
    this.tblPersonaDTO = this.parametroDialogo.objeto;

    this.nombreAccion = ETipoAccionCRUD[this.parametroDialogo.accion];

    this.inicializarFormulario();
  }

  /**
    * Permite iniciar la configuración del formulario reactivo.
    */
  inicializarFormulario(): void {
    this.frmReactivo = this.formBuilder.group(
      {
        noPersona: [null],
        apPaterno: [null],
        apMaterno: [null],
      }
    );
    this.dialogRef.updateSize('100%');

    this.enlazarFormulario();
  }

  /**
   * Permite crear el formulario reactivo.
   */
  enlazarFormulario() {

    this.frmReactivo = this.formBuilder.group(
      {
        noPersona: [this.tblPersonaDTO.noPersona, [Validators.required]],
        apPaterno: [this.tblPersonaDTO.apPaterno, [Validators.required]],
        apMaterno: [this.tblPersonaDTO.apPaterno, [Validators.required]],
      }
    );

    // Deshabilitando los controles del formulario.
    if (this.esFormularioSoloLectura) {
      Object.values(this.frmReactivo.controls).forEach(control => control.disable());
    }
  }


  /**
   * Permite verificar si el control dado por el nombre tiene algún tipo de error.
   * @param campo Nombre del control.
   * @param error Error buscado.
   */
  tieneError(campo: string, error: string): boolean {
    if (error === 'any' || error === '') {
      return (
        this.frmReactivo.get(campo).invalid
        && this.frmReactivo.get(campo).touched
      );
    }

    return (
      this.frmReactivo.get(campo).hasError(error)
    );
  }

  /**
   * Procesa el envío del formulario.
   */
  enviar() {
    this.buscarControlesNoValidos();

    if (this.frmReactivo.invalid) {

      Object.values(this.frmReactivo.controls).forEach(control => control.markAllAsTouched());

      return;
    }

    this.procesarCrearOModificar();
  }

  public buscarControlesNoValidos() {
    this.controlesNovalidos = [];
    const controls = this.frmReactivo.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        this.controlesNovalidos.push({ control: name, errores: controls[name].errors });
      }
    }
  }

  /**
   * Permite procesar la acción de crear o modificar.
   */
  procesarCrearOModificar() {
    this.enProceso = true;

    let tblpersonaDTOCU = new TblPersonaDTO();
    tblpersonaDTOCU = this.frmReactivo.value;

    let peticion: Observable<TblPersonaDTO>;
    let mensaje: string;

    switch (+this.parametroDialogo.accion) {
      case ETipoAccionCRUD.CREAR:
        peticion = this.personaService.crearPersona(tblpersonaDTOCU);
        mensaje = 'La persona ha sido creada';
        break;
      default:
        console.log('Ninguna acción implementada');
        break;
    }

    if (peticion) {
      peticion.subscribe(respuesta => {
        this.snackBar.open(mensaje, 'Ok', {
          duration: 3000
        });

        this.parametroDialogo.objeto = respuesta;
        this.parametroDialogo.resultado = 'ok';

        this.enProceso = false;
        this.dialogRef.close();
      }
      );
    }
  }

}
