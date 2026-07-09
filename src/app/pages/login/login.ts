import { Component, OnInit, signal, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoadingSpinner } from '../../components/loading-spinner/loading-spinner';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, LoadingSpinner],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  ngOnInit(): void {
    // If already logged in, redirect to dashboard
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }
    this.initForm();
  }

  private initForm(): void {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(4)]],
      password: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);
    const { username, password } = this.loginForm.value;

    this.authService.login(username, password).subscribe({
      next: (response) => {
        if (response && response['access-token']) {
          this.authService.saveToken(response['access-token']);
          this.router.navigate(['/dashboard']);
        } else {
          this.errorMessage.set('Invalid server response format.');
          this.isLoading.set(false);
        }
      },
      error: (err) => {
        const errorMsg = err.error?.message || err.error || 'Authentication failed. Please verify your credentials.';
        this.errorMessage.set(errorMsg);
        this.isLoading.set(false);
      }
    });
  }

  // Helpers for validation errors
  get usernameControl() { return this.loginForm.get('username'); }
  get passwordControl() { return this.loginForm.get('password'); }
}
