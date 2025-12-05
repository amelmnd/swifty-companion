// components/ResponsiveLayout.tsx
import React from 'react';
import { View, useWindowDimensions } from 'react-native';

export default function ResponsiveLayout({ children }: { children: React.ReactNode }) {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  return (
    <View
      style={{
        flex: 1,
        paddingHorizontal: isLandscape ? 32 : 16,
        paddingTop: isLandscape ? 24 : 40,
        paddingBottom: 16,
      }}
    >
      {children}
    </View>
  );
}
