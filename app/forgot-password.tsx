import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView as SafeAreaViewContext } from 'react-native-safe-area-context';
import { Button } from './components/Button';
import { COLORS, FONT_SIZE, SPACING } from './constants/theme';

export default function ForgotPassword() {
  const router = useRouter();
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
            onPress: () => router.back()
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
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Reset Password</Text>
      </SafeAreaViewContext>

      <View style={styles.formContainer}>
        <Text style={styles.description}>
          Enter your email address and we&apos;ll send you a link to reset your password.
        </Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={[styles.input, error && styles.inputError]}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (error) setError(undefined);
            }}
            editable={!isSubmitting}
          />
          {error && <Text style={styles.errorText}>{error}</Text>}
        </View>

        <Button
          title={isSubmitting ? "Sending..." : "Send Reset Link"}
          onPress={handleResetPassword}
          style={styles.resetButton}
          disabled={isSubmitting}
        />
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
  label: {
    fontSize: FONT_SIZE.medium,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: SPACING.md,
    fontSize: FONT_SIZE.medium,
    backgroundColor: '#fff',
  },
  inputError: {
    borderColor: COLORS.error,
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