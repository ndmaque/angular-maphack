import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HelloComponent } from './hello.component';
import { MapComponent} from './modules/map.component';

@NgModule({
  imports:      [ BrowserModule, FormsModule, ReactiveFormsModule],
  declarations: [ AppComponent, HelloComponent, MapComponent ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
