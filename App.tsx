import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  SafeAreaView
} from 'react-native';

// Import Custom App Screens
import Calculator from './src/components/Calculator';
import Weather from './src/components/Weather';
import Notes from './src/components/Notes';
import Settings from './src/components/Settings';

const { width } = Dimensions.get('window');

const wallpapers = [
  { name: 'Default Blue', color: '#2a5298' },
  { name: 'Midnight Slate', color: '#1e293b' },
  { name: 'Sunset Pink', color: '#f5576c' },
  { name: 'Pastel Lavender', color: '#a18cd1' }
];

export default function App() {
  const [activeAppId, setActiveAppId] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [wallpaperIdx, setWallpaperIdx] = useState(0);

  // Time & Date State
  const [timeStr, setTimeStr] = useState('09:41');
  const [dateStr, setDateStr] = useState('Friday, June 26');

  // Dynamic Island States
  const [islandActive, setIslandActive] = useState(false);
  const [islandLeft, setIslandLeft] = useState('');
  const [islandCenter, setIslandCenter] = useState('');
  const [islandRight, setIslandRight] = useState('');

  // Music Simulator
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);

  useEffect(() => {
    // Clock updater
    const timer = setInterval(() => {
      const now = new Date();
      let hours = now.getHours();
      let minutes = now.getMinutes();
      const rawHours = hours.toString().padStart(2, '0');
      const rawMinutes = minutes.toString().padStart(2, '0');
      setTimeStr(`${rawHours}:${rawMinutes}`);

      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      setDateStr(`${days[now.getDay()]}, ${months[now.getMonth()]} ${now.getDate()}`);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const triggerIslandAlert = (left: string, center: string, right: string) => {
    setIslandLeft(left);
    setIslandCenter(center);
    setIslandRight(right);
    setIslandActive(true);

    setTimeout(() => {
      setIslandActive(false);
    }, 2800);
  };

  const launchApp = (appId: string) => {
    triggerIslandAlert('⚡', `Opening ${appId.toUpperCase()}`, '✓');
    setActiveAppId(appId);
  };

  const closeActiveApp = () => {
    if (activeAppId) {
      triggerIslandAlert('📱', 'Home Screen', '');
      setActiveAppId(null);
    }
  };

  const cycleWallpaper = () => {
    const nextIdx = (wallpaperIdx + 1) % wallpapers.length;
    setWallpaperIdx(nextIdx);
    triggerIslandAlert('🖼', `Theme: ${wallpapers[nextIdx].name}`, '');
  };

  const toggleMusic = () => {
    const newState = !isPlayingMusic;
    setIsPlayingMusic(newState);
    if (newState) {
      triggerIslandAlert('🎶', 'Playing: Get Lucky', 'Now');
    } else {
      triggerIslandAlert('⏸', 'Music Paused', '');
    }
  };

  const activeWallpaper = wallpapers[wallpaperIdx];

  return (
    <View style={[styles.container, { backgroundColor: activeWallpaper.color }]}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Dynamic Island Overlay */}
      <View style={styles.islandContainer} pointerEvents="none">
        <View style={[styles.island, islandActive ? styles.islandExpanded : styles.islandCollapsed]}>
          {islandActive ? (
            <View style={styles.islandRow}>
              <Text style={styles.islandText}>{islandLeft}</Text>
              <Text style={styles.islandTitle}>{islandCenter}</Text>
              <Text style={styles.islandText}>{islandRight}</Text>
            </View>
          ) : (
            <View style={styles.islandPill} />
          )}
        </View>
      </View>

      {/* Main OS screen layer */}
      <View style={styles.screenContent}>
        {activeAppId === null ? (
          <SafeAreaView style={styles.homeScreen}>
            {/* Widgets Section */}
            <View style={styles.widgetContainer}>
              <View style={styles.timeWidget}>
                <Text style={styles.widgetTime}>{timeStr}</Text>
                <Text style={styles.widgetDate}>{dateStr}</Text>
              </View>

              {/* Weather Widget */}
              <TouchableOpacity
                style={styles.weatherWidget}
                onPress={() => launchApp('weather')}
                activeOpacity={0.8}
              >
                <View>
                  <Text style={styles.weatherCity}>New Delhi</Text>
                  <Text style={styles.weatherTemp}>32°</Text>
                </View>
                <View style={styles.weatherConditionBox}>
                  <Text style={styles.weatherIcon}>⛅</Text>
                  <Text style={styles.weatherText}>Partly Cloudy</Text>
                  <Text style={styles.weatherHiLo}>H:36° L:27°</Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* App Grid */}
            <View style={styles.gridContainer}>
              {/* Weather App */}
              <TouchableOpacity style={styles.appIconContainer} onPress={() => launchApp('weather')}>
                <View style={[styles.appIcon, { backgroundColor: '#5ac8fa' }]}>
                  <Text style={styles.appIconText}>⛅</Text>
                </View>
                <Text style={styles.appName}>Weather</Text>
              </TouchableOpacity>

              {/* Calculator App */}
              <TouchableOpacity style={styles.appIconContainer} onPress={() => launchApp('calculator')}>
                <View style={[styles.appIcon, { backgroundColor: '#ff9f0a' }]}>
                  <Text style={styles.appIconText}>＋</Text>
                </View>
                <Text style={styles.appName}>Calculator</Text>
              </TouchableOpacity>

              {/* Notes App */}
              <TouchableOpacity style={styles.appIconContainer} onPress={() => launchApp('notes')}>
                <View style={[styles.appIcon, { backgroundColor: '#f2f2f7' }]}>
                  <Text style={styles.appIconText}>📝</Text>
                </View>
                <Text style={styles.appName}>Notes</Text>
              </TouchableOpacity>

              {/* Settings App */}
              <TouchableOpacity style={styles.appIconContainer} onPress={() => launchApp('settings')}>
                <View style={[styles.appIcon, { backgroundColor: '#8e8e93' }]}>
                  <Text style={styles.appIconText}>⚙️</Text>
                </View>
                <Text style={styles.appName}>Settings</Text>
              </TouchableOpacity>

              {/* Music App */}
              <TouchableOpacity style={styles.appIconContainer} onPress={toggleMusic}>
                <View style={[styles.appIcon, { backgroundColor: '#ff2d55' }]}>
                  <Text style={styles.appIconText}>🎵</Text>
                </View>
                <Text style={styles.appName}>{isPlayingMusic ? 'Playing' : 'Music'}</Text>
              </TouchableOpacity>
            </View>

            {/* App Dock (pinned bottom apps) */}
            <View style={styles.dockContainer}>
              <View style={styles.dock}>
                <TouchableOpacity style={styles.dockIcon} onPress={() => launchApp('notes')}>
                  <Text style={styles.dockEmoji}>📝</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.dockIcon} onPress={() => launchApp('calculator')}>
                  <Text style={styles.dockEmoji}>＋</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.dockIcon} onPress={() => launchApp('settings')}>
                  <Text style={styles.dockEmoji}>⚙️</Text>
                </TouchableOpacity>
              </View>
            </View>
          </SafeAreaView>
        ) : (
          /* Active App Window Layout */
          <View style={styles.appContainer}>
            {activeAppId === 'weather' && <Weather onClose={closeActiveApp} />}
            {activeAppId === 'calculator' && <Calculator onClose={closeActiveApp} />}
            {activeAppId === 'notes' && <Notes onClose={closeActiveApp} triggerIsland={triggerIslandAlert} />}
            {activeAppId === 'settings' && (
              <Settings
                onClose={closeActiveApp}
                isDarkMode={isDarkMode}
                onToggleTheme={setIsDarkMode}
                currentWallpaperName={activeWallpaper.name}
                onCycleWallpaper={cycleWallpaper}
              />
            )}
          </View>
        )}
      </View>

      {/* Bottom Home Indicator Line */}
      {activeAppId !== null && (
        <TouchableOpacity style={styles.homeIndicator} onPress={closeActiveApp}>
          <View style={styles.homeIndicatorBar} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  islandContainer: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 9999,
  },
  island: {
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    overflow: 'hidden',
  },
  islandCollapsed: {
    width: 110,
    height: 30,
  },
  islandExpanded: {
    width: width - 40,
    height: 60,
  },
  islandPill: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#000000',
  },
  islandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    width: '100%',
    height: '100%',
  },
  islandText: {
    fontSize: 18,
  },
  islandTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  screenContent: {
    flex: 1,
  },
  homeScreen: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  widgetContainer: {
    alignItems: 'center',
    marginTop: 60,
    gap: 20,
    width: '100%',
  },
  timeWidget: {
    alignItems: 'center',
  },
  widgetTime: {
    color: '#ffffff',
    fontSize: 74,
    fontWeight: '300',
    letterSpacing: -2,
  },
  widgetDate: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '500',
    marginTop: 4,
  },
  weatherWidget: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    padding: 16,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  weatherCity: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  weatherTemp: {
    color: '#ffffff',
    fontSize: 38,
    fontWeight: '300',
  },
  weatherConditionBox: {
    alignItems: 'flex-end',
  },
  weatherIcon: {
    fontSize: 24,
  },
  weatherText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '500',
  },
  weatherHiLo: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 11,
    marginTop: 2,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 24,
    justifyContent: 'flex-start',
    paddingHorizontal: 10,
    marginTop: 20,
  },
  appIconContainer: {
    alignItems: 'center',
    gap: 6,
    width: (width - 48 - 48) / 4, // 4 items per row layout
  },
  appIcon: {
    width: 60,
    height: 60,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  appIconText: {
    fontSize: 32,
  },
  appName: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  dockContainer: {
    width: '100%',
    paddingBottom: 20,
    alignItems: 'center',
  },
  dock: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  dockIcon: {
    width: 60,
    height: 60,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dockEmoji: {
    fontSize: 32,
  },
  appContainer: {
    flex: 1,
  },
  homeIndicator: {
    position: 'absolute',
    bottom: 8,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingVertical: 10,
    zIndex: 9999,
  },
  homeIndicatorBar: {
    width: 140,
    height: 5,
    backgroundColor: '#8e8e93',
    borderRadius: 10,
  },
});
