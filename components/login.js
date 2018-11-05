import React, {Component} from 'react';
import {StyleSheet, Image, Dimensions} from 'react-native';
import { Container, Content, Form, Item, Input, Label, Button, Text } from 'native-base';
import firebase from 'react-native-firebase';
const {width} = Dimensions.get('window');

class Login extends Component {
    constructor(props){
        super(props);
        this.state = {
            email: "",
            pass : "",
            textUsuario: "",
            textPass: "",
            textLogin:""
            // modalVisibleRecordar: false,
            // modalVisibleCrear: false
        };

        this.logear = this.logear.bind(this);
        this.desLogear = this.desLogear.bind(this);
        // this.mostrarRecordarContrasena = this.mostrarRecordarContrasena.bind(this);
        // this.mostrarCrearUsuario = this.mostrarCrearUsuario.bind(this);
    }

    componentWillMount(){
        firebase.auth().onAuthStateChanged((user) => {
            console.log(user);
            if(user){
                this.setState({textUsuario:"",textPass:"",textLogin:""});
                //this.props.navigation.navigate('Main');
                console.log('logeado');
            }else{
                console.log('No logeado');
            }
        });
    }

    // mostrarRecordarContrasena(visible){
    //     this.setState({modalVisibleRecordar: visible});
    // }
    // mostrarCrearUsuario(visible){
    //     this.setState({modalVisibleCrear: visible});
    // }

  async saveItem(item, selectedValue) {
    try {
      await AsyncStorage.setItem(item, selectedValue)
    } catch (error) {
      console.log('AsyncStorage error:' + error.message)
    }
  }

  logear(){
    console.log(this.state.email, this.state.pass);
    if(this.state.email){
        if(this.state.pass){
            this.setState({textUsuario:"",textPass:"",textLogin:"Cargando..."});
            firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.pass)
                .then(goodLogin => {

                    goodLogin.user.reload();
                    goodLogin.user.getIdToken()
                        .then(Token => {
                            console.log('Token ->>>',Token);
                            this.saveItem('token', Token);
                            this.props.navigation.navigate('App');

                        }).catch(function (error) {
                            console.log('error sacando token');
                            console.log('error: ', error);
                        });
                })
                .catch(error => {
                    this.setState({textUsuario:"",textPass:"",textLogin:"Email o contraseña invalido"});
                    console.log('error Logeando');
                    console.log(error);
                });
        }else{
            this.setState({textUsuario:"",textPass:"Requerido",textLogin:""});
        }
    }else{
        if(this.state.pass){
            this.setState({textUsuario:"Requerido",textPass:"",textLogin:""});
        }else{
            this.setState({textUsuario:"Requerido",textPass:"Requerido",textLogin:""});
        }
    }
  }

  desLogear(){
        firebase.auth().signOut()
            .then( ok => {
                console.log('DESLOG -->',ok);
            })
            .catch( error => {
                console.log('ERROR -->',error);
        });
  }

  render() {
    return (
    <Container>
        <Image source={require('./../src/img/fondo.jpg')} style={styles.fondo}/>
        <Content>
            <Image source={require('./../src/img/logo.png')} style={styles.logo}/>
            <Form>
                <Content style={styles.contenedorTexto}>
                <Image source={require('./../src/img/email.png')} style={styles.emailPass}/>
                <Item style={styles.item}>
                    <Input
                        autoCorrect={false}
                        placeholder="Usuario"
                        style={styles.text}
                        onChangeText={(text) => this.setState({email:text})}
                    />
                </Item>
                </Content>
                <Content style={{alignSelf: 'flex-end', height:28}}>
                    <Item style={styles.item}>
                        <Text style={styles.textUsuario}>{this.state.textUsuario}</Text>
                    </Item>
                </Content>

                <Content style={styles.contenedorTexto}>
                <Image source={require('./../src/img/pass.png')} style={styles.emailPass}/>
                <Item last style={styles.item}>
                    <Input
                        style={styles.text}
                        secureTextEntry={true}
                        onChangeText={(text) => this.setState({pass:text})}
                        placeholder="Contraseña"
                    >
                    </Input>
                </Item>
                </Content>
                <Content style={{alignSelf: 'flex-end',height:28}}>
                    <Item style={styles.item}>
                        <Text style={styles.textUsuario}>{this.state.textPass}</Text>
                    </Item>
                </Content>
            </Form>
            <Button rounded success style={styles.buttonLogin} onPress={() => {this.logear()} } >
                <Text>Logear</Text>
            </Button>
            <Content style={{alignSelf: 'center',height:20}}>
                    <Item style={styles.item}>
                        <Text style={styles.loginInfo}>{this.state.textLogin}</Text>
                    </Item>
            </Content>
            <Content style={{flex: 1}}>
                <Button style={styles.crear} transparent light onPress={() => {
                    this.setState({textUsuario:"",textPass:"",textLogin:""});
                    this.props.navigation.push('crearUsuario');

                    }}>
                    <Text>Crear Usuario</Text>
                </Button>

                <Button style={styles.recordar} transparent light onPress={() => {
                    this.setState({textUsuario:"",textPass:"",textLogin:""});
                    this.props.navigation.push('recuperarContrasena');
                    }}>
                    <Text>Recordar Contraseña</Text>
                </Button>
            </Content>
            <Button onPress={() => {this.desLogear()} }>
            <Text>Deslogear</Text>
            </Button>
        </Content>
    </Container>
    );
  }
}


