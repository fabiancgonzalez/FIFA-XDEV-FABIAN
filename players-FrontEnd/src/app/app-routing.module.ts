import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FiltrosComponent } from './views/filtros/filtros.component';
import { OnePlayerComponent } from './views/one-player/one-player.component';
import { EditPlayerComponent } from './views/edit-player/edit-player.component';
import { CreatePlayerComponent } from './views/create-player/create-player.component';
import { PaginaPrincipalComponent } from './views/pagina-principal/pagina-principal.component';
import { LoginComponent } from './views/login/login.component';
import { AuthGuard } from './auth.guard';
import { ComparePlayerComponent } from './views/compare-player/compare-player.component';


const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },

  { path: 'home', component: PaginaPrincipalComponent, canActivate: [AuthGuard]  },
  {path: 'players/filtros', component: FiltrosComponent, canActivate: [AuthGuard]},
  {path: 'players/one-player', component: OnePlayerComponent, canActivate: [AuthGuard] },
  {path: 'players/edit-delete-player', component: EditPlayerComponent, canActivate: [AuthGuard] },
  {path: 'players/create-player', component: CreatePlayerComponent, canActivate: [AuthGuard]},
  {path: 'players/compare-player', component: ComparePlayerComponent, canActivate:[AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { 


};
