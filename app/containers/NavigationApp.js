// import React, { Component } from 'react';
// import { StyleSheet, View, Text, Image } from 'react-native';
// import {
//   StackNavigation,
//   DrawerNavigation,
//   DrawerNavigationItem,
// } from '@expo/ex-navigation';
// import { Ionicons } from '@expo/vector-icons';
// import Router  from '../router';
//
// export default class NavigationApp extends Component {
//   _renderHeader = () => {
//     return (
//       <View style={{ height: 100, width: 300 }}>
//         <Text style={styles.header}>Konichiwa</Text>
//       </View>
//     );
//   };
//
//   _renderTitle = (text: string, isSelected: boolean) => {
//     return (
//       <Text
//         style={[
//           styles.buttonTitleText,
//           isSelected ? styles.selectedText : null,
//         ]}>
//         {text}
//       </Text>
//     );
//   };
//
//   _renderIcon = (name: string, isSelected: boolean) => {
//     let extraStyle = { marginTop: 2 };
//     if (name === 'md-alert') {
//       extraStyle = { ...extraStyle, marginLeft: -3 };
//     }
//     return (
//       <Ionicons
//         style={[
//           styles.icon,
//           isSelected ? styles.selectedText : null,
//           extraStyle,
//         ]}
//         name={name}
//         size={24}
//       />
//     );
//   };
//
//   static route = {
//     navigationBar: {
//       visible: false,
//     }
//   };
//
//   render() {
//
//
//     return (
//       <DrawerNavigation
//         drawerPosition="left"
//         renderHeader={this._renderHeader}
//         drawerWidth={300}
//         initialItem="home">
//         <DrawerNavigationItem
//           id="home"
//           selectedStyle={styles.selectedItemStyle}
//           renderTitle={isSelected => this._renderTitle('Examples', isSelected)}
//           renderIcon={isSelected => this._renderIcon('md-apps', isSelected)}>
//           <StackNavigation
//             id="root"
//             defaultRouteConfig={{
//               navigationBar: {
//                 backgroundColor: 'red',
//                 tintColor: '#fff',
//               }
//             }}
//             initialRoute={Router.getRoute('home')}
//           />
//         </DrawerNavigationItem>
//         <DrawerNavigationItem
//           id="another"
//           selectedStyle={styles.selectedItemStyle}
//           renderTitle={isSelected => this._renderTitle('About', isSelected)}
//           renderIcon={isSelected => this._renderIcon('md-alert', isSelected)}>
//           <StackNavigation
//             id="about"
//             initialRoute={Router.getRoute('home')} />
//         </DrawerNavigationItem>
//       </DrawerNavigation>
//     );
//   }
// }
//
// const styles = StyleSheet.create({
//   header: {
//
//   },
//   buttonTitleText: {
//     color: '#222',
//     fontWeight: 'bold',
//     marginLeft: 18,
//   },
//   icon: {
//     color: '#999',
//   },
//   selectedText: {
//     color: '#0084FF',
//   },
//   selectedItemStyle: {
//     backgroundColor: '#E8E8E8',
//   },
// });
