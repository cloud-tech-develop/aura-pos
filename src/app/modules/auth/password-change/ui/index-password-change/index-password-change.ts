import { signal } from '@angular/core';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-index-password-change',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule],
  templateUrl: './index-password-change.html',
  styleUrl: './index-password-change.css',
})
export class IndexPasswordChange {
  private router = inject(Router);

  readonly currentPassword = signal('');
  readonly newPassword = signal('');
  readonly confirmPassword = signal('');
  readonly isLoading = signal(false);
  readonly successMessage = signal('');
  readonly errorMessage = signal('');

  onSubmit() {
    this.errorMessage.set('');
    this.successMessage.set('');

    if (!this.currentPassword() || !this.newPassword() || !this.confirmPassword()) {
      this.errorMessage.set('Please fill in all fields');
      return;
    }

    if (this.newPassword() !== this.confirmPassword()) {
      this.errorMessage.set('New passwords do not match');
      return;
    }

    if (this.newPassword().length < 6) {
      this.errorMessage.set('Password must be at least 6 characters');
      return;
    }

    this.isLoading.set(true);

    setTimeout(() => {
      this.isLoading.set(false);
      this.successMessage.set('Password changed successfully');
      setTimeout(() => {
        this.router.navigate(['/auth/login']);
      }, 2000);
    }, 1000);
  }

  goBack() {
    this.router.navigate(['/auth/login']);
  }
}
