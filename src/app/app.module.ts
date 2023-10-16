import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NavbarComponent } from './components/navbar/navbar.component';
import { Angular4PaystackModule } from 'angular4-paystack';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    HttpClientModule,
    NavbarComponent,
    Angular4PaystackModule.forRoot('pk_test_d9cdc81c492f1413e172216d837d56a3a423b701'),
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-bottom-full-width',
      closeButton: true,
      progressBar: true,

    }),
    BrowserAnimationsModule

  ],
  providers: [ToastrService],
  bootstrap: [AppComponent]
})
export class AppModule { }
