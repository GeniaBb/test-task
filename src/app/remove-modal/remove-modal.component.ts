import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-remove-modal',
  templateUrl: './remove-modal.component.html',
  styleUrls: ['./remove-modal.component.scss'],
})
export class RemoveModalComponent implements OnInit {
  isModalVisible: boolean = false;
  constructor() {}

  ngOnInit(): void {}

  show(): void {
    this.isModalVisible = true;
  }
  hide(): void {
    this.isModalVisible = false;
  }
}
