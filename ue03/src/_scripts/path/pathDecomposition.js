import {direction} from '../edge'
import path from './path'

function draw (pixels, config, image, cb, paths) {
    let dstPixels
    if (config.showPixels)
        dstPixels = pixels
    else {
        dstPixels = new Uint8ClampedArray(pixels.length)
        dstPixels.fill(255, 0, pixels.length)
    }

    if (config.showPath) {
        for (let path of paths) {

            for (let edge of path) {

                let pos = edge.pos * 4

                dstPixels[pos] = (dstPixels[pos] + 255) / 2
                dstPixels[pos + 1] = dstPixels[pos] / 4
                dstPixels[pos + 2] = dstPixels[pos] / 4

            }

        }
    }

    cb(dstPixels)
}

export default function(pixels, config, image, cb) {

    let paths = []
    let invertedPixels = pixels

    let it = 0
    while (true) {
        it++

        let lastPath = path(invertedPixels, config, image, cb)
        if (! lastPath)
            break
        paths.push(lastPath)

        invertedPixels = invertedPixels.slice(0)

        for (let edge of lastPath) {
            if (edge.dir === direction.up || edge.dir === direction.down) {
                let pos = edge.pos
                invertedPixels[pos * 4] = 128
                invertedPixels[pos * 4 + 1] = 128
                invertedPixels[pos * 4 + 2] = 128

                if (config.useVisual)
                    cb(invertedPixels)

                pos++

                while (pos % image.width > 0) {
                    let _pos = pos * 4
                    invertedPixels[_pos] = Math.abs(invertedPixels[_pos] - 255)
                    invertedPixels[_pos + 1] = Math.abs(invertedPixels[_pos + 1] - 255)
                    invertedPixels[_pos + 2] = Math.abs(invertedPixels[_pos + 2] - 255)

                    pos++
                }

                if (config.useVisual)
                    cb(invertedPixels)

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
            cb(invertedPixels)

    }

    draw.apply(null, [...arguments, paths])

}
