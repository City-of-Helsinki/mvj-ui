import { describe, expect, it, vi, beforeEach } from 'vitest';
import { renderHook, act, cleanup } from '@testing-library/react-hooks';
import React from 'react';
import { Provider } from 'react-redux';
import {
  useAuthenticatedUser,
  isApiTokensUpdatedSignal,
  isApiTokensRemovedSignal,
  LoginProvider,
  LoginProviderProps,
  useApiTokens,
  useApiTokensClientTracking,
  apiTokensClientEvents,
  createApiTokensClientEventSignal,
} from 'hds-react';
import type { User } from 'oidc-client-ts';
import type { ModuleNamespace } from 'vite/types/hot';
import type { Store } from 'redux';
import { clearApiToken, receiveApiToken, userFound, clearUser } from './actions';
import useAuth from './useAuth';
import { setRedirectUrlToSessionStorage } from '../util/storage';
import configureStore from '../root/configureStore';

vi.mock('@/index', () => {
  return {
    store: vi.fn()
  }
});

vi.mock('@/root/routes', () => {
  return {
    getRouteById: vi.fn()
  }
});

vi.mock('@/util/storage', async (importOriginal) => {
  const actual: ModuleNamespace = await importOriginal();
  return {
    ...actual,
    setRedirectUrlToSessionStorage: vi.fn(actual.setRedirectUrlToSessionStorage),
  }
});

vi.mock('react-redux', async (importOriginal) => {
  const actual: ModuleNamespace = await importOriginal();
  return {
    ...actual,
  Provider: ({ children }) => children,
  useDispatch: () => vi.fn(() => actual.useDispatch),
  connect: vi.fn().mockReturnValue(vi.fn()),
  default: vi.fn().mockReturnValue(vi.fn()),
}});

vi.mock('hds-react', async (importOriginal) => {
  const actual: ModuleNamespace = await importOriginal();
  return {
    ...actual,
    useAuthenticatedUser: vi.fn(actual.useAuthenticatedUser),
    useApiTokens: vi.fn(() => {
        return {
        ...actual.useApiTokens,
        getStoredApiTokens: vi.fn(actual.useApiTokens.getStoredApiTokens),
      }
    }),
    useApiTokensClientTracking: vi.fn(actual.useApiTokensClientTracking),
    useOidcClient: vi.fn(() => {
      return {
        ...actual.useOidcClient,
        login: vi.fn(actual.login),
        logout: vi.fn(actual.logout),
      }
    }),
    isApiTokensUpdatedSignal: vi.fn(actual.isApiTokensUpdatedSignal),
    isApiTokensRemovedSignal: vi.fn(actual.isApiTokensRemovedSignal),
  }
});

vi.mock('./actions', async (importOriginal) => {
  const actual: ModuleNamespace = await importOriginal()
  return {
    ...actual,
    clearApiToken: vi.fn(actual.clearApiToken),
    clearUser: vi.fn(actual.clearUser),
    receiveApiToken: vi.fn(actual.receiveApiToken),
    userFound: vi.fn(actual.userFound),
  }
});

