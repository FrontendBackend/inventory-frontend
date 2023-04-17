import { Component, Input, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { TipoResultado } from 'src/app/modules/shared/enums/tipo-resultado';
import { Paginador } from 'src/app/modules/shared/models/Paginador';
import { ResponseDTO } from 'src/app/modules/shared/models/ResponseDTO';
import { TblHistorialPrestamoDTO } from 'src/app/modules/shared/models/TblHistorialPrestamoDTO';
import { TblPrestamoDTO } from 'src/app/modules/shared/models/TblPrestamoDTO';
import { PersonaService } from 'src/app/modules/shared/services/persona.service';

@Component({
  selector: 'app-prestamo-historial-lista',
  templateUrl: './prestamo-historial-lista.component.html',
  styleUrls: ['./prestamo-historial-lista.component.css']
})
export class PrestamoHistorialListaComponent implements OnInit {

  @Input() tblPrestamoDTO: TblPrestamoDTO;

  cantidadRegistros: number = 0;

  displayedColumns: string[] = ['fePrestamoHistorial', 'descripcionHistorial', 'montoSubtotalOperado', 'montoOperar', 'flagOperador', 'acciones'];

  dataSource: MatTableDataSource<TblHistorialPrestamoDTO>;

  paginador: Paginador;

  enProceso = false;

  constructor(private personaService: PersonaService, private matSnackBar: MatSnackBar) {
    this.configurarPaginador();
   }

  ngOnInit(): void {
    this.paginarHistorialPrestamos();
  }

  configurarPaginador() {
    this.paginador = new Paginador();
    this.paginador.page = 0;
    this.paginador.size = 7;
    this.paginador.totalElements = 0;
    this.paginador.pageSizeOptions = [7, 10, 20, 40, 60, 100];
    this.paginador.sort = 'fePrestamoHistorial,desc';
  }

  reIniciarPaginador() {
    this.paginador.page = 0;
    this.paginador.totalElements = 0;
  }

  paginar(event: PageEvent): void {
    this.paginador.page = event.pageIndex;
    this.paginador.size = event.pageSize;

    this.paginarHistorialPrestamos();
  }

  ordenamiento(valorOption: string) {
    if (valorOption) {
      this.paginador.sort = valorOption;
      this.paginarHistorialPrestamos();
    }
  }

  paginarHistorialPrestamos(){

    this.enProceso = true;

    let idPrestamo = this.tblPrestamoDTO.idPrestamo;

    this.personaService.paginarHistorialPrestamos(idPrestamo, this.paginador).subscribe(respuesta => {

      let res = respuesta as ResponseDTO;

      console.log({respuesta});

      if (res.tipoResultado === TipoResultado.SUCCESS.toString()) {

        /* Obtengo de esta lista de tipo paginación el registro total solo por paginas */
        this.dataSource = new MatTableDataSource(res.data.content);
        this.cantidadRegistros = this.dataSource.data.length;
        this.paginador.totalElements = res.data.totalElements;

      } else if (res.tipoResultado === TipoResultado.ERROR.toString()){
        this.matSnackBar.open(res.mensaje, res.tipoResultado, {
          duration: 4000
        });
      }

      this.enProceso = false;
    });
  }
}
