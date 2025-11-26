import { QueryClient } from '@tanstack/react-query';
import { onlineManager, focusManager } from '@tanstack/react-query';
import NetInfo from '@react-native-community/netinfo';
import { AppState, AppStateStatus } from 'react-native';


onlineManager.setEventListener((setOnline) => {
  return NetInfo.addEventListener((state) => {
    setOnline(state.isConnected ?? false);
  });
});


focusManager.setEventListener((handleFocus) => {
  const subscription = AppState.addEventListener('change', (status: AppStateStatus) => {
    handleFocus(status === 'active');
  });

  return () => {
    subscription.remove();
  };
});

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        if (!onlineManager.isOnline()) {
          return false;
        }
        return failureCount < 2;
      },
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      networkMode: 'online',
    },
    mutations: {
      retry: (failureCount, error: any) => {
        if (!onlineManager.isOnline()) {
          return false;
        }
        return failureCount < 1;
      },
      networkMode: 'online',
    },
  },
});