describe('useAuth', () => {
  let mockStore: Store;
  const loginProviderProperties : LoginProviderProps = {
    userManagerSettings: {
      authority: 'http://localhost/openid/',
      client_id: 'mvj-ui',
      scope: 'openid profile http://localhost/mvj',
      redirect_uri: `${location.origin}/callback`,
    },
    apiTokensClientSettings: { url: 'https://localhost/api-tokens/' },
    sessionPollerSettings: { pollIntervalInMs: 300000 } // 300000ms = 5min
  };
  
  beforeEach(async () => {
    mockStore = configureStore();
    vi.clearAllMocks();
    await cleanup();
  });

  it('should initialize with loggedIn as false', () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }) => (
        <Provider store={mockStore}>
          <LoginProvider {...loginProviderProperties}>{children}</LoginProvider>
        </Provider>)
    });
    expect(clearUser).toHaveBeenCalled();
    expect(clearApiToken).toHaveBeenCalled();
    expect(result.current.loggedIn).toBe(false);
  });
  
  it('should trigger log in', () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }) => (
        <Provider store={mockStore}>
          <LoginProvider {...loginProviderProperties}>{children}</LoginProvider>
        </Provider>)
    });

    act(() => {
      result.current.login('/redirect-path');
    });
    expect(setRedirectUrlToSessionStorage).toHaveBeenCalledWith('/redirect-path');  
  });

  it('should find user on mount', () => {
    const mockAuthenticatedUser = { name: 'John Doe' };
    vi.mocked(useAuthenticatedUser).mockReturnValue(mockAuthenticatedUser as unknown as User);
    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }) => (
        <Provider store={mockStore}>
          <LoginProvider {...loginProviderProperties}>{children}</LoginProvider>
        </Provider>)
    });

    expect(userFound).toBeCalledWith(mockAuthenticatedUser);
  });

  it('should sync state for logged in user', () => {
    const mockAuthenticatedUser = { name: 'John Doe' };
    vi.mocked(useAuthenticatedUser).mockReturnValue(mockAuthenticatedUser as unknown as User);
    const mockApiTokens = {
      getStoredApiTokens: vi.fn().mockReturnValue([null, 'dummyApiToken']),
    };
    vi.mocked(useApiTokens).mockReturnValue(mockApiTokens as unknown as ReturnType<typeof useApiTokens>);
    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }) => (
        <Provider store={mockStore}>
          <LoginProvider {...loginProviderProperties}>{children}</LoginProvider>
        </Provider>)
    });

    expect(userFound).toBeCalledWith(mockAuthenticatedUser);
    expect(receiveApiToken).toBeCalledWith('dummyApiToken');
    expect(result.current.loggedIn).toBe(true);
  });
  
  it('should log out the user', () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }) => (
        <Provider store={mockStore}>
          <LoginProvider {...loginProviderProperties}>{children}</LoginProvider>
        </Provider>)
    });

    result.current.logout();
    expect(clearApiToken).toHaveBeenCalled();
    expect(clearUser).toHaveBeenCalled();
    expect(result.current.loggedIn).toBe(false);
  });
  
  it('should handle API token updates', async () => {
    const mockApiTokens = {
      getStoredApiTokens: vi.fn().mockReturnValue([null, 'dummyApiToken2']),
    };
    vi.mocked(useApiTokens).mockReturnValue(mockApiTokens as unknown as ReturnType<typeof useApiTokens>);
    const apiTokensUpdatedSignal = createApiTokensClientEventSignal({ type: apiTokensClientEvents.API_TOKENS_UPDATED});
    vi.mocked(useApiTokensClientTracking).mockReturnValue([apiTokensUpdatedSignal, () => null, null]);
    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }) => (
        <Provider store={mockStore}>
          <LoginProvider {...loginProviderProperties}>{children}</LoginProvider>
        </Provider>)
    });

    expect(isApiTokensUpdatedSignal).toHaveBeenCalledWith(apiTokensUpdatedSignal);
    expect(receiveApiToken).toHaveBeenCalledWith('dummyApiToken2');
    expect(result.current.loggedIn).toBe(true)
  });

  it('should handle API token removal', async () => {
    const mockApiTokens = {
      getStoredApiTokens: vi.fn().mockReturnValue([null, null]),
    };
    vi.mocked(useApiTokens).mockReturnValue(mockApiTokens as unknown as ReturnType<typeof useApiTokens>);

    const apiTokensRemovedSignal = createApiTokensClientEventSignal({ type: apiTokensClientEvents.API_TOKENS_REMOVED});
    vi.mocked(useApiTokensClientTracking).mockReturnValue([apiTokensRemovedSignal, () => null, null]);
    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }) => (
        <Provider store={mockStore}>
          <LoginProvider {...loginProviderProperties}>{children}</LoginProvider>
        </Provider>)
    });
    expect(receiveApiToken).not.toHaveBeenCalled();
    expect(isApiTokensRemovedSignal).toHaveBeenCalledWith(apiTokensRemovedSignal);
    expect(clearApiToken).toHaveBeenCalled();
    expect(result.current.loggedIn).toBe(false);
  });
});
