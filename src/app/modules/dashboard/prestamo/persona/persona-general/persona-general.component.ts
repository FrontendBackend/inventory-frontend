import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { pgimAnimations } from 'src/app/modules/shared/animations/pgim-animations';
import { TipoResultado } from 'src/app/modules/shared/enums/tipo-resultado';
import { Paginador } from 'src/app/modules/shared/models/Paginador';
import { ResponseDTO } from 'src/app/modules/shared/models/ResponseDTO';
import { TblPersonaDTO } from 'src/app/modules/shared/models/TblPersonaDTO';
import { TblPrestamoDTO } from 'src/app/modules/shared/models/TblPrestamoDTO';
import { ETipoAccionCRUD } from 'src/app/modules/shared/models/tipo-accion';
import { PersonaService } from 'src/app/modules/shared/services/persona.service';

@Component({
  selector: 'app-persona-general',
  templateUrl: './persona-general.component.html',
  styleUrls: ['./persona-general.component.css'],
  animations: [pgimAnimations]
})
export class PersonaGeneralComponent implements OnInit {

  @Input() tblPersonaDTO: TblPersonaDTO;

  @Input() tblPrestamoDTO: TblPrestamoDTO;

  @Input() tipoAccionCrud = ETipoAccionCRUD.NINGUNA;

  @Output() eventoPersonaModificado = new EventEmitter<TblPersonaDTO>();

  @ViewChild(MatPaginator) paginator: MatPaginator;

  totalPrestamo: number;

  enProceso = false;

  enProcesoPrestamo = false;

  enProcesoLista = false;

  cantidadRegistros: number = 0;

  controlesNovalidos: any[];

  esFormularioSoloLectura = false;

  frmReactivo: FormGroup;

  frmReactivoPrestamo: FormGroup;

  paginador: Paginador;

  estadoActivo = false;

  displayedColumns: string[] = ['descripcion', 'fePrestamo', 'feCancelado', 'monto', 'estado', 'acciones'];

  dataSource: MatTableDataSource<TblPrestamoDTO>;
  dataSourceTotal: MatTableDataSource<TblPrestamoDTO>;

  sumaTotal: number;

  constructor(private formBuilder: FormBuilder,
    private personaService: PersonaService,
    private router: Router,
    private matSnackBar: MatSnackBar,) {
    this.configurarPaginador();
  }

  ngOnInit(): void {
    this.iniciarFormulario();
    this.iniciarFormularioPrestamo();
    this.paginarPrestamos();
  }

  iniciarFormulario() {

    if (this.tipoAccionCrud === ETipoAccionCRUD.CONSULTAR) {
      this.esFormularioSoloLectura = true;
    }

    this.frmReactivo = this.formBuilder.group(
      {
        noPersona: [this.tblPersonaDTO.noPersona, [Validators.required]],
        apPaterno: [this.tblPersonaDTO.apPaterno, [Validators.required]],
        apMaterno: [this.tblPersonaDTO.apMaterno, [Validators.required]],

      }
    );

    if (this.esFormularioSoloLectura) {
      Object.values(this.frmReactivo.controls).forEach(control => control.disable());
    }
  }

  iniciarFormularioPrestamo() {

    if (this.tipoAccionCrud === ETipoAccionCRUD.CONSULTAR) {
      this.esFormularioSoloLectura = true;
    }

    this.frmReactivoPrestamo = this.formBuilder.group(
      {
        fePrestamo: ['', [Validators.required]],
        feCancelado: ['', [Validators.required]],
        descripcion: ['', [Validators.required]],
        monto: ['', [Validators.required]],
      }
    );

    if (this.esFormularioSoloLectura) {
      Object.values(this.frmReactivoPrestamo.controls).forEach(control => control.disable());
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
      );
    }

    return (
      this.frmReactivo.get(campo).hasError(error)
    );
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

  /* CARTA 1 */
  enviar() {
    if (this.frmReactivo.invalid) {
      Object.values(this.frmReactivo.controls).forEach(control => control.markAllAsTouched());

      this.matSnackBar.open('Existen datos incorrectos o faltantes, por favor verifique', 'CERRAR', {
        duration: 4000
      });
      return;
    }

    let tblPersonaDTOCU = new TblPersonaDTO();
    tblPersonaDTOCU = this.frmReactivo.value;
    // Recuperando las propiedades originales
    tblPersonaDTOCU.idPersona = this.tblPersonaDTO.idPersona;

    this.procesarCrearOModificar(tblPersonaDTOCU);

  }

  procesarCrearOModificar(tblPersonaDTO: TblPersonaDTO) {
    this.enProceso = true;

    let peticion: Observable<TblPersonaDTO>;
    let mensaje: string;

    switch (+this.tipoAccionCrud) {
      case ETipoAccionCRUD.MODIFICAR:
        peticion = this.personaService.modificarPersona(tblPersonaDTO);
        mensaje = 'El cuadro de verificación ha sido modificado';
        break;
      default:
        console.log('Ninguna acción implementada');
        break;
    }

    if (peticion) {
      peticion.subscribe((respuesta: any) => {
        this.matSnackBar.open(mensaje, 'Ok', {
          duration: 4000
        });

        this.tblPersonaDTO = respuesta;

        if (this.tipoAccionCrud === ETipoAccionCRUD.CREAR) {
          // this.eventoContratoCreado.emit(this.tblPersonaDTO);
        } else {
          this.eventoPersonaModificado.emit(this.tblPersonaDTO);
          this.paginarPrestamos();
          this.enProceso = false;
        }
      }
      );
    }
  }

