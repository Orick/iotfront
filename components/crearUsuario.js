import React, {Component} from 'react';
import {StyleSheet, Image, Dimensions} from 'react-native';
import { Container, Content, Form, Item, Input, Label, Button, Text } from 'native-base';
const {width} = Dimensions.get('window');


class crearUsuario extends Component {
    constructor(props){
        super(props);
        this.state = {
            email: '',
            pass: '',
            textCreate: '',
            textUsuario: "",
            textPass: ""
        };
        this.crearUsuario = this.crearUsuario.bind(this);
    }
    crearUsuario(){
        if(this.state.email){
            if(this.state.pass){
                this.setState({textUsuario:"",textPass:"",textCreate:"Cargando..."});
                fetch('http://142.93.125.238:90/user/create',{
                // fetch('http://localhost:3000/user/create',{
                            method: 'POST',
                            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                            body: "email="+this.state.email+"&password="+this.state.pass
                        })
                .then(response => response.json())
                .then(result => {
                    if(result.description =='Firebase error, creando usuario'){
                        this.setState({
                            textCreate: "Email no valido"
                        });
                    }else{
                        this.setState({
                            textCreate: result.description
                        });
                    }
                    
                }).catch(err =>{
                    console.log(err);
                })              
            }else{
                this.setState({textUsuario:"",textPass:"Requerido",textCreate:""});
            }
        }else{
            if(this.state.pass){
                this.setState({textUsuario:"Requerido",textPass:"",textCreate:""});
            }else{
                this.setState({textUsuario:"Requerido",textPass:"Requerido",textCreate:""});
            }
        }
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
                    placeholder="Contraseña" 
                    style={styles.text}
                    secureTextEntry={true} 
                    onChangeText={(text) => this.setState({pass:text})}
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

        <Button rounded success style={styles.buttonLogin} onPress={() => {this.crearUsuario()} } >
            <Text>Crear Usuario</Text>
        </Button>
        <Content style={{alignSelf: 'center',height:20}}>
            <Item style={styles.item}>
                <Text style={styles.loginInfo}>{this.state.textCreate}</Text>
            </Item>
        </Content>
        <Button onPress={() => {this.props.navigation.goBack()} }>
            <Text>Volver</Text>
        </Button>
        
    </Content>
</Container>

        );
  }
}


{/* <Container style= {{backgroundColor:'#00b359'}}>
<Content>
    <Form>
        <Input 
            placeholder="Email" 
            style={styles.text}
            onChangeText={(text) => this.setState({email:text})}
        />
        <Input 
            placeholder="Contraseña"
            style={styles.text}
            onChangeText={(text) => this.setState({pass:text})}
        />
    </Form>
    <Button rounded success style={styles.buttons} onPress={() => {this.crearUsuario()} } >
        <Text>Crear Usuario</Text>
    </Button>
    <Text hide={this.state.visibleCreate}>{this.state.textCreate}</Text>
    <Button onPress={() => {this.props.navigation.goBack()} }>
        <Text>Volver</Text>
    </Button>
</Content>
</Container>
 */}


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

export default crearUsuario;