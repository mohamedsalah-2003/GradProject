import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { getAnalytics } from "../../../services/analytics.service";
import { useAlertsStore } from "../../store/alertsStore";

const COLORS = {
  bg: '#f5f6fa',
  surface: '#ffffff',
  card: '#ffffff',
  border: '#e8eaf0',
  accent: '#3b82f6',
  green: '#22c55e',
  orange: '#f59e0b',
  red: '#ef4444',
  purple: '#8b5cf6',
  textPrimary: '#111827',
  textSecondary: '#6b7280',
  textMuted: '#9ca3af',
};

const RANGES = ['24h', '7d', '30d'];
const { width: windowWidth } = Dimensions.get('window');

// ─── Sub-components ───────────────────────────────────────────────────────────

const StatCard = ({ label, value, color, iconName, iconLib = 'Ionicons', fadeAnim }) => {
  const IconComponent = iconLib === 'MaterialCommunityIcons' ? MaterialCommunityIcons : Ionicons;
  return (
    <Animated.View style={[styles.statCard, { opacity: fadeAnim }]}>
      <View style={[styles.statIconWrap, { backgroundColor: color + '18' }]}>
        <IconComponent name={iconName} size={20} color={color} />
      </View>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </Animated.View>
  );
};

const SectionHeader = ({ title, subtitle, iconName, iconColor }) => (
  <View style={styles.sectionHeader}>
    <View style={styles.sectionTitleRow}>
      {iconName && (
        <Ionicons name={iconName} size={17} color={iconColor || COLORS.textSecondary} style={{ marginRight: 6 }} />
      )}
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
    {subtitle ? <Text style={styles.sectionSubtitle}>{subtitle}</Text> : null}
  </View>
);

const AnomalyBadge = ({ type, count }) => {
  const schemes = {
    fire:           { bg: '#fef2f2', text: '#ef4444', dot: '#ef4444' },
    gas_leak:       { bg: '#fffbeb', text: '#d97706', dot: '#f59e0b' },
    intrusion:      { bg: '#eff6ff', text: '#2563eb', dot: '#3b82f6' },
    water_leak:     { bg: '#f0fdf4', text: '#16a34a', dot: '#22c55e' },
    energy_anomaly: { bg: '#f5f3ff', text: '#7c3aed', dot: '#8b5cf6' },
  };
  const scheme = schemes[type] || { bg: '#f9fafb', text: '#6b7280', dot: '#9ca3af' };
  const label = type.replace('_', ' ');
  return (
    <View style={[styles.anomalyBadge, { backgroundColor: scheme.bg }]}>
      <View style={[styles.anomalyDot, { backgroundColor: scheme.dot }]} />
      <Text style={[styles.anomalyType, { color: scheme.text }]}>{label}</Text>
      <Text style={[styles.anomalyCount, { color: scheme.text }]}>{count}</Text>
    </View>
  );
};

// ─── Main Screen ──────────────────────────────────────────────────────────────

