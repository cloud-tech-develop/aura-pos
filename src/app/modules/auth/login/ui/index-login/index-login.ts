import { signal } from '@angular/core';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@module-auth/login/services';
import { ToastAlertService } from '@services/toast-alert.service';

@Component({
  selector: 'app-index-login',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule],
  templateUrl: './index-login.html',
  styleUrl: './index-login.css',
})
export class IndexLogin {
  private router = inject(Router);
  private service = inject(AuthService);
  private toast = inject(ToastAlertService);

  readonly email = signal('');
  readonly password = signal('');
  readonly isLoading = signal(false);
  readonly errorMessage = signal('');

  onSubmit() {
    if (!this.email() || !this.password()) {
      this.errorMessage.set('Please enter email and password');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.service.login({ username: this.email(), password: this.password() }).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        if (response.error) {
          this.errorMessage.set(response.msg);
          return;
        }
        this.toast.success(response.msg);
        this.router.navigate(['/dashboard']);
      },
    });
  }
}
