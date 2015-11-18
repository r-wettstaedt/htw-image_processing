/*
 * action types
 */

export const ADD_IMAGE = 'ADD_IMAGE'
export const CHANGE_ACTIVE_IMAGE = 'CHANGE_IMAGE'
export const CHANGE_VISUAL = 'CHANGE_VISUAL'
export const CHANGE_PIXELS = 'CHANGE_PIXELS'
export const CHANGE_PATH = 'CHANGE_PATH'


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

export function changeVisual (useVisual) {
    return {
        type: CHANGE_VISUAL,
        useVisual
    }
}

export function changePixels (usePixels) {
    return {
        type: CHANGE_PIXELS,
        usePixels
    }
}

export function changePath (usePath) {
    return {
        type: CHANGE_PATH,
        usePath
    }
}

