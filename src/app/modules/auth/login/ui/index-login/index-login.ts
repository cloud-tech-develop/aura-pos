import { signal } from '@angular/core';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { InputText } from 'primeng/inputtext';
import { Password } from 'primeng/password';
import { Button } from 'primeng/button';
import { AuthService } from '@module-auth/login/services';
import { ToastAlertService } from '@services/toast-alert.service';
import { UserSessionStore } from '@store/user.session';
import { TranslationService } from '@services/translation.service';
import { ValidatorErrors } from '@shared/components/validation-errors/validator-errors.component';
import { ControlHasInvalidPipe } from '@core/pipes';
import { DASHBOARD } from '@core/constants';

@Component({
  selector: 'app-index-login',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    TranslateModule,
    InputText,
    ControlHasInvalidPipe,
    Password,
    Button,
    ValidatorErrors,
  ],
  templateUrl: './index-login.html',
  styleUrl: './index-login.css',
})
export class IndexLogin {
  private router = inject(Router);
  private service = inject(AuthService);
  private toast = inject(ToastAlertService);
  private session = inject(UserSessionStore);
  private i18n = inject(TranslationService);
  private fb = inject(FormBuilder);

  readonly isLoading = signal(false);

  readonly loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(4)]],
  });

  onSubmit(): void {
    this.loginForm.markAllAsTouched();
    if (this.loginForm.invalid) {
      return;
    }

    this.isLoading.set(true);
    const { email, password } = this.loginForm.value;

    this.service.login({ email, password }).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        if (!response.data) {
          this.toast.error(response.msg || 'Error al iniciar sesión');
          return;
        }
        // Login exitoso - guardar sesión
        const user = {
          ...response.data.user,
          token: response.data.token,
          enterprise: response.data.enterprise,
        };

        this.session.login(user, response.data.token);
        this.toast.success(this.i18n.get('AUTH.LOGIN.SUCCESS'));
        this.router.navigate([DASHBOARD]);
      },
    });
  }
}
