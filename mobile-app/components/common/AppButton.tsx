import React from 'react';
import { Pressable, StyleSheet, Text, View, type TextStyle, type ViewStyle } from 'react-native';

import { AppColors, Fonts } from '@/constants/theme';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';

type AppButtonProps = {
  title: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
};

export function AppButton({
  title,
  onPress,
  variant = 'primary',
  icon,
  style,
  textStyle,
  disabled,
}: AppButtonProps) {
  const variantStyle = stylesByVariant[variant];
  const variantTextStyle = textByVariant[variant];

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        variantStyle,
        pressed && !disabled ? styles.pressed : null,
        disabled ? styles.disabled : null,
        style,
      ]}
      accessibilityRole="button">
      <View style={styles.content}>
        {icon ? <View style={styles.icon}>{icon}</View> : null}
        <Text style={[styles.text, variantTextStyle, textStyle]}>{title}</Text>
      </View>
    </Pressable>
  );
}

const stylesByVariant = StyleSheet.create({
  primary: {
    backgroundColor: AppColors.teal,
  },
  secondary: {
    backgroundColor: AppColors.tealSoft,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: AppColors.teal,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
});

const textByVariant = StyleSheet.create({
  primary: {
    color: AppColors.card,
  },
  secondary: {
    color: AppColors.tealDark,
  },
  outline: {
    color: AppColors.teal,
  },
  ghost: {
    color: AppColors.teal,
  },
});

const styles = StyleSheet.create({
  base: {
    minHeight: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  icon: {
    marginRight: 2,
  },
  text: {
    fontFamily: Fonts.rounded,
    fontSize: 16,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.85,
  },
  disabled: {
    opacity: 0.6,
  },
});
