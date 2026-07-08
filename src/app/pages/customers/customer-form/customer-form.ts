import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CustomerService } from '../../../services/customer.service';
import { ToastService } from '../../../services/toast.service';
import { LoadingSpinner } from '../../../components/loading-spinner/loading-spinner';

@Component({
  selector: 'app-customer-form',
  imports: [ReactiveFormsModule, RouterLink, LoadingSpinner],
  templateUrl: './customer-form.html',
  styleUrl: './customer-form.css'
})
export class CustomerFormComponent implements OnInit {
  customerForm!: FormGroup;
  isEditMode = signal<boolean>(false);
  isLoading = signal<boolean>(false);
  customerId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private toastService: ToastService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.initForm();
    
    // Check if ID exists in route parameters (Edit mode)
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode.set(true);
      this.customerId = Number(idParam);
      this.loadCustomerDetails(this.customerId);
    }
  }

  private initForm(): void {
    this.customerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  private loadCustomerDetails(id: number): void {
    this.isLoading.set(true);
    this.customerService.getCustomer(id).subscribe({
      next: (customer) => {
        this.customerForm.patchValue({
          name: customer.name,
          email: customer.email
        });
        this.isLoading.set(false);
      },
      error: (err) => {
        this.toastService.showError('Failed to load customer details.');
        this.router.navigate(['/customers']);
      }
    });
  }

  onSubmit(): void {
    if (this.customerForm.invalid) {
      this.customerForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    const formValue = this.customerForm.value;

    if (this.isEditMode()) {
      const updatedCustomer = { id: this.customerId!, ...formValue };
      this.customerService.updateCustomer(this.customerId!, updatedCustomer).subscribe({
        next: () => {
          this.toastService.showSuccess('Customer profile updated successfully!');
          this.router.navigate(['/customers']);
        },
        error: (err) => {
          this.toastService.showError('Failed to update customer.');
          this.isLoading.set(false);
        }
      });
    } else {
      this.customerService.saveCustomer(formValue).subscribe({
        next: () => {
          this.toastService.showSuccess('New customer registered successfully!');
          this.router.navigate(['/customers']);
        },
        error: (err) => {
          this.toastService.showError('Failed to save customer.');
          this.isLoading.set(false);
        }
      });
    }
  }

  // Helper getters for validation errors in template
  get nameControl() { return this.customerForm.get('name'); }
  get emailControl() { return this.customerForm.get('email'); }
}
