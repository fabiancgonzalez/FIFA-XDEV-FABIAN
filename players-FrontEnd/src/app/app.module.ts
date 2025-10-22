import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, RouterOutlet } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClient, HttpClientModule, provideHttpClient } from '@angular/common/http';
import { ModuloHTTPService } from './core/services/modulo-http.service';
import { FiltrosComponent } from './views/filtros/filtros.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OnePlayerComponent } from './views/one-player/one-player.component';
import { EditPlayerComponent } from './views/edit-player/edit-player.component';
import { CreatePlayerComponent } from './views/create-player/create-player.component';
import { PaginaPrincipalComponent } from './views/pagina-principal/pagina-principal.component';
import { HeaderComponent } from './views/header/header.component';
import { LoginComponent } from './views/login/login.component';

import { AuthGuard } from './auth.guard';
import { ComparePlayerComponent } from './views/compare-player/compare-player.component';
import { SafeUrlPipe } from './core/pipes/safe-url.pipe';
import { StatsTimelineComponent } from './views/stats-timeline/stats-timeline.component';
import { LogoutComponent } from './views/logout/logout.component';
import { UserManagementComponent } from './views/user-management/user-management.component';

@NgModule({
  declarations: [
    AppComponent,
    FiltrosComponent,
    OnePlayerComponent,
    EditPlayerComponent,
    CreatePlayerComponent,
    PaginaPrincipalComponent,
    HeaderComponent,
    LoginComponent,
    ComparePlayerComponent,
    SafeUrlPipe,
    StatsTimelineComponent,
    LogoutComponent,
    UserManagementComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    RouterOutlet,
    RouterModule,
    HttpClientModule
  ],
  providers: [
    ModuloHTTPService,
    AuthGuard
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
