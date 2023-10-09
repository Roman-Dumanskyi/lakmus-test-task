import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConditionRoutingModule } from './condition-routing.module';
import { ConditionFormComponent } from './components/condition-form/condition-form.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BootstrapIconsModule } from 'ng-bootstrap-icons';
import { Calendar } from 'ng-bootstrap-icons/icons';
import { NgSelectModule } from '@ng-select/ng-select';
import { HttpClientModule } from '@angular/common/http';

const icons = { Calendar };

@NgModule({
  declarations: [ConditionFormComponent],
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    BootstrapIconsModule.pick(icons),
    NgSelectModule,
    ConditionRoutingModule,
  ],
  exports: [ConditionFormComponent, BootstrapIconsModule],
})
export class ConditionModule {}
