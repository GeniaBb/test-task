import { Component, OnDestroy, OnInit } from '@angular/core';

import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { DataService } from '../data.service';
import { CraneType } from '../types/crane-type.enum';
import { Shift } from '../types/shift.interface';

@Component({
  selector: 'app-working-shift-modal',
  templateUrl: './working-shift-modal.component.html',
  styleUrls: ['./working-shift-modal.component.scss'],
})
export class WorkingShiftModalComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  constructor(private readonly dataService: DataService) {}
  isModalVisible: boolean = false;

  ngOnInit(): void {
    window.addEventListener('keydown', this.onKeyDown);
    this.form = new FormGroup({
      responsible: new FormControl('', [Validators.required]), //ФИО ответственного
      craneType: new FormControl('', [Validators.required]),
      start: new FormControl('', [Validators.required]),
      end: new FormControl('', [Validators.required]),
      cranes: new FormArray([]),
    });
  }

  ngOnDestroy(): void {
    window.removeEventListener('keydown', this.onKeyDown);
  }

  get craneType(): typeof CraneType {
    return CraneType;
  }

  get cranes(): FormArray {
    return this.form.get('cranes') as FormArray;
  }

  get cranesControls(): AbstractControl[] {
    return this.cranes.controls || [];
  }

  get isSingleCrane(): boolean {
    return this.form.get('craneType')?.value === CraneType.single;
  }

  get loaded(): number {
    let loaded = 0;
    const form = this.form.value as Shift;
    if (form.cranes) {
      form.cranes.forEach((crane) => {
        crane.trucks.forEach((truck) => {
          loaded += +truck.loaded;
        });
      });
    }

    return loaded;
  }

  get shipped(): number {
    let shipped = 0;
    const form = this.form.value as Shift;
    if (form.cranes) {
      form.cranes.forEach((crane) => {
        crane.trucks.forEach((truck) => {
          shipped += +truck.shipped;
        });
      });
    }

    return shipped;
  }

  getTrucksForCrane(idx: number) {
    // По индексу крана получаем его массив грузовиков
    const crane = this.cranes.get(String(idx)) as FormGroup;
    return (crane.get('trucks') as FormArray).controls || [];
  }

  show(): void {
    this.isModalVisible = true;
  }

  hide(): void {
    this.isModalVisible = false;
  }

  onChangeCrane() {
    const selectedCrane = this.form.value.craneType;
    (this.form.get('cranes') as FormArray).clear();
    this.addNewCrane();
    if (selectedCrane === this.craneType.double) {
      this.addNewCrane();
    }
  }

  onChangeTruck(craneIdx: number) {
    const crane = this.cranes.get(String(craneIdx));
    if (crane) {
      const trucks = crane.get('trucks') as FormArray;
      const lastTruck = trucks.get(String(trucks.length - 1));
      if (lastTruck?.value.truck) {
        trucks.push(this.addNewTruck());
      }
    }
  }

  addNewTruck() {
    return new FormGroup({
      truck: new FormControl(''),
      loaded: new FormControl(''),
      shipped: new FormControl(''), // Отгружено тонн
    });
  }

  addNewCrane() {
    const craneFormGroup = new FormGroup({
      trucks: new FormArray([this.addNewTruck()]),
    });
    (this.form.get('cranes') as FormArray).push(craneFormGroup);
  }

  isTruckHasValue(truck: any): boolean {
    return Boolean(truck.value.truck);
  }

  onKeyDown = (event: KeyboardEvent): void => {
    if (event.key === 'Escape') {
      this.hide();
    }
  };

  submit() {
    if (this.form.valid) {
      const data: Shift = this.form.value;
      data.loaded = this.loaded;
      data.shipped = this.shipped;
      this.dataService.createShift(this.form.value);
    }

    this.hide();

    console.log(this.form.value);
  }

  removeTruck(craneIdx: number, truckIdx: number) {
    const crane = this.cranes.get(String(craneIdx));
    if (crane) {
      const trucks = crane.get('trucks') as FormArray;
      trucks.removeAt(truckIdx);
    }
  }
}
