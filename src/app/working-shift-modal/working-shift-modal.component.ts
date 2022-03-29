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
import { Crane } from '../types/crane.interface';
import { Shift } from '../types/shift.interface';
import { Truck } from '../types/truck.interface';

@Component({
  selector: 'app-working-shift-modal',
  templateUrl: './working-shift-modal.component.html',
  styleUrls: ['./working-shift-modal.component.scss'],
})
/**
 * Модал создания/редактирования смены
 */
export class WorkingShiftModalComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  constructor(private readonly dataService: DataService) {}
  isModalVisible: boolean = false;
  currentId: number = -1;
  isEdit: boolean = false;

  ngOnInit(): void {
    // Закрытие модалки по кнопке esc делаем глобальным
    window.addEventListener('keydown', this.onKeyDown);
    this.resetForm();
  }

  /**
   * Сброс формы
   */
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
    // При уничтожении компонента удаляем eventListener с window
    window.removeEventListener('keydown', this.onKeyDown);
  }

  /**
   * Тип крана (enum)
   */
  get craneType(): typeof CraneType {
    return CraneType;
  }

  /**
   * Модель кранов
   */
  get cranes(): FormArray {
    return this.form.get('cranes') as FormArray;
  }

  /**
   * Контролы кранов
   */
  get cranesControls(): AbstractControl[] {
    return this.cranes.controls || [];
  }

  /**
   * Выбран ли одинарный кран
   */
  get isSingleCrane(): boolean {
    return this.form.get('craneType')?.value === CraneType.single;
  }

  /**
   * Количество погруженных тонн
   */
  get loaded(): number {
    return this.getTotal('loaded');
  }

  /**
   * Количество отгруженных тонн
   */
  get shipped(): number {
    return this.getTotal('shipped');
  }

  /**
   * Получение модели грузовиков крана
   * @param idx индекс крана
   * @returns модель грузовиков
   */
  getTrucksForCrane(idx: number) {
    // По индексу крана получаем его массив грузовиков
    const crane = this.cranes.get(String(idx)) as FormGroup;
    return (crane.get('trucks') as FormArray).controls || [];
  }

  /**
   * Получить общее количество погруженных или отгруженных всеми грузовиками тонн
   * @param type погружено или отгружено
   * @returns количество погруженных/отгруженных тонн
   */
  getTotal(type: 'loaded' | 'shipped'): number {
    let result = 0;
    const form = this.form.value as Shift;
    if (form.cranes) {
      form.cranes.forEach((crane) => {
        crane.trucks.forEach((truck) => {
          result += +(truck[type] || 0);
        });
      });
    }

    return result;
  }

  /**
   * Показ модального окна
   */
  show(shift?: Shift): void {
    if (shift) {
      this.isEdit = true;
      this.currentId = shift.id;
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

  /**
   * Скрытие модального окна
   */
  hide(): void {
    this.isModalVisible = false;
    this.currentId = -1;
    this.resetForm();
  }

  /**
   * Выбор типа крана
   */
  onChangeCrane() {
    // Если выбран одинарный кран, то поле выводится один раз, если двойной, то добавляется ещё одно поле
    const selectedCrane = this.form.value.craneType;
    (this.form.get('cranes') as FormArray).clear();
    this.addNewCrane();
    if (selectedCrane === this.craneType.double) {
      this.addNewCrane();
    }
  }

  /**
   * Выбор грузовика
   */
  onChangeTruck(craneIdx: number) {
    const crane = this.cranes.get(String(craneIdx));
    if (crane) {
      const trucks = crane.get('trucks') as FormArray;
      const lastTruck = trucks.get(String(trucks.length - 1));
      //Если выбран грузовик, то добавляется новое пустое поле с грузовиком и данными по нему
      if (lastTruck?.value.truck) {
        trucks.push(this.addNewTruck());
      }
    }
  }

  /**
   * Добавление модели грузовика
   * @param truck данные грузовика
   * @returns модель
   */
  addNewTruck(truck?: Truck) {
    // Если есть данные, то поля формы предзаполянются
    return new FormGroup({
      truck: new FormControl(truck?.truck || ''),
      loaded: new FormControl(truck?.loaded || ''),
      shipped: new FormControl(truck?.shipped || ''), // Отгружено тонн
    });
  }

  /**
   * Добавление модели крана
   * @param crane данные крана
   */
  addNewCrane(crane?: Crane) {
    const craneFormGroup = new FormGroup({
      trucks: new FormArray(
        // Если есть кран, то добавляем модели формы по его данным
        crane
          ? [
              // Данные грузовиков мапятся в модели
              ...crane.trucks.map((truck) => this.addNewTruck(truck)),
              // Добавляем пустую модель в конец
              this.addNewTruck(),
            ]
          : // Если крана нет, просто добавляем пустую модель грузовика
            [this.addNewTruck()]
      ),
    });
    (this.form.get('cranes') as FormArray).push(craneFormGroup);
  }

  /**
   * Проверяет наличие данных у поля грузовик
   */
  isTruckHasValue(truck: any): boolean {
    return Boolean(truck.value.truck);
  }

  /**
   * Закрытие модального окна при нажатии на кнопку Esc
   */
  onKeyDown = (event: KeyboardEvent): void => {
    if (event.key === 'Escape') {
      this.hide();
    }
  };

  /**
   * Обработка данных и сохранение
   */
  submit() {
    if (this.form.valid) {
      const data: Shift = this.form.value;
      data.loaded = this.loaded;
      data.shipped = this.shipped;
      data.cranes.forEach(
        (crane) => (crane.trucks = crane.trucks.filter((truck) => truck.truck))
      );
      if (this.isEdit) {
        data.id = this.currentId;
        this.dataService.editShift(data);
      } else {
        this.dataService.createShift(data);
      }
    }

    this.hide();
  }

  /**
   * Удаление поля с грузовиком и информацией об отгруженных и погруженных тоннах
   */
  removeTruck(craneIdx: number, truckIdx: number) {
    const crane = this.cranes.get(String(craneIdx));
    if (crane) {
      const trucks = crane.get('trucks') as FormArray;
      trucks.removeAt(truckIdx);
    }
  }

  /**
   * Получить заполнено ли поле грузовик в модели грузовика по id модели крана и id модели грузовика
   * @param craneIdx id модели крана
   * @param truckIdx id модели грузовика
   * @returns Заполнено ли поле грузовик
   */
  getIsTruckSelected(craneIdx: number, truckIdx: number): boolean {
    const crane = this.cranes.get(String(craneIdx));
    if (crane) {
      const trucks = crane.get('trucks') as FormArray;
      const truck = trucks.get(String(truckIdx));

      return Boolean((truck as FormGroup).value.truck);
    }

    return false;
  }

  /**
   * Заблокировано ли поле погружено для модели грузовика
   */
  getLoadedInputDisableState(craneIdx: number, truckIdx: number) {
    return this.getTruckInfoInputDisabledState(craneIdx, truckIdx, 'shipped');
  }

  /**
   * Заблокировано ли поле отгружено для модели грузовика
   */
  getShipppedInputDisableState(craneIdx: number, truckIdx: number) {
    return this.getTruckInfoInputDisabledState(craneIdx, truckIdx, 'loaded');
  }

  /**
   * Заблокировано ли поле погружено/отгружено для модели грузовика
   */
  getTruckInfoInputDisabledState(
    craneIdx: number,
    truckIdx: number,
    type: 'loaded' | 'shipped'
  ) {
    const crane = this.cranes.get(String(craneIdx));
    let hasInputValue = false;

    if (crane) {
      const trucks = crane.get('trucks') as FormArray;
      const truck = trucks.get(String(truckIdx));

      hasInputValue = Boolean((truck as FormGroup).value[type]);
    }

    return hasInputValue || !this.getIsTruckSelected(craneIdx, truckIdx);
  }
}
