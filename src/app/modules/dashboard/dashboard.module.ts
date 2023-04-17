import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './pages/dashboard.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { CategoryModule } from '../category/category.module';
import { PersonaBaseComponent } from './prestamo/persona/persona-base/persona-base.component';
import { PersonaListaComponent } from './prestamo/persona/persona-lista/persona-lista.component';
import { PersonaFormularioComponent } from './prestamo/persona/persona-formulario/persona-formulario.component';
import { PersonaDialogoComponent } from './prestamo/persona/persona-dialogo/persona-dialogo.component';
import { PersonaGeneralComponent } from './prestamo/persona/persona-general/persona-general.component';
import { PersonaTarjetaComponent } from './prestamo/persona/persona-tarjeta/persona-tarjeta.component';
import { MaterialModule } from '../shared/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { PrestamoFormularioComponent } from './prestamo/prestamo/prestamo-formulario/prestamo-formulario.component';
import { PrestamoHistorialListaComponent } from './prestamo/prestamo/prestamo-historial-lista/prestamo-historial-lista.component';
import { PrestamoGeneralComponent } from './prestamo/prestamo/prestamo-general/prestamo-general.component';



@NgModule({
  declarations: [
    DashboardComponent,
    HomeComponent,
    PersonaBaseComponent,
    PersonaListaComponent,
    PersonaFormularioComponent,
    PersonaDialogoComponent,
    PersonaGeneralComponent,
    PersonaTarjetaComponent,
    PrestamoFormularioComponent,
    PrestamoHistorialListaComponent,
    PrestamoGeneralComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    HttpClientModule,
    CategoryModule,
    MaterialModule,
    ReactiveFormsModule,
    FlexLayoutModule,

  ]
})
export class DashboardModule { }
