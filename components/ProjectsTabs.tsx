import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';

type Project = {
  id: string;
  label: string;
  status: 'Completed' | 'Failed' | 'In progress';
  finalMark?: number | null;
  date: string;
};

type Props = {  levelBlock: { paddingVertical: 10 },
  projects: Project[];
};

export default function ProjectsList({ projects }: Props) {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  const [tab, setTab] = useState<'inProgress' | 'done' | 'failed'>('inProgress');

  const inProgress = projects.filter((p) => p.status === 'In progress');
  const done = projects.filter((p) => p.status === 'Completed');
  const failed = projects.filter((p) => p.status === 'Failed');

  const visible = tab === 'inProgress' ? inProgress : tab === 'done' ? done : failed;

  return (
    <View style={styles.container}>
      <Text style={styles.blockTitle}>Projects</Text>

      <ScrollView
        nestedScrollEnabled
        stickyHeaderIndices={[0]}
        style={{
          maxHeight: isLandscape ? 270 : 620,
        }}
        contentContainerStyle={{ paddingBottom: 20 }}
      >

        <View style={styles.tabsWrapper}>
          <View style={styles.tabsContainer}>
            <TouchableOpacity
              style={[styles.tab, tab === 'inProgress' && styles.tabActive]}
              onPress={() => setTab('inProgress')}
            >
              <Text
                style={[
                  styles.tabText,
                  tab === 'inProgress' && styles.tabTextActive,
                ]}
              >
                En cours
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tab, tab === 'done' && styles.tabActive]}
              onPress={() => setTab('done')}
            >
              <Text
                style={[styles.tabText, tab === 'done' && styles.tabTextActive]}
              >
                Validés
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tab, tab === 'failed' && styles.tabActive]}
              onPress={() => setTab('failed')}
            >
              <Text
                style={[
                  styles.tabText,
                  tab === 'failed' && styles.tabTextActive,
                ]}
              >
                Échoués
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ marginTop: 14 }}>
          {visible.length === 0 && (
            <Text style={styles.emptyText}>
              Aucun projet dans cette catégorie.
            </Text>
          )}

          {visible.map((p) => (
            <View key={p.id} style={styles.projectRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.projectName}>{p.label}</Text>
                <Text style={styles.projectSub}>
                  {p.status === 'Completed'
                    ? `Validé le ${p.date}`
                    : p.status === 'Failed'
                    ? `Échoué le ${p.date}`
                    : `En cours depuis le ${p.date}`}
                </Text>
              </View>
              {(p.status === 'Completed' || p.status === 'Failed' ) &&
              <View
                style={[
                  styles.badge,
                  p.status === 'Completed'
                    ? { backgroundColor: '#DCFCE7', borderColor: '#16a34a' }
                    : p.status === 'Failed'
                    && { backgroundColor: '#FEE2E2', borderColor: '#dc2626' }
                ]}
              >
                <Text
                  style={[
                    styles.badgeText,
                    p.status === 'Completed'
                      ? { color: '#16a34a' }
                      : p.status === 'Failed'
                      && { color: '#dc2626' }
                  ]}
                >
                  {p.finalMark ?? (p.status === 'Failed' && '✗')}
                </Text>
              </View>}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 14,
    marginTop: 18,
  },

  blockTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 12,
  },

  tabsWrapper: {
    backgroundColor: '#fff',
    paddingBottom: 6,
    paddingTop: 4,
  },

  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#E5E7EB',
    borderRadius: 40,
    overflow: 'hidden',
  },

  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },

  tabActive: {
    backgroundColor: '#111827',
  },

  tabText: {
    color: '#6b7280',
    fontSize: 15,
    fontWeight: '700',
  },

  tabTextActive: {
    color: '#fff',
  },

  projectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },

  projectName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
  },

  projectSub: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },

  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    minWidth: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },

  badgeText: { 
    fontWeight: '800' 
  },

  emptyText: {
    textAlign: 'center',
    paddingVertical: 20,
    color: '#6b7280',
    fontStyle: 'italic',
  },
});
