import { Component } from '@angular/core';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast-notification',
  templateUrl: './toast-notification.html',
  styleUrl: './toast-notification.css'
})
export class ToastNotification {
  constructor(protected toastService: ToastService) {}
}
