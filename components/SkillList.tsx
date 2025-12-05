import {
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';

type Skill = {
  id: string;
  label: string;
  level: number;
};

type Props = {
  data: Skill[];
};

export default function SkillList({ data }: Props) {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  return (
    <View style={styles.block}>
      <Text style={styles.blockTitle}>Skills</Text>

      <ScrollView
        nestedScrollEnabled
        showsVerticalScrollIndicator={true}
        style={{ maxHeight: isLandscape ? 260 : 240 }}
      >
        <View
          style={[
            isLandscape ? styles.grid2cols : undefined,
            { paddingRight: 6 },
          ]}
        >
          {data.map((skill) => (
            <SkillItem key={skill.id} skill={skill} isLandscape={isLandscape} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

function SkillItem({
  skill,
  isLandscape,
}: {
  skill: Skill;
  isLandscape: boolean;
}) {
  const raw = skill.level ?? 0; 
  const pct = Math.round(raw * 100);  
  const lvl = raw * 20;               

  return (
    <View style={[styles.skillRow, isLandscape && styles.landscapeItem]}>
      <Text style={styles.skillLabel}>
        {skill.label} — level {lvl.toFixed(2)}
      </Text>

      <View style={styles.progressContainer}>
        <View style={styles.progressBg}>
          <View style={[styles.progressFill, { width: `${pct}%` }]} />
        </View>
        <Text style={styles.percentText}>{pct}%</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginTop: 14,
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
    marginBottom: 14,
  },

  grid2cols: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  landscapeItem: {
    width: '48%',
  },

  skillRow: {
    width: '100%',
    marginBottom: 16,
  },

  skillLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111',
    marginBottom: 6,
  },

  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  progressBg: {
    flex: 1,
    height: 10,
    backgroundColor: '#d1d5db',
    borderRadius: 8,
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    backgroundColor: '#3CB371',
    borderRadius: 8,
  },

  percentText: {
    width: 40,
    textAlign: 'right',
    fontSize: 14,
    fontWeight: '600',
    color: '#111',
  },
});

