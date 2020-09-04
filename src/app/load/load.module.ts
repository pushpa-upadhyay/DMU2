import { MaterialModule } from './../material/material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadlandingComponent } from './loadlanding/loadlanding.component';
import { LoadSelectFilesComponent } from './load-select-files/load-select-files.component';
import { LoadStatusComponent } from './load-status/load-status.component';

@NgModule({
  declarations: [LoadlandingComponent,
    LoadSelectFilesComponent,
    LoadStatusComponent],
  imports: [
    CommonModule,
    MaterialModule
  ],  
  exports: [LoadlandingComponent,
    LoadSelectFilesComponent]
})
export class LoadModule { }