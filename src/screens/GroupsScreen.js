import React, { Component } from 'react';
import { StyleSheet, Image, Dimensions, Modal, TouchableOpacity, View } from 'react-native'
import { Container, Content, Body, Text, Card, CardItem, List, ListItem, Form, Item, Input, Right, Button } from 'native-base';
import firebase from 'react-native-firebase';
import IbeaconMap from '../../components/IbeaconMap';

const {width, height} = Dimensions.get('window');

class GroupsScreen extends Component {
  constructor(props){
    super(props);
    this.state = {
      groups : [],
      groupSelect : -1,
      showModal: false,
      modalVisible: false,
      newGroup: "",
    };
    this.modalibeacon = this.modalibeacon.bind(this);
    this.groupsList = this.groupsList.bind(this);
    this.cardlist = this.cardlist.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.newGroup = this.newGroup.bind(this);
  }
  componentWillMount(){
    this.groupsList()
  }

  modalibeacon(idgroup){
    //console.log("22222",idgroup);
    console.log("click en grupo");
    this.setState({
                    groupSelect:idgroup,
                    showModal:true
                  });

  }

  closeModal(){
    console.log("cerrando modal");
    this.setState({
      groupSelect:-1,
      showModal:false
    })

  }
  groupsList() {
    firebase.auth().onAuthStateChanged((user) => {
      if(user){
        user.getIdToken()
          .then(Token => {
              fetch('http://142.93.125.238:90/groups/getall',{
                      method: 'POST',
                      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                      body: "token="+Token
                  })
                  .then(response => response.json())
                  .then(result => {
                    this.setState({groups: result.groups});
                  })
                  .catch( error => {
                      console.log("fetch error : ", error);
                      return [];
                  });

          }).catch(function (error) {
              console.log('error sacando token');
              console.log('error: ', error);
              return [];
          });
      }else{
          console.log('No logeado');
          return [];
      }
    });
}

  cardlist(){
      return this.state.groups.map((data,index) => {
          return (
            <ListItem thumbnail key={index} style={{backgroundColor:'white', marginBottom:10}}>
              <Body>
                <Text>{data.Nombre}</Text>
                <Text note>{"Patio Ingeniería"}</Text>
              </Body>
              <Right>
                <View style={{flexDirection:'row'}}>
                  <TouchableOpacity onPress={ () => { console.log("aa", data.id); this.modalibeacon(data.id) }} style={{marginRight:5}}>
                      <Image source={require('./../img/mapicon.png')} style={{height:40,width:40}}/>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={ () => { console.log("bb", data.id); }}>
                      <Image source={require('./../img/config.png')} style={{height:40,width:40}}/>
                  </TouchableOpacity>
                </View>

              </Right>
            </ListItem>
        )
      });

      // <Card key={index} style={styles.cards}>
      //   <CardItem bordered button onPress={() => {this.modalibeacon(data.id)}}>
      //     <Body>
      //       <Text style={styles.text}> {data.Nombre} </Text>
      //     </Body>
      //   </CardItem>
      // </Card>

  }

  toggleModal(visible) {
      this.setState({ modalVisible: visible });
  }

  newGroup() {
    firebase.auth().onAuthStateChanged((user) => {
      if(user){
        user.getIdToken()
          .then(Token => {
              fetch('http://142.93.125.238:90/groups/create',{
                      method: 'POST',
                      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                      body: "token="+Token+"&nombre="+this.state.newGroup
                  })
                  .then(response => response.json())
                  .then(result => {
                    if (result.code === 1){
                      fetch('http://142.93.125.238:90/place/asing',{
                          method: 'POST',
                          headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                          body: "idgroup="+result.group.id+"&idplace=1"
                      })
                      .then(response2 => response2.json())
                      .then(result2 => {
                        if (result2.code === 1){
                          alert('Grupo Creado!')
                        }else{
                          alert("Error, intenta de nuevo")
                        }
                      })
                      .catch( error => {
                          console.log("fetch error : ", error);
                          return [];
                      });
                    }else{
                      alert("Error, intenta de nuevo")
                    }
                  })
                  .catch( error => {
                      console.log("fetch error : ", error);
                      return [];
                  });

          }).catch(function (error) {
              console.log('error sacando token');
              console.log('error: ', error);
              return [];
          });
      }else{
          console.log('No logeado');
          return [];
      }
    });
  }

  render() {
    return (
      <Container>
        <Modal animationType = {"slide"} transparent = {false}
               visible = {this.state.modalVisible}
               onRequestClose = {() => { console.log("Modal has been closed.") } }>

               <View style = {styles.modal}>
                  <Text style={{fontWeight: "bold", color: "black", fontSize: 35, paddingBottom:20}}>Nuevo Grupo</Text>
                  <Input
                      autoCorrect={false}
                      placeholder="Ingrese el nombre"
                      style={styles.text}
                      onChangeText={(text) => this.setState({newGroup:text})}
                  />

                  <View style={{flexDirection:'row'}}>
                    <Button onPress={() => this.newGroup()}>
                       <Text>Agregar</Text>
                    </Button>

                    <Button style={{marginLeft:15}} onPress={() => {
                       this.toggleModal(!this.state.modalVisible)}}>
                       <Text>Cerrar</Text>
                    </Button>
                  </View>
               </View>
          </Modal>

        <Image source={require('./../img/fondo.jpg')} style={styles.fondo}/>

        <Content>
            <Text style={styles.titulo}>{"Grupos"}</Text>
            <List style={{marginRight:17}}>
              {this.cardlist()}
            </List>
            <Modal visible={this.state.showModal} onRequestClose={()=> this.closeModal()}>
              <IbeaconMap groupid={this.state.groupSelect}/>
            </Modal>
        </Content>

        <TouchableOpacity onPress = {() => {this.toggleModal(true)}}>
            <Image style={styles.agregar} source={require('./../img/agregar.png')}/>
        </TouchableOpacity>
      </Container>
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
  text:{
    color:'black'
  },
  cards:{
    marginLeft: 15,
    marginRight: 15
  },
  titulo:{
    color: 'white',
    fontSize: 20,
    marginTop:30,
    marginLeft: 15,
    marginRight: 15,
    marginBottom:15,
  },
  modal: {
      flex: 1,
      alignItems: 'center',
      backgroundColor: '#F5FCFF',
      padding:100
   },
  agregar:{
    height:70,
    width:70,
    left:"80%"
  }

});

export default GroupsScreen;
