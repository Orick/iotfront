import React from 'react';
import { Text, View } from 'react-native';
import { createBottomTabNavigator } from 'react-navigation';

import GroupsScreen from './screens/GroupsScreen';
import SettingsScreen from './screens/SettingScreen';

export default createBottomTabNavigator({
    Grupos: GroupsScreen,
    Ajustes: SettingsScreen,
});
