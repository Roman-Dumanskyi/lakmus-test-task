import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { ConditionService } from '../../services';
import { Observable, debounceTime, of, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-condition-form',
  templateUrl: './condition-form.component.html',
  styleUrls: ['./condition-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConditionFormComponent implements OnInit {
  @ViewChild('resultArea') resultArea!: ElementRef;
  form!: FormGroup;
  conditionOptions$: Observable<any[]>;
  today = {
    year: new Date().getFullYear(),
    month: new Date().getMonth(),
    day: new Date().getDate(),
  };

  constructor(
    readonly changeDetectorRef: ChangeDetectorRef,
    readonly conditionService: ConditionService
  ) {}

  ngOnInit(): void {
    this.buildForm();
  }

  getConditionOptions(search: any) {
    this.conditionOptions$ = of(null).pipe(
      debounceTime(300),
      switchMap(() =>
        this.conditionService
          .search(search.term)
          .pipe(tap((res) => console.log(res)))
      )
    );
  }

  generateUUID() {
    const s4 = () => {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    };

    return (
      s4() +
      s4() +
      '-' +
      s4() +
      '-' +
      s4() +
      '-' +
      s4() +
      '-' +
      s4() +
      s4() +
      s4()
    );
  }

  buildForm() {
    this.form = new FormGroup({
      encounter: new FormGroup({
        date: new FormControl(new Date()),
      }),
      conditions: new FormArray([this.createCondition()]),
    });
    this.changeDetectorRef.markForCheck();
    this.changeDetectorRef.detectChanges();
  }

  createCondition() {
    return new FormGroup({
      id: new FormControl(this.generateUUID()),
      condition: new FormControl(null),
      notes: new FormControl(''),
      onset_date: new FormControl(new Date()),
    });
  }

  addCondition() {
    this.getConditions().push(this.createCondition());
  }

  removeCondition(index: number) {
    this.getConditions().removeAt(index);
  }

  getConditions() {
    return this.form.get('conditions') as FormArray;
  }

  generateResult() {
    const value = this.form.getRawValue();

    value.conditions = value.conditions
      .map((c: any) =>
        c.condition
          ? {
              id: c.id,
              context: {
                identifier: {
                  type: {
                    coding: [
                      {
                        system: 'eHealth/resources', // TODO ???????
                        code: 'encounter', // TODO ???????
                      },
                    ],
                  },
                  value: c.condition.id,
                },
              },
              code: {
                coding: [
                  {
                    system: 'eHealth/ICPC2/condition_codes', // TODO ???????
                    code: c.condition.code,
                  },
                ],
              },
              notes: c.notes,
              onset_date: c.onset_date,
            }
          : null
      )
      .filter(Boolean);

    if (!value.conditions.length) {
      delete value.conditions;
    }

    this.resultArea.nativeElement.value = JSON.stringify(value);
    this.buildForm();
  }
}
