import { Ionicons } from '@expo/vector-icons';
import { DrawerActions, NavigationProp, useNavigation } from '@react-navigation/native';
import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Button as PaperButton, Text as PaperText } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONT_SIZE, SPACING } from '../constants/theme';
import { useAuth } from '../contexts/AuthContext';
import { RootDrawerParamList } from '../types/navigation';

export default function Home() {
  const { user, logout } = useAuth();
  const navigation = useNavigation<NavigationProp<RootDrawerParamList>>();

  const handleLogout = async () => {
    await logout();
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  };

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <View style={styles.navbar}>
          <View style={styles.leftSection}>
            <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.openDrawer())} style={styles.menuButton}>
              <Ionicons name="menu" size={28} color={COLORS.text} />
            </TouchableOpacity>
            <Image source={require('../assets/DSMN8_Icon_rgb_Orange_1000.png')} style={styles.logo} />
          </View>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Ionicons name="log-out-outline" size={26} color={COLORS.error} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      <View style={styles.container}>
        <PaperText variant="headlineLarge" style={styles.title}>Welcome{user?.name ? `, ${user.name}` : ''}!</PaperText>
        <PaperButton mode="contained" onPress={handleLogout} style={{ marginTop: 24 }}>Logout</PaperButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  safeArea: {
    backgroundColor: COLORS.background,
  },
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.background,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 36,
    height: 36,
    resizeMode: 'contain',
    marginLeft: 12,
  },
  menuButton: {
    padding: 4,
  },
  logoutButton: {
    padding: 4,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  title: {
    fontSize: FONT_SIZE.xxlarge,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.xl,
  },
}); 