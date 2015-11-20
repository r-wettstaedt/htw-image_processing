import { combineReducers } from 'redux'
import * as actions from './actions'


const initialState = {
    images : [
        `${location.pathname}images/klein copy.png`,
        `${location.pathname}images/klein.png`,
        `${location.pathname}images/test3.png`,
        `${location.pathname}images/sample.png`,
        `${location.pathname}images/tools.png`,
    ],
    activeImage : 0,
    useVisual : true,

    showPixels : true,
    showPath : true,

    zoom : 1,
}

function controls (state = initialState, action) {
    switch (action.type) {

        case actions.ADD_IMAGE:
            return Object.assign({}, state, {
                images : [action.src, ...state.images],
                activeImage : 0,
            })

        case actions.CHANGE_ACTIVE_IMAGE:
            return Object.assign({}, state, {
                activeImage : action.index,
            })

        case actions.CHANGE_VISUAL:
            return Object.assign({}, state, {
                useVisual : action.useVisual,
            })

        case actions.CHANGE_PIXELS:
            return Object.assign({}, state, {
                usePixels : action.usePixels,
            })

        case actions.CHANGE_PATH:
            return Object.assign({}, state, {
                usePath : action.usePath,
            })

        case actions.CHANGE_ZOOM:
            return Object.assign({}, state, {
                zoom : action.zoom,
            })

        default:
            return state

    }
}

export default combineReducers({
    controls
})
