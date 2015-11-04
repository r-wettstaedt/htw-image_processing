/*
 * action types
 */

export const ADD_IMAGE = 'ADD_IMAGE'
export const CHANGE_ACTIVE_IMAGE = 'CHANGE_IMAGE'
export const CHANGE_METHOD = 'CHANGE_METHOD'
export const CHANGE_VISUAL = 'CHANGE_VISUAL'


/*
 * action creators
 */

export function addImage (src) {
    return {
        type: ADD_IMAGE,
        src
    }
}

export function changeActiveImage (index) {
    return {
        type: CHANGE_ACTIVE_IMAGE,
        index
    }
}

export function changeMethod (method) {
    return {
        type: CHANGE_METHOD,
        method
    }
}

export function changeVisual (useVisual) {
    return {
        type: CHANGE_VISUAL,
        useVisual
    }
}
