import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { C } from '../theme/colors';
import { s } from '../styles/styles';
import { STATUS_META } from '../data/mockData';
import type { Status, IconName } from '../types';

// ─── Componentes reutilizables ────────────────────────────────────────────────
export function StatusBadge({ status }: { status: Status }) {
  const m = STATUS_META[status];
  return (
    <View style={[s.badge, { backgroundColor: m.bg }]}>
      <View style={[s.badgeDot, { backgroundColor: m.dot }]} />
      <Text style={[s.badgeText, { color: m.color }]}>{m.label}</Text>
    </View>
  );
}

export function ConnPill({ online, onToggle }: { online: boolean; onToggle: () => void }) {
  const color  = online ? C.blue : C.amber;
  const bg     = online ? 'rgba(59,130,246,0.1)' : 'rgba(245,158,11,0.1)';
  const border = online ? 'rgba(59,130,246,0.3)' : 'rgba(245,158,11,0.3)';
  return (
    <TouchableOpacity onPress={onToggle} style={[s.pill, { backgroundColor: bg, borderColor: border }]}>
      <Feather name={online ? 'wifi' : 'wifi-off'} size={11} color={color} />
      <Text style={[s.pillText, { color }]}>{online ? 'En línea' : 'Sin conexión'}</Text>
    </TouchableOpacity>
  );
}

export function SectionLabel({ children }: { children: string }) {
  return <Text style={s.sectionLabel}>{children}</Text>;
}

export function DataRow({ icon, label, value, mono, last }: {
  icon?: IconName; label: string; value: string; mono?: boolean; last?: boolean;
}) {
  return (
    <View style={[s.dataRow, last && { borderBottomWidth: 0 }]}>
      {icon ? <Feather name={icon} size={13} color={C.text3} style={{ marginRight: 4 }} /> : null}
      <Text style={s.dataLabel}>{label}</Text>
      <Text style={[s.dataValue, mono && s.mono]} numberOfLines={2}>{value}</Text>
    </View>
  );
}

export function Card({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[s.card, style]}>{children}</View>;
}
