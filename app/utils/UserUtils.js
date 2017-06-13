import { AsyncStorage } from 'react-native'

export const getRole = async () => {
    let user = JSON.parse(await AsyncStorage.getItem('user'));

    return user.ChucVu;
}

export const getUserInfo = async () => {
  let user = JSON.parse(await AsyncStorage.getItem('user'));

  return user;
}
