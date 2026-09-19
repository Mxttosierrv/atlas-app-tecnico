import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  StyleSheet, Platform,
} from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Slider from '@react-native-community/slider';
import { Feather } from '@expo/vector-icons';

// ─── Tipos ────────────────────────────────────────────────────────────────────
type Status   = 'programada' | 'en_ruta' | 'en_curso' | 'completada';
type Estado   = 'operativo' | 'falla';
type TabId    = 'resumen' | 'checklist' | 'equipo' | 'evidencias' | 'notas';
type ViewName = 'agenda' | 'detail' | 'success';
type IconName = React.ComponentProps<typeof Feather>['name'];

type Visit = {
  id: string;
  time: string;
  client: string;
  service: string;
  address: string;
  zone: string;
  status: Status;
  equipo: { modelo: string; iccid: string; falla: string };
};

// ─── Tokens de color ──────────────────────────────────────────────────────────
const C = {
  bg:           '#0C0C0C',
  card:         '#1A1A1A',
  surface:      '#242424',
  orange:       '#F97316',
  orangeDim:    '#2A1608',
  orangeText:   '#FB923C',
  border:       'rgba(255,255,255,0.07)',
  borderBright: 'rgba(255,255,255,0.11)',
  text1:        '#F5F5F5',
  text2:        '#9CA3AF',
  text3:        '#4B5563',
  blue:         '#60A5FA',
  blueDim:      '#0D1B2E',
  green:        '#4ADE80',
  greenDim:     '#0A1F0F',
  red:          '#F87171',
  redDim:       '#1F0808',
  amber:        '#FBBF24',
  amberDim:     '#1F1507',
};

// ─── Datos ────────────────────────────────────────────────────────────────────
const MAX_PHOTOS = 6;

const VISITS_INIT: Visit[] = [
  {
    id: 'VT-0521', time: '09:00 – 11:00', client: 'Juan Pérez',
    service: 'Instalación de Internet', address: 'Av. Los Leones 1234, Providencia',
    zone: 'Zona Norte', status: 'programada',
    equipo: { modelo: 'Router corporativo X200', iccid: '8956 0123 4567 8901 234', falla: 'Sin fallas previas registradas' },
  },
  {
    id: 'VT-0522', time: '11:30', client: 'María González',
    service: 'Mantención de equipo', address: 'Camino Real 890, Las Condes',
    zone: 'Zona Centro', status: 'en_curso',
    equipo: { modelo: 'Enlace móvil 4G', iccid: '8956 0123 4567 8905 512', falla: 'Pérdida de señal intermitente (12 may)' },
  },
  {
    id: 'VT-0523', time: '14:00', client: 'Pedro Rojas',
    service: 'Cambio de router', address: 'Pasaje Los Aromos 45, Ñuñoa',
    zone: 'Zona Oriente', status: 'en_ruta',
    equipo: { modelo: 'Router corporativo X200', iccid: '8956 0123 4567 8909 887', falla: 'Reportó fallas de reinicio' },
  },
  {
    id: 'VT-0518', time: '16:00', client: 'Constructora Andes SpA',
    service: 'Revisión de enlace', address: 'Av. Apoquindo 3500, of. 12',
    zone: 'Zona Oriente', status: 'completada',
    equipo: { modelo: 'Módem IoT', iccid: '8956 0123 4567 8912 003', falla: 'Sin fallas previas registradas' },
  },
];

const CHECKLIST_ITEMS = [
  { id: 1, title: 'Verificación de acceso',     desc: 'Acceso al lugar confirmado' },
  { id: 2, title: 'Revisión de equipos',        desc: 'Equipos en condiciones operativas' },
  { id: 3, title: 'Instalación / mantenimiento', desc: 'Trabajo realizado correctamente' },
  { id: 4, title: 'Pruebas de funcionamiento',  desc: 'Todo funcionando según estándar' },
  { id: 5, title: 'Cierre y validación',        desc: 'Cliente conforme con el servicio' },
];

const STATUS_META: Record<Status, { label: string; bg: string; color: string; dot: string }> = {
  programada: { label: 'Programada', bg: 'rgba(255,255,255,0.07)', color: C.text2,      dot: C.text3 },
  en_ruta:    { label: 'En ruta',    bg: C.blueDim,                color: C.blue,       dot: C.blue },
  en_curso:   { label: 'En curso',   bg: C.orangeDim,              color: C.orangeText, dot: C.orange },
  completada: { label: 'Completada', bg: C.greenDim,               color: C.green,      dot: C.green },
};

