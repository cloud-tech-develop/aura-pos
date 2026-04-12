import { Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { UserSessionStore } from '@store/user.session';

@Component({
  selector: 'app-index-logout',
  standalone: true,
  imports: [TranslateModule],
  template: `
    <div class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <i class="pi pi-spin pi-spinner text-4xl text-primary"></i>
        <p class="mt-4 text-lg">{{ 'AUTH.LOGOUT_LOADING' | translate }}</p>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IndexLogout implements OnInit {
  private readonly store = inject(UserSessionStore);
  private readonly router = inject(Router);

  async ngOnInit(): Promise<void> {
    // Establecer loading mientras cierra sesión
    this.store.setLoading(true);

    try {
      // Cerrar sesión en el store
      await this.store.logout();
    } finally {
      // Redirigir al login
      this.router.navigate(['/auth/logout']);
    }
  }
}
