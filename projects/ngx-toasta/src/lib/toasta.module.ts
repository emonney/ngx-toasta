import { NgModule, ModuleWithProviders } from "@angular/core";
import { CommonModule } from '@angular/common';


import { ToastaComponent } from './toasta.component';
import { ToastComponent } from './toast.component';
import { SafeHtmlPipe } from './shared';
import { ToastaService, ToastaConfig, toastaServiceFactory } from './toasta.service';

export let providers = [
  ToastaConfig,
  { provide: ToastaService, useFactory: toastaServiceFactory, deps: [ToastaConfig] }
];

@NgModule({
  imports: [CommonModule],
  declarations: [ToastComponent, ToastaComponent, SafeHtmlPipe],
  exports: [ToastComponent, ToastaComponent],
  providers: providers
})
export class ToastaModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ToastaModule,
      providers: providers
    };
  }
}
