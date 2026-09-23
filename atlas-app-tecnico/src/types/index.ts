import React from 'react';
import { Feather } from '@expo/vector-icons';

// ─── Tipos ────────────────────────────────────────────────────────────────────
export type Status   = 'programada' | 'en_ruta' | 'en_curso' | 'completada';
export type Estado   = 'operativo' | 'falla';
export type TabId    = 'resumen' | 'checklist' | 'equipo' | 'evidencias' | 'notas';
export type ViewName = 'agenda' | 'detail' | 'success';
export type IconName = React.ComponentProps<typeof Feather>['name'];

export type Visit = {
  id: string;
  time: string;
  client: string;
  service: string;
  address: string;
  zone: string;
  status: Status;
  equipo: { modelo: string; iccid: string; falla: string };
};
