import { HttpClient } from '@angular/common/http';
import { Injectable, signal, inject } from '@angular/core';
import { environment } from '../../environments/environment';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private readonly baseUrl = `${environment.apiBaseUrl}/ai`;
  private http = inject(HttpClient);

  // Reactive conversation history
  messages = signal<ChatMessage[]>([]);
  isLoading = signal<boolean>(false);

  sendMessage(userMessage: string): void {
    // Add user message to history immediately
    this.messages.update(msgs => [
      ...msgs,
      { role: 'user', content: userMessage, timestamp: new Date() }
    ]);

    this.isLoading.set(true);

    this.http.post<any>(`${this.baseUrl}/chat`, { message: userMessage }).subscribe({
      next: (response) => {
        // Add AI response to history
        this.messages.update(msgs => [
          ...msgs,
          { role: 'assistant', content: response.response, timestamp: new Date() }
        ]);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.messages.update(msgs => [
          ...msgs,
          { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.', timestamp: new Date() }
        ]);
        this.isLoading.set(false);
      }
    });
  }

  clearHistory(): void {
    this.messages.set([]);
  }
}
