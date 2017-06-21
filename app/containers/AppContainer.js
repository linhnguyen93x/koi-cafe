import React, { Component } from 'react'
import Expo from 'expo'
import ReactNative from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { ActionCreators } from '../actions'
import { Router, Scene, Reducer, Actions } from 'react-native-router-flux'
import * as Constants from './Constant'
import { FontAwesome as Icon } from '@expo/vector-icons'
import { Colors } from '../style'
import { Color, globalStyle } from '../style'
import Api from '../libs/api'
import KoiApi from '../libs/koiApi'

const {
	ActivityIndicator,
    AsyncStorage,
    StyleSheet,
    TouchableOpacity,
    Image,
    View,
    Text,
    Platform
} = ReactNative

const RouterWithRedux = connect()(Router);

// Create home menu on navbar
var createRightButton = function() {
    return (
        <TouchableOpacity
            onPress={() => Actions.home({ type: 'reset' })}>
            <View style={{ marginRight: 8 }}>
                <Icon name="home" size={20} color="white" />
            </View>
        </TouchableOpacity>
    );
}

class AppContainer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            hasToken: false,
            isLoaded: false,
        };
    }

    componentWillMount() {
      	this.getSetting();
    }

    async getSetting() {
        var tokenId = await AsyncStorage.getItem('id_token');
        var user = await AsyncStorage.getItem('user');

        if (tokenId != null && user != null && user.length > 0) {
            user = JSON.parse(user);
            Api.setToken(tokenId);
						// KoiApi.setToken(tokenId);

            this.setState({
                ...this.state,
                hasToken: tokenId !== null,
                isLoaded: true,

            });

        } else {
            this.setState({
                ...this.state,
                isLoaded: true,
            });
        }

    }

    render() {
        if (!this.state.isLoaded) {
            return (
                <ActivityIndicator />
            )
        }

        return <RouterWithRedux
            {...this.props}
            animationStyle={animationStyle}
            duration={0.5}
            navigationBarStyle={styles.navBarLogin}
            titleStyle={styles.navBarTitle}
            barButtonTextStyle={styles.barButtonTextStyle}
            barButtonIconStyle={styles.barButtonIconStyle}
            leftButtonStyle={styles.leftButtonStyle}
            renderRightButton={createRightButton}
            onRight={() => { }}
            drawerImage={require('../../assets/icons/menu_burger_white.png')}  >
            <Scene key="drawer" component={Constants.NavigationDrawer} open={true}>
                <Scene key="root">
                    <Scene key="login"
                        component={Constants.Login}
                        initial={!this.state.hasToken}
                        title="Login"
                        onRight={null}
                        renderRightButton={() => { return <View></View> }}
                    />
                    <Scene key="home" component={Constants.Home} title="Home" initial={this.state.hasToken} />
                    <Scene key="employeeList" component={Constants.EmployeeList} title="Danh sách nhân viên" />
                    <Scene key="employeeMenu" component={Constants.EmployeeMenu} title="Danh sách nhân viên" />
										<Scene key="personalInfo" component={Constants.PersonalInfo} title="Trang cá nhân" />
										<Scene key="checkInOut" component={Constants.CheckInOut} title="Check In/Check out" />
										<Scene key="detailSalary" component={Constants.DetailSalary} title="Chi tiết bảng lương" />
                </Scene>
            </Scene>
        </RouterWithRedux>
    }
}

const styles = StyleSheet.create({
    navBar: {
        backgroundColor: Colors.colorPrimary,
    },
    navBarLogin: {
        backgroundColor: 'transparent',
        borderBottomColor: 'transparent'
    },
    navBarTitle: {
        color: '#FFFFFF',
    },
    barButtonTextStyle: {
        color: '#FFFFFF'
    },
    barButtonIconStyle: {
        tintColor: 'rgb(255,255,255)'
    }
});

const animationStyle = (props) => {
    const { layout, position, scene } = props;

    const direction = (scene.navigationState && scene.navigationState.direction) ?
        scene.navigationState.direction : 'horizontal';

    const index = scene.index;
    const inputRange = [index - 1, index, index + 1];
    const width = layout.initWidth;
    const height = layout.initHeight;

    const opacity = position.interpolate({
        inputRange,
        //default: outputRange: [1, 1, 0.3],
        outputRange: [1, 1, 0.5],
    });

    const scale = position.interpolate({
        inputRange,
        //default: outputRange: [1, 1, 0.95],
        outputRange: [1, 1, 1],
    });

    let translateX = 0;
    let translateY = 0;

    switch (direction) {
        case 'horizontal':
            translateX = position.interpolate({
                inputRange,
                //default: outputRange: [width, 0, -10],
                outputRange: [width, 0, 0],
            });
            break;
        case 'vertical':
            translateY = position.interpolate({
                inputRange,
                //default: outputRange: [height, 0, -10],
                outputRange: [height, 0, 0],
            });
            break;
    }

    return {
        opacity,
        transform: [
            { scale },
            { translateX },
            { translateY },
        ],
    };
};

function mapDispatchToProps(dispatch) {
    return bindActionCreators(ActionCreators, dispatch);
}

export default connect((state) => {
    return {

    }
}, mapDispatchToProps)(AppContainer);
