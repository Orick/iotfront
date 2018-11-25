import React, { Component } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import Authe from './src/Authe';
import IbeaconMap from './components/IbeaconMap';
export default class App extends Component {

  componentDidMount() {

    if (Platform.OS === 'android' && Platform.Version >= 23) {
      PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION).then((result) => {
          if (result) {
            console.log("Permission is OK 1");
            PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).then((result) => {
              if (result) {
                console.log("Permission is OK 2");
              } else {
                PermissionsAndroid.requestPermission(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).then((result) => {
                  if (result) {
                    console.log("User accept 2");
                  } else {
                    console.log("User refuse 2");
                  }
                });
              }
          });
          } else {
            PermissionsAndroid.requestPermission(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION).then((result) => {
              if (result) {
                console.log("User accept 1");
                PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).then((result) => {
                  if (result) {
                    console.log("Permission is OK 2");
                  } else {
                    PermissionsAndroid.requestPermission(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).then((result) => {
                      if (result) {
                        console.log("User accept 2");
                      } else {
                        console.log("User refuse 2");
                      }
                    });
                  }
              });
              } else {
                console.log("User refuse 1");
                PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).then((result) => {
                  if (result) {
                    console.log("Permission is OK 2");
                  } else {
                    PermissionsAndroid.requestPermission(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).then((result) => {
                      if (result) {
                        console.log("User accept 2");
                      } else {
                        console.log("User refuse 2");
                      }
                    });
                  }
              });
              }
            });
          }
      });
    }
  }

  render() {
      return(
        <Authe />
      );
  }
}
