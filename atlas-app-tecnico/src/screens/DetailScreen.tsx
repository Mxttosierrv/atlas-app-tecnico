import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';

import { ConnPill, StatusBadge, SectionLabel, DataRow, Card } from '../components/common';
import { CHECKLIST_ITEMS, TABS, MAX_PHOTOS } from '../data/mockData';
import { dbmQuality } from '../utils/helpers';
import type { Visit, TabId, Estado } from '../types';

// ─── Pantalla Detalle ─────────────────────────────────────────────────────────
type DetailProps = {
  visit: Visit;
  tab: TabId; setTab: (t: TabId) => void;
  online: boolean; onToggleOnline: () => void;
  onBack: () => void;
  checked: Record<number, boolean>; doneCount: number; allDone: boolean;
  onToggle: (id: number) => void; onConfirmAccess: () => void;
  evidence: number[]; onAddEvidence: () => void;
  notes: string; onNotesChange: (t: string) => void;
  dbm: number; onDbmChange: (v: number) => void;
  estado: Estado; onEstadoChange: (v: Estado) => void;
  fallaNote: string; onFallaNoteChange: (t: string) => void;
  iccidVerified: boolean; onIccidVerify: () => void;
  onFinalize: () => void;
};

export function DetailScreen(p: DetailProps) {
  const quality  = dbmQuality(p.dbm);
  const total    = CHECKLIST_ITEMS.length;
  const progress = `${(p.doneCount / total) * 100}%` as `${number}%`;

  return (
    <View className="flex-1">
      {/* Top bar */}
      <View className="px-4 pt-3 pb-3">
        <View className="flex-row items-center justify-between mb-3">
          <TouchableOpacity
            onPress={p.onBack}
            className="bg-white/[0.06] border border-border rounded-[9px] p-[7px] items-center justify-center"
          >
            <Feather name="arrow-left" size={16} color="#F5F5F5" />
          </TouchableOpacity>
          <ConnPill online={p.online} onToggle={p.onToggleOnline} />
        </View>
        <Text className="font-mono text-[10px] text-text3 mb-[3px]">
          {p.visit.id} · {p.visit.zone}
        </Text>
        <View className="flex-row items-center justify-between mb-0.5">
          <Text className="text-text1 font-bold text-[17px] flex-1 tracking-tight">{p.visit.service}</Text>
          <StatusBadge status={p.visit.status} />
        </View>
        <Text className="text-xs text-text2">{p.visit.client}</Text>
      </View>

      {/* Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="flex-grow-0 border-b border-border"
        contentContainerClassName="px-3"
      >
        {TABS.map((t) => (
          <TouchableOpacity
            key={t.id}
            onPress={() => p.setTab(t.id)}
            className={`px-2.5 py-2 border-b-2 ${p.tab === t.id ? 'border-brand' : 'border-transparent'}`}
          >
            <Text className={`text-xs ${p.tab === t.id ? 'font-semibold text-text1' : 'text-text3'}`}>
              {t.label}{t.id === 'checklist' ? ` ${p.doneCount}/${total}` : ''}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Content */}
      <ScrollView
        className="flex-1"
        contentContainerClassName="p-4 pb-8"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* RESUMEN */}
        {p.tab === 'resumen' && (
          <View>
            <Card className="mb-[10px]">
              <DataRow icon="map-pin" label="Dirección" value={p.visit.address} />
              <DataRow icon="clock"   label="Ventana"   value={p.visit.time} mono />
              <DataRow icon="tool"    label="Zona"      value={p.visit.zone} last />
            </Card>
            <SectionLabel>Información del equipo</SectionLabel>
            <Card className="mb-4">
              <DataRow label="Modelo"       value={p.visit.equipo.modelo} />
              <DataRow label="ICCID SIM"    value={p.visit.equipo.iccid} mono />
              <DataRow label="Última falla" value={p.visit.equipo.falla} last />
            </Card>
            {p.visit.status !== 'completada' && (
              <TouchableOpacity
                onPress={p.onConfirmAccess}
                className="bg-brand rounded-xl p-[13px] items-center"
                style={{
                  shadowColor: '#F97316', shadowOpacity: 0.35, shadowRadius: 12,
                  shadowOffset: { width: 0, height: 4 }, elevation: 6,
                }}
              >
                <Text className="text-white text-sm font-bold">Confirmar ingreso y comenzar</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* CHECKLIST */}
        {p.tab === 'checklist' && (
          <View>
            <View className="flex-row items-center mb-3.5">
              <View className="flex-1 h-1 bg-surface rounded-full overflow-hidden">
                <View className="h-full bg-brand rounded-full" style={{ width: progress }} />
              </View>
              <Text className="font-mono text-[11px] text-text2 ml-2.5">
                {p.doneCount}/{total}
              </Text>
            </View>
            {CHECKLIST_ITEMS.map((item, idx) => {
              const isChecked = !!p.checked[item.id];
              return (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => p.onToggle(item.id)}
                  className={`flex-row items-start gap-2.5 border rounded-xl p-[11px] mb-[7px] ${
                    isChecked ? 'bg-green-dim border-green/25' : 'bg-card border-border'
                  }`}
                  activeOpacity={0.75}
                >
                  <View
                    className={`w-5 h-5 rounded-full border-[1.5px] items-center justify-center mt-px ${
                      isChecked ? 'bg-green border-green' : 'border-text3'
                    }`}
                  >
                    {isChecked ? <Feather name="check" size={11} color="#fff" /> : null}
                  </View>
                  <View className="flex-1">
                    <Text className={`font-bold text-xs ${isChecked ? 'text-green' : 'text-text1'}`}>
                      {String(idx + 1).padStart(2, '0')} {item.title}
                    </Text>
                    <Text className="text-text2 text-[11px] mt-0.5">{item.desc}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* EQUIPO */}
        {p.tab === 'equipo' && (
          <View>
            <SectionLabel>Datos del sistema</SectionLabel>
            <Card className="mb-3.5">
              <DataRow label="Modelo"    value={p.visit.equipo.modelo} />
              <DataRow label="ICCID SIM" value={p.visit.equipo.iccid} mono last />
            </Card>

            <SectionLabel>Registro en terreno</SectionLabel>
            <Card className="mb-[10px]">
              <View className="flex-row items-center justify-between mb-2.5">
                <Text className="text-xs text-text2 font-medium">Nivel de señal</Text>
                <Text className="font-mono text-xs font-semibold" style={{ color: quality.color }}>
                  {p.dbm} dBm · {quality.label}
                </Text>
              </View>

              {/* Signal bars */}
              <View className="flex-row items-end h-6 mb-2.5">
                {[1, 2, 3, 4].map((b) => (
                  <View
                    key={b}
                    className="flex-1 mx-0.5 rounded-[3px]"
                    style={{
                      height: 6 + b * 4,
                      backgroundColor: b <= quality.bars ? quality.color : '#242424',
                    }}
                  />
                ))}
              </View>

              <Slider
                minimumValue={-110}
                maximumValue={-50}
                step={1}
                value={p.dbm}
                onValueChange={p.onDbmChange}
                minimumTrackTintColor="#F97316"
                maximumTrackTintColor="#242424"
                thumbTintColor="#F97316"
                style={{ width: '100%' }}
              />

              <View className="h-px bg-border my-3" />

              <Text className="text-xs text-text2 font-medium mb-2">
                Estado del equipo
              </Text>
              <View className={`flex-row gap-2 ${p.estado === 'falla' ? 'mb-2.5' : 'mb-0'}`}>
                {(['operativo', 'falla'] as const).map((opt) => {
                  const active = p.estado === opt;
                  const activeClass = opt === 'operativo'
                    ? 'border-green/50 bg-green-dim'
                    : 'border-red/50 bg-red-dim';
                  const textActiveClass = opt === 'operativo' ? 'text-green' : 'text-red';
                  return (
                    <TouchableOpacity
                      key={opt}
                      onPress={() => p.onEstadoChange(opt)}
                      className={`flex-1 p-[9px] rounded-[10px] border items-center ${
                        active ? activeClass : 'border-border bg-transparent'
                      }`}
                    >
                      <Text className={`text-xs font-semibold ${active ? textActiveClass : 'text-text3'}`}>
                        {opt === 'operativo' ? 'Operativo' : 'Con falla'}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {p.estado === 'falla' && (
                <TextInput
                  value={p.fallaNote}
                  onChangeText={p.onFallaNoteChange}
                  placeholder="Describe la falla encontrada"
                  placeholderTextColor="#4B5563"
                  multiline
                  numberOfLines={3}
                  className="bg-card border border-red/30 rounded-xl p-3 text-text1 text-[13px] min-h-[120px]"
                  style={{ textAlignVertical: 'top' }}
                />
              )}
            </Card>

            <TouchableOpacity
              onPress={p.onIccidVerify}
              className={`flex-row items-center gap-2.5 border rounded-xl p-[11px] mb-[7px] ${
                p.iccidVerified ? 'bg-green-dim border-green/25' : 'bg-card border-border'
              }`}
              activeOpacity={0.75}
            >
              <View
                className={`w-5 h-5 rounded-[5px] border-[1.5px] items-center justify-center ${
                  p.iccidVerified ? 'bg-green border-green' : 'border-text3'
                }`}
              >
                {p.iccidVerified ? <Feather name="check" size={11} color="#fff" /> : null}
              </View>
              <Text className={`text-xs ${p.iccidVerified ? 'text-green' : 'text-text2'}`}>
                ICCID de SIM verificado en terreno
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* EVIDENCIAS */}
        {p.tab === 'evidencias' && (
          <View>
            <View className="flex-row items-center justify-between mb-3">
              <SectionLabel>Fotos</SectionLabel>
              <Text className="font-mono text-[10px] text-text3">
                {p.evidence.length}/{MAX_PHOTOS}
              </Text>
            </View>
            <View className="flex-row flex-wrap gap-2">
              {p.evidence.map((n) => (
                <View
                  key={n}
                  className="w-[30%] aspect-square rounded-[10px] border items-center justify-center bg-brand/20 border-brand/30"
                >
                  <Feather name="camera" size={20} color="#F97316" />
                </View>
              ))}
              {p.evidence.length < MAX_PHOTOS && (
                <TouchableOpacity
                  onPress={p.onAddEvidence}
                  className="w-[30%] aspect-square rounded-[10px] border border-dashed border-border items-center justify-center"
                  activeOpacity={0.7}
                >
                  <Feather name="plus" size={20} color="#4B5563" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}

        {/* NOTAS */}
        {p.tab === 'notas' && (
          <TextInput
            value={p.notes}
            onChangeText={p.onNotesChange}
            placeholder="Agrega notas u observaciones de la visita"
            placeholderTextColor="#4B5563"
            multiline
            numberOfLines={9}
            className="bg-card border border-border rounded-xl p-3 text-text1 text-[13px] min-h-[120px]"
            style={{ textAlignVertical: 'top' }}
          />
        )}
      </ScrollView>

      {/* Finalize bar */}
      {p.visit.status !== 'completada' && p.tab !== 'resumen' && (
        <View className="p-3.5 border-t border-border">
          {!p.allDone && (
            <Text className="text-[10px] text-text3 text-center mb-[7px]">
              Completa el checklist para finalizar · {p.doneCount}/{total}
            </Text>
          )}
          <TouchableOpacity
            onPress={p.onFinalize}
            disabled={!p.allDone}
            className={`rounded-xl p-[13px] items-center ${p.allDone ? 'bg-brand' : 'bg-surface'}`}
            style={p.allDone ? {
              shadowColor: '#F97316', shadowOpacity: 0.35, shadowRadius: 12,
              shadowOffset: { width: 0, height: 4 }, elevation: 6,
            } : undefined}
            activeOpacity={p.allDone ? 0.8 : 1}
          >
            <Text className={`text-sm font-bold ${p.allDone ? 'text-white' : 'text-text3'}`}>
              Finalizar visita
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
