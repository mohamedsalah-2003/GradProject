import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';
import axios from 'axios';

const { width: windowWidth } = Dimensions.get("window");

const AnalyticsScreen = () => {
  const [data, setData] = useState({ 
    readings: [], 
    summary: { alerts: 0, devices: 0, critical: 2, uptime: '99.2%' }, 
    weekly: [2, 1, 3, 0, 2, 1, 4] 
  });
  const [loading, setLoading] = useState(true);
  const [chartWidth, setChartWidth] = useState(windowWidth - 60);

  useEffect(() => {
    const updateLayout = () => {
      setChartWidth(Dimensions.get("window").width - 60);
    };
    const subscription = Dimensions.addEventListener("change", updateLayout);
    return () => subscription.remove();
  }, []);

  const processData = (allReadings) => {
    const uniqueDevices = [...new Set(allReadings.map(r => r.deviceId))].length;
    const alertsCount = allReadings.filter(r => r.temp > 30 || r.gas > 0.05).length;
    return {
      readings: allReadings.slice(-10),
      summary: { alerts: alertsCount, devices: uniqueDevices, critical: 2, uptime: '99.2%' },
      weekly: [2, 1, 3, 0, 2, 1, 4] 
    };
  };

  const fetchReadings = async () => {
    try {
      const response = await axios.get('http://localhost:3000/readings/', {
        headers: { 'accesstoken': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2YTA3NTY2N2NjMjk4OTg0ZTYyYWRmZmIiLCJlbWFpbCI6ImFsYWFzYXllZDIwMDMxMTVAZ21haWwuY29tIiwiaWF0IjoxNzc4ODcwMjY3LCJleHAiOjE3Nzg4Nzc0NjcsImp0aSI6IjgwY2Q2OWRlLTA4ZDktNGFiZi05YjM4LTYwZjUyYWM4NGNkZiJ9.6yEGTXaKOYVNtDxMJE3_UDf3Lf0E27YzU3SpvW48uL8' }
      });
      setData(processData(response.data.readings || []));
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => { fetchReadings(); }, []);

  const chartConfig = (color) => ({
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    color: (opacity = 1) => color(opacity),
    labelColor: (opacity = 1) => `rgba(100, 100, 100, ${opacity})`,
    strokeWidth: 3,
    decimalPlaces: 2,
  });

  if (loading) return <ActivityIndicator size="large" color="#4CAF50" style={{flex:1, marginTop: 100}} />;

  return (
    <ScrollView style={styles.outerContainer}>
      <View style={styles.innerContent}>
        <Text style={styles.headerTitle}>Analytics</Text>
        <Text style={styles.headerSub}>Monitoring your safety metrics over time</Text>

    
        <View style={styles.row}>
          <View style={styles.smallCard}>
            <Text style={styles.cardLabel}>📈 Avg Temp</Text>
            <Text style={styles.cardValue}>{data.readings.length > 0 ? data.readings[data.readings.length-1].temp : 0}°C</Text>
          </View>
          <View style={styles.smallCard}>
            <Text style={styles.cardLabel}>📉 Gas Level</Text>
            <Text style={styles.cardValue}>{data.readings.length > 0 ? data.readings[data.readings.length-1].gas : 0}</Text>
          </View>
        </View>

        
        <View style={styles.bigCard}>
          <Text style={styles.bigCardTitle}>Temperature History (°C)</Text>
          <LineChart
            data={{
              labels: ["T1", "T2", "T3", "T4", "T5", "T6", "Now"],
              datasets: [{ data: data.readings.map(r => r.temp || 20) }]
            }}
            width={chartWidth}
            height={200}
            chartConfig={chartConfig((opacity) => `rgba(76, 175, 80, ${opacity})`)}
            bezier
            style={styles.chartStyle}
          />
        </View>

        
        <View style={styles.bigCard}>
          <Text style={styles.bigCardTitle}>Gas Levels (ppm)</Text>
          <LineChart
            data={{
              labels: ["G1", "G2", "G3", "G4", "G5", "G6", "Now"],
              datasets: [{ data: data.readings.map(r => r.gas || 0.01) }]
            }}
            width={chartWidth}
            height={200}
            chartConfig={chartConfig((opacity) => `rgba(33, 150, 243, ${opacity})`)}
            bezier
            style={styles.chartStyle}
          />
        </View>

        
        <View style={styles.bigCard}>
          <Text style={styles.bigCardTitle}>Weekly Activity</Text>
          <BarChart
            data={{
              labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
              datasets: [{ data: data.weekly }]
            }}
            width={chartWidth}
            height={200}
            chartConfig={chartConfig((opacity) => `rgba(255, 152, 0, ${opacity})`)}
            style={styles.chartStyle}
          />
        </View>

    
        <View style={[styles.bigCard, {backgroundColor: '#f0f7ff', marginBottom: 60}]}>
          <Text style={styles.bigCardTitle}>Weekly Summary</Text>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}><Text style={styles.summaryValue}>{data.summary.alerts}</Text><Text style={styles.summaryLabel}>Total Alerts</Text></View>
            <View style={styles.summaryItem}><Text style={styles.summaryValue}>{data.summary.critical}</Text><Text style={styles.summaryLabel}>Critical Events</Text></View>
            <View style={styles.summaryItem}><Text style={styles.summaryValue}>{data.summary.uptime}</Text><Text style={styles.summaryLabel}>Uptime</Text></View>
            <View style={[styles.summaryItem, {borderRightWidth:0}]}><Text style={styles.summaryValue}>{data.summary.devices}</Text><Text style={styles.summaryLabel}>Active Devices</Text></View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  outerContainer: { flex: 1, backgroundColor: '#f8f9fa' },
  innerContent: { width: '100%', padding: 20 },
  headerTitle: { fontSize: 26, fontWeight: 'bold', color: '#1a1a1a' },
  headerSub: { fontSize: 14, color: '#666', marginBottom: 20 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  smallCard: { backgroundColor: '#fff', width: '48%', padding: 20, borderRadius: 15, elevation: 2 },
  cardLabel: { fontSize: 12, color: '#888' },
  cardValue: { fontSize: 22, fontWeight: 'bold' },
  bigCard: { backgroundColor: '#fff', padding: 20, borderRadius: 15, marginBottom: 20, elevation: 2, alignItems: 'center' },
  bigCardTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', alignSelf: 'flex-start' },
  chartStyle: { marginTop: 15, borderRadius: 15 },
  summaryRow: { flexDirection: 'row', width: '100%', marginTop: 20 },
  summaryItem: { flex: 1, alignItems: 'center', borderRightWidth: 1, borderRightColor: '#d1e3f8' },
  summaryValue: { fontSize: 20, fontWeight: 'bold', color: '#001d3d' },
  summaryLabel: { fontSize: 11, color: '#555', marginTop: 5 }
});

export default AnalyticsScreen;