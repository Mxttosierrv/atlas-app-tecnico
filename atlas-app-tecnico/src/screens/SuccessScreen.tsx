import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { C } from '../theme/colors';
import { s } from '../styles/styles';
import type { Visit } from '../types';

// ─── Pantalla Éxito ───────────────────────────────────────────────────────────
type SuccessProps = {
  visit: Visit;
  online: boolean;
  onDone: () => void;
};

export function SuccessScreen({ visit, online, onDone }: SuccessProps) {
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
