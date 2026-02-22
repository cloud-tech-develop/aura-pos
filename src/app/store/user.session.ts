import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { computed, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { User, AuthState, initialAuthState } from '@core/interfaces/user.interface';
import { StorageService, StorageServiceConfig, StorageType } from '@services/storage.service';
import { AUTH_STORAGE_KEY } from '@core/constants';

const DEFAULT_STORAGE_CONFIG: StorageServiceConfig = {
  type: 'indexedDB',
  dbName: 'aura-pos-db',
  storeName: 'aura-pos-store',
};

let storageConfig: StorageServiceConfig = { ...DEFAULT_STORAGE_CONFIG };

export function setStorageConfig(config: {
  type: StorageType;
  dbName?: string;
  storeName?: string;
}): void {
  storageConfig = { ...DEFAULT_STORAGE_CONFIG, ...config };
}

export function getStorageConfig(): StorageServiceConfig {
  return { ...storageConfig };
}

async function loadFromStorage(storageService: StorageService): Promise<AuthState> {
  if (!isPlatformBrowser(inject(PLATFORM_ID))) {
    return initialAuthState;
  }

  const saved = await storageService.getItem<AuthState>(AUTH_STORAGE_KEY, storageConfig);
  if (saved) {
    return {
      ...initialAuthState,
      ...saved,
      isAuthenticated: !!saved.token && !!saved.user,
    };
  }

  return initialAuthState;
}

async function saveToStorage(state: AuthState, storageService: StorageService): Promise<void> {
  await storageService.setItem(AUTH_STORAGE_KEY, state, storageConfig);
}

async function removeFromStorage(storageService: StorageService): Promise<void> {
  await storageService.removeItem(AUTH_STORAGE_KEY, storageConfig);
}

export const UserSessionStore = signalStore(
  { providedIn: 'root' },
  withState<AuthState>(initialAuthState),
  withComputed((store) => ({
    currentUser: computed(() => store.user()),
    isLoggedIn: computed(() => store.isAuthenticated()),
    getToken: computed(() => store.token()),
    getRole: computed(() => store.user()?.rol ?? null),
  })),
  withMethods((store) => {
    const storageService = inject(StorageService);

    return {
      async init(): Promise<void> {
        const loadedState = await loadFromStorage(storageService);
        patchState(store, loadedState);
      },

      async login(user: User, token: string): Promise<void> {
        const newState: AuthState = {
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
        };
        patchState(store, newState);
        await saveToStorage(newState, storageService);
      },

      async logout(): Promise<void> {
        const newState: AuthState = {
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        };
        patchState(store, newState);
        await removeFromStorage(storageService);
      },

      setLoading(isLoading: boolean): void {
        patchState(store, { isLoading });
      },

      async updateToken(token: string): Promise<void> {
        const newState: AuthState = {
          user: store.user(),
          token,
          isAuthenticated: !!token && !!store.user(),
          isLoading: store.isLoading(),
        };
        patchState(store, newState);
        await saveToStorage(newState, storageService);
      },

      async updateUser(user: Partial<User>): Promise<void> {
        const currentUser = store.user();
        if (currentUser) {
          const updatedUser = { ...currentUser, ...user };
          patchState(store, { user: updatedUser });
          await saveToStorage(
            {
              user: updatedUser,
              token: store.token(),
              isAuthenticated: store.isAuthenticated(),
              isLoading: store.isLoading(),
            },
            storageService,
          );
        }
      },

      // hasModule(module: string): boolean {
      //   const modules = store.user()?.modules ?? [];
      //   return modules.includes(module);
      // },

      // hasPermission(permission: string): boolean {
      //   const permissions = store.user()?.permissions ?? [];
      //   return permissions.includes(permission);
      // },

      async syncState(): Promise<void> {
        const loadedState = await loadFromStorage(storageService);
        patchState(store, loadedState);
      },
    };
  }),
);