const SERVICE_COLOR: Record<string, string> = {
  'Instalación de Internet': '#60A5FA',
  'Mantención de equipo':    '#FBBF24',
  'Cambio de router':        '#F97316',
  'Revisión de enlace':      '#A78BFA',
};

const SERVICE_ICON: Record<string, IconName> = {
  'Instalación de Internet': 'wifi',
  'Mantención de equipo':    'tool',
  'Cambio de router':        'refresh-cw',
  'Revisión de enlace':      'clipboard',
};

const TABS: { id: TabId; label: string }[] = [
  { id: 'resumen',    label: 'Resumen' },
  { id: 'checklist',  label: 'Checklist' },
  { id: 'equipo',     label: 'Equipo' },
  { id: 'evidencias', label: 'Evidencias' },
  { id: 'notas',      label: 'Notas' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function dbmQuality(v: number) {
  if (v >= -70)  return { label: 'Excelente', bars: 4, color: C.green };
  if (v >= -85)  return { label: 'Buena',     bars: 3, color: C.blue };
  if (v >= -100) return { label: 'Regular',   bars: 2, color: C.amber };
  return               { label: 'Débil',      bars: 1, color: C.red };
}

// ─── Componentes reutilizables ────────────────────────────────────────────────
function StatusBadge({ status }: { status: Status }) {
  const m = STATUS_META[status];
  return (
    <View style={[s.badge, { backgroundColor: m.bg }]}>
      <View style={[s.badgeDot, { backgroundColor: m.dot }]} />
      <Text style={[s.badgeText, { color: m.color }]}>{m.label}</Text>
    </View>
  );
}

function ConnPill({ online, onToggle }: { online: boolean; onToggle: () => void }) {
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

function SectionLabel({ children }: { children: string }) {
  return <Text style={s.sectionLabel}>{children}</Text>;
}

function DataRow({ icon, label, value, mono, last }: {
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

function Card({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[s.card, style]}>{children}</View>;
}

// ─── Pantalla Agenda ──────────────────────────────────────────────────────────
function AgendaScreen({ visits, online, onToggleOnline, onOpen }: {
  visits: Visit[];
  online: boolean;
  onToggleOnline: () => void;
  onOpen: (id: string) => void;
}) {
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

function DetailScreen(p: DetailProps) {
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

// ─── Pantalla Éxito ───────────────────────────────────────────────────────────
function SuccessScreen({ visit, online, onDone }: {
  visit: Visit; online: boolean; onDone: () => void;
}) {
  return (
    <View style={s.successContainer}>
      <View style={s.successIcon}>
        <Feather name="check-circle" size={30} color={C.green} />
      </View>
      <Text style={[s.heading, { fontSize: 22, marginBottom: 6 }]}>Visita finalizada</Text>
      <Text style={[s.subText, { marginBottom: 20, textAlign: 'center', maxWidth: 230 }]}>
        {visit.service} · {visit.client}
      </Text>
      <View
        style={[s.syncPill, {
          backgroundColor: online ? C.greenDim : C.orangeDim,
          borderColor: online ? C.green + '30' : C.orange + '30',
        }]}
      >
        <Feather name={online ? 'check' : 'alert-triangle'} size={12} color={online ? C.green : C.orangeText} />
        <Text style={{ fontSize: 12, color: online ? C.green : C.orangeText, marginLeft: 6, fontWeight: '500' }}>
          {online ? 'Sincronizada con el sistema' : 'Guardada · pendiente de sincronizar'}
        </Text>
      </View>
      <TouchableOpacity onPress={onDone} style={[s.primaryBtn, { paddingHorizontal: 32 }]}>
        <Text style={s.primaryBtnText}>Volver a mis visitas</Text>
      </TouchableOpacity>
    </View>
  );
}

// ─── App principal ────────────────────────────────────────────────────────────
export default function AtlasTecnico() {
  const [visits, setVisits]               = useState<Visit[]>(VISITS_INIT);
  const [view, setView]                   = useState<ViewName>('agenda');
  const [selectedId, setSelectedId]       = useState<string | null>(null);
  const [tab, setTab]                     = useState<TabId>('resumen');
  const [online, setOnline]               = useState(true);
  const [checkedMap, setCheckedMap]       = useState<Record<string, Record<number, boolean>>>({});
  const [evidenceMap, setEvidenceMap]     = useState<Record<string, number[]>>({});
  const [notesMap, setNotesMap]           = useState<Record<string, string>>({});
  const [dbmMap, setDbmMap]               = useState<Record<string, number>>({});
  const [estadoMap, setEstadoMap]         = useState<Record<string, Estado>>({});
  const [fallaNotes, setFallaNotes]       = useState<Record<string, string>>({});
  const [iccidVerified, setIccidVerified] = useState<Record<string, boolean>>({});

  const key       = selectedId ?? '';
  const visit     = visits.find((v) => v.id === selectedId);
  const checked: Record<number, boolean> = checkedMap[key] ?? {};
  const doneCount = CHECKLIST_ITEMS.filter((i) => checked[i.id]).length;
  const allDone   = doneCount === CHECKLIST_ITEMS.length;
  const evidence: number[] = evidenceMap[key] ?? [];
  const dbm       = dbmMap[key] ?? -76;
  const estado: Estado = estadoMap[key] ?? 'operativo';

  function openVisit(id: string) {
    setSelectedId(id);
    setTab('resumen');
    setView('detail');
  }

  function toggleItem(id: number) {
    setCheckedMap((prev) => {
      const current: Record<number, boolean> = prev[key] ?? {};
      return { ...prev, [key]: { ...current, [id]: !current[id] } };
    });
  }

  function confirmAccess() {
    setCheckedMap((prev) => {
      const current: Record<number, boolean> = prev[key] ?? {};
      return { ...prev, [key]: { ...current, 1: true } };
    });
    setTab('checklist');
  }

  function addEvidence() {
    setEvidenceMap((prev) => {
      const arr: number[] = prev[key] ?? [];
      if (arr.length >= MAX_PHOTOS) return prev;
      return { ...prev, [key]: [...arr, arr.length + 1] };
    });
  }

  function finalize() {
    setVisits((prev) =>
      prev.map((v): Visit => (v.id === selectedId ? { ...v, status: 'completada' } : v)),
    );
    setView('success');
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}>
        <StatusBar style="light" />

        {view === 'agenda' && (
          <AgendaScreen
            visits={visits}
            online={online}
            onToggleOnline={() => setOnline((o) => !o)}
            onOpen={openVisit}
          />
        )}

        {view === 'detail' && visit && (
          <DetailScreen
            visit={visit}
            tab={tab}
            setTab={setTab}
            online={online}
            onToggleOnline={() => setOnline((o) => !o)}
            onBack={() => setView('agenda')}
            checked={checked}
            doneCount={doneCount}
            allDone={allDone}
            onToggle={toggleItem}
            onConfirmAccess={confirmAccess}
            evidence={evidence}
            onAddEvidence={addEvidence}
            notes={notesMap[key] ?? ''}
            onNotesChange={(t) => setNotesMap((prev) => ({ ...prev, [key]: t }))}
            dbm={dbm}
            onDbmChange={(v) => setDbmMap((prev) => ({ ...prev, [key]: v }))}
            estado={estado}
            onEstadoChange={(v) => setEstadoMap((prev) => ({ ...prev, [key]: v }))}
            fallaNote={fallaNotes[key] ?? ''}
            onFallaNoteChange={(t) => setFallaNotes((prev) => ({ ...prev, [key]: t }))}
            iccidVerified={!!iccidVerified[key]}
            onIccidVerify={() => setIccidVerified((prev) => ({ ...prev, [key]: !prev[key] }))}
            onFinalize={finalize}
          />
        )}

        {view === 'success' && visit && (
          <SuccessScreen visit={visit} online={online} onDone={() => setView('agenda')} />
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  // layout
  row:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  rowStart: { flexDirection: 'row', alignItems: 'center' },
  divider:  { height: 1, backgroundColor: C.border },

  // typography
  heading:  { fontWeight: '700', color: C.text1, letterSpacing: -0.3 },
  subText:  { fontSize: 12, color: C.text2 },
  mono:     { fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace', color: C.text2 },
  sectionLabel: {
    fontSize: 10, fontWeight: '600', letterSpacing: 1.5,
    textTransform: 'uppercase', color: C.text3, marginBottom: 8,
  },

  // brand
  logo: {
    width: 30, height: 30, borderRadius: 9,
    backgroundColor: '#1A1A1A',
    borderWidth: 1, borderColor: 'rgba(249,115,22,0.4)',
    alignItems: 'center', justifyContent: 'center',
  },
  logoText: { color: C.orange, fontSize: 16, fontWeight: '700' },
  appTitle: { fontSize: 14, fontWeight: '600', color: C.text1, marginLeft: 8 },

  // pill / badge
  pill: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    borderWidth: 1, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20,
  },
  pillText:  { fontSize: 11, fontWeight: '500', marginLeft: 4 },
  badge: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 9, paddingVertical: 3, borderRadius: 20,
  },
  badgeDot:  { width: 5, height: 5, borderRadius: 3, marginRight: 5 },
  badgeText: { fontSize: 11, fontWeight: '500' },

  // card
  card: {
    backgroundColor: C.card,
    borderWidth: 1, borderColor: C.border,
    borderRadius: 14, padding: 14,
  },

  // visit card
  visitCard: {
    backgroundColor: C.card,
    borderWidth: 1, borderColor: C.borderBright,
    borderRadius: 14, padding: 12, paddingLeft: 16,
    marginBottom: 8, position: 'relative', overflow: 'hidden',
  },
  accentBar: { position: 'absolute', left: 0, top: 8, bottom: 8, width: 3, borderRadius: 2 },
  serviceIcon: {
    width: 36, height: 36, borderRadius: 10, borderWidth: 1,
    alignItems: 'center', justifyContent: 'center',
  },

  // tabs
  tabsBar: { flexGrow: 0, borderBottomWidth: 1, borderBottomColor: C.border },
  tab: { paddingHorizontal: 10, paddingVertical: 8, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabActive:     { borderBottomColor: C.orange },
  tabText:       { fontSize: 12, color: C.text3 },
  tabTextActive: { fontWeight: '600', color: C.text1 },

  // data row
  dataRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 9, borderBottomWidth: 1, borderBottomColor: C.border,
  },
  dataLabel: { fontSize: 11, color: C.text3, width: 84 },
  dataValue: { fontSize: 12, color: C.text1, fontWeight: '500', flex: 1, textAlign: 'right' },

  // checklist
  checkItem: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 10,
    backgroundColor: C.card, borderWidth: 1, borderColor: C.border,
    borderRadius: 12, padding: 11, marginBottom: 7,
  },
  checkCircle: {
    width: 20, height: 20, borderRadius: 10, borderWidth: 1.5,
    borderColor: C.text3, alignItems: 'center', justifyContent: 'center', marginTop: 1,
  },
  checkSquare: {
    width: 20, height: 20, borderRadius: 5, borderWidth: 1.5,
    borderColor: C.text3, alignItems: 'center', justifyContent: 'center',
  },

  // progress
  progressTrack: { flex: 1, height: 4, backgroundColor: C.surface, borderRadius: 4, overflow: 'hidden' },
  progressFill:  { height: '100%', backgroundColor: C.orange, borderRadius: 4 },

  // equipo
  estadoBtn: { flex: 1, padding: 9, borderRadius: 10, borderWidth: 1, alignItems: 'center' },

  // evidencias
  photoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  photoCell: {
    width: '30%', aspectRatio: 1, borderRadius: 10,
    borderWidth: 1, alignItems: 'center', justifyContent: 'center',
  },

  // textarea
  textarea: {
    backgroundColor: C.card, borderWidth: 1, borderColor: C.border,
    borderRadius: 12, padding: 12, color: C.text1, fontSize: 13,
    textAlignVertical: 'top', minHeight: 120,
  },

  // finalize
  finalizeBar:  { padding: 14, borderTopWidth: 1, borderTopColor: C.border },
  finalizeHint: { fontSize: 10, color: C.text3, textAlign: 'center', marginBottom: 7 },

  // buttons
  primaryBtn: {
    backgroundColor: C.orange, borderRadius: 12,
    padding: 13, alignItems: 'center',
    shadowColor: C.orange, shadowOpacity: 0.35, shadowRadius: 12, shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  primaryBtnDisabled: { backgroundColor: C.surface, shadowOpacity: 0, elevation: 0 },
  primaryBtnText: { color: '#fff', fontSize: 14, fontWeight: '700' },
  backBtn: {
    backgroundColor: 'rgba(255,255,255,0.06)', borderWidth: 1, borderColor: C.border,
    borderRadius: 9, padding: 7, alignItems: 'center', justifyContent: 'center',
  },

  // success
  successContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  successIcon: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: C.greenDim, borderWidth: 1, borderColor: C.green + '40',
    alignItems: 'center', justifyContent: 'center', marginBottom: 18,
  },
  syncPill: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20,
    borderWidth: 1, marginBottom: 28,
  },
});
