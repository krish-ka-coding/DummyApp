import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Switch, ScrollView } from 'react-native';

interface SettingsProps {
  onClose: () => void;
  isDarkMode: boolean;
  onToggleTheme: (value: boolean) => void;
  currentWallpaperName: string;
  onCycleWallpaper: () => void;
}

export default function Settings({
  onClose,
  isDarkMode,
  onToggleTheme,
  currentWallpaperName,
  onCycleWallpaper
}: SettingsProps) {
  return (
    <View style={[styles.container, isDarkMode ? styles.bgDark : styles.bgLight]}>
      <View style={[styles.header, isDarkMode ? styles.borderDark : styles.borderLight]}>
        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
          <Text style={styles.closeText}>✕ Close</Text>
        </TouchableOpacity>
        <Text style={[styles.title, isDarkMode ? styles.textLight : styles.textDark]}>Settings</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <Text style={[styles.largeTitle, isDarkMode ? styles.textLight : styles.textDark]}>Settings</Text>

        {/* Profile Card */}
        <View style={[styles.card, isDarkMode ? styles.cardDark : styles.cardLight]}>
          <View style={styles.profileRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>KC</Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={[styles.profileName, isDarkMode ? styles.textLight : styles.textDark]}>Krish Coding</Text>
              <Text style={styles.profileSub}>Apple Account, iCloud, & Security</Text>
            </View>
          </View>
        </View>

        {/* Connection Group */}
        <View style={[styles.card, isDarkMode ? styles.cardDark : styles.cardLight]}>
          <View style={styles.row}>
            <Text style={[styles.rowText, isDarkMode ? styles.textLight : styles.textDark]}>Wi-Fi</Text>
            <Text style={styles.rowVal}>Connected</Text>
          </View>
          <View style={[styles.separator, isDarkMode ? styles.sepDark : styles.sepLight]} />
          <View style={styles.row}>
            <Text style={[styles.rowText, isDarkMode ? styles.textLight : styles.textDark]}>Bluetooth</Text>
            <Text style={styles.rowVal}>On</Text>
          </View>
        </View>

        {/* Appearance Options */}
        <View style={[styles.card, isDarkMode ? styles.cardDark : styles.cardLight]}>
          <View style={styles.row}>
            <Text style={[styles.rowText, isDarkMode ? styles.textLight : styles.textDark]}>Dark Mode</Text>
            <Switch
              value={isDarkMode}
              onValueChange={onToggleTheme}
              trackColor={{ false: '#767577', true: '#34c759' }}
              thumbColor={isDarkMode ? '#ffffff' : '#f4f3f4'}
            />
          </View>
          <View style={[styles.separator, isDarkMode ? styles.sepDark : styles.sepLight]} />
          <TouchableOpacity style={styles.row} onPress={onCycleWallpaper}>
            <Text style={[styles.rowText, isDarkMode ? styles.textLight : styles.textDark]}>Wallpaper</Text>
            <Text style={styles.rowVal}>{currentWallpaperName} ›</Text>
          </TouchableOpacity>
        </View>

        {/* System Specs */}
        <View style={[styles.card, isDarkMode ? styles.cardDark : styles.cardLight]}>
          <View style={styles.row}>
            <Text style={[styles.rowText, isDarkMode ? styles.textLight : styles.textDark]}>Model Name</Text>
            <Text style={styles.rowVal}>iPhone 16 Pro Max</Text>
          </View>
          <View style={[styles.separator, isDarkMode ? styles.sepDark : styles.sepLight]} />
          <View style={styles.row}>
            <Text style={[styles.rowText, isDarkMode ? styles.textLight : styles.textDark]}>iOS Version</Text>
            <Text style={styles.rowVal}>19.0 (23A344)</Text>
          </View>
          <View style={[styles.separator, isDarkMode ? styles.sepDark : styles.sepLight]} />
          <View style={styles.row}>
            <Text style={[styles.rowText, isDarkMode ? styles.textLight : styles.textDark]}>Capacity</Text>
            <Text style={styles.rowVal}>512 GB</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bgLight: {
    backgroundColor: '#f2f2f7',
  },
  bgDark: {
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
  },
  borderLight: {
    borderBottomColor: '#e5e5ea',
    backgroundColor: '#ffffff',
  },
  borderDark: {
    borderBottomColor: '#1c1c1e',
    backgroundColor: '#1c1c1e',
  },
  closeBtn: {
    padding: 8,
  },
  closeText: {
    color: '#007aff',
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  body: {
    padding: 20,
    gap: 20,
  },
  largeTitle: {
    fontSize: 34,
    fontWeight: '700',
    marginBottom: 5,
  },
  card: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  cardLight: {
    backgroundColor: '#ffffff',
  },
  cardDark: {
    backgroundColor: '#1c1c1e',
  },
  profileRow: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007aff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '600',
  },
  profileInfo: {
    marginLeft: 14,
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
  },
  profileSub: {
    color: '#8e8e93',
    fontSize: 12,
    marginTop: 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    paddingHorizontal: 16,
  },
  rowText: {
    fontSize: 16,
    fontWeight: '400',
  },
  rowVal: {
    color: '#8e8e93',
    fontSize: 15,
  },
  separator: {
    height: 1,
    marginLeft: 16,
  },
  sepLight: {
    backgroundColor: '#e5e5ea',
  },
  sepDark: {
    backgroundColor: '#2c2c2e',
  },
  textLight: {
    color: '#ffffff',
  },
  textDark: {
    color: '#000000',
  },
});
