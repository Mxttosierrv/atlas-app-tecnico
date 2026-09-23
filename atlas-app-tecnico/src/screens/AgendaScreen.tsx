import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { ConnPill, StatusBadge } from '../components/common';
import { SERVICE_COLOR, SERVICE_ICON } from '../data/mockData';
import type { Visit } from '../types';

// ─── Pantalla Agenda ──────────────────────────────────────────────────────────
type AgendaProps = {
  visits: Visit[];
  online: boolean;
  onToggleOnline: () => void;
  onOpen: (id: string) => void;
};

export function AgendaScreen({ visits, online, onToggleOnline, onOpen }: AgendaProps) {
  const completed = visits.filter((v) => v.status === 'completada').length;
  return (
    <ScrollView
      className="flex-1"
      contentContainerClassName="p-4 pb-8"
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center">
          <View className="w-[30px] h-[30px] rounded-[9px] bg-card border border-brand/40 items-center justify-center">
            <Text className="text-brand text-base font-bold">A</Text>
          </View>
          <Text className="text-sm font-semibold text-text1 ml-2">Atlas técnico</Text>
        </View>
        <ConnPill online={online} onToggle={onToggleOnline} />
      </View>

      {/* Day banner */}
      <View className="bg-card border border-border rounded-2xl p-3.5 mt-4 mb-3.5 flex-row justify-between items-center">
        <View>
          <Text className="font-mono text-[10px] text-text3 tracking-[1px]">MIÉRCOLES</Text>
          <Text className="text-text1 font-bold text-xl mt-0.5 tracking-tight">15 de mayo</Text>
        </View>
        <View className="items-end">
          <Text className="text-text1 font-bold text-[26px] tracking-tight">{visits.length}</Text>
          <Text className="text-[10px] text-text3 tracking-[0.5px]">
            VISITAS · {completed} OK
          </Text>
        </View>
      </View>

      {/* Visit cards */}
      {visits.map((v) => {
        const accentColor = SERVICE_COLOR[v.service] || '#F97316';
        const iconName    = SERVICE_ICON[v.service] || 'tool';
        const isCompleted = v.status === 'completada';
        return (
          <TouchableOpacity
            key={v.id}
            onPress={() => onOpen(v.id)}
            className={`bg-card border border-border-bright rounded-2xl p-3 pl-4 mb-2 relative overflow-hidden ${
              isCompleted ? 'opacity-[0.55]' : ''
            }`}
            activeOpacity={0.75}
          >
            {/* left accent bar */}
            <View
              className="absolute left-0 top-2 bottom-2 w-[3px] rounded-[2px]"
              style={{ backgroundColor: isCompleted ? '#4B5563' : accentColor }}
            />

            <View className="flex-row items-center justify-between mb-2">
              <View className="flex-row items-center">
                <Feather name="clock" size={11} color="#4B5563" />
                <Text className="font-mono text-[11px] text-text3 ml-1">{v.time}</Text>
              </View>
              <StatusBadge status={v.status} />
            </View>

            <View className="flex-row items-center justify-between">
              <View
                className="w-9 h-9 rounded-[10px] border items-center justify-center"
                style={{ backgroundColor: accentColor + '20', borderColor: accentColor + '35' }}
              >
                <Feather name={iconName} size={16} color={accentColor} />
              </View>
              <View className="flex-1 ml-2.5">
                <Text className="text-text1 font-bold text-[13px]">{v.service}</Text>
                <Text className="text-xs text-text2">{v.client}</Text>
                <View className="flex-row items-center mt-1">
                  <Feather name="map-pin" size={11} color="#4B5563" />
                  <Text
                    className="text-text2 text-[11px] ml-1 flex-shrink"
                    numberOfLines={1}
                  >
                    {v.address}
                  </Text>
                </View>
              </View>
              <Feather name="chevron-right" size={14} color="#4B5563" style={{ marginTop: 4 }} />
            </View>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}
