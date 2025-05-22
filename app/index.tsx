import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from './components/Button';
import { COLORS, FONT_SIZE, SPACING } from './constants/theme';

export default function Home() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to My Expo App</Text>
      <Text style={styles.subtitle}>Start building something amazing!</Text>
      
      <Button
        title="Go to Login"
        onPress={() => router.push('/login')}
        style={styles.button}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.lg,
  },
  title: {
    fontSize: FONT_SIZE.xxlarge,
    fontWeight: 'bold',
    marginBottom: SPACING.sm,
    color: COLORS.text,
  },
  subtitle: {
    fontSize: FONT_SIZE.medium,
    color: COLORS.textLight,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  button: {
    width: '100%',
    maxWidth: 300,
  },
});
