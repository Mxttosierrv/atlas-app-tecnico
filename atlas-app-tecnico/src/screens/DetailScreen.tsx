import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';

import { C } from '../theme/colors';
import { s } from '../styles/styles';
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
    <View style={{ flex: 1 }}>
      {/* Top bar */}
      <View style={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 12 }}>
        <View style={[s.row, { marginBottom: 12 }]}>
          <TouchableOpacity onPress={p.onBack} style={s.backBtn}>
            <Feather name="arrow-left" size={16} color={C.text1} />
          </TouchableOpacity>
          <ConnPill online={p.online} onToggle={p.onToggleOnline} />
        </View>
        <Text style={[s.mono, { fontSize: 10, color: C.text3, marginBottom: 3 }]}>
          {p.visit.id} · {p.visit.zone}
        </Text>
        <View style={[s.row, { marginBottom: 2 }]}>
          <Text style={[s.heading, { fontSize: 17, flex: 1 }]}>{p.visit.service}</Text>
          <StatusBadge status={p.visit.status} />
        </View>
        <Text style={s.subText}>{p.visit.client}</Text>
      </View>

      {/* Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={s.tabsBar}
        contentContainerStyle={{ paddingHorizontal: 12 }}
      >
        {TABS.map((t) => (
          <TouchableOpacity
            key={t.id}
            onPress={() => p.setTab(t.id)}
            style={[s.tab, p.tab === t.id && s.tabActive]}
          >
            <Text style={[s.tabText, p.tab === t.id && s.tabTextActive]}>
              {t.label}{t.id === 'checklist' ? ` ${p.doneCount}/${total}` : ''}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Content */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* RESUMEN */}
        {p.tab === 'resumen' && (
          <View>
            <Card style={{ marginBottom: 10 }}>
              <DataRow icon="map-pin" label="Dirección" value={p.visit.address} />
              <DataRow icon="clock"   label="Ventana"   value={p.visit.time} mono />
              <DataRow icon="tool"    label="Zona"      value={p.visit.zone} last />
            </Card>
            <SectionLabel>Información del equipo</SectionLabel>
            <Card style={{ marginBottom: 16 }}>
              <DataRow label="Modelo"       value={p.visit.equipo.modelo} />
              <DataRow label="ICCID SIM"    value={p.visit.equipo.iccid} mono />
              <DataRow label="Última falla" value={p.visit.equipo.falla} last />
            </Card>
            {p.visit.status !== 'completada' && (
              <TouchableOpacity onPress={p.onConfirmAccess} style={s.primaryBtn}>
                <Text style={s.primaryBtnText}>Confirmar ingreso y comenzar</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* CHECKLIST */}
        {p.tab === 'checklist' && (
          <View>
            <View style={[s.row, { marginBottom: 14 }]}>
              <View style={s.progressTrack}>
                <View style={[s.progressFill, { width: progress }]} />
              </View>
              <Text style={[s.mono, { fontSize: 11, color: C.text2, marginLeft: 10 }]}>
                {p.doneCount}/{total}
              </Text>
            </View>
            {CHECKLIST_ITEMS.map((item, idx) => {
              const isChecked = !!p.checked[item.id];
              return (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => p.onToggle(item.id)}
                  style={[s.checkItem, isChecked && { backgroundColor: C.greenDim, borderColor: C.green + '40' }]}
                  activeOpacity={0.75}
                >
                  <View style={[s.checkCircle, isChecked && { backgroundColor: C.green, borderColor: C.green }]}>
                    {isChecked ? <Feather name="check" size={11} color="#fff" /> : null}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[s.heading, { fontSize: 12, color: isChecked ? C.green : C.text1 }]}>
                      {String(idx + 1).padStart(2, '0')} {item.title}
                    </Text>
                    <Text style={[s.subText, { fontSize: 11, marginTop: 2 }]}>{item.desc}</Text>
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
            <Card style={{ marginBottom: 14 }}>
              <DataRow label="Modelo"    value={p.visit.equipo.modelo} />
              <DataRow label="ICCID SIM" value={p.visit.equipo.iccid} mono last />
            </Card>

            <SectionLabel>Registro en terreno</SectionLabel>
            <Card style={{ marginBottom: 10 }}>
              <View style={[s.row, { marginBottom: 10 }]}>
                <Text style={{ fontSize: 12, color: C.text2, fontWeight: '500' }}>Nivel de señal</Text>
                <Text style={[s.mono, { fontSize: 12, color: quality.color, fontWeight: '600' }]}>
                  {p.dbm} dBm · {quality.label}
                </Text>
              </View>

              {/* Signal bars */}
              <View style={[s.row, { height: 24, alignItems: 'flex-end', marginBottom: 10 }]}>
                {[1, 2, 3, 4].map((b) => (
                  <View
                    key={b}
                    style={{
                      flex: 1, marginHorizontal: 2,
                      height: 6 + b * 4, borderRadius: 3,
                      backgroundColor: b <= quality.bars ? quality.color : C.surface,
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
                minimumTrackTintColor={C.orange}
                maximumTrackTintColor={C.surface}
                thumbTintColor={C.orange}
                style={{ width: '100%' }}
              />

              <View style={[s.divider, { marginVertical: 12 }]} />

              <Text style={{ fontSize: 12, color: C.text2, fontWeight: '500', marginBottom: 8 }}>
                Estado del equipo
              </Text>
              <View style={[s.row, { gap: 8, marginBottom: p.estado === 'falla' ? 10 : 0 }]}>
                {(['operativo', 'falla'] as const).map((opt) => {
                  const active = p.estado === opt;
                  const color  = opt === 'operativo' ? C.green : C.red;
                  const dim    = opt === 'operativo' ? C.greenDim : C.redDim;
                  return (
                    <TouchableOpacity
                      key={opt}
                      onPress={() => p.onEstadoChange(opt)}
                      style={[s.estadoBtn, {
                        borderColor: active ? color + '50' : C.border,
                        backgroundColor: active ? dim : 'transparent',
                      }]}
                    >
                      <Text style={{ fontSize: 12, fontWeight: '600', color: active ? color : C.text3 }}>
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
                  placeholderTextColor={C.text3}
                  multiline
                  numberOfLines={3}
                  style={[s.textarea, { borderColor: C.red + '30' }]}
                />
              )}
            </Card>

            <TouchableOpacity
              onPress={p.onIccidVerify}
              style={[s.checkItem, p.iccidVerified && { backgroundColor: C.greenDim, borderColor: C.green + '40' }]}
              activeOpacity={0.75}
            >
              <View style={[s.checkSquare, p.iccidVerified && { backgroundColor: C.green, borderColor: C.green }]}>
                {p.iccidVerified ? <Feather name="check" size={11} color="#fff" /> : null}
              </View>
              <Text style={{ fontSize: 12, color: p.iccidVerified ? C.green : C.text2 }}>
                ICCID de SIM verificado en terreno
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* EVIDENCIAS */}
        {p.tab === 'evidencias' && (
          <View>
            <View style={[s.row, { marginBottom: 12 }]}>
              <SectionLabel>Fotos</SectionLabel>
              <Text style={[s.mono, { fontSize: 10, color: C.text3 }]}>
                {p.evidence.length}/{MAX_PHOTOS}
              </Text>
            </View>
            <View style={s.photoGrid}>
              {p.evidence.map((n) => (
                <View key={n} style={[s.photoCell, { backgroundColor: C.orange + '20', borderColor: C.orange + '30' }]}>
                  <Feather name="camera" size={20} color={C.orange} />
                </View>
              ))}
              {p.evidence.length < MAX_PHOTOS && (
                <TouchableOpacity
                  onPress={p.onAddEvidence}
                  style={[s.photoCell, { borderStyle: 'dashed', borderColor: C.border }]}
                  activeOpacity={0.7}
                >
                  <Feather name="plus" size={20} color={C.text3} />
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
            placeholderTextColor={C.text3}
            multiline
            numberOfLines={9}
            style={s.textarea}
          />
        )}
      </ScrollView>

      {/* Finalize bar */}
      {p.visit.status !== 'completada' && p.tab !== 'resumen' && (
        <View style={s.finalizeBar}>
          {!p.allDone && (
            <Text style={s.finalizeHint}>
              Completa el checklist para finalizar · {p.doneCount}/{total}
            </Text>
          )}
          <TouchableOpacity
            onPress={p.onFinalize}
            disabled={!p.allDone}
            style={[s.primaryBtn, !p.allDone && s.primaryBtnDisabled]}
            activeOpacity={p.allDone ? 0.8 : 1}
          >
            <Text style={[s.primaryBtnText, !p.allDone && { color: C.text3 }]}>Finalizar visita</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
