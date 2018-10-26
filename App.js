import React from 'react';
import { Text, View } from 'react-native';
import { createBottomTabNavigator } from 'react-navigation';

import MapScreen from './src/screens/MapScreen';
import FriendScreen from './src/screens/FriendScreen';
import SettingScreen from './src/screens/SettingScreen';

export default createBottomTabNavigator({
    Mapa: MapScreen,
    Amigos: FriendScreen,
    Ajustes: SettingsScreen,
});
