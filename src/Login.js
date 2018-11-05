import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Image} from 'react-native';
import { Container, Content, Icon, Header, Body } from 'native-base';

import Login from '../components/login';
import recuperarContrasena from '../components/recuperarContrasena';
import crearUsuario from '../components/crearUsuario';

import { createStackNavigator, createDrawerNavigator, DrawerItems } from 'react-navigation';

// const instructions = Platform.select({
//   ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
//   android:
//     'Double tap R on your keyboard to reload,\n' +
//     'Shake or press menu button for dev menu TEST'+
//     '22222',
// });

/* const CustomDrawerContentComponent = (props) => (
  <Container>
    <Header style={styles.drawerHeader}>
      <Body style={{alignItems: 'center'}}>
        <Image
          style={styles.drawerImage}
          source={require('./src/img/logo.png')} />
      </Body>
    </Header>
    <Content>
      <DrawerItems {...props} />
    </Content>
  </Container>
);
const DrawerNav = createDrawerNavigator(
  {
    Main,
    Notification,
    agregarplanta,
    agregarPlantaForm,
    Login
  },
  {
    initialRouteName: 'Main',
    contentComponent: CustomDrawerContentComponent,
    headerMode: 'none'
  }
); */

export default createStackNavigator(
  {
    Login,
    recuperarContrasena,
    crearUsuario,
  },
  {
    initialRouteName: 'Login',
    headerMode: 'none'
  }
);
