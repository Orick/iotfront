import React, { Component } from 'react';
import { StyleSheet, Image, Dimensions, Modal, TouchableOpacity } from 'react-native'
import { Container, Content, Body, Text, Card, CardItem, List, ListItem, Right, Button, View } from 'native-base';
import firebase from 'react-native-firebase';
import IbeaconMap from '../../components/IbeaconMap';




const {width, height} = Dimensions.get('window');

class MapScreen extends Component {
  constructor(props){
    super(props);
    this.state = {
      groups : [],
      groupSelect : -1,
      showModal: false
    };
    this.modalibeacon = this.modalibeacon.bind(this);
    this.groupsList = this.groupsList.bind(this);  
    this.cardlist = this.cardlist.bind(this);  
    this.closeModal = this.closeModal.bind(this);  
    
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

  render() {
    return (
      <Container>
        <Image source={require('./../img/fondo.jpg')} style={styles.fondo}/>
        <Image source={require('./../img/agregar.png')} style={styles.agregar}/>
        <Content>
            <Text style={styles.titulo}>{"Grupos"}</Text>
            <List style={{marginRight:17}}>
              {this.cardlist()}
            </List>
            <Modal visible={this.state.showModal} onRequestClose={()=> this.closeModal()}>
              <IbeaconMap groupid={this.state.groupSelect}/>
            </Modal>
        </Content>
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
  modal:{
    width, 
    height
  },
  agregar:{
    height:70,
    width:70,
    position:'absolute', 
    right:10, 
    top: height*0.75
  }

});

export default MapScreen;