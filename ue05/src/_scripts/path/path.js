import {Edge, direction} from '../edge'

console.log(" ")

export default function(pixels, pos, config, image, cb) {

    let path = []

    path.push(new Edge(pos, direction.down, image))
    let pathPixels = pixels.slice(0)
    let lastEdge = 0

    let it = 0
    while (lastEdge.pos !== path[0].pos || lastEdge.dir !== path[0].dir) {

        lastEdge = path[path.length - 1]

        // pathPixels[lastEdge.pos * 4 + 0] = 255
        // pathPixels[lastEdge.pos * 4 + 1] = 0
        // pathPixels[lastEdge.pos * 4 + 2] = 0
        // pathPixels[lastEdge.pos * 4 + 3] = 128

        // if (config.useVisual)
        //     cb(pathPixels)


        let left, right, leftPixel, rightPixel
        switch (lastEdge.dir) {
            case direction.up:
                right = lastEdge.pos - image.width
                left = right - 1

                leftPixel = pixels[left * 4]
                rightPixel = pixels[right * 4]

                if (leftPixel === 0 && rightPixel === 255)
                    // forward
                    path.push(new Edge(right, lastEdge.dir, image))

                else if (leftPixel === 255 && rightPixel === 255)
                    // left
                    path.push(new Edge(left + image.width, direction.left, image))

                else
                    // right
                    path.push(new Edge(lastEdge.pos, direction.right, image))

                break

            case direction.right:
                right = lastEdge.pos
                left = right - image.width

                leftPixel = pixels[left * 4]
                rightPixel = pixels[right * 4]

                if (leftPixel === 0 && rightPixel === 255)
                    // forward
                    path.push(new Edge(right + 1, lastEdge.dir, image))

                else if (leftPixel === 255 && rightPixel === 255)
                    // left
                    path.push(new Edge(left, direction.up, image))

                else
                    // right
                    path.push(new Edge(lastEdge.pos, direction.down, image))

                break

            case direction.down:
                left = lastEdge.pos + image.width //+ 1
                right = left - 1

                leftPixel = pixels[left * 4]
                rightPixel = pixels[right * 4]

                if (leftPixel === 0 && rightPixel === 255)
                    // forward
                    path.push(new Edge(left, lastEdge.dir, image))

                else if (leftPixel === 255 && rightPixel === 255)
                    // left
                    path.push(new Edge(left, direction.right, image))

                else
                    // right
                    path.push(new Edge(left/*lastEdge.pos*/, direction.left, image))

                break

            case direction.left:
                left = lastEdge.pos - 1
                right = left - image.width

                leftPixel = pixels[left * 4]
                rightPixel = pixels[right * 4]

                if (leftPixel === 0 && rightPixel === 255)
                    // forward
                    path.push(new Edge(left, lastEdge.dir, image))

                else if (leftPixel === 255 && rightPixel === 255)
                    // left
                    path.push(new Edge(lastEdge.pos, direction.down, image))

                else
                    // right
                    path.push(new Edge(lastEdge.pos, direction.up, image))

                break
        }

        let tmpPixels
        if (config.useVisual) {
            tmpPixels = pathPixels.slice(0)

            // green here
            tmpPixels[lastEdge.pos * 4 + 0] = 0
            tmpPixels[lastEdge.pos * 4 + 1] = 255
            tmpPixels[lastEdge.pos * 4 + 2] = 0
            tmpPixels[lastEdge.pos * 4 + 3] = 255

            // yellow left
            tmpPixels[left * 4 + 0] = 255
            tmpPixels[left * 4 + 1] = 255
            tmpPixels[left * 4 + 2] = 0
            tmpPixels[left * 4 + 3] = 255

            // blue right
            tmpPixels[right * 4 + 0] = 0
            tmpPixels[right * 4 + 1] = 128
            tmpPixels[right * 4 + 2] = 255
            tmpPixels[right * 4 + 3] = 255

            cb(tmpPixels)
        }

        lastEdge = path[path.length - 1]

        if (config.useVisual) {

            // green here
            tmpPixels[lastEdge.pos * 4 + 0] = 0
            tmpPixels[lastEdge.pos * 4 + 1] = 128
            tmpPixels[lastEdge.pos * 4 + 2] = 0
            tmpPixels[lastEdge.pos * 4 + 3] = 255

            cb(tmpPixels)
        }

        console.log()

    }

    if (config.useVisual)
        cb(pathPixels)

    path.pop()
    return path

}
