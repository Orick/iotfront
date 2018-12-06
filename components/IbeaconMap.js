import React, { Component } from 'react';
import { DeviceEventEmitter, StyleSheet, Image, Dimensions, TouchableOpacity, Picker, View, ImageBackground, Text } from 'react-native'
import Beacons from 'react-native-beacons-manager'
import { BluetoothStatus } from 'react-native-bluetooth-status';
import firebase from 'react-native-firebase';


const {width, height} = Dimensions.get('window');
let ibeacon = {
    '4b23a5e9-3351-437d-a339-739d4fb7b43d' :{
      distance: 999999,
      set: false
    }, 
    '04130c98-0b71-46e0-b430-d3696875f13e' :{
      distance: 999999,
      set: false
    }, 
    '83b3730e-a173-446e-a4b0-f77aa6b85556' :{
      distance: 999999,
      set: false
    } 
};

let friends = {};
// I1 x:41, y 90
// I2 x:195, y 90
// I3 x:100, y 252
let countDatos = 0;
var minDistanteIbeacon = 9999999;
var uuid = "";

class IbeaconMap extends Component {
  constructor(props){
    super(props);

    //this.props.groupid

    this.state = {
      distance: 0,
      bluetoothState: false,
      pickerValue: '',
      myposs: {
        poss:0,
        idibeacon:''
      },
      groupposs: [],
      colors:[]
    };
    this.myposs = this.myposs.bind(this);
    this.recargar = this.recargar.bind(this);
    this.groupposs = this.groupposs.bind(this);
    this.getRandomColor = this.getRandomColor.bind(this);
  }
  
