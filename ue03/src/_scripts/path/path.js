import {Edge, direction} from '../edge'

export default function(pixels, image, cb) {

    console.log("msg")

    let path = []

    let pos, pixel
    for (pos = 0; pos < pixels.length / 4; pos++) {
        pixel = pixels[pos * 4 + 4]
        if (pixel === 0) {
            break
        }
    }

    if (typeof pixel === 'undefined')
        return

    path.push(new Edge(pos, direction.down))
    let pathPixels = pixels.slice(0)
    let lastEdge = 0

    let it = 0
    while (lastEdge.pos !== path[0].pos || lastEdge.dir !== path[0].dir) {

        lastEdge = path[path.length - 1]

        pathPixels[lastEdge.pos * 4] = 255
        pathPixels[lastEdge.pos * 4 + 1] = 0
        pathPixels[lastEdge.pos * 4 + 2] = 0
        pathPixels[lastEdge.pos * 4 + 3] = 128
        cb(pathPixels)

        it++

        let left, right, leftPixel, rightPixel
        switch (lastEdge.dir) {
            case direction.up:
                left = lastEdge.pos - image.width - 1
                right = left + 1

                leftPixel = pixels[left * 4]
                rightPixel = pixels[right * 4]

                if (leftPixel === 0 && rightPixel === 255) // forward
                    path.push(new Edge(right, lastEdge.dir))

                else if (leftPixel === 255 && rightPixel === 255) // left
                    path.push(new Edge(left, direction.left))

                else // right
                    path.push(new Edge(lastEdge.pos, direction.right))

                break

            case direction.right:
                right = lastEdge.pos + 1
                left = right - image.width

                leftPixel = pixels[left * 4]
                rightPixel = pixels[right * 4]

                if (leftPixel === 0 && rightPixel === 255) // forward
                    path.push(new Edge(right, lastEdge.dir))

                else if (leftPixel === 255 && rightPixel === 255) // left
                    path.push(new Edge(left, direction.up))

                else // right
                    path.push(new Edge(lastEdge.pos, direction.down))

                break

            case direction.down:
                left = lastEdge.pos + image.width + 1
                right = left - 1

                leftPixel = pixels[left * 4]
                rightPixel = pixels[right * 4]

                if (leftPixel === 0 && rightPixel === 255) // forward
                    path.push(new Edge(right, lastEdge.dir))

                else if (leftPixel === 255 && rightPixel === 255) // left
                    path.push(new Edge(left, direction.right))

                else // right
                    path.push(new Edge(lastEdge.pos, direction.left))

                break

            case direction.left:
                right = lastEdge.pos - 1
                left = right + image.width

                leftPixel = pixels[left * 4]
                rightPixel = pixels[right * 4]

                if (leftPixel === 0 && rightPixel === 255) // forward
                    path.push(new Edge(right, lastEdge.dir))

                else if (leftPixel === 255 && rightPixel === 255) // left
                    path.push(new Edge(left, direction.down))

                else // right
                    path.push(new Edge(lastEdge.pos, direction.up))

                break
        }

        let tmpPixels = pathPixels.slice(0)
        tmpPixels[left * 4] = 255
        tmpPixels[left * 4 + 1] = 255
        tmpPixels[left * 4 + 2] = 0
        tmpPixels[right * 4] = 0
        tmpPixels[right * 4 + 1] = 128
        tmpPixels[right * 4 + 2] = 255
        cb(tmpPixels)

        lastEdge = path[path.length - 1]

    }

    cb(pathPixels)
    path.pop()
    return path

}
