import {Edge, direction} from './edge'

export default function(pixels, image, cb) {

    console.log("msg")

    let path = []

    let pos = 0
    let pixel = pixels[pos]
    while (pixel > 0) {
        pos++
        pixel = pixels[pos * 4]
    }

    path.push(new Edge(pos, direction.down))

    while (true) {
        let lastEdge = path[path.length - 1]

        let left, right
        switch (lastEdge.dir) {
            case direction.up:
                left = 4 * lastEdge.pos - 4 * image.width
                right = left + 4
                break

            case direction.right:
                left = 4 * lastEdge.pos + 4
                right = left + image.width
                break

            case direction.down:
                left = 4 * lastEdge.pos + 4 * image.width
                right = left - 4
                break

            case direction.left:
                left = 4 * lastEdge.pos - 4
                right = left - image.width
                break
        }

        let tmpPixels = pixels.slice(0)
        tmpPixels[pos * 4] = 255
        tmpPixels[left + 1] = 128
        tmpPixels[right + 2] = 128
        cb(tmpPixels)

        let leftPixel = pixels[left]
        let rightPixel = pixels[right]
        if (leftPixel === 0 && rightPixel === 0) {
            path.push(new Edge(pos , (lastEdge.dir + 1) % 4))
        } else if (leftPixel === 0 && rightPixel === 255) {
            path.push(new Edge( , lastEdge.dir))
        }
        else
            path.push(new Edge( , (Math.abs(lastEdge - 1)) % 4))


        break
    }

}
