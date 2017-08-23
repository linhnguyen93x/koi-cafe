import React, { PropTypes } from 'react';
import Drawer from 'react-native-drawer';
import { DefaultRenderer, Actions, ActionConst  } from 'react-native-router-flux';
import {Text, Button, StyleSheet, View, TouchableOpacity, StatusBar, AsyncStorage } from "react-native";
import DrawerMenu from './DrawerMenu';
import { Colors } from '../style'

const propTypes = {
  navigationState: PropTypes.object,
};

class NavigationDrawer extends React.Component {

  constructor() {
    super();
    this.state = {
      user: {},
      avatar: null
    }
  }
  
    componentDidMount() {
        Actions.refresh({key: 'drawer', ref: this.refs.navigation});
    }


  componentWillMount() {
    AsyncStorage.getItem('user').then(item => {
      let userObj = JSON.parse(item);
      this.setState({
        user: userObj
      });
      
    })
  }

  _openDrawer = (state) => {
    AsyncStorage.getItem('user').then(item => {
      let userObj = JSON.parse(item);
      this.setState({
        user: userObj
      })
      
    })
    
    
    
    Actions.refresh({ key: state.key, open: true })
  }

  render() {
    const state = this.props.navigationState;
    const children = state.children;
    return (
      <Drawer
        ref="navigation"
        type="static"
        captureGestures={true}
        onOpen={() => this._openDrawer(state)}
        onClose={() => Actions.refresh({ key: state.key, open: false })}
        content={<DrawerMenu
          {...this.props}
          user={this.state.user} />}
        tapToClose={true}
        openDrawerOffset={0.2}
        panCloseMask={0.2}
        negotiatePan={true}
        tweenHandler={(ratio) => ({
          main: { opacity: Math.max(1, 1 - ratio), backgroundColor: 'rgba(0, 0, 0, 6);' },
        })} >
        <StatusBar
         backgroundColor={Colors.colorPrimaryDark}
         barStyle="light-content"
       />
        <DefaultRenderer navigationState={children[0]} onNavigate={this.props.onNavigate} />
      </Drawer>
    );
  }
}

const styles = StyleSheet.create({

  wrapper: {
    paddingTop: 50,
    flex: 1
  },

  modal: {
    justifyContent: 'flex-start',
    alignItems: 'center'
  },

  modal2: {
    height: 320,
    backgroundColor: "white"
  },

  modal3: {
    height: 300,
    width: 300
  },

  modal4: {
    height: 300
  },

  btn: {
    margin: 10,
    backgroundColor: "#3B5998",
    color: "white",
    padding: 10
  },

  btnModal: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 50,
    height: 50,
    backgroundColor: "transparent"
  },

  text: {
    color: "black",
    fontSize: 22
  },
  header: {
    backgroundColor: "#3B5998",
    textAlign: 'left',
    padding: 8,
    color: 'white'

  },
  modalView: {
    flex: 1,
     alignSelf: 'stretch',
  },
  button: {
      backgroundColor: '#008DD4',
      paddingVertical: 15,
      marginVertical: 24,
      marginHorizontal: 40,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 50,
    },
    buttonText: {
      color: 'white',
      fontSize: 12,
    }

});

NavigationDrawer.propTypes = propTypes;

export default NavigationDrawer;
