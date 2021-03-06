import ajax from 'Gb/utils/ajax'
import Toast from 'Gb/components/Toast'
import { replace } from 'react-router-redux'
import {
  INIT_CHECKLIST,
  API
} from './constants'

// 获取未审核列表 | 驳回列表
const initCheckList = (type) => {
  return async (dispatch) => {
    const params = {}
    if (type) params.type = type
    const data = await ajax.get(API.checklist, params)
    if (data) {
      dispatch({
        type: INIT_CHECKLIST,
        data
      })
    }
  }
}

// 审核
const check = (id, type) => {
  return async (dispatch) => {
    const params = { id }
    if (type) params.type = type
    const data = await ajax.get(API.check, params)
    if (data) {
      const msg = type === 1 ? '驳回成功' : '审核成功'
      Toast.success(msg)
      setTimeout(() => {
        dispatch(replace('/manage'))
      }, 1000)
    }
  }
}

// 微信授权
const auth = (code) => {
  return async (dispatch) => {
    const data = await ajax.get(API.auth, { code })
    if (!data) {
      Toast.warn('授权失败')
    }
  }
}

export default {
  initCheckList,
  check,
  auth
}