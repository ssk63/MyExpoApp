import { DrawerContentComponentProps, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CustomDrawerContent(props: DrawerContentComponentProps) {
  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
    </SafeAreaView>
  );
} 