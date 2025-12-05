import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

type Item = { id: string; label: string; level?: number };
type Props = { title: string; variant: 'skills'; data: Item[] };

export default function ScrollableSection({ title, variant, data }: Props) {
  return (
    <View style={styles.block}>
      <Text style={styles.blockTitle}>{title}</Text>
      <FlatList
        data={data}
        keyExtractor={(it) => String(it.id)}
        renderItem={({ item }) => <SkillPill item={item} />}
        horizontal
        showsHorizontalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ width: 8 }} />}
      />
    </View>
  );
}

function SkillPill({ item }: { item: Item }) {
  const pct = Math.round((item.level ?? 0) * 100);
  return (
    <View style={styles.pill}>
      <Text style={styles.pillText}>{item.label}</Text>
      <Text style={styles.pillPct}>{pct}%</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    marginTop: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 1,
  },
  blockTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 12
  },
  pill: {
    backgroundColor: '#F3F4F6',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pillText: {
    fontWeight: '700',
    color: '#111827'
  },
  pillPct: { 
    color: '#6b7280', 
    fontWeight: '700' 
  },
});
