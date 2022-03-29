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
import { Crane, Shift, Truck } from '../types/shift.interface';

@Component({
  selector: 'app-working-shift-modal',
  templateUrl: './working-shift-modal.component.html',
  styleUrls: ['./working-shift-modal.component.scss'],
})
export class WorkingShiftModalComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  constructor(private readonly dataService: DataService) {}
  isModalVisible: boolean = false;
  currentId: number = -1;
  isEdit: boolean = false;

  ngOnInit(): void {
    window.addEventListener('keydown', this.onKeyDown);
    this.resetForm();
  }

  resetForm() {
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
          loaded += +(truck.loaded || 0);
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
          shipped += +(truck.shipped || 0);
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

  show(shift?: Shift): void {
    if (shift) {
      this.isEdit = true;
      this.currentId = shift.id;
      console.log(shift);

      this.form = new FormGroup({
        responsible: new FormControl(shift.responsible, [Validators.required]), //ФИО ответственного
        craneType: new FormControl(shift.craneType, [Validators.required]),
        start: new FormControl(shift.start, [Validators.required]),
        end: new FormControl(shift.end, [Validators.required]),
        cranes: new FormArray([]),
      });
      shift.cranes.forEach((crane) => {
        this.addNewCrane(crane);
      });
    } else {
      this.isEdit = false;
    }
    this.isModalVisible = true;
  }

  hide(): void {
    this.isModalVisible = false;
    this.currentId = -1;
    this.resetForm();
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

  addNewTruck(truck?: Truck) {
    return new FormGroup({
      truck: new FormControl(truck?.truck || ''),
      loaded: new FormControl(truck?.loaded || ''),
      shipped: new FormControl(truck?.shipped || ''), // Отгружено тонн
    });
  }

  addNewCrane(crane?: Crane) {
    const craneFormGroup = new FormGroup({
      trucks: new FormArray(
        crane
          ? [
              ...crane.trucks.map((truck) => this.addNewTruck(truck)),
              this.addNewTruck(),
            ]
          : [this.addNewTruck()]
      ),
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
      if (this.isEdit) {
        data.id = this.currentId;
        this.dataService.editShift(data);
      } else {
        this.dataService.createShift(data);
      }
    }

    this.hide();
  }

  removeTruck(craneIdx: number, truckIdx: number) {
    const crane = this.cranes.get(String(craneIdx));
    if (crane) {
      const trucks = crane.get('trucks') as FormArray;
      trucks.removeAt(truckIdx);
    }
  }

  getIsTruckSelected(craneIdx: number, truckIdx: number) {
    const crane = this.cranes.get(String(craneIdx));
    let isTruckSelected = false;
    if (crane) {
      const trucks = crane.get('trucks') as FormArray;
      const truck = trucks.get(String(truckIdx));

      isTruckSelected = Boolean((truck as FormGroup).value.truck);
    }

    return isTruckSelected;
  }

  getLoadedInputDisableState(craneIdx: number, truckIdx: number) {
    const crane = this.cranes.get(String(craneIdx));
    let hasShipped = false;

    if (crane) {
      const trucks = crane.get('trucks') as FormArray;
      const truck = trucks.get(String(truckIdx));

      hasShipped = Boolean((truck as FormGroup).value.shipped);
    }

    return hasShipped || !this.getIsTruckSelected(craneIdx, truckIdx);
  }

  getShipppedInputDisableState(craneIdx: number, truckIdx: number) {
    const crane = this.cranes.get(String(craneIdx));
    let hasLoaded = false;

    if (crane) {
      const trucks = crane.get('trucks') as FormArray;
      const truck = trucks.get(String(truckIdx));

      hasLoaded = Boolean((truck as FormGroup).value.loaded);
    }

    return hasLoaded || !this.getIsTruckSelected(craneIdx, truckIdx);
  }
}
