import { combineReducers } from 'redux'
import * as actions from './actions'

const initialState = {
    images : [
        `${location.pathname}images/klein.png`,
        `${location.pathname}images/klein copy.png`,
        `${location.pathname}images/test3.png`,
        `${location.pathname}images/w2.png`,
        `${location.pathname}images/head.png`,
        `${location.pathname}images/wheel-orig2.png`,
        `${location.pathname}images/stanford-orig2.png`,
        `${location.pathname}images/writing-orig2.png`,
        `${location.pathname}images/faces-orig2.png`,
        `${location.pathname}images/letters-orig2.png`,
    ],
    activeImage : 0,
    imageChanged : true,

    useVisual : false,

    showGrid : true,
    showPixels : false,
    showPath : true,
    showPolygon : true,

    zoom : 1,
}

function controls (state = initialState, action) {
    switch (action.type) {

        case actions.ADD_IMAGE:
            return Object.assign({}, state, {
                images : [action.src, ...state.images],
                activeImage : 0,
                imageChanged : true,
            })

        case actions.CHANGE_ACTIVE_IMAGE:
            return Object.assign({}, state, {
                activeImage : action.index,
                imageChanged : true,
            })

        case actions.CHANGE_VISUAL:
            return Object.assign({}, state, {
                useVisual : action.useVisual,
                imageChanged : true,
            })

        case actions.CHANGE_GRID:
            return Object.assign({}, state, {
                showGrid : action.showGrid,
                imageChanged : false,
            })

        case actions.CHANGE_PIXELS:
            return Object.assign({}, state, {
                showPixels : action.showPixels,
                imageChanged : false,
            })

        case actions.CHANGE_PATH:
            return Object.assign({}, state, {
                showPath : action.showPath,
                imageChanged : false,
            })

        case actions.CHANGE_POLYGON:
            return Object.assign({}, state, {
                showPolygon : action.showPolygon,
                imageChanged : false,
            })

        case actions.CHANGE_ZOOM:
            return Object.assign({}, state, {
                zoom : action.zoom,
                imageChanged : false,
            })

        default:
            return state

    }
}

export default combineReducers({
    controls
})
