import {direction} from '../edge'
import path from './path'

function createPathPixels (pixels, config, image, notify, resolve, outerPaths) {
    let pathPixels = new Uint8ClampedArray(pixels.length)
    pathPixels.fill(255, 0, pixels.length)

    for (let path of outerPaths) {
        for (let edge of path) {

            let pos = edge.pos * 4

            pathPixels[pos] = 254
            pathPixels[pos + 1] = 0
            pathPixels[pos + 2] = 0
        }
    }

    resolve(pathPixels)
}

export default function(pixels, config, image, notify, resolve) {

    let outerPaths = []
    let innerPaths = []
    let invertedPixels = pixels

    while (true) {

        let lastPath = path(invertedPixels, config, image, notify)
        if (! lastPath)
            break
        outerPaths.push(lastPath)

        invertedPixels = invertedPixels.slice(0)

        for (let edge of lastPath) {
            if (edge.dir === direction.up || edge.dir === direction.down) {
                let pos = edge.pos
                invertedPixels[pos * 4] = 128
                invertedPixels[pos * 4 + 1] = 128
                invertedPixels[pos * 4 + 2] = 128

                if (config.useVisual)
                    notify(invertedPixels)

                pos++

                while (pos % image.width > 0) {
                    let _pos = pos * 4
                    invertedPixels[_pos] = Math.abs(invertedPixels[_pos] - 255)
                    invertedPixels[_pos + 1] = Math.abs(invertedPixels[_pos + 1] - 255)
                    invertedPixels[_pos + 2] = Math.abs(invertedPixels[_pos + 2] - 255)

                    pos++

                    if (config.useVisual)
                        notify(invertedPixels)
                }

                if (config.useVisual)
                    notify(invertedPixels)

            }
        }
        for (let i = 0; i < invertedPixels.length; i += 4) {
            if (invertedPixels[i] !== 128 && invertedPixels[i] !== 127)
                continue

            invertedPixels[i] = 255
            invertedPixels[i + 1] = 255
            invertedPixels[i + 2] = 255
        }

        if (config.useVisual)
            notify(invertedPixels)

    }

    createPathPixels.apply(null, [...arguments, outerPaths])

}
