import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { AppColors } from '@/constants/theme';

type ToastKind = 'success' | 'error' | 'info';

type ToastState = {
  message: string;
  kind: ToastKind;
};

type ToastContextValue = {
  showToast: (message: string, kind?: ToastKind) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<ToastState | null>(null);
  const translateY = useRef(new Animated.Value(-20)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hideToast = useCallback(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -20,
        duration: 200,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start(() => setToast(null));
  }, [opacity, translateY]);

  const showToast = useCallback(
    (message: string, kind: ToastKind = 'info') => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      setToast({ message, kind });

      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 240,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 240,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start();

      timeoutRef.current = setTimeout(() => {
        hideToast();
      }, 2000);
    },
    [hideToast, opacity, translateY]
  );

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toast ? (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.toast,
            stylesByKind[toast.kind],
            {
              opacity,
              transform: [{ translateY }],
            },
          ]}>
          <Ionicons
            name={iconByKind[toast.kind]}
            size={18}
            color={toast.kind === 'info' ? AppColors.teal : '#FFFFFF'}
          />
          <Text style={[styles.toastText, toast.kind !== 'info' && styles.toastTextLight]}>
            {toast.message}
          </Text>
        </Animated.View>
      ) : null}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return ctx;
}

const iconByKind: Record<ToastKind, keyof typeof Ionicons.glyphMap> = {
  success: 'checkmark-circle',
  error: 'alert-circle',
  info: 'information-circle',
};

const stylesByKind = StyleSheet.create({
  success: {
    backgroundColor: AppColors.teal,
  },
  error: {
    backgroundColor: AppColors.red,
  },
  info: {
    backgroundColor: '#FFFFFF',
    borderColor: AppColors.border,
    borderWidth: 1,
  },
});

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    top: 38,
    left: 16,
    right: 16,
    borderRadius: 16,
    minHeight: 56,
    paddingVertical: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    shadowColor: '#000000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  toastText: {
    color: AppColors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  toastTextLight: {
    color: '#FFFFFF',
  },
});
