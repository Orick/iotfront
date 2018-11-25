import React, { Component } from 'react';
import { DeviceEventEmitter, StyleSheet, Image, Dimensions, TouchableOpacity, Picker, View } from 'react-native'
import Beacons from 'react-native-beacons-manager'
import { BluetoothStatus } from 'react-native-bluetooth-status';


const {width, height} = Dimensions.get('window');

class IbeaconMap extends Component {
  constructor(props){
    super(props);
    this.state = {
      distance: 0,
      bluetoothState: false,
      pickerValue: ''
    };
    this.marcar = this.marcar.bind(this);
    this.recargar = this.recargar.bind(this);
  }

  componentWillMount(){
    Beacons.detectIBeacons();
    try {
      Beacons.startRangingBeaconsInRegion('test1');
      console.log(`Beacons ranging started succesfully!`)
    } catch (err) {
      console.log(`Beacons ranging not started, error: ${error}`)
    }
    DeviceEventEmitter.addListener('beaconsDidRange', (data) => {
      // console.log('Found beacons!', data.beacons)
      this.marcar(data.beacons);
    })
  }

  componentDidMount() {
    this.checkInitialBluetoothState();
  }

  async checkInitialBluetoothState() {
    const isEnabled = await BluetoothStatus.state();
    this.setState({ bluetoothState: (isEnabled) ? 'On' : 'Off'});
  }

  async toggleBluetooth() {
    try {
      const isEnabled = await BluetoothStatus.state();
      BluetoothStatus.enable(!isEnabled);
      this.setState({ bluetoothState: isEnabled });
    } catch (error) { console.error(error); }
  }

  marcar(beacon){
    if(beacon){
      if(beacon.length > 0){
        // console.log("BEACON ENCONTRADO");
        // console.log(beacon);

      }
    }
  }

  recargar(){

  }

  render() {
    // const blue = (this.state.bluetoothState) ? './../src/img/blueon.png': './../src/img/blueoff.png';
    return (
      <View>
        <Image source={require('./../src/img/fondo.jpg')} style={styles.fondo}/>
        <Image source={require('./../src/img/mapa.png')} style={styles.mapa}/>
        <View>
            <Picker style={styles.picker} onValueChange={(itemValue,index)=> {this.setState({pickerValue:itemValue})}}>
              <Picker.Item value={"patioIngenieria"} label={"Patio Ingeniería"}/>
            </Picker>
        </View>

        <View style={styles.bluetooth}>
            <TouchableOpacity onPress={ ()=> this.toggleBluetooth() }>
                <Image source={require('./../src/img/blueon.png')} style={{height:70,width:70}}/>
            </TouchableOpacity>
        </View>

        <View style={styles.recargar}>
          <TouchableOpacity onPress={ () => {
              this.recargar();
          }}>
              <Image source={require('./../src/img/recargar.png')} style={{height:70,width:70}}/>
          </TouchableOpacity>
        </View>

    </View>
    );
  }
}

const styles = StyleSheet.create({
  fondo:{
    flex:1,
    position:"absolute",
    transform: [
        { translateX: -740 },
        { translateY: -240 }
      ]
  },
  mapa:{
    flex: 1,
    marginLeft: width*0.05,
    marginTop:height*0.1,
    height: height*0.7,
    width: width*0.9,
    position: 'absolute',
    resizeMode: 'contain'
  },
  bluetooth: {
    height: 70,
    width:70,
    position:'absolute',
    top: height*0.8,
    left: 10
  },
  recargar:{
    height:70,
    width:70,
    position:'absolute', 
    right:10, 
    top: height*0.8
  },
  picker:{
    width:'80%', 
    color:'white',
    marginLeft: width*0.05,
    marginTop: height*0.01,
    borderRadius: 14,
    borderWidth: 1,
  }

});

export default IbeaconMap;

