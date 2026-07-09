import { Component, signal, inject, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChatService, ChatMessage } from '../../services/chat.service';
import { AuthService } from '../../services/auth.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-chat-widget',
  imports: [FormsModule, DatePipe],
  templateUrl: './chat-widget.html',
  styleUrl: './chat-widget.css'
})
export class ChatWidgetComponent implements AfterViewChecked {
  chatService = inject(ChatService);
  authService = inject(AuthService);

  isOpen = signal(false);
  userInput = '';

  @ViewChild('messagesContainer') messagesContainer!: ElementRef;

  toggleChat(): void {
    this.isOpen.update(v => !v);
  }

  sendMessage(): void {
    const message = this.userInput.trim();
    if (!message) return;
    this.chatService.sendMessage(message);
    this.userInput = '';
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    try {
      if (this.messagesContainer) {
        this.messagesContainer.nativeElement.scrollTop = 
          this.messagesContainer.nativeElement.scrollHeight;
      }
    } catch (err) {}
  }
}
