import React from 'react';
import { Text, View } from 'react-native';
import { createBottomTabNavigator } from 'react-navigation';

import MapScreen from './screens/MapScreen';
import FriendScreen from './screens/FriendScreen';
import SettingsScreen from './screens/SettingScreen';

export default createBottomTabNavigator({
    Mapa: MapScreen,
    Grupos: FriendScreen,
    Ajustes: SettingsScreen,
});