  /* CARTA 2 */
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
    tblPrestamoDTOCU.feCancelado = this.frmReactivoPrestamo.controls['feCancelado'].value;;

    // Recuperando las propiedades originales
    tblPrestamoDTOCU.idPersona = this.tblPersonaDTO.idPersona;

    this.procesarCrearOModificarPrestamo(tblPrestamoDTOCU);

  }

  procesarCrearOModificarPrestamo(tblPrestamoDTO: TblPrestamoDTO) {
    this.enProcesoPrestamo = true;

    this.personaService.crearPrestamo(tblPrestamoDTO).subscribe(respuesta => {

      if (respuesta) {
        this.matSnackBar.open('El prestamo ha sido guardado', 'Ok', {
          duration: 4000
        });
        this.paginarPrestamos();
        this.enProcesoPrestamo = false;
      }
    });
  }



  get etiquetaAccion(): string {
    let nombreAccionCrud: string;
    if (this.tipoAccionCrud === ETipoAccionCRUD.CREAR) {
      nombreAccionCrud = 'CREAR';
    } else if (this.tipoAccionCrud === ETipoAccionCRUD.MODIFICAR) {
      nombreAccionCrud = 'MODIFICAR';

    }
    return nombreAccionCrud;
  }


  configurarPaginador() {
    this.paginador = new Paginador();
    this.paginador.page = 0;
    this.paginador.size = 7;
    this.paginador.totalElements = 0;
    this.paginador.pageSizeOptions = [7, 10, 20, 40, 60, 100];
    this.paginador.sort = 'feCreacion,desc';
  }

  reIniciarPaginador() {
    this.paginador.page = 0;
    this.paginador.totalElements = 0;
  }

  paginar(event: PageEvent): void {
    this.paginador.page = event.pageIndex;
    this.paginador.size = event.pageSize;

    this.paginarPrestamos();
  }

  ordenamiento(valorOption: string) {
    if (valorOption) {
      this.paginador.sort = valorOption;
      this.paginarPrestamos();
    }
  }

  paginarPrestamos() {

    this.enProcesoLista = (this.enProcesoPrestamo === true || this.enProceso === true) ? true : true;

    let idPersona = this.tblPersonaDTO.idPersona;

    this.personaService.paginarPrestamos(idPersona, this.paginador).subscribe(respuesta => {

      let res = respuesta as ResponseDTO;

      if (res.tipoResultado === TipoResultado.SUCCESS.toString()) {

        /* Obtengo de esta lista de tipo paginación el registro total solo por paginas */
        this.dataSource = new MatTableDataSource(res.data['pTblPrestamoDTO'].content);

        /* Obtengo de esta lista de tipo paginación el registro total */
        this.dataSourceTotal = new MatTableDataSource(res.data['pTblPrestamoDTOTotal'].content);

        this.cantidadRegistros = this.dataSource.data.length;
        this.paginador.totalElements = res.data['pTblPrestamoDTO'].totalElements;

        /* Obtengo los montos almacenando en un array de tipo number, tambien condicionar solo los que estan en estado 'cancelado' */
        let monto = this.dataSourceTotal.data.map(x => (x.estado === '0') ? x.monto : 0);

        /* Preparo para la suma de los montos en total */
        if (monto.length > 0) {
          this.sumaTotal = monto.reduce((a, b) => a + b);
          this.totalPrestamo = this.sumaTotal;
        } else {
          this.totalPrestamo = 0;
        }

      } else if (res.tipoResultado === TipoResultado.ERROR.toString()){
        this.matSnackBar.open(res.mensaje, res.tipoResultado, {
          duration: 4000
        });
      }

      this.enProcesoLista = false;
    });
  }

  cambiarEstado(event: MatSlideToggleChange, tblPrestamo: TblPrestamoDTO){

    let estado = event.checked;

    if(estado === true){
      tblPrestamo.estado = '1';
      this.totalPrestamo = this.totalPrestamo - tblPrestamo.monto;
      this.cambiarEstadoPrestamo(tblPrestamo);
    }else{
      tblPrestamo.estado = '0';
      this.totalPrestamo =  this.totalPrestamo + tblPrestamo.monto;
      this.cambiarEstadoPrestamo(tblPrestamo);
    }

  }

  cambiarEstadoPrestamo(tblPrestamoDTO: TblPrestamoDTO) {

    this.personaService.modificarPrestamo(tblPrestamoDTO).subscribe(respuesta => {

      if (respuesta) {
        this.matSnackBar.open('El prestamo ha sido calculado y modificado', 'Ok', {
          duration: 4000
        });
      }
    });
  }

  modificarPrestamo(tblPrestamoDTO: TblPrestamoDTO, indice: number) {
    this.router.navigate([`/dashboard/persona/prestamo-detalle/${ETipoAccionCRUD.MODIFICAR}`, tblPrestamoDTO.idPrestamo, 0]);
  }

  consultarPrestamo(tblPrestamoDTO: TblPrestamoDTO, indice: number) {

    let ventanaOrigen = (this.tipoAccionCrud === ETipoAccionCRUD.CONSULTAR) ? 4 : 2;

    this.router.navigate([`/dashboard/persona/prestamo-detalle/${ETipoAccionCRUD.CONSULTAR}`, tblPrestamoDTO.idPrestamo, 0, ventanaOrigen]);
  }

  eliminarPrestamo(tblPrestamoDTO: TblPrestamoDTO, indice: number) {

  }
}