const Analytics = () => {
  const [analytics, setAnalytics]       = useState(null);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);
  const [selectedRange, setSelectedRange] = useState('24h');
  const [chartWidth, setChartWidth]     = useState(windowWidth - 48);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // ── Subscribe to store ───────────────────────────────────────────────────────
  const alerts        = useAlertsStore((s) => s.alerts);
  const latestReading = useAlertsStore((s) => s.latestReading);
  const latestAlert   = alerts[0] ?? null;

  // ── Dimension listener ───────────────────────────────────────────────────────
  useEffect(() => {
    const sub = Dimensions.addEventListener('change', () => {
      setChartWidth(Dimensions.get('window').width - 48);
    });
    return () => sub.remove();
  }, []);

  // ── Fetch analytics ──────────────────────────────────────────────────────────
  const fetchAnalytics = useCallback(async (range) => {
    setLoading(true);
    setError(null);
    fadeAnim.setValue(0);
    try {
      const data = await getAnalytics(range);
      setAnalytics(data);
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
    } catch (err) {
      console.error(err);
      setError('Failed to load analytics. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [fadeAnim]);

  useEffect(() => { fetchAnalytics(selectedRange); }, [selectedRange]);

  // ── React to new alert → update summary + anomalyBreakdown + timeSeries ─────
  const prevAlertIdRef = useRef(null);

  useEffect(() => {
    if (!latestAlert) return;
    if (latestAlert.id === prevAlertIdRef.current) return;
    prevAlertIdRef.current = latestAlert.id;

    setAnalytics((prev) => {
      if (!prev) return prev;

      const now   = new Date();
      const isCritical = latestAlert.type === 'Critical';

      // 1. Update summary counts
      const totalAnomalies  = (prev.summary?.totalAnomalies  ?? 0) + 1;
      const totalReadings   =  prev.summary?.totalReadings   ?? 0;
      const anomalyRate     = totalReadings
        ? ((totalAnomalies / totalReadings) * 100).toFixed(1)
        : prev.summary?.anomalyRate ?? 0;

      // 2. Update anomalyBreakdown
      const anomalyType = latestAlert.anomalyType ?? 'unknown';
      const anomalyBreakdown = {
        ...(prev.anomalyBreakdown ?? {}),
        [anomalyType]: ((prev.anomalyBreakdown?.[anomalyType] ?? 0) + 1),
      };

      // 3. Update timeSeries — bump anomaly count in the latest bucket
      const timeSeries = [...(prev.timeSeries ?? [])];
      if (timeSeries.length > 0) {
        const last = { ...timeSeries[timeSeries.length - 1] };
        last.anomalies = (last.anomalies ?? 0) + 1;
        timeSeries[timeSeries.length - 1] = last;
      }

      return {
        ...prev,
        summary: {
          ...prev.summary,
          totalAnomalies,
          anomalyRate,
        },
        anomalyBreakdown,
        timeSeries,
      };
    });
  }, [latestAlert]);

  // ── React to new reading → update sensor averages + timeSeries ──────────────
  const prevReadingIdRef = useRef(null);

  useEffect(() => {
    if (!latestReading) return;
    if (latestReading._id === prevReadingIdRef.current) return;
    prevReadingIdRef.current = latestReading._id;

    setAnalytics((prev) => {
      if (!prev) return prev;

      // Update summary averages (running average approximation)
      const n = prev.summary?.totalReadings ?? 1;
      const reCalcAvg = (oldAvg, newVal) =>
        parseFloat(((oldAvg * n + newVal) / (n + 1)).toFixed(1));

      // Update timeSeries last bucket sensor values
      const timeSeries = [...(prev.timeSeries ?? [])];
      if (timeSeries.length > 0) {
        const last = { ...timeSeries[timeSeries.length - 1] };
        last.avgTemp  = reCalcAvg(last.avgTemp  ?? 0, latestReading.temp);
        last.avgGas   = reCalcAvg(last.avgGas   ?? 0, latestReading.gas);
        last.avgSmoke = reCalcAvg(last.avgSmoke ?? 0, latestReading.smoke);
        last.avgPower = reCalcAvg(last.avgPower ?? 0, latestReading.power);
        timeSeries[timeSeries.length - 1] = last;
      }

      return {
        ...prev,
        summary: {
          ...prev.summary,
          totalReadings: n + 1,
          avgTemp:  reCalcAvg(prev.summary?.avgTemp  ?? 0, latestReading.temp),
          avgGas:   reCalcAvg(prev.summary?.avgGas   ?? 0, latestReading.gas),
          avgSmoke: reCalcAvg(prev.summary?.avgSmoke ?? 0, latestReading.smoke),
          avgPower: reCalcAvg(prev.summary?.avgPower ?? 0, latestReading.power),
        },
        timeSeries,
      };
    });
  }, [latestReading]);

  // ── Chart helpers ────────────────────────────────────────────────────────────
  const chartConfig = (lineColor) => ({
    backgroundGradientFrom: COLORS.card,
    backgroundGradientTo:   COLORS.card,
    color: (opacity = 1) => lineColor(opacity),
    labelColor: () => COLORS.textMuted,
    strokeWidth: 2,
    decimalPlaces: 1,
    propsForDots:            { r: '3', strokeWidth: '1', stroke: COLORS.card },
    propsForBackgroundLines: { stroke: COLORS.border, strokeDasharray: '4' },
  });

  const buildChartData = (key) => {
    const series = analytics?.timeSeries ?? [];
    const MAX_POINTS = 7;
    const slice = series.length > MAX_POINTS
      ? series.filter((_, i) => i % Math.ceil(series.length / MAX_POINTS) === 0).slice(0, MAX_POINTS)
      : series;
    return {
      labels:   slice.map((s) => s.label),
      datasets: [{ data: slice.length ? slice.map((s) => s[key] ?? 0) : [0] }],
    };
  };

  // ── States ───────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={COLORS.accent} />
        <Text style={styles.loadingText}>Loading analytics...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Ionicons name="warning-outline" size={48} color={COLORS.orange} style={{ marginBottom: 12 }} />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={() => fetchAnalytics(selectedRange)}>
          <Text style={styles.retryBtnText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const { summary = {}, anomalyBreakdown = {}, timeSeries = [] } = analytics ?? {};
  const anomalyEntries = Object.entries(anomalyBreakdown);
  const anomalyRate    = parseFloat(summary.anomalyRate ?? 0);
  const rateColor      = anomalyRate > 50 ? COLORS.red : anomalyRate > 20 ? COLORS.orange : COLORS.green;

  // ── UI ───────────────────────────────────────────────────────────────────────
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Analytics</Text>
          <Text style={styles.headerSub}>
            Safety metrics · {selectedRange === '24h' ? 'Last 24 hours' : selectedRange === '7d' ? 'Last 7 days' : 'Last 30 days'}
          </Text>
        </View>
        <View style={styles.liveIndicator}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>Live</Text>
        </View>
      </View>

      {/* Range Selector */}
      <View style={styles.rangeRow}>
        {RANGES.map((r) => (
          <TouchableOpacity
            key={r}
            style={[styles.rangeBtn, selectedRange === r && styles.rangeBtnActive]}
            onPress={() => setSelectedRange(r)}
          >
            <Text style={[styles.rangeBtnText, selectedRange === r && styles.rangeBtnTextActive]}>{r}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Stat Cards */}
      <Animated.View style={[styles.statsGrid, { opacity: fadeAnim }]}>
        <StatCard label="Total Alerts" value={summary.totalAnomalies ?? 0} color={COLORS.red}    iconName="notifications-outline" fadeAnim={fadeAnim} />
        <StatCard label="Devices"      value={summary.activeDevices  ?? 0} color={COLORS.accent} iconName="hardware-chip-outline"  fadeAnim={fadeAnim} />
        <StatCard label="Anomaly Rate" value={`${anomalyRate}%`}           color={rateColor}     iconName="stats-chart-outline"    fadeAnim={fadeAnim} />
        <StatCard label="Readings"     value={summary.totalReadings  ?? 0} color={COLORS.purple} iconName="document-text-outline"  fadeAnim={fadeAnim} />
      </Animated.View>

      {/* Sensor Averages */}
      <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
        <SectionHeader title="Sensor Averages" iconName="pulse-outline" iconColor={COLORS.accent} />
        <View style={styles.sensorRow}>
          <View style={styles.sensorItem}>
            <Text style={styles.sensorVal}>{summary.avgTemp ?? '--'}°C</Text>
            <Text style={styles.sensorLbl}>Temperature</Text>
          </View>
          <View style={[styles.sensorItem, styles.sensorDivider]}>
            <Text style={styles.sensorVal}>{summary.avgGas ?? '--'}</Text>
            <Text style={styles.sensorLbl}>Gas (ppm)</Text>
          </View>
          <View style={[styles.sensorItem, styles.sensorDivider]}>
            <Text style={styles.sensorVal}>{summary.avgSmoke ?? '--'}</Text>
            <Text style={styles.sensorLbl}>Smoke</Text>
          </View>
          <View style={[styles.sensorItem, styles.sensorDivider]}>
            <Text style={styles.sensorVal}>{summary.avgPower ?? '--'}W</Text>
            <Text style={styles.sensorLbl}>Power</Text>
          </View>
        </View>
      </Animated.View>

      {/* Temperature Chart */}
      {timeSeries.length > 0 && (
        <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
          <SectionHeader title="Temperature" subtitle="°C over time" iconName="thermometer-outline" iconColor={COLORS.accent} />
          <LineChart
            data={buildChartData('avgTemp')}
            width={chartWidth} height={180}
            chartConfig={chartConfig((op) => `rgba(59, 130, 246, ${op})`)}
            bezier style={styles.chart} withInnerLines withOuterLines={false}
          />
        </Animated.View>
      )}

      {/* Gas Chart */}
      {timeSeries.length > 0 && (
        <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
          <SectionHeader title="Gas Levels" subtitle="ppm over time" iconName="cloud-outline" iconColor={COLORS.red} />
          <LineChart
            data={buildChartData('avgGas')}
            width={chartWidth} height={180}
            chartConfig={chartConfig((op) => `rgba(239, 68, 68, ${op})`)}
            bezier style={styles.chart} withInnerLines withOuterLines={false}
          />
        </Animated.View>
      )}

      {/* Anomaly Activity Bar */}
      {timeSeries.length > 0 && (
        <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
          <SectionHeader title="Anomaly Activity" subtitle="events over time" iconName="bar-chart-outline" iconColor={COLORS.orange} />
          <BarChart
            data={buildChartData('anomalies')}
            width={chartWidth} height={180}
            chartConfig={chartConfig((op) => `rgba(245, 158, 11, ${op})`)}
            style={styles.chart} withInnerLines showValuesOnTopOfBars
          />
        </Animated.View>
      )}

      {/* Anomaly Breakdown */}
      {anomalyEntries.length > 0 && (
        <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
          <SectionHeader title="Anomaly Breakdown" subtitle={`${anomalyEntries.length} types detected`} iconName="warning-outline" iconColor={COLORS.orange} />
          <View style={styles.anomalyGrid}>
            {anomalyEntries.map(([type, count]) => (
              <AnomalyBadge key={type} type={type} count={count} />
            ))}
          </View>
        </Animated.View>
      )}

      {/* Summary Footer */}
      <Animated.View style={[styles.summaryCard, { opacity: fadeAnim }]}>
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryVal}>{summary.normalReadings ?? 0}</Text>
            <Text style={styles.summaryLbl}>Normal</Text>
          </View>
          <View style={[styles.summaryItem, styles.sensorDivider]}>
            <Text style={[styles.summaryVal, { color: COLORS.red }]}>{summary.totalAnomalies ?? 0}</Text>
            <Text style={styles.summaryLbl}>Anomalies</Text>
          </View>
          <View style={[styles.summaryItem, styles.sensorDivider]}>
            <Text style={[styles.summaryVal, { color: rateColor }]}>{anomalyRate}%</Text>
            <Text style={styles.summaryLbl}>Rate</Text>
          </View>
        </View>
      </Animated.View>

      <View style={{ height: 60 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container:   { flex: 1, backgroundColor: COLORS.bg },
  content:     { padding: 16 },
  centered:    { flex: 1, backgroundColor: COLORS.bg, alignItems: 'center', justifyContent: 'center', padding: 32 },
  loadingText: { marginTop: 12, color: COLORS.textSecondary, fontSize: 14 },
  errorText:   { color: COLORS.textSecondary, fontSize: 15, textAlign: 'center', marginBottom: 20 },
  retryBtn:    { backgroundColor: COLORS.accent, paddingHorizontal: 24, paddingVertical: 10, borderRadius: 8 },
  retryBtnText:{ color: '#fff', fontWeight: '600', fontSize: 14 },

  header:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, marginTop: 8 },
  headerTitle: { fontSize: 26, fontWeight: '700', color: COLORS.textPrimary, letterSpacing: -0.5 },
  headerSub:   { fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },

  liveIndicator: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f0fdf4', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, borderWidth: 1, borderColor: '#bbf7d0', marginTop: 4 },
  liveDot:       { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.green, marginRight: 5 },
  liveText:      { fontSize: 11, color: COLORS.green, fontWeight: '600' },

  rangeRow:         { flexDirection: 'row', backgroundColor: '#f1f3f8', borderRadius: 10, padding: 3, marginBottom: 16 },
  rangeBtn:         { flex: 1, paddingVertical: 7, alignItems: 'center', borderRadius: 8 },
  rangeBtnActive:   { backgroundColor: COLORS.surface, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 2, elevation: 2 },
  rangeBtnText:     { color: COLORS.textMuted, fontSize: 13, fontWeight: '500' },
  rangeBtnTextActive:{ color: COLORS.textPrimary, fontWeight: '600' },

  statsGrid:    { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 , justifyContent: 'space-between' },
  statCard:     { backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.border, borderRadius: 14, padding: 14, width: '47.5%', alignItems: 'flex-start', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 },
  statIconWrap: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  statValue:    { fontSize: 24, fontWeight: '700', letterSpacing: -0.5 },
  statLabel:    { fontSize: 12, color: COLORS.textMuted, marginTop: 2 },

  card:          { backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.border, borderRadius: 14, padding: 16, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 },
  sectionHeader: { marginBottom: 14 },
  sectionTitleRow:{ flexDirection: 'row', alignItems: 'center' },
  sectionTitle:  { fontSize: 15, fontWeight: '600', color: COLORS.textPrimary },
  sectionSubtitle:{ fontSize: 12, color: COLORS.textMuted, marginTop: 2 },
  chart:         { borderRadius: 10, marginLeft: 0 },

  sensorRow:     { flexDirection: 'row' },
  sensorItem:    { flex: 1, alignItems: 'center' },
  sensorDivider: { borderLeftWidth: 1, borderLeftColor: COLORS.border },
  sensorVal:     { fontSize: 16, fontWeight: '600', color: COLORS.textPrimary },
  sensorLbl:     { fontSize: 10, color: COLORS.textMuted, marginTop: 3 },

  anomalyGrid:  { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  anomalyBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20, gap: 6 },
  anomalyDot:   { width: 6, height: 6, borderRadius: 3 },
  anomalyType:  { fontSize: 12, fontWeight: '500', textTransform: 'capitalize' },
  anomalyCount: { fontSize: 12, fontWeight: '700' },

  summaryCard: { backgroundColor: '#f8faff', borderWidth: 1, borderColor: '#dbeafe', borderRadius: 14, padding: 16, marginBottom: 16 },
  summaryRow:  { flexDirection: 'row' },
  summaryItem: { flex: 1, alignItems: 'center' },
  summaryVal:  { fontSize: 20, fontWeight: '700', color: COLORS.textPrimary },
  summaryLbl:  { fontSize: 11, color: COLORS.textMuted, marginTop: 3 },
});

export default Analytics;
