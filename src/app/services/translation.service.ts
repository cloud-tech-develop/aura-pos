import { Injectable, signal, inject, PLATFORM_ID, effect } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { TranslateService as NgxTranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

export type AppLanguage = 'en' | 'es';

@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  private translate = inject(NgxTranslateService);
  private platformId = inject(PLATFORM_ID);

  readonly currentLanguage = signal<AppLanguage>('en');
  readonly availableLanguages: AppLanguage[] = ['en', 'es'];

  private readonly STORAGE_KEY = 'aura-pos-language';

  constructor() {
    this.initLanguages();

    effect(() => {
      const lang = this.currentLanguage();
      if (lang) {
        this.translate.use(lang);
      }
    });
  }

  private initLanguages(): void {
    this.translate.addLangs(this.availableLanguages);

    const savedLanguage = this.getStoredLanguage();
    if (savedLanguage) {
      this.currentLanguage.set(savedLanguage);
    } else {
      const browserLang = this.translate.getBrowserLang();
      if (browserLang && this.availableLanguages.includes(browserLang as AppLanguage)) {
        this.currentLanguage.set(browserLang as AppLanguage);
      } else {
        this.currentLanguage.set('en');
      }
    }

    this.translate.setDefaultLang(this.currentLanguage());
  }

  setLanguage(lang: AppLanguage): void {
    if (this.availableLanguages.includes(lang)) {
      this.currentLanguage.set(lang);
      this.saveToStorage(lang);
    }
  }

  get(key: string, params?: Record<string, unknown>): string {
    return this.translate.instant(key, params);
  }

  get$(key: string, params?: Record<string, unknown>): Observable<string> {
    return this.translate.get(key, params);
  }

  getCurrentLanguage(): AppLanguage {
    return this.currentLanguage();
  }

  getLanguageName(lang: AppLanguage): string {
    const names: Record<AppLanguage, string> = {
      en: 'English',
      es: 'Español',
    };
    return names[lang];
  }

  private getStoredLanguage(): AppLanguage | null {
    if (!isPlatformBrowser(this.platformId)) return null;

    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved && this.availableLanguages.includes(saved as AppLanguage)) {
      return saved as AppLanguage;
    }
    return null;
  }

  private saveToStorage(lang: AppLanguage): void {
    if (!isPlatformBrowser(this.platformId)) return;
    localStorage.setItem(this.STORAGE_KEY, lang);
  }
}
