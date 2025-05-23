import { Ionicons } from '@expo/vector-icons';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Button as PaperButton, Text as PaperText, TextInput, useTheme } from 'react-native-paper';
import { SafeAreaView as SafeAreaViewContext } from 'react-native-safe-area-context';
import { COLORS, FONT_SIZE, SPACING } from '../constants/theme';
import { useAuth } from '../contexts/AuthContext';
import { RootDrawerParamList } from '../types/navigation';

interface FormErrors {
  email?: string;
  password?: string;
}

interface FormData {
  email: string;
  password: string;
}

export default function Login() {
  const navigation = useNavigation<NavigationProp<RootDrawerParamList>>();
  const { user, login } = useAuth();
  const { colors } = useTheme();
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (user) {
      navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
    }
  }, [user]);

  const validateEmail = (email: string): string | undefined => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return 'Email is required';
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return undefined;
  };

  const validatePassword = (password: string): string | undefined => {
    if (!password) return 'Password is required';
    return undefined;
  };

  const validateForm = (): boolean => {
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);
    const newErrors: FormErrors = {};
    if (emailError) newErrors.email = emailError;
    if (passwordError) newErrors.password = passwordError;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (isSubmitting) return;
    if (!validateForm()) {
      Alert.alert(
        'Validation Error',
        'Please fill in all required fields.',
        [{ text: 'OK' }]
      );
      return;
    }
    setIsSubmitting(true);
    try {
      await login(formData.email, formData.password);
    } catch (error: any) {
      Alert.alert('Login Failed', error?.message || 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.formContainer}>
        <SafeAreaViewContext style={styles.header} edges={['top']}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            disabled={isSubmitting}
          >
            <Ionicons
              name="arrow-back"
              size={24}
              color={COLORS.text}
            />
          </TouchableOpacity>
          <PaperText variant="headlineMedium" style={styles.title}>Welcome Back</PaperText>
        </SafeAreaViewContext>
        <View style={styles.firstInputContainer}>
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
            right={<TextInput.Icon icon={showPassword ? 'eye-off' : 'eye'} onPress={togglePasswordVisibility} />}
            style={styles.input}
          />
          {errors.password && <PaperText style={styles.errorText}>{errors.password}</PaperText>}
        </View>
        <PaperButton
          mode="contained"
          onPress={handleLogin}
          loading={isSubmitting}
          disabled={isSubmitting}
          style={styles.loginButton}
          contentStyle={{ paddingVertical: 8 }}
        >
          Login
        </PaperButton>
        <View style={styles.bottomContainer}>
          <TouchableOpacity
            onPress={() => navigation.navigate('ForgotPassword')}
            disabled={isSubmitting}
          >
            <PaperText style={styles.forgotPassword}>Forgot Password?</PaperText>
          </TouchableOpacity>
          <View style={styles.registerContainer}>
            <PaperText style={styles.registerText}>Don&apos;t have an account? </PaperText>
            <TouchableOpacity
              onPress={() => navigation.navigate('Register')}
              disabled={isSubmitting}
            >
              <PaperText style={styles.registerLink}>Sign Up</PaperText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  formContainer: {
    flex: 1,
    padding: SPACING.lg,
    justifyContent: 'center',
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
  inputContainer: {
    marginBottom: SPACING.lg,
  },
  firstInputContainer: {
    marginTop: SPACING.xl,
    marginBottom: SPACING.lg,
  },
  input: {
    // Removed custom styles for react-native-paper TextInput
  },
  errorText: {
    color: COLORS.error,
    fontSize: FONT_SIZE.small,
    marginTop: SPACING.xs,
    marginBottom: SPACING.sm,
  },
  loginButton: {
    marginTop: SPACING.md,
  },
  bottomContainer: {
    marginTop: SPACING.xl,
    alignItems: 'center',
  },
  forgotPassword: {
    color: COLORS.primary,
    fontSize: FONT_SIZE.medium,
    marginBottom: SPACING.lg,
  },
  registerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.md,
  },
  registerText: {
    fontSize: FONT_SIZE.medium,
    color: COLORS.textLight,
  },
  registerLink: {
    fontSize: FONT_SIZE.medium,
    color: COLORS.primary,
    fontWeight: '600',
  },
}); 