export const coalitionImages: Record<string, any> = {
  Atreides: require('../assets/coalitions/bg_classic_atreides.jpg'),
  Harkonnen: require('../assets/coalitions/bg_classic_harkonnen.jpg'),
  Corrino: require('../assets/coalitions/bg_classic_corrino.jpg'),
};

export function getCoalitionImage(coalition: any) {
  if (!coalition) return null;
  const n = coalition.name?.toLowerCase() ?? '';
  if (n.includes('atre')) return coalitionImages.Atreides;
  if (n.includes('hark')) return coalitionImages.Harkonnen;
  if (n.includes('cor')) return coalitionImages.Corrino;
  return null;
}

export function currentCursus(user: any) {
  const list = Array.isArray(user?.cursus_users) ? user.cursus_users : [];
  if (!list.length) return null;
  const c21 = list.find((c: any) => c.cursus_id === 21);
  if (c21) return c21;
  return list.sort(
    (a, b) =>
      new Date(b?.updated_at || 0).getTime() -
      new Date(a?.updated_at || 0).getTime()
  )[0];
}

export function mapSkillsFromCursus(cursus: any) {
  const raw = Array.isArray(cursus?.skills) ? cursus.skills : [];
  return raw.map((s: any) => ({
    id: String(s.id),
    label: s.name,
    level: Math.min(1, (Number(s.level) || 0) / 20),
  }));
}

export function mapProjects(user: any) {
  const raw = Array.isArray(user?.projects_users) ? user.projects_users : [];
  return raw
    .filter((p: any) => p.project?.name)
    .map((p: any) => {
      const status =
        p['validated?'] === true
          ? 'Completed'
          : p['validated?'] === false
          ? 'Failed'
          : p.status === 'finished'
          ? 'Completed'
          : 'In progress';

      const eff = p.marked_at || p.updated_at || p.created_at || null;
      const ts = eff ? new Date(eff).getTime() : 0;

      return {
        id: String(p.id),
        label: p.project.name,
        status,
        finalMark: p.final_mark ?? null,
        date: eff ? new Date(eff).toLocaleDateString('fr-FR') : '—',
        ts,
      };
    })
    .sort((a, b) => b.ts - a.ts);
}
