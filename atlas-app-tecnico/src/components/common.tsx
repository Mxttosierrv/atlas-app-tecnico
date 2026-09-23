import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { C } from '../theme/colors';
import { STATUS_META } from '../data/mockData';
import type { Status, IconName } from '../types';

// ─── Componentes reutilizables ────────────────────────────────────────────────
export function StatusBadge({ status }: { status: Status }) {
  const m = STATUS_META[status];
  return (
    <View className={`flex-row items-center px-[9px] py-[3px] rounded-full ${m.wrapClass}`}>
      <View className={`w-[5px] h-[5px] rounded-[3px] mr-[5px] ${m.dotClass}`} />
      <Text className={`text-[11px] font-medium ${m.textClass}`}>{m.label}</Text>
    </View>
  );
}

export function ConnPill({ online, onToggle }: { online: boolean; onToggle: () => void }) {
  return (
    <TouchableOpacity
      onPress={onToggle}
      className={`flex-row items-center gap-[5px] border px-2.5 py-1 rounded-full ${
        online ? 'bg-blue/10 border-blue/30' : 'bg-amber/10 border-amber/30'
      }`}
    >
      <Feather name={online ? 'wifi' : 'wifi-off'} size={11} color={online ? C.blue : C.amber} />
      <Text className={`text-[11px] font-medium ml-1 ${online ? 'text-blue' : 'text-amber'}`}>
        {online ? 'En línea' : 'Sin conexión'}
      </Text>
    </TouchableOpacity>
  );
}

export function SectionLabel({ children }: { children: string }) {
  return (
    <Text className="text-[10px] font-semibold tracking-[1.5px] uppercase text-text3 mb-2">
      {children}
    </Text>
  );
}

export function DataRow({ icon, label, value, mono, last }: {
  icon?: IconName; label: string; value: string; mono?: boolean; last?: boolean;
}) {
  return (
    <View className={`flex-row items-center py-[9px] ${last ? '' : 'border-b border-border'}`}>
      {icon ? <Feather name={icon} size={13} color={C.text3} style={{ marginRight: 4 }} /> : null}
      <Text className="text-[11px] text-text3 w-[84px]">{label}</Text>
      <Text
        className={`text-xs text-text1 font-medium flex-1 text-right ${mono ? 'font-mono text-text2' : ''}`}
        numberOfLines={2}
      >
        {value}
      </Text>
    </View>
  );
}

export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <View className={`bg-card border border-border rounded-2xl p-3.5 ${className ?? ''}`}>
      {children}
    </View>
  );
}