  componentWillMount(){
      this.myposs();
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
  
  myposs(){
    Beacons.detectIBeacons();
    try {
      Beacons.startRangingBeaconsInRegion('test1');
      console.log(`Beacons ranging started succesfully!`)
    } catch (err) {
      console.log(`Beacons ranging not started, error: ${error}`)
    }


    DeviceEventEmitter.addListener('beaconsDidRange', (data) => {
      
// iBeacon 1 - 4b23a5e9-3351-437d-a339-739d4fb7b43d
// iBeacon 2 - 04130c98-0b71-46e0-b430-d3696875f13e
// iBeacon 3 - 83b3730e-a173-446e-a4b0-f77aa6b85556
      if(data.beacons){
        if(data.beacons.length > 0){
          if(!(countDatos < 5)){

              data.beacons.map((ibeaconData) => {
                
                if(ibeacon[ibeaconData.uuid]){
                    if(ibeaconData.distance < minDistanteIbeacon){
                      minDistanteIbeacon = ibeaconData.distance;
                      uuid = ibeaconData.uuid;
                    }
                    // ibeacon[ibeaconData.uuid].distance = ibeaconData.distance;
                    // ibeacon[ibeaconData.uuid].set = true
                  }
              });
              if(minDistanteIbeacon != 9999999){
                firebase.auth().onAuthStateChanged((user) => {
                  if(user){        
                    user.getIdToken()
                      .then(Token => {
                          fetch('http://142.93.125.238:90/position/poss',{
                                  method: 'POST',
                                  headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                                  body: "token="+Token+"&poss="+minDistanteIbeacon+"&idibeacon="+uuid
                              })
                              .then(response => response.json())
                              .then(result => {
                                console.log("FETCH MY POSITION", {minDistanteIbeacon,uuid});
                                minDistanteIbeacon = 9999999;
                                uuid = "";
                                countDatos = 0;
                                this.groupposs();
                              })
                              .catch( error => {
                                  console.log("fetch error : ", error);
                              });
                      }).catch(function (error) {
                          console.log('error sacando token');
                          console.log('error: ', error);
                      });
                  }else{
                      console.log('No logeado');
                  }
                });
              }else{
                minDistanteIbeacon = 9999999;
                uuid = "";
                countDatos = 0;
              }
          }else{
            countDatos++ ;
          }

            // let pix_original_x = 323;
            // let pix_original_y = 349;
            // let patio_m_real_x = 1.55;
            // let patio_m_real_y = 1.55;
            // iBeacon 1 - 4b23a5e9-3351-437d-a339-739d4fb7b43d
            // iBeacon 2 - 04130c98-0b71-46e0-b430-d3696875f13e
            // iBeacon 3 - 83b3730e-a173-446e-a4b0-f77aa6b85556
            // I1 x:41, y 90
            // I2 x:195, y 90
            // I3 x:100, y 252
            //eje x(0,0) = (41,90) , x(154,0) = (195,90) 
            //I3 = x(59, 162)= (100, 252) 
            //let i = 59, j = 162, d = 154
            // r1 = d1, r2 = d2, r3 = d3
            //Metros a pixeles
            // solo patio   x:21.98m  y: 24.66m
            // new mapa feria x:323, y: 349
            // I1 x:41, y 90
            // I2 x:195, y 90
            // I3 x:100, y 252
            //datos en metros del patio
            // let patio_m_real_x = 21.98;
            // let patio_m_real_y = 24.66;
            // let patio_m_real_x = 1.55;
            // let patio_m_real_y = 1.55;
            // 21.98->323
            // 1->x
            // 323/21.98 = cuantos pixeles son 1 metro
            //datos en pixeles del mapa original
            // let pix_original_x = 323;
            // let pix_original_y = 349;
            //datos mapa en pixeles de celular
            // let pix_cel_x = width*0.9;
            // let pix_cel_y = (width*0.9 * pix_original_y)/pix_original_x;
            //eje x(0,0) = (41,90) , x(154,0) = (195,90) 
            //I3 = x(59, 162)= (100, 252) 
            // let i = 59*(patio_m_real_x/pix_original_x) , j = 162*(patio_m_real_y/pix_original_y) , d = 154*(patio_m_real_x/pix_original_x)
            // let d1 = ibeacon['4b23a5e9-3351-437d-a339-739d4fb7b43d'].distance;
            // let d2 = ibeacon['04130c98-0b71-46e0-b430-d3696875f13e'].distance;
            // let d3 = ibeacon['83b3730e-a173-446e-a4b0-f77aa6b85556'].distance;
            // console.log({i,j,d})
            // console.log({d1,d2,d3})
            // //mi poss 
            // let x = (Math.pow(d1,2)-Math.pow(d2,2)+Math.pow(d,2))/(2*d);
            // let y = (Math.pow(d1,2)-Math.pow(d3,2) - Math.pow(x,2)+Math.pow(x-i,2)+Math.pow(j,2))/(2*j);
            // console.log({x,y});
            // console.log("x:",x+41);
            // console.log("y:",y+90);
          // ibeacon['4b23a5e9-3351-437d-a339-739d4fb7b43d'].distance = 999999;
          // ibeacon['4b23a5e9-3351-437d-a339-739d4fb7b43d'].set = false;
          // ibeacon['04130c98-0b71-46e0-b430-d3696875f13e'].distance = 999999;
          // ibeacon['04130c98-0b71-46e0-b430-d3696875f13e'].set = false;
          // ibeacon['83b3730e-a173-446e-a4b0-f77aa6b85556'].distance = 999999;
          // ibeacon['83b3730e-a173-446e-a4b0-f77aa6b85556'].set = false;
        }
      }
    });

    //       if(ibeacon[ibeaconData.uid].count < 5 ){
    //         ibeacon[ibeaconData.uid].count++;
    //         ibeacon[ibeaconData.uid].distance = data.distance;
    //         console.log(ibeacon[ibeaconData.uid]);                
    //       }else{ 
    //         // ibeacon[ibeaconData.uid].count = 0;
    //         // ibeacon[ibeaconData.uid].distance = 0;
    //         firebase.auth().onAuthStateChanged((user) => {
    //           if(user){        
    //             user.getIdToken()
    //               .then(Token => {
    //                 console.log("Envio a server");
    //                   // fetch('http://142.93.125.238:90/position/poss',{
    //                   //         method: 'POST',
    //                   //         headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    //                   //         body: "token="+Token+"&poss="+data.distance+"&idibeacon="+ibeaconData.uid
    //                   //     })
    //                   //     .then(response => response.json())
    //                   //     .then(result => {

    //                   //       ibeacon[ibeaconData.uid].count = 0;
    //                   //       ibeacon[ibeaconData.uid].distance = 0;

    //                   //       if(result.code == 1){  
    //                   //         this.setState(
    //                   //           { myposs: {
    //                   //                 poss:data.distance,
    //                   //                 idibeacon:ibeaconData.uid
    //                   //           }
    //                   //         });

    //                   //       }else{
    //                   //         this.setState(
    //                   //           { myposs: {
    //                   //                 poss:0,
    //                   //                 idibeacon:''
    //                   //           }
    //                   //         });
    //                   //       }
                            
    //                   //     })
    //                   //     .catch( error => {
    //                   //         console.log("fetch error : ", error);
    //                   //     });
    //               }).catch(function (error) {
    //                   console.log('error sacando token');
    //                   console.log('error: ', error); 
    //               });
    //           }else{
    //               console.log('No logeado');
    //           }
    //         });

    //       }
    //     }else{
    //       ibeacon[ibeaconData.uid] = {
    //         count: 1,
    //         distance :data.distance
    //       }
    //     }
        
        
    //     }
    //   }  
    // }) 
  }

  getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

   groupposs(){
    // setInterval( () => { 
      firebase.auth().onAuthStateChanged((user) => {
        if(user){        
          user.getIdToken()
            .then(Token => {
                fetch('http://142.93.125.238:90/position/getgroup',{
                        method: 'POST',
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                        body: "token="+Token+"&idgroup="+this.props.groupid
                    })
                    .then(response => response.json())
                    .then(result => {
                      if(result.code == 1){  
                        console.log("FETCH PARA GROUP");

                        let colorGroup = result.position.map(emails => {
                          if(friends[emails.email]){
                            return { emails:emails.email, color:friends[emails.email].color}
                          }else{
                            friends[emails.email] = {
                              emails:emails.email,
                              color: this.getRandomColor()
                            }
                            return { emails:emails.email, color:friends[emails.email].color}
                          }
                        })
                        
                        this.setState({ groupposs: result.position, colors:colorGroup });
                      }else{
                        this.setState({ groupposs: [] });
                      }
                    })
                    .catch( error => {
                        console.log("fetch error : ", error);
                    });
            }).catch(function (error) {
                console.log('error sacando token');
                console.log('error: ', error); 
            });
        }else{
            console.log('No logeado');
        }
      });
  }

  recargar(){
    this.myposs();
  }
  

  createMarkers(groups){
    let x_real = 323;
    let y_real = 349;
    let poss_beacon_x = 0;
    let poss_beacon_y = 0;
    // I1 x:41, y 90
    // I2 x:195, y 90
    // I3 x:100, y 252
    // '4b23a5e9-3351-437d-a339-739d4fb7b43d' 
    // '04130c98-0b71-46e0-b430-d3696875f13e'
    // '83b3730e-a173-446e-a4b0-f77aa6b85556'
    if(groups){
      return groups.map((dataGroups, index) => {
        if(dataGroups.position){
          if(dataGroups.position.distancia){

            let d = ((dataGroups.position.distancia*2)*(width*0.9))/13.1064;

            if(dataGroups.position.ibeaconId == '4b23a5e9-3351-437d-a339-739d4fb7b43d'){ poss_beacon_x = 50; poss_beacon_y = 90;   }
            if(dataGroups.position.ibeaconId == '04130c98-0b71-46e0-b430-d3696875f13e'){ poss_beacon_x = 195; poss_beacon_y = 90;  }
            if(dataGroups.position.ibeaconId == '83b3730e-a173-446e-a4b0-f77aa6b85556'){ poss_beacon_x = 100; poss_beacon_y = 252; }
            if(poss_beacon_x == 0 && poss_beacon_y == 0) return (<View key={index}/>);
            
            console.log('GRUPOS-> ',{d:dataGroups.position.distancia,uuid:dataGroups.position.ibeaconId});
            
            
            let colorCircle = ""

            this.state.colors.map(data => {
              if(data.emails == dataGroups.email ){
                colorCircle = friends[dataGroups.email].color
              }
            });
            

            let styles_c = StyleSheet.create({
              circle: {
                width: d,
                height: d,
                borderRadius: d/2,
                borderWidth:2.5,
                borderColor: colorCircle,
                position: 'absolute',
                transform: [
                  { translateX: -d/2 + ( width*0.9* poss_beacon_x )/x_real},
                  { translateY: -d/2  +(((width*0.9 * 349)/323)* poss_beacon_y )/y_real }
                ]
              }
            });
            return (<View style={styles_c.circle} key={index} />);
          }else{
            return (<View key={index}/>);
          }
        }else{
          return (<View key={index}/>);
        }
      });
    }
      //largo circulo =(width*d_ibeacon)/metros
      // x b1 = width
      // posicion I1, x:145, y:190
      // Total imagen original = x:294  , y: 274
      // X:32.86 m, y:36.52
      // height: height*0.7,
      // width: width*0.9,

      // posicion I1, x:145, y:190
      // Total imagen original = x:294  , y: 274
      // 294 -> 145
      // width*0.9 -> x

      //solo patio   x:21.98m  y: 24.66m
      // new mapa feria x:323, y: 349
      // I1 x:41, y 90
      // I2 x:195, y 90
      // I3 x:100, y 252
    //   x_real = 323;
    //   y_real = 349;
    //   poss_beacon_x = 41
    //   poss_beacon_y = 252
    //   d = 100;

      
    //   styles_c = StyleSheet.create({
    //       circle: {
    //         width: d,
    //         height: d,
    //         borderRadius: d/2,
    //         borderWidth:2,
    //         borderColor: 'green',
    //         position: 'absolute',
    //         transform: [
    //           { translateX: -d/2 + ( width*0.9* poss_beacon_x )/x_real +40},
    //           { translateY: -d/2  +(((width*0.9 * 349)/323)* poss_beacon_y )/y_real }
    //         ]
    //       }
    //   });
    //   styles_c2 = StyleSheet.create({
    //     circle: {
    //       width: 80,
    //       height: 80,
    //       borderRadius: d/2,
    //       borderWidth:2,
    //       borderColor: 'blue',
    //       position: 'absolute',
    //       transform: [
    //         { translateX: -d/2 + ( width*0.9* poss_beacon_x )/x_real +40},
    //         { translateY: -d/2  +(((width*0.9 * 349)/323)* poss_beacon_y )/y_real-150 }
    //       ]
    //     }
    // });
    //   return (
    //     <View>
    //     <View style={styles_c.circle} />
    //     <View style={styles_c2.circle} />
    //     </View>
        
    //   );
  }

  createTips(colorsGroup){
    let c = 15;
    return colorsGroup.map((color,index) => {
      let styles_cuadrado = StyleSheet.create({
        cuadrado: {
          width: 15,
          height: 15,
          borderWidth:0.1,
          backgroundColor: color.color,
          marginLeft:5
        },
        texto: {
          color:'black',
          fontSize: 14,
          transform: [
            { translateX: 2 },
            { translateY: - 2 }
          ]
        },
        container: {
          flexDirection:'row',
          paddingTop:4,
          backgroundColor:'white',
          transform: [
            { translateY:  c }
          ]
        }
      });
      c += 3;
      return (
          <View key={index} style={styles_cuadrado.container}>
            <View style={styles_cuadrado.cuadrado}/>
            <Text style={styles_cuadrado.texto}>{color.emails}</Text>
          </View>
      );
    });
  }

  render() {
    const {groupposs,colors} = this.state;
    const blueicon = this.state.bluetoothState ? require('./../src/img/blueoff.png') : require('./../src/img/blueon.png');
  
    return (
      <View>
        <Image source={require('./../src/img/fondo.jpg')} style={styles.fondo}/>
        <ImageBackground source={require('./../src/img/mapa.png')} style={styles.mapa}>
          <View>
          {this.createMarkers(groupposs)}
          </View>
          <View style={styles.tipsfondo} >
          {this.createTips(colors)}
          </View>
        </ImageBackground>
        
        
        

        <View>
            <Picker style={styles.picker} onValueChange={(itemValue,index)=> {this.setState({pickerValue:itemValue})}}>
              <Picker.Item value={"patioIngenieria"} label={"Patio Ingeniería"}/>
            </Picker>
        </View>
      
        <View style={styles.bluetooth}>
            <TouchableOpacity onPress={ ()=> this.toggleBluetooth() }>

                <Image source={blueicon} style={{height:70,width:70}}/>
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
  tipsfondo:{
    width: width*0.6,
    position: 'absolute',
    transform: [
      { translateY: width*0.9 }
    ]
  },
  fondo:{
    flex:1,
    position:"absolute",
    transform: [
        { translateX: -740 },
        { translateY: -240 }
      ]
  },
  mapa:{
    marginLeft: width*0.05,
    marginTop:height*0.1,
    width: width*0.9,
    height: width*0.9,
    position: 'absolute',
    resizeMode: 'contain'
  },
  bluetooth: {
    height: 55,
    width: 55,
    position:'absolute',
    top: height*0.8,
    left: 10
  },
  recargar:{
    height:55,
    width:55,
    position:'absolute', 
    right:20, 
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

