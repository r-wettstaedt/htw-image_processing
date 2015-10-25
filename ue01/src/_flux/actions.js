/*
 * action types
 */

export const ADD_IMAGE = 'ADD_IMAGE'
export const CHANGE_ACTIVE_IMAGE = 'CHANGE_IMAGE'
export const CHANGE_OUTLINE = 'CHANGE_OUTLINE'
export const CHANGE_METHOD = 'CHANGE_METHOD'
export const CHANGE_THRESHOLD = 'CHANGE_THRESHOLD'


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

export function changeOutline (outline) {
    return {
        type: CHANGE_OUTLINE,
        outline
    }
}

export function changeMethod (method) {
    return {
        type: CHANGE_METHOD,
        method
    }
}

export function changeThreshold (threshold) {
    return {
        type: CHANGE_THRESHOLD,
        threshold
    }
}
