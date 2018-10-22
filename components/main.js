import React, { Component } from 'react';
import { Container, Header, Left, Body, Right, Text, Button, Icon, Title,  Drawer, Tab, Tabs, ScrollableTab } from 'native-base';
import SideBar from './sidebar.js';

class Main extends Component {
  constructor(props){
    super(props);
    this.state = {
      maceteros: [''],
      plantas:['']
    };
    this.closeDrawer = this.closeDrawer.bind(this);
    this.openDrawer = this.openDrawer.bind(this);
    this.maceterosList = this.maceterosList.bind(this);
  }
  componentWillMount(){
    id_m = ['maceteroaleeh','maceteroaleeh2','maceteroaleeh3','maceteroaleeh3','maceteroaleeh3','maceteroaleeh3'];
    nombres_p = ['Planta 1','Planta 2','Planta 3','Planta 4','Planta 5','Planta 6'];
    
    this.setState({
      maceteros: id_m,
      plantas: nombres_p
    });
  }

  closeDrawer(){
    this._drawer._root.close()
  }
  openDrawer(){
    this._drawer._root.open()
  }

maceterosList() {
    return this.state.maceteros.map((data,index) => {      
      return (
        <Tab key={index} heading={this.state.plantas[index]} tabStyle={{backgroundColor: '#32CD32'}}  activeTabStyle={{backgroundColor: '#32CD32'}} textStyle={{color: 'white'}}>
          
        </Tab>
      )
    })

}
  
  render() {    
    return (        
      <Container>
        <Drawer
          ref={(ref) => { this._drawer = ref; }}
          content={<SideBar navigator={this._navigator} />}
          onClose={() => this.closeDrawer()} >
          
          <Header hasTabs style={{backgroundColor: '#32CD32'}}>
            <Left>
              <Button transparent onPress={()=>this.openDrawer()}>
                <Icon name='menu' />
              </Button>
            </Left>
            <Body>
              <Title>SMartCetero</Title>
            </Body>
          </Header>
          
          <Tabs renderTabBar={()=> <ScrollableTab />}>
            {this.maceterosList()}
          </Tabs>
        </Drawer>
      </Container>
    );
  }
}

export default Main;