import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import React, { useMemo } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  coalitionImages,
  getCoalitionImage,
  currentCursus,
  mapSkillsFromCursus,
  mapProjects,
} from '../../lib/profileUtils';

import ProfileHeader from '../../components/ProfileHeader';
import ProjectsTabs from '../../components/ProjectsTabs';
import ResponsiveLayout from '../../components/ResponsiveLayout';
import SkillList from '../../components/SkillList';


type RootStackParamList = {
  Profile: { user: any; coalition: any } | undefined;
};
type ProfileRouteProp = RouteProp<RootStackParamList, 'Profile'>;

export default function ProfileScreen() {
  const navigation = useNavigation();
  const route = useRoute<ProfileRouteProp>();
  const user = route.params?.user ?? {};
  const coalition = route.params?.coalition ?? null;

  const coalitionImage = getCoalitionImage(coalition);

  const cursus = useMemo(() => currentCursus(user), [user]);
  const campus = user?.campus?.[0];
  const profile = useMemo(
    () => ({
      name:
        user?.usual_full_name ||
        user?.displayname ||
        `${user?.first_name ?? ''} ${user?.last_name ?? ''}`,
      login: user?.login,
      email: user?.email,
      phone: user?.phone,
      level: cursus?.level ?? 0,
      percent: (cursus?.level - Math.floor(cursus?.level)) * 100,
      grade: cursus?.grade ?? '42cursus',
      campus: campus?.name,
      country: campus?.country,
      wallet: user?.wallet ?? 0,
      correction: user?.correction_point ?? 0,
      rank: cursus?.rank ?? 0,
      score: cursus?.score ?? 0,
      avatar: user?.image?.link,
      projects: mapProjects(user),
      skills: mapSkillsFromCursus(cursus),
      pool_year: user?.pool_year,
      pool_month: user?.pool_month,
    }),
    [user, cursus, campus]
  );

  return (
    <ResponsiveLayout>
      <ScrollView showsVerticalScrollIndicator={false}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>
        <ProfileHeader profile={profile} coalitionImage={coalitionImage} />
        <SkillList data={profile.skills} />
        <ProjectsTabs projects={profile.projects} />
      </ScrollView>
    </ResponsiveLayout>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 12,
  },
  backArrow: { fontSize: 28, color: '#111' },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '800',
  },
  block: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 20,
    marginTop: 12,
  },
  blockTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 12,
  },
  projectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  projectName: { fontSize: 16, fontWeight: '700' },
  projectSub: { fontSize: 12, color: '#6b7280', marginTop: 2 },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    minWidth: 60,
    alignItems: 'center',
  },
  badgeText: { fontWeight: '800' },
});
