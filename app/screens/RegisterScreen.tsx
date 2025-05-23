import { Ionicons } from '@expo/vector-icons';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Button as PaperButton, Text as PaperText, TextInput } from 'react-native-paper';
import { SafeAreaView as SafeAreaViewContext } from 'react-native-safe-area-context';
import { COLORS, FONT_SIZE, SPACING } from '../constants/theme';
import { useAuth } from '../contexts/AuthContext';
import { RootDrawerParamList } from '../types/navigation';

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export default function Register() {
  const navigation = useNavigation<NavigationProp<RootDrawerParamList>>();
  const { register } = useAuth();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateName = (name: string): string | undefined => {
    if (!name) return 'Name is required';
    if (name.length < 2) return 'Name must be at least 2 characters';
    return undefined;
  };

  const validateEmail = (email: string): string | undefined => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return 'Email is required';
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return undefined;
  };

  const validatePassword = (password: string): string | undefined => {
    if (!password) return 'Password is required';
    if (password.length < 6) return 'Password must be at least 6 characters';
    return undefined;
  };

  const validateConfirmPassword = (password: string, confirmPassword: string): string | undefined => {
    if (!confirmPassword) return 'Please confirm your password';
    if (password !== confirmPassword) return 'Passwords do not match';
    return undefined;
  };

  const validateForm = (): boolean => {
    const nameError = validateName(formData.name);
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);
    const confirmPasswordError = validateConfirmPassword(formData.password, formData.confirmPassword);

    const newErrors: FormErrors = {};
    if (nameError) newErrors.name = nameError;
    if (emailError) newErrors.email = emailError;
    if (passwordError) newErrors.password = passwordError;
    if (confirmPasswordError) newErrors.confirmPassword = confirmPasswordError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (isSubmitting) return;

    if (!validateForm()) {
      Alert.alert(
        'Validation Error',
        'Please fill in all required fields correctly.',
        [{ text: 'OK' }]
      );
      return;
    }

    setIsSubmitting(true);

    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      
      Alert.alert(
        'Registration Successful',
        'Your account has been created successfully.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Home')
          }
        ]
      );
    } catch (error) {
      console.error('Registration error:', error);
      Alert.alert(
        'Registration Failed',
        error instanceof Error ? error.message : 'Failed to create account. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <SafeAreaViewContext style={styles.header} edges={['top']}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <PaperText variant="headlineMedium" style={styles.title}>Create Account</PaperText>
      </SafeAreaViewContext>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <TextInput
              label="Full Name"
              mode="outlined"
              value={formData.name}
              onChangeText={(text) => handleInputChange('name', text)}
              error={!!errors.name}
              disabled={isSubmitting}
              autoCapitalize="words"
              style={styles.input}
            />
            {errors.name && <PaperText style={styles.errorText}>{errors.name}</PaperText>}
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              label="Email"
              mode="outlined"
              value={formData.email}
              onChangeText={(text) => handleInputChange('email', text)}
              keyboardType="email-address"
              autoCapitalize="none"
              error={!!errors.email}
              disabled={isSubmitting}
              style={styles.input}
            />
            {errors.email && <PaperText style={styles.errorText}>{errors.email}</PaperText>}
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              label="Password"
              mode="outlined"
              value={formData.password}
              onChangeText={(text) => handleInputChange('password', text)}
              secureTextEntry={!showPassword}
              error={!!errors.password}
              disabled={isSubmitting}
              right={<TextInput.Icon icon={showPassword ? 'eye-off' : 'eye'} onPress={() => setShowPassword(!showPassword)} />}
              style={styles.input}
            />
            {errors.password && <PaperText style={styles.errorText}>{errors.password}</PaperText>}
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              label="Confirm Password"
              mode="outlined"
              value={formData.confirmPassword}
              onChangeText={(text) => handleInputChange('confirmPassword', text)}
              secureTextEntry={!showConfirmPassword}
              error={!!errors.confirmPassword}
              disabled={isSubmitting}
              right={<TextInput.Icon icon={showConfirmPassword ? 'eye-off' : 'eye'} onPress={() => setShowConfirmPassword(!showConfirmPassword)} />}
              style={styles.input}
            />
            {errors.confirmPassword && <PaperText style={styles.errorText}>{errors.confirmPassword}</PaperText>}
          </View>
          <PaperButton
            mode="contained"
            onPress={handleRegister}
            loading={isSubmitting}
            disabled={isSubmitting}
            style={styles.registerButton}
            contentStyle={{ paddingVertical: 8 }}
          >
            Create Account
          </PaperButton>
          <View style={styles.loginContainer}>
            <PaperText style={styles.loginText}>Already have an account? </PaperText>
            <TouchableOpacity
              onPress={() => navigation.navigate('Login')}
              disabled={isSubmitting}
            >
              <PaperText style={styles.loginLink}>Login</PaperText>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  formContainer: {
    flex: 1,
    padding: SPACING.lg,
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
  registerButton: {
    marginTop: SPACING.md,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SPACING.xl,
  },
  loginText: {
    fontSize: FONT_SIZE.medium,
    color: COLORS.textLight,
  },
  loginLink: {
    fontSize: FONT_SIZE.medium,
    color: COLORS.primary,
    fontWeight: '600',
  },
}); 