import { combineReducers } from "redux";
import {reducer as toastrReducer} from 'react-redux-toastr'

import AuthReducer from'./AuthReducer'
import ScreenReducer from './ScreenReducer'
import DataReducer from './DataReducer'
import HeroesReducer from './HeroesReducer'

export default combineReducers({
    auth: AuthReducer,
    toastr: toastrReducer,
    screen: ScreenReducer,
    data: DataReducer,
    heroes: HeroesReducer
})