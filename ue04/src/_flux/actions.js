/*
 * action types
 */

export const ADD_IMAGE = 'ADD_IMAGE'
export const CHANGE_ACTIVE_IMAGE = 'CHANGE_IMAGE'
export const CHANGE_VISUAL = 'CHANGE_VISUAL'

export const CHANGE_GRID = 'CHANGE_GRID'
export const CHANGE_PIXELS = 'CHANGE_PIXELS'
export const CHANGE_PATH = 'CHANGE_PATH'
export const CHANGE_POLYGON = 'CHANGE_POLYGON'

export const CHANGE_ZOOM = 'CHANGE_ZOOM'


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

export function changeGrid (showGrid) {
    return {
        type: CHANGE_GRID,
        showGrid
    }
}

export function changePixels (showPixels) {
    return {
        type: CHANGE_PIXELS,
        showPixels
    }
}

export function changePath (showPath) {
    return {
        type: CHANGE_PATH,
        showPath
    }
}

export function changePolygon (showPolygon) {
    return {
        type: CHANGE_POLYGON,
        showPolygon
    }
}

export function changeZoom (zoom) {
    return {
        type: CHANGE_ZOOM,
        zoom
    }
}

