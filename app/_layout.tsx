import React from 'react';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { COLORS } from './constants/theme';
import { AuthProvider } from './contexts/AuthContext';
import AppNavigation from './Navigation';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: COLORS.primary,
    accent: COLORS.secondary,
    background: COLORS.background,
    text: COLORS.text,
    error: COLORS.error,
  },
};

export default function RootLayout() {
  return (
    <PaperProvider theme={theme}>
      <AuthProvider>
        <AppNavigation />
      </AuthProvider>
    </PaperProvider>
  );
}
