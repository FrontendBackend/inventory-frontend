import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ParametroDialogo } from 'src/app/modules/shared/models/ParametroDialogo';
import { TblPersonaDTO } from 'src/app/modules/shared/models/TblPersonaDTO';
import { ETipoAccionCRUD } from 'src/app/modules/shared/models/tipo-accion';
import { PersonaService } from 'src/app/modules/shared/services/persona.service';
import { PersonaDialogoComponent } from '../persona-dialogo/persona-dialogo.component';
import { Paginador } from 'src/app/modules/shared/models/Paginador';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { pgimAnimations } from 'src/app/modules/shared/animations/pgim-animations';

@Component({
  selector: 'app-persona-lista',
  templateUrl: './persona-lista.component.html',
  styleUrls: ['./persona-lista.component.scss'],
  animations: [pgimAnimations]
})
export class PersonaListaComponent implements OnInit {

  @Input() tblPersonaDTO: TblPersonaDTO;
  @Input() tipoAccionCrud = ETipoAccionCRUD.NINGUNA;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  enProceso = false;
  cantidadRegistros = 0;
  lTblPersonaDTO: TblPersonaDTO[];
  paginador: Paginador;
  constructor(private matDialog: MatDialog, private router: Router, private personaService: PersonaService) {
    this.configurarPaginador();
  }

  ngOnInit(): void {
    this.paginarPersona();
  }

  configurarPaginador() {
    this.paginador = new Paginador();
    this.paginador.page = 0;
    this.paginador.size = 20;
    this.paginador.totalElements = 0;
    this.paginador.pageSizeOptions = [10, 20, 40, 60, 100];
    this.paginador.sort = 'noPersona,asc';
  }

  reIniciarPaginador() {
    this.paginador.page = 0;
    this.paginador.totalElements = 0;
  }

  paginar(event: PageEvent): void {
    this.paginador.page = event.pageIndex;
    this.paginador.size = event.pageSize;

    this.paginarPersona();
  }

  ordenamiento(valorOption: string) {
    if (valorOption) {
      this.paginador.sort = valorOption;
      this.paginarPersona();
    }
  }

  crearPersona() {
    let tblPersona: TblPersonaDTO;

    const parametroDialogo = new ParametroDialogo<TblPersonaDTO, any>();
    parametroDialogo.accion = ETipoAccionCRUD.CREAR;
    parametroDialogo.objeto = new TblPersonaDTO();
    parametroDialogo.objeto.idPersona = 0;

    const dialogRef = this.matDialog.open(PersonaDialogoComponent, {
      disableClose: true,
      data: parametroDialogo,
    });

    dialogRef.afterClosed().subscribe((resultado) => {
      if (parametroDialogo.resultado === 'ok') {
        tblPersona = parametroDialogo.objeto;
        this.paginarPersona();
      }
    });
  }

  consultarPersona(tblPersonaDTO: TblPersonaDTO) {
    this.router.navigate([`/dashboard/persona/${ETipoAccionCRUD.CONSULTAR}`,
    tblPersonaDTO.idPersona, this.tipoAccionCrud]);
  }

  modificarPersona(tblPersonaDTO: TblPersonaDTO) {
    this.router.navigate([`/dashboard/persona/${ETipoAccionCRUD.MODIFICAR}`,
    tblPersonaDTO.idPersona, this.tipoAccionCrud]);
  }

  paginarPersona(): void {
    this.enProceso = true;

    this.personaService.paginarPersonas(this.paginador).subscribe(respuesta => {

      if (respuesta) {
        this.lTblPersonaDTO = respuesta.content;
        this.cantidadRegistros = respuesta.totalElements;
        this.paginador.totalElements = this.cantidadRegistros;

      }
      this.enProceso = false;
    });
  }
}
