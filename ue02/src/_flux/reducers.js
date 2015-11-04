import { combineReducers } from 'redux'
import * as actions from './actions'


const initialState = {
    images : [
        `${location.pathname}images/klein copy.png`,
        `${location.pathname}images/klein.png`,
        `${location.pathname}images/sample.png`,
        `${location.pathname}images/tools.png`,
    ],
    activeImage : 0,
    methods : {
        df : {
            short : 'df',
            name : 'Depth-first',
        },
        bf : {
            short : 'bf',
            name : 'Breadth-first',
        },
        idf : {
            short : 'idf',
            name : 'Intelligent Depth-first',
        },
        ibf : {
            short : 'ibf',
            name : 'Intelligent Breadth-first',
        },
        sr : {
            short : 'sr',
            name : 'Sequential region labeling',
        },
    },
    activeMethod : 'df',
    useVisual : false,
    speedtest : false
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

        case actions.CHANGE_METHOD:
            return Object.assign({}, state, {
                activeMethod : action.method,
            })

        case actions.CHANGE_VISUAL:
            return Object.assign({}, state, {
                useVisual : action.useVisual,
            })

        default:
            return state

    }
}

export default combineReducers({
    controls
})
