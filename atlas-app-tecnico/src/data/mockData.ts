import type { Visit, Status, IconName, TabId } from '../types';
import { C } from '../theme/colors';

// ─── Datos ────────────────────────────────────────────────────────────────────
export const MAX_PHOTOS = 6;

export const VISITS_INIT: Visit[] = [
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

export const CHECKLIST_ITEMS = [
  { id: 1, title: 'Verificación de acceso',      desc: 'Acceso al lugar confirmado' },
  { id: 2, title: 'Revisión de equipos',         desc: 'Equipos en condiciones operativas' },
  { id: 3, title: 'Instalación / mantenimiento', desc: 'Trabajo realizado correctamente' },
  { id: 4, title: 'Pruebas de funcionamiento',   desc: 'Todo funcionando según estándar' },
  { id: 5, title: 'Cierre y validación',         desc: 'Cliente conforme con el servicio' },
];

export const STATUS_META: Record<Status, { label: string; bg: string; color: string; dot: string }> = {
  programada: { label: 'Programada', bg: 'rgba(255,255,255,0.07)', color: C.text2,      dot: C.text3 },
  en_ruta:    { label: 'En ruta',    bg: C.blueDim,                color: C.blue,       dot: C.blue },
  en_curso:   { label: 'En curso',   bg: C.orangeDim,              color: C.orangeText, dot: C.orange },
  completada: { label: 'Completada', bg: C.greenDim,               color: C.green,      dot: C.green },
};

export const SERVICE_COLOR: Record<string, string> = {
  'Instalación de Internet': '#60A5FA',
  'Mantención de equipo':    '#FBBF24',
  'Cambio de router':        '#F97316',
  'Revisión de enlace':      '#A78BFA',
};

export const SERVICE_ICON: Record<string, IconName> = {
  'Instalación de Internet': 'wifi',
  'Mantención de equipo':    'tool',
  'Cambio de router':        'refresh-cw',
  'Revisión de enlace':      'clipboard',
};

export const TABS: { id: TabId; label: string }[] = [
  { id: 'resumen',    label: 'Resumen' },
  { id: 'checklist',  label: 'Checklist' },
  { id: 'equipo',     label: 'Equipo' },
  { id: 'evidencias', label: 'Evidencias' },
  { id: 'notas',      label: 'Notas' },
];
