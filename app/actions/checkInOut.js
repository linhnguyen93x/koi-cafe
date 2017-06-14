import * as types from './types'
import KoiApi from '../libs/koiApi'


export function getUserOutlet(userCode) {
	return (dispatch, getState) => {

		return KoiApi.get(`/api/getip`).then(resp => {
			console.log(resp);
		}).catch(ex => {
			console.log(ex);
		});
	}
}
