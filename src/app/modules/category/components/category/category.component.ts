import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { CategoryService } from 'src/app/modules/shared/services/category.service';
import { NewCategoryComponent } from '../new-category/new-category.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {

  @ViewChild('archivo', { static: true }) archivo!: ElementRef;

  constructor(private categoryService: CategoryService,
    public dialog: MatDialog, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.getCategories();
  }

  displayedColumns: string[] = ['id', 'name', 'description', 'actions'];

  dataSource = new MatTableDataSource<CategoryElement>();

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;


  getCategories() {

    this.categoryService.getCategories()
      .subscribe((data: any) => {

        console.log("respuesta categories: ", data);
        this.processCategoriesResponse(data);
      }, (error: any) => {
        console.log("error: ", error);
      })
  }

  subirRegistrosExcel(event: any): any {

    if (event.target.files.length === 0) {

     let mensaje = Swal.fire(
        'Archivo no seleccionado!',
        'Acabas de no seleccionar un archivo',
        'warning'
      );

      return mensaje;
    }

    let file = event.target.files[0];

    console.log({ 'nombreArchivo': event });
    if (file.type === 'application/vnd.ms-excel' || file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.name.endsWith('.xls') || file.name.endsWith('.xlsx')) {
      console.log('El archivo seleccionado es un archivo de Excel.');
    } else {
      let mensaje = Swal.fire(
        'Selección de archivo invalido!',
        'Solo se debe seleccionar el archivo de tipo Excel',
        'warning'
      );

      return mensaje;
    }

    this.categoryService.subirRegistrosExcel(event).subscribe((data: string[][] | any) => {

      console.log({ data: data });
      if(data){

        this.getCategories();

        Swal.fire(
          'Genial!',
          'La importación ha sido exitosa',
          'success'
        );
      }else{
        Swal.fire(
          'Error!',
          'Algo salió mal',
          'error'
        );
      }

      // Restablecer el valor del elemento de entrada de archivo
      this.archivo.nativeElement.value = '';

    });
  }

  processCategoriesResponse(resp: any) {

    const dataCategory: CategoryElement[] = [];

    if (resp.metadata[0].code == "00") {

      let listCategory = resp.categoryResponse.category;

      listCategory.forEach((element: CategoryElement) => {
        dataCategory.push(element);
      });

      this.dataSource = new MatTableDataSource<CategoryElement>(dataCategory);
      this.dataSource.paginator = this.paginator;

    }

  }

  openCategoryDialog() {
    const dialogRef = this.dialog.open(NewCategoryComponent, {
      width: '450px'
    });

    dialogRef.afterClosed().subscribe((result: any) => {

      if (result == 1) {
        this.openSnackBar("Categoria Agregada", "Exitosa");
        this.getCategories();
      } else if (result == 2) {
        this.openSnackBar("Se produjo un error al guardar categoria", "Error");
      }
    });
  }

  edit(id: number, name: string, description: string) {
    const dialogRef = this.dialog.open(NewCategoryComponent, {
      width: '450px',
      data: { id: id, name: name, description: description }
    });

    dialogRef.afterClosed().subscribe((result: any) => {

      if (result == 1) {
        this.openSnackBar("Categoria Actualizada", "Exitosa");
        this.getCategories();
      } else if (result == 2) {
        this.openSnackBar("Se produjo un error al actualizar categoria", "Error");
      }
    });
  }

  delete(id: any) {
    /* const dialogRef = this.dialog.open(ConfirmComponent, {
      data: { id: id }
    });

    dialogRef.afterClosed().subscribe((result: any) => {

      if (result == 1) {
        this.openSnackBar("Categoria Eliminada", "Exitosa");
        this.getCategories();
      } else if (result == 2) {
        this.openSnackBar("Se produjo un error al eliminar categoria", "Error");
      }
    }); */
  }

  buscar(termino: string) {

    if (termino.length === 0) {
      return this.getCategories();
    }

    this.categoryService.getCategorieById(termino)
      .subscribe((resp: any) => {
        this.processCategoriesResponse(resp);
      })
  }

  openSnackBar(message: string, action: string): MatSnackBarRef<SimpleSnackBar> {
    return this.snackBar.open(message, action, {
      duration: 2000
    })

  }

}

export interface CategoryElement {
  description: string;
  id: number;
  name: string;
}
