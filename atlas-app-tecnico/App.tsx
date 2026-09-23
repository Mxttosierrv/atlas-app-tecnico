import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { C } from './src/theme/colors';
import { CHECKLIST_ITEMS, MAX_PHOTOS, VISITS_INIT } from './src/data/mockData';
import { AgendaScreen } from './src/screens/AgendaScreen';
import { DetailScreen } from './src/screens/DetailScreen';
import { SuccessScreen } from './src/screens/SuccessScreen';
import type { Estado, TabId, Visit, ViewName } from './src/types';

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