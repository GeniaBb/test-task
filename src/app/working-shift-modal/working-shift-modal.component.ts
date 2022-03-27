import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
      loaded: new FormControl('', [Validators.required]), // Погруженно тонн
      shipped: new FormControl(''), // Отгружено тонн
      crane: new FormControl('', [Validators.required]),
      truck: new FormControl(''),
      dateStart: new FormControl('', [Validators.required]),
      dateEnd: new FormControl('', [Validators.required]),
    });
  }

  ngOnDestroy(): void {
    window.removeEventListener('keydown', this.onKeyDown);
  }

  isModalVisible: boolean = false;
  isCraneVisible: boolean = false;

  get craneType(): typeof CraneType {
    return CraneType;
  }

  show(): void {
    this.isModalVisible = true;
  }

  hide(): void {
    this.isModalVisible = false;
  }

  addDoubleCrane(): void {
    this.isCraneVisible = true;
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
