import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { Button } from 'native-base';

class SettingScreen extends Component {
  render() {
    return (
      <View style={{ flex: 1, paddingTop: 10}}>
        <Text style={{fontWeight: "bold", color: "black", padding: 25, fontSize: 42}}>Settings</Text>

        <Text style={{color: "black", padding: 25, fontSize: 21}}>E-mail:</Text>
          <Text style={{color: "green", textAlign:"center", fontSize: 21}}>A04</Text>

        <Button style={{left:"23%", top:80}}>
          <Text style={{color:"#FFFFFF"}}> Cambiar contraseña </Text>
        </Button>

      </View>
    );
  }
}

export default SettingScreen;
