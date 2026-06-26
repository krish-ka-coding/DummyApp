import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions } from 'react-native';

interface WeatherProps {
  onClose: () => void;
}

export default function Weather({ onClose }: WeatherProps) {
  const hourlyData = [
    { time: 'Now', temp: '32°', icon: '☀️' },
    { time: '1 PM', temp: '34°', icon: '☀️' },
    { time: '2 PM', temp: '35°', icon: '⛅' },
    { time: '3 PM', temp: '35°', icon: '⛅' },
    { time: '4 PM', temp: '33°', icon: '⛅' },
    { time: '5 PM', temp: '31°', icon: '☀️' },
    { time: '6 PM', temp: '29°', icon: '🌙' },
  ];

  const weeklyData = [
    { day: 'Today', tempLow: '27°', tempHigh: '36°', icon: '⛅', fillLeft: '20%', fillWidth: '60%' },
    { day: 'Saturday', tempLow: '28°', tempHigh: '37°', icon: '☀️', fillLeft: '30%', fillWidth: '65%' },
    { day: 'Sunday', tempLow: '28°', tempHigh: '35°', icon: '⛅', fillLeft: '30%', fillWidth: '55%' },
    { day: 'Monday', tempLow: '29°', tempHigh: '38°', icon: '☀️', fillLeft: '40%', fillWidth: '60%' },
    { day: 'Tuesday', tempLow: '26°', tempHigh: '32°', icon: '🌧️', fillLeft: '10%', fillWidth: '40%' },
    { day: 'Wednesday', tempLow: '25°', tempHigh: '30°', icon: '⛈️', fillLeft: '5%', fillWidth: '35%' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
          <Text style={styles.closeText}>✕ Close</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Weather</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Current Weather Section */}
        <View style={styles.currentSection}>
          <Text style={styles.city}>New Delhi</Text>
          <Text style={styles.temp}>32°</Text>
          <Text style={styles.condition}>Partly Cloudy</Text>
          <Text style={styles.range}>H:36°  L:27°</Text>
        </View>

        {/* Hourly Forecast */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Hourly Forecast</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hourlyList}>
            {hourlyData.map((item, idx) => (
              <View key={idx} style={styles.hourlyItem}>
                <Text style={styles.hourlyTime}>{item.time}</Text>
                <Text style={styles.hourlyIcon}>{item.icon}</Text>
                <Text style={styles.hourlyTemp}>{item.temp}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* 7-Day Forecast */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>7-Day Forecast</Text>
          <View style={styles.weeklyList}>
            {weeklyData.map((item, idx) => (
              <View key={idx} style={styles.weeklyRow}>
                <Text style={styles.weeklyDay}>{item.day}</Text>
                <Text style={styles.weeklyIcon}>{item.icon}</Text>
                <View style={styles.weeklyTempContainer}>
                  <Text style={styles.weeklyLow}>{item.tempLow}</Text>
                  <View style={styles.tempBar}>
                    <View style={[styles.tempBarFill, { left: item.fillLeft as any, width: item.fillWidth as any }]} />
                  </View>
                  <Text style={styles.weeklyHigh}>{item.tempHigh}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4fa3e3', // Standard iOS Weather blue sky
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 10,
    backgroundColor: 'rgba(79, 163, 227, 0.9)',
  },
  closeBtn: {
    padding: 8,
  },
  closeText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
  scrollContent: {
    padding: 20,
    gap: 20,
  },
  currentSection: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  city: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: '400',
  },
  temp: {
    color: '#ffffff',
    fontSize: 84,
    fontWeight: '200',
  },
  condition: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '500',
    marginTop: -5,
  },
  range: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    fontWeight: '500',
    marginTop: 5,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  cardTitle: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  hourlyList: {
    gap: 18,
  },
  hourlyItem: {
    alignItems: 'center',
    gap: 8,
    minWidth: 45,
  },
  hourlyTime: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
  hourlyIcon: {
    fontSize: 20,
  },
  hourlyTemp: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  weeklyList: {
    gap: 14,
  },
  weeklyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  weeklyDay: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
    width: 80,
  },
  weeklyIcon: {
    fontSize: 18,
    width: 30,
    textAlign: 'center',
  },
  weeklyTempContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  weeklyLow: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
    width: 28,
    textAlign: 'right',
  },
  weeklyHigh: {
    color: '#ffffff',
    fontSize: 14,
    width: 28,
    textAlign: 'right',
    fontWeight: '600',
  },
  tempBar: {
    width: 80,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 2,
    position: 'relative',
  },
  tempBarFill: {
    position: 'absolute',
    height: '100%',
    backgroundColor: '#ffb300',
    borderRadius: 2,
  },
});
