import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ToastaModule } from '../../projects/ngx-toasta/src/public-api';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';

@NgModule({
  declarations: [AppComponent, HomeComponent],
  imports: [BrowserModule, FormsModule, ToastaModule.forRoot()],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
