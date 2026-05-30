import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-album-confirm-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './album-confirm-modal.html',
  styleUrl: './album-confirm-modal.css',
})
export class AlbumConfirmModalComponent {
  @Input() pendingTotal = 0;
  @Input() placing = false;

  @Output() cancel = new EventEmitter<void>();
  @Output() confirmPlace = new EventEmitter<void>();
}
