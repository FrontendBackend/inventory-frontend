import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoryComponent } from '../category/components/category/category.component';
import { HomeComponent } from './components/home/home.component';
import { PersonaBaseComponent } from './prestamo/persona/persona-base/persona-base.component';
import { PersonaListaComponent } from './prestamo/persona/persona-lista/persona-lista.component';
import { PersonaFormularioComponent } from './prestamo/persona/persona-formulario/persona-formulario.component';
import { PrestamoFormularioComponent } from './prestamo/prestamo/prestamo-formulario/prestamo-formulario.component';

const childRoutes: Routes = [
    { path: '', component: HomeComponent },
    {
      path: 'persona',
      component: PersonaBaseComponent,
      data: {
        title: 'Personas',
        breadcrumb: 'Personas'
      },
      children: [

        /*
        * -------------------------------------
        * ---------Primera ventana-------------
        * -------------------------------------
        */
        {
          path: '',
          component: PersonaListaComponent,
          data: {
            title: 'Personas',
            breadcrumb: 'Personas'
          }
        },
        {
          path: '2/:idPersona/:nroPestania',
          component: PersonaFormularioComponent,
          data: {
            title: 'Modificar',
            breadcrumb: 'Modificar persona'
          }
        },
        {
          path: '4/:idPersona/:nroPestania',
          component: PersonaFormularioComponent,
          data: {
            title: 'Consultar',
            breadcrumb: 'Consultar persona'
          }
        },

        /*
        * -------------------------------------
        * ---------Segunda ventana-------------
        * -------------------------------------
        */
        {
          path: 'prestamo-detalle/2/:idPrestamo/:nroPestania',
          component: PrestamoFormularioComponent,
          data: {
            title: 'Modificar prestamo',
            breadcrumb: 'Modificar prestamo'
          }
        },
        {
          path: 'prestamo-detalle/4/:idPrestamo/:nroPestania/:ventanaOrigen',
          component: PrestamoFormularioComponent,
          data: {
            title: 'Consultar prestamo',
            breadcrumb: 'Consultar prestamo'
          }
        },
      ]
    },
    { path: 'home', component: HomeComponent },
    { path: 'category', component: CategoryComponent },
]

@NgModule({
    imports: [RouterModule.forChild(childRoutes)],
    exports: [RouterModule],
})
export class RouterChildModule { }
