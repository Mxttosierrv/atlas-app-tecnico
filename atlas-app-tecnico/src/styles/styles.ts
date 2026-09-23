import { StyleSheet, Platform } from 'react-native';
import { C } from '../theme/colors';

// ─── Estilos ──────────────────────────────────────────────────────────────────
export const s = StyleSheet.create({
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
