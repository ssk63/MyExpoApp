import { Ionicons } from '@expo/vector-icons';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Button as PaperButton, Text as PaperText, TextInput } from 'react-native-paper';
import { SafeAreaView as SafeAreaViewContext } from 'react-native-safe-area-context';
import { COLORS, FONT_SIZE, SPACING } from '../constants/theme';
import { RootDrawerParamList } from '../types/navigation';

export default function ForgotPassword() {
  const navigation = useNavigation<NavigationProp<RootDrawerParamList>>();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const validateEmail = (email: string): string | undefined => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return 'Email is required';
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return undefined;
  };

  const handleResetPassword = async () => {
    if (isSubmitting) return;

    const emailError = validateEmail(email);
    if (emailError) {
      setError(emailError);
      return;
    }

    setIsSubmitting(true);
    setError(undefined);

    try {
      // Call the /forgot-password API endpoint
      const response = await fetch('http://localhost:3001/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!response.ok) {
        throw new Error('Failed to send reset link.');
      }
      // Simulate API call
      // await new Promise(resolve => setTimeout(resolve, 1000));
      Alert.alert(
        'Reset Link Sent',
        'If an account exists with this email, you will receive a password reset link.',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack()
          }
        ]
      );
    } catch (error) {
      console.error('Reset password error:', error);
      Alert.alert(
        'Error',
        'Failed to send reset link. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaViewContext style={styles.header} edges={['top']}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <PaperText variant="headlineMedium" style={styles.title}>Reset Password</PaperText>
      </SafeAreaViewContext>
      <View style={styles.formContainer}>
        <PaperText style={styles.description}>
          Enter your email address and we&apos;ll send you a link to reset your password.
        </PaperText>
        <View style={styles.inputContainer}>
          <TextInput
            label="Email"
            mode="outlined"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (error) setError(undefined);
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            error={!!error}
            disabled={isSubmitting}
            style={styles.input}
          />
          {error && <PaperText style={styles.errorText}>{error}</PaperText>}
        </View>
        <PaperButton
          mode="contained"
          onPress={handleResetPassword}
          loading={isSubmitting}
          disabled={isSubmitting}
          style={styles.resetButton}
          contentStyle={{ paddingVertical: 8 }}
        >
          Send Reset Link
        </PaperButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    paddingTop: 16,
    paddingBottom: 16,
    minHeight: 64,
    marginBottom: 8,
  },
  backButton: {
    padding: SPACING.xs,
    width: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: FONT_SIZE.large,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
    flex: 1,
  },
  formContainer: {
    flex: 1,
    padding: SPACING.lg,
  },
  description: {
    fontSize: FONT_SIZE.medium,
    color: COLORS.textLight,
    marginBottom: SPACING.xl,
    lineHeight: 22,
  },
  inputContainer: {
    marginBottom: SPACING.lg,
  },
  input: {
    // Removed custom styles for react-native-paper TextInput
  },
  errorText: {
    color: COLORS.error,
    fontSize: FONT_SIZE.small,
    marginTop: SPACING.xs,
  },
  resetButton: {
    marginTop: SPACING.md,
  },
}); 