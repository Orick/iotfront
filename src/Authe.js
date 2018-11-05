import React from 'react';
import { Text, View, ActivityIndicator, StatusBar, AsyncStorage, StyleSheet} from 'react-native';
import { StackNavigator, SwitchNavigator } from 'react-navigation';

import Home from './Home';
import Login from './Login';

class AuthLoadingScreen extends React.Component {
  constructor(props) {
    super();
    this._bootstrapAsync();
  }
    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    _bootstrapAsync = async () => {
        const userToken = await AsyncStorage.getItem('userToken');

        // This will switch to the App screen or Auth screen and this loading
        // screen will be unmounted and thrown away.
        this.props.navigation.navigate(userToken ? 'App' : 'Auth');
    };

    render() {
      return (
        <View style={styles.container}>
          <ActivityIndicator />
          <StatusBar barStyle="default" />
        </View>
      );
    }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});


const AppStack = StackNavigator({
  Home: {
    screen: Home,
    navigationOptions:{
      header: null,
    }
  },
});

const AuthStack = StackNavigator({
  Home: {
    screen: Login,
    navigationOptions:{
      header: null,
    }
  },
});

export default SwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    App: AppStack,
    Auth: AuthStack,
  },
  {
    initialRouteName: 'AuthLoading',
  }
);
