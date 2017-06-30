import React from 'react';
import { PropTypes } from "react";
import { StyleSheet, Text, View, AsyncStorage, ScrollView, Image } from "react-native";
import Button from 'react-native-button';
import { connect } from 'react-redux'
import { Actions } from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/FontAwesome';


const contextTypes = {
  drawer: React.PropTypes.object,
};

const propTypes = {
  name: PropTypes.string,
  sceneStyle: View.propTypes.style,
  title: PropTypes.string,
};

const DrawerMenu = (props, context) => {
  const drawer = context.drawer;

  async function clearData() {
    try {
      // clear app key for user
      let keys = ["id_token", "user"];

      // AsyncStorage.multiRemove(keys, (err) => {
      //   if (!err) {

      //   }
      // });
      await AsyncStorage.clear();
      Actions.login({ type: "reset" });

    } catch (error) {
      console.log('AsyncStorage error: ' + error.message);
    }
  }
  function openChooseOutlet() {

    // drawer.close();
    // Actions.detailOutletInfo({type: "reset"});
  }

  function logout() {
    props.logout().then(() => {
      clearData();
    });

  }

  function getImagePath(imgPath) {
    if (!imgPath.startsWith("/user")) {
      return imgPath;
    } else {
      return Api.getBaseUrl() + "/repository" + imgPath;
    }
  }

  function isEmpty(str) {
    return (str == null || !str || 0 === str.length);
  }

  return (
    <Image source={require('../../assets/backgrounds/blue_burst.png')}
      resizeMode="cover" style={[styles.container, props.sceneStyle, { width: null }]}>

      {/*<View style={styles.imageContainer}>
        <Image source={require('../img/shopper_menu_icon.png')}
          style={styles.logoApp}
          resizeMode="contain" />
      </View>*/}


      <ScrollView
        style={styles.menuContainer}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}>
        <View style={styles.wrapNav}>
          <Image source={{ uri: "http://www.limestone.edu/sites/default/files/user.png" }}
            style={styles.image}
            resizeMode="cover" />
          <Text style={[styles.navText, { alignSelf: 'center', padding: 4, color: '#99FFCC', fontWeight: 'bold' }]}>
            {props.user != null ? props.user.HoTen : ""}
          </Text>
        </View>

        <View style={styles.wrapNav}>

          <Text style={styles.ttNav}>Chức năng chính</Text>
          <View style={styles.lineNav}>
            <Button style={styles.btn} onPress={() => { drawer.close(); }}>
              <Icon style={styles.navIcon} name="user" size={18} color="white" />
              <Text style={styles.navText}>Trang cá nhân</Text>
            </Button>
          </View>


        </View>

        <View style={styles.wrapNav}>
          <Text style={styles.ttNav}>Trợ giúp</Text>
          <View style={styles.lineNav}>
            <Button style={styles.btn} onPress={() => { drawer.close(); }}>
              <Icon style={[styles.navIcon, styles.opHide]} name="star" size={24} color="#bdbdbd" />
              <Text style={styles.navText}>Đánh giá ứng dụng</Text>
            </Button>
          </View>
          <View style={styles.lineNav}>
            <Button style={styles.btn} onPress={() => { drawer.close(); logout(); }}>
              <Icon style={[styles.navIcon, styles.opHide]} name="sign-out" size={24} color="#bdbdbd" />
              <Text style={styles.navText}>Đăng xuất</Text>
            </Button>
          </View>
        </View>


      </ScrollView>


    </Image>
  );

};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'flex-start',
    // alignItems: 'flex-start',
    backgroundColor: 'rgba(14,94,95,0.6) 60%',
    paddingHorizontal: 16,
  },
  menuContainer: {

  },
  headerMenu: {
    alignSelf: 'stretch',
    padding: 12,
    textAlign: 'center',
    color: 'white',
    fontSize: 16,
  },
  btn: {
    color: '#00a4d3',

  },
  ttNav: {
    color: 'white',
    fontSize: 20,
    fontWeight: '500'
  },
  wrapNav: {
    marginTop: 20,
    paddingVertical: 8,
  },
  navText: {
    flex: 1,
    color: 'white',
    fontSize: 14,
  },
  lineNav: {
    paddingVertical: 6,
  },
  navIcon: {
    width: 45
  },
  opHide: {
    opacity: 0,
  },
  navUpdate: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 20
  },
  navCard: {
    position: 'relative',
  },
  imgCard: {
    minHeight: 180,
    flex: 1,
    position: 'relative',
    zIndex: 0
  },
  TextCrad: {
    position: 'absolute',
    zIndex: 1,
    top: 0,
    left: 0,
    flex: 1,
    padding: 20,
  },
  nameCard: {
    fontSize: 14,
    marginBottom: 5,
    backgroundColor: 'transparent',
    color: '#fff'

  },
  nameStaff: {
    fontSize: 14,
    marginBottom: 5,
    color: '#fff',
    fontWeight: 'bold',
  },
  titleStaff: {
    fontSize: 14,
    marginBottom: 5,
    color: '#fff'
  },
  wrapStaff: {
    flexDirection: 'row'
  },
  avatarCard: {
    width: 100,
    height: 100,
    marginRight: 10
  },
  infoStaff: {

  },
  ttDate: {
    fontSize: 14,
    marginBottom: 5,
    color: '#fff'
  },
  birthStaff: {
    fontSize: 14,
    marginBottom: 5,
    color: '#fff',
    fontWeight: 'bold',
  },
  bold: {
    fontWeight: 'bold'
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8
  },
  logoApp: {
    width: 120,
    height: 40,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: 'white',
    alignSelf: 'center'
  },
});

DrawerMenu.contextTypes = contextTypes;
DrawerMenu.propTypes = propTypes;

export default connect()(DrawerMenu)
