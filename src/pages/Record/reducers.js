import {
  INIT_LIST
} from './constains'

const INITIAL_STATE = {
  list: null
}

const record = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case INIT_LIST:
      return {
        ...state,
        list: action.data
      }
    default:
      return state
  }
}

export default record