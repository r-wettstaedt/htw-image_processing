import {direction} from '../edge'
import path from './path'

export default function(pixels, image, cb) {

    let paths = []
    let invertedPixels = pixels

    let it = 0
    while (true) {
        it++

        let lastPath = path(invertedPixels, image, cb)
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
                cb(invertedPixels)

                pos++

                while (pos % image.width > 0) {
                    let _pos = pos * 4
                    invertedPixels[_pos] = Math.abs(invertedPixels[_pos] - 255)
                    invertedPixels[_pos + 1] = Math.abs(invertedPixels[_pos + 1] - 255)
                    invertedPixels[_pos + 2] = Math.abs(invertedPixels[_pos + 2] - 255)

                    pos++
                }
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

        cb(invertedPixels)

    }

}
