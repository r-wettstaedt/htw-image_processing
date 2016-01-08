import {direction} from '../edge'
import path from './path'

function cleanup (paths) {
    for (let path of paths) {
        for (let i = 0; i < path.length; i++) {
            if (path[i - 1] && path[i].pos === path[i - 1].pos) {
                path.splice(i, 1)
                --i
            }
        }
    }
}

function invertPixels (pixels, config, image, notify, invertedPixels, lastPath) {

    for (let index = 0; index < lastPath.length; index++) {
        let edge = lastPath[index]
        let lastEdge = lastPath[index - 1]

        if (edge.dir === direction.left || edge.dir === direction.right)
            continue

        // if (edge.dir === direction.up && lastEdge.dir === direction.right)
        //     continue

        if (edge.dir === direction.up && lastEdge.dir === direction.left)
            continue

        let pos = edge.pos
        invertedPixels[pos * 4 + 0] = 128
        invertedPixels[pos * 4 + 1] = 128
        invertedPixels[pos * 4 + 2] = 128

        if (config.useVisual)
            notify(invertedPixels)

        pos++

        while (pos % image.width > 0) {
            let _pos = pos * 4
            let r = Math.abs(invertedPixels[_pos + 0] - 255)
            let g = Math.abs(invertedPixels[_pos + 1] - 255)
            let b = Math.abs(invertedPixels[_pos + 2] - 255)
            let a = Math.abs(invertedPixels[_pos + 3] - 255)
            invertedPixels[_pos + 0] = r
            invertedPixels[_pos + 1] = g
            invertedPixels[_pos + 2] = b
            invertedPixels[_pos + 3] = a

            pos++

            if (config.useVisual)
                notify(invertedPixels)
        }

        console.log()

    }
    for (let i = 0; i < invertedPixels.length; i += 4) {
        if (invertedPixels[i] !== 128 && invertedPixels[i] !== 127)
            continue

        invertedPixels[i + 0] = 255
        invertedPixels[i + 1] = 255
        invertedPixels[i + 2] = 255
    }

    if (config.useVisual)
        notify(invertedPixels)
}

export default function(pixels, config, image, notify) {

    let outerPaths = []
    let innerPaths = []
    let invertedPixels = pixels

    while (true) {

        let pos, alpha
        let found = false
        for (pos = 0; pos < invertedPixels.length / 4; pos++) {
            let pixel = invertedPixels[pos * 4 + 4]
            alpha = invertedPixels[pos * 4 + 7]
            if (pixel === 0) {
                found = true
                break
            }
        }

        if (! found)
            break

        if (config.useVisual) {
            let tmpPixels = invertedPixels.slice(0)
            tmpPixels[pos * 4 + 0] = 255
            tmpPixels[pos * 4 + 1] = 128
            tmpPixels[pos * 4 + 2] = 128
            tmpPixels[pos * 4 + 3] = 255
            notify(tmpPixels)
        }

        let lastPath = path(invertedPixels, ++pos, config, image, notify)

        if (alpha === 0)
            innerPaths.push(lastPath)
        else
            outerPaths.push(lastPath)

        invertedPixels = invertedPixels.slice(0)
        invertPixels.apply(null, [...arguments, invertedPixels, lastPath])

    }

    cleanup(outerPaths)
    cleanup(innerPaths)

    return new Promise(function (resolve) {
        resolve([outerPaths, innerPaths])
    })

}
