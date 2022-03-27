import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { CraneType } from '../types/crane-type.enum';

@Component({
  selector: 'app-working-shift-modal',
  templateUrl: './working-shift-modal.component.html',
  styleUrls: ['./working-shift-modal.component.scss'],
})
export class WorkingShiftModalComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  constructor() {}

  ngOnInit(): void {
    window.addEventListener('keydown', this.onKeyDown);
    this.form = new FormGroup({
      employee: new FormControl('', [Validators.required]), //ФИО ответственного
      crane: new FormControl('', [Validators.required]),
      truck: new FormControl(''),
      dateStart: new FormControl('', [Validators.required]),
      dateEnd: new FormControl('', [Validators.required]),
      cranes: new FormArray([]),
    });
  }

  ngOnDestroy(): void {
    window.removeEventListener('keydown', this.onKeyDown);
  }

  isModalVisible: boolean = false;

  get craneType(): typeof CraneType {
    return CraneType;
  }

  get cranes(): FormArray {
    return this.form.get('cranes') as FormArray;
  }

  get cranesControls(): AbstractControl[] {
    return this.cranes.controls || [];
  }

  getTrucksForCrane(idx: number) {
    // По индексу крана получаем его массив грузовиков
    const crane = this.cranes.get(String(idx)) as FormGroup;
    console.log('crane', crane);
    return (crane.get('trucks') as FormArray).controls || [];
  }

  show(): void {
    this.isModalVisible = true;
  }

  hide(): void {
    this.isModalVisible = false;
  }

  onChangeCrane() {
    const selectedCrane = this.form.value.crane;
    (this.form.get('cranes') as FormArray).clear();
    this.addCraneFormGroup();
    if (selectedCrane === this.craneType.double) {
      this.addCraneFormGroup();
    }
  }

  addCraneFormGroup() {
    const craneFormGroup = new FormGroup({
      trucks: new FormArray([
        new FormGroup({
          truck: new FormControl('', [Validators.required]),
          loaded: new FormControl(''),
          shipped: new FormControl(''), // Отгружено тонн
        }),
      ]),
    });
    (this.form.get('cranes') as FormArray).push(craneFormGroup);
  }

  onKeyDown = (event: KeyboardEvent): void => {
    if (event.key === 'Escape') {
      this.hide();
    }
  };

  submit() {
    this.form.markAsTouched();
    console.log(this.form);
  }
}