{/* <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisibleCrear}
          onRequestClose={() => {

          }}>
          <Content style={{marginTop: 22}}>
              <Text>Crear USUARIO!</Text>
              <Button
                onPress={() => {
                  this.mostrarCrearUsuario(!this.state.modalVisibleCrear);
                }}>
                <Text>Hide Modal</Text>
              </Button>
          </Content>
        </Modal>

        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisibleRecordar}
          onRequestClose={() => {

          }}>
          <Content style={{marginTop: 22}}>
              <Text>Recordar Contraseña!</Text>
              <Button
                onPress={() => {
                  this.mostrarRecordarContrasena(!this.state.modalVisibleRecordar);
                }}>
                <Text>Hide Modal</Text>
              </Button>
          </Content>
        </Modal> */}





{/* <Button transparent light onPress={() => { this.mostrarCrearUsuario(true); }}>
                <Text>Crear Usuario</Text>
            </Button> */}

{/* <Button transparent light onPress={() => { this.mostrarRecordarContrasena(true); }}>
                <Text>Recordar Contraseña</Text>
            </Button> */}
{/* <View style={styles.container}>
        <TextInput
          style={{height: 40}}
          placeholder="Email"
          onChangeText={(text) => this.setState({email:text})}
        />
        <TextInput
          style={{height: 40}}
          placeholder="Password"
          onChangeText={(text) => this.setState({pass:text})}
        />
        <Button onPress={() => {this.logear()} } title="Logear" />
        <Button onPress={() => {this.desLogear()} } title="DES Logear" />
</View> */}

const styles = StyleSheet.create({
    contenedorTexto:{
        opacity: 0.8,
        backgroundColor: '#32CD32',
        borderRadius: 25,
        marginLeft: 10,
        marginRight: 10,
    },
    emailPass:{
        position:"absolute",
        marginLeft: 10,
        marginTop: 5,
        height: 40,
        width: 40
    },
    text: {
        marginLeft: 50,
        color:'black'
    },
    buttons: {
        flex: 1,
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 15,
    },
    buttonLogin:{
        flex: 1,
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 5
    },
    logo: {
        height: 200,
        width: 200,
        alignSelf: "center",
        marginTop: 50,
        marginBottom: 20
    },
    fondo:{
        height: 1000,
        flex:1,
        position:"absolute",
        transform: [
            { translateX: -250 },
            { translateY: -330 }
          ]
    },
    recordar:{
        width: width/2-1,
        position:"absolute",
        right: 0,
        paddingLeft:5
    },
    crear:{
        width: width/2-1
    },
    textUsuario:{
        paddingTop:1,
        paddingBottom:4,
        fontSize: 15,
        paddingRight: 20,
        color:'white',
    },
    item:{
        borderColor:'transparent'
    },
    loginInfo:{
        paddingTop:1,
        paddingBottom:8,
        fontSize: 15,
        paddingRight: 20,
        color:'white',

    }

});

export default Login;

// /Users/alvarogutierrez/Library/Android/sdk/emulator/emulator -avd bestEmu
// react-native log-android
