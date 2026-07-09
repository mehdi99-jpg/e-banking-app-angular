import { HttpClient } from '@angular/common/http';
import { Injectable, signal, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly baseUrl = `${environment.apiBaseUrl}/auth`;
  private http = inject(HttpClient);
  private router = inject(Router);

  // Core Authentication Signals
  token = signal<string | null>(null);
  username = signal<string | null>(null);
  roles = signal<string[]>([]);

  // Computed Authentication State
  isLoggedIn = computed(() => this.token() !== null);
  isAdmin = computed(() => this.roles().includes('ROLE_ADMIN'));

  constructor() {
    this.loadStoredToken();
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/login`, { username, password });
  }

  saveToken(tokenValue: string): void {
    localStorage.setItem('jwt-token', tokenValue);
    this.token.set(tokenValue);
    
    const decoded = this.decodeToken(tokenValue);
    if (decoded) {
      this.username.set(decoded.sub || null);
      if (decoded.scope) {
        // split space-separated roles
        this.roles.set(decoded.scope.split(' '));
      } else {
        this.roles.set([]);
      }
    }
  }

  loadStoredToken(): void {
    const storedToken = localStorage.getItem('jwt-token');
    if (storedToken) {
      const decoded = this.decodeToken(storedToken);
      if (decoded) {
        // Check if token is expired
        const isExpired = decoded.exp * 1000 < Date.now();
        if (!isExpired) {
          this.token.set(storedToken);
          this.username.set(decoded.sub || null);
          if (decoded.scope) {
            this.roles.set(decoded.scope.split(' '));
          } else {
            this.roles.set([]);
          }
          return;
        }
      }
      // If token is invalid or expired, clear it
      this.logout();
    }
  }

  logout(): void {
    localStorage.removeItem('jwt-token');
    this.token.set(null);
    this.username.set(null);
    this.roles.set([]);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return this.token();
  }

  private decodeToken(token: string): any {
    try {
      const payloadBase64 = token.split('.')[1];
      // Decode base64 utf-8 correctly
      const decodedPayload = atob(payloadBase64);
      return JSON.parse(decodedPayload);
    } catch (e) {
      return null;
    }
  }
}
