import React, { Component } from 'react';
import { Container, Content, List, ListItem, Text } from 'native-base';
import { NavigationActions } from 'react-navigation';

class Sidebar extends Component {
    constructor(props){
        super(props);
        this.state = {
          email: '',
          pass: ''
        };
        this.signOut = this.signOut.bind(this);
    }
    componentWillMount(){
    }      
    signOut () {
        var resetAction = NavigationActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({ routeName: "Login"})
            ]
        });
        console.log(resetAction);
        this.props.navigation.dispatch(resetAction);
    }

    render(){
        return(
            <Container>
                <Content>
                    <List>
                        <ListItem>
                            <Text>Agregar macetero</Text>
                        </ListItem>
                        
                        <ListItem>
                            <Text>Configurar macetero</Text>
                        </ListItem>
                        
                        <ListItem>
                            <Text>Eliminar macetero</Text>
                        </ListItem>
                        
                        <ListItem
                        button
                        onPress={() => {this.props.navigation.navigate("Notification",{ idMacetero: 'maceteroaleeh'} )} }>
                            <Text>Ver Notificaciones</Text>
                        </ListItem>
                        
                        <ListItem>
                            <Text>Cambiar contrasena</Text>
                        </ListItem>
                        
                        <ListItem
                        button
                        onPress={() => {this.signOut()} }>
                            <Text>Cerrar sesion</Text>
                        </ListItem>
                    </List>
                </Content>
            </Container>
        );
    }
}

export default Sidebar;