import React from 'react';
import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';

interface ProfileBannerProps {
  profile: {
    avatar: string;
    login: string;
    name: string;
    email: string;
    phone: string;
    campus: string;
    country: string;
    pool_month: string;
    pool_year: string;
    wallet: number;
    correction: number;
    level: number;
    percent: number;
    grade: string;
  };
  coalitionImage: any;
}

export default function ProfileBanner({
  profile,
  coalitionImage,
}: ProfileBannerProps) {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  return (
    <ImageBackground
      source={coalitionImage}
      style={styles.banner}
      imageStyle={{ borderRadius: 20 }}
      resizeMode='cover'
    >
      <View style={styles.bannerOverlay}>
        <View style={styles.leftCol}>
          <Image source={{ uri: profile.avatar }} style={styles.avatar} />
          <Text style={styles.info}>{profile.login}</Text>
        </View>

        <View style={styles.rightCol}>
          <Text style={styles.name}>{profile.name}</Text>

          {profile.email ? (
            <Text style={styles.info}>{profile.email}</Text>
          ) : null}

          {profile.phone !== 'hidden' && (
            <Text style={styles.info}>{profile.phone}</Text>
          )}

          <Text style={styles.info}>
            {profile.campus}, {profile.country}
          </Text>

          <Text style={styles.info}>
            <Text style={styles.bold}>Piscine :</Text> {profile.pool_month}{' '}
            {profile.pool_year}
          </Text>
        </View>
      </View>

      <View
        style={[
          styles.responsiveRow,
          isLandscape && styles.responsiveRowLandscape,
        ]}
      >
        <View
          style={[styles.statsRow, isLandscape && styles.statsRowLandscape]}
        >
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              <Text>₳</Text> {profile.wallet}
            </Text>
          </View>

          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              <Text>Ev.P</Text> {profile.correction}i = pro
            </Text>
          </View>
        </View>

        {!isLandscape && <View style={styles.separator} />}

        <View
          style={[styles.levelBlock, isLandscape && styles.levelBlockLandscape]}
        >
          <View style={styles.levelRow}>
            <Text style={styles.bigLevel}>{Math.floor(profile.level)}</Text>
            <Text style={styles.midLevel}>{Math.round(profile.percent)}%</Text>
            <Text style={styles.levelGrade}>{profile.grade}</Text>
          </View>

          <View style={styles.progressBg}>
            <View
              style={[
                styles.progressFill,
                { width: `${Math.min(100, profile.percent)}%` },
              ]}
            />
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bold: { fontWeight: '700' },

  banner: {
    borderRadius: 20,
    marginBottom: 16,
    padding: 20,
  },

  bannerOverlay: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.40)',
    borderRadius: 20,
    padding: 18,
    gap: 20,
  },

  leftCol: { width: '40%', alignItems: 'center' },

  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: '#fff',
  },

  name: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 6,
  },

  rightCol: { flex: 1, justifyContent: 'center', gap: 4 },

  info: { color: '#fff', fontSize: 13 },

  responsiveRow: {
    marginTop: 5,
  },

  responsiveRowLandscape: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 20,
  },

  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 14,
  },

  statsRowLandscape: {
    flex: 1,
    paddingVertical: 0,
  },

  statItem: { alignItems: 'center' },

  statValue: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },

  separator: {
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 2,
    marginBottom: 10,
  },

  levelBlock: { paddingVertical: 10 },

  levelBlockLandscape: {
    flex: 1,
  },

  levelRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },

  bigLevel: {
    fontSize: 24,
    fontWeight: '900',
    color: '#fff',
    marginRight: 12,
  },

  midLevel: {
    fontSize: 18,
    fontWeight: '800',
    color: '#fff',
    alignSelf: 'center',
  },

  levelGrade: {
    fontSize: 12,
    color: '#fff',
    marginLeft: 'auto',
    alignSelf: 'flex-end',
  },

  progressBg: {
    height: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.3)',
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
});
