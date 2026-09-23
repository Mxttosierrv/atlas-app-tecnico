import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { C } from '../theme/colors';
import { s } from '../styles/styles';
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
      style={{ flex: 1 }}
      contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={s.row}>
        <View style={s.rowStart}>
          <View style={s.logo}>
            <Text style={s.logoText}>A</Text>
          </View>
          <Text style={s.appTitle}>Atlas técnico</Text>
        </View>
        <ConnPill online={online} onToggle={onToggleOnline} />
      </View>

      {/* Day banner */}
      <View style={[s.card, { marginTop: 16, marginBottom: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
        <View>
          <Text style={[s.mono, { fontSize: 10, color: C.text3, letterSpacing: 1 }]}>MIÉRCOLES</Text>
          <Text style={[s.heading, { fontSize: 20, marginTop: 2 }]}>15 de mayo</Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={[s.heading, { fontSize: 26 }]}>{visits.length}</Text>
          <Text style={{ fontSize: 10, color: C.text3, letterSpacing: 0.5 }}>
            VISITAS · {completed} OK
          </Text>
        </View>
      </View>

      {/* Visit cards */}
      {visits.map((v) => {
        const accentColor = SERVICE_COLOR[v.service] || C.orange;
        const iconName    = SERVICE_ICON[v.service] || 'tool';
        const isCompleted = v.status === 'completada';
        return (
          <TouchableOpacity
            key={v.id}
            onPress={() => onOpen(v.id)}
            style={[s.visitCard, isCompleted && { opacity: 0.55 }]}
            activeOpacity={0.75}
          >
            {/* left accent bar */}
            <View style={[s.accentBar, { backgroundColor: isCompleted ? C.text3 : accentColor }]} />

            <View style={[s.row, { marginBottom: 8 }]}>
              <View style={s.rowStart}>
                <Feather name="clock" size={11} color={C.text3} />
                <Text style={[s.mono, { fontSize: 11, color: C.text3, marginLeft: 4 }]}>{v.time}</Text>
              </View>
              <StatusBadge status={v.status} />
            </View>

            <View style={s.row}>
              <View style={[s.serviceIcon, { backgroundColor: accentColor + '20', borderColor: accentColor + '35' }]}>
                <Feather name={iconName} size={16} color={accentColor} />
              </View>
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={[s.heading, { fontSize: 13 }]}>{v.service}</Text>
                <Text style={s.subText}>{v.client}</Text>
                <View style={[s.rowStart, { marginTop: 4 }]}>
                  <Feather name="map-pin" size={11} color={C.text3} />
                  <Text style={[s.subText, { marginLeft: 4, fontSize: 11, flexShrink: 1 }]} numberOfLines={1}>
                    {v.address}
                  </Text>
                </View>
              </View>
              <Feather name="chevron-right" size={14} color={C.text3} style={{ marginTop: 4 }} />
            </View>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}
