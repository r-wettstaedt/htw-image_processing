import { combineReducers } from 'redux'
import * as actions from './actions'


const initialState = {
    images : [
        `${location.pathname}images/ABC.png`,
        `${location.pathname}images/Bibel3.jpg`,
        `${location.pathname}images/Book1.jpg`,
        `${location.pathname}images/component.jpg`,
        `${location.pathname}images/lowContrast.jpg`,
        `${location.pathname}images/tools1.png`,
        // '/images/yeogurt-swirl.png',
    ],
    activeImage : 0,
    useISOData : false,
    useOutline : false,
    threshold : 128,
    thresholdByISOData : false,
}

function controls (state = initialState, action) {
    switch (action.type) {

        case actions.ADD_IMAGE:
            return Object.assign({}, state, {
                images : [action.src, ...state.images],
                activeImage : 0,
                thresholdByISOData : false,
            })

        case actions.CHANGE_ACTIVE_IMAGE:
            return Object.assign({}, state, {
                activeImage : action.index,
                thresholdByISOData : false,
            })

        case actions.CHANGE_OUTLINE:
            return Object.assign({}, state, {
                useOutline : action.outline,
                thresholdByISOData : false,
            })

        case actions.CHANGE_METHOD:
            return Object.assign({}, state, {
                useISOData : action.method,
                thresholdByISOData : false,
            })

        case actions.CHANGE_THRESHOLD:
            return Object.assign({}, state, {
                threshold : action.threshold,
                thresholdByISOData : state.useISOData,
            })

        default:
            return state

    }
}

export default combineReducers({
    controls
})
