import {randomColor} from './colorConvert'

function getNeighbors (pos, image) {
    return [
        pos - image.width * 4 - 4,
        pos - image.width * 4,
        pos - image.width * 4 + 4,
        pos - 4,
        pos + 4,
        pos + image.width * 4 - 4,
        pos + image.width * 4,
        pos + image.width * 4 + 4
    ]
}

function floodFillBase (opts, dataStructureMethod, cb) {

    let pixels = opts.pixels
    let image = opts.image

    let dataStructure = new Array()
    dataStructure.push(opts.pos)

    let color = randomColor()

    while (dataStructure.length) {
        let index = dataStructure[dataStructureMethod]()

        if (index < 0 || index >= pixels.length || pixels[index] > 0)
            continue

        pixels[index] = color.r
        pixels[index + 1] = color.g
        pixels[index + 2] = color.b

        if (opts.config.useVisual) {
            let tmpPixels = pixels.slice(0)
            tmpPixels[index] = 255
            tmpPixels[index + 1] = 0
            tmpPixels[index + 2] = 0
            cb(tmpPixels)
        }

        let neighbors = getNeighbors(index, image)
        for (let n = 0; n < neighbors.length; n++)
            dataStructure.push(neighbors[n])

    }
}

function iFloodFillBase (opts, dataStructureMethod, cb) {

    let pixels = opts.pixels
    let image = opts.image

    let dataStructure = new Array()
    dataStructure.push(opts.pos)

    let color = randomColor()

    while (dataStructure.length) {
        let index = dataStructure[dataStructureMethod]()

        if (index < 0 || index >= pixels.length || pixels[index] > 0)
            continue

        pixels[index] = color.r
        pixels[index + 1] = color.g
        pixels[index + 2] = color.b

        if (opts.config.useVisual) {
            let tmpPixels = pixels.slice(0)
            tmpPixels[index] = 255
            tmpPixels[index + 1] = 0
            tmpPixels[index + 2] = 0
            cb(tmpPixels)
        }

        let neighbors = getNeighbors(index, image)
        for (let n = 0; n < neighbors.length; n++) {
            if (pixels[neighbors[n]] === 0)
                dataStructure.push(neighbors[n])
        }
    }
}


function regionLabelingBase (opts, args) {

    let pixels = opts.pixels
    let image = opts.image
    let pos = opts.pos

    let neighbors = getNeighbors(pos, image)
    let relevantNeighbors = []
    let backgroundNeighbors = []

    for (let n of neighbors) {
        if (pixels[n] === 0)
            backgroundNeighbors.push(n)

        if (pixels[n] > 1 && pixels[n] !== 255)
            relevantNeighbors.push(n)
    }

    switch (relevantNeighbors.length) {
        case 0:
            if (backgroundNeighbors.length) {
                pixels[pos] = args.m
                pixels[pos + 1] = args.m
                pixels[pos + 2] = args.m++
            }
            break

        case 1:
            var neighborValue = pixels[relevantNeighbors[0]]
            pixels[pos] = neighborValue
            pixels[pos + 1] = neighborValue
            pixels[pos + 2] = neighborValue
            break

        default:
            var neighborValue = pixels[relevantNeighbors[0]]
            pixels[pos] = neighborValue
            pixels[pos + 1] = neighborValue
            pixels[pos + 2] = neighborValue

            for (let n of relevantNeighbors) {
                if (neighborValue === pixels[n])
                    continue

                if (!args.C[pixels[n]])
                    args.C[pixels[n]] = {}

                args.C[pixels[n]][neighborValue] = 0
            }
            break
    }

}


function mergeCollisions (args) {

    for (let c of Object.keys(args.C)) {
        for (let i of Object.keys(args.C[c])) {
            let merged = Object.assign(args.C[c], args.C[i])
            args.C[c] = merged
            args.C[i] = merged
        }
    }

}

function reindexImage (opts, args, cb, tmpCb) {

    let pixels = opts.pixels

    let colors = []
    for (let i = 2; i < args.m; i++) {
        let color = randomColor()
        colors[i] = color
        if (opts.config.useVisual) {
            console.log(`%c    `, `background-color: rgb(${color.r}, ${color.g}, ${color.b})`, i);
        }
    }

    let tmpPixels = pixels.slice(0)
    for (let k = 0; k < tmpPixels.length; k += 4) {
        if (colors[tmpPixels[k]]) {
            let color = colors[tmpPixels[k]]
            tmpPixels[k] = color.r
            tmpPixels[k + 1] = color.g
            tmpPixels[k + 2] = color.b
        }
    }
    tmpCb(tmpPixels)

    for (let i = 0; i < pixels.length; i += 4) {
        if (pixels[i] < 1 || pixels[i] === 255)
            continue

        let label = args.C[pixels[i]]
        let color = colors[pixels[i]]

        if (label) {
            let c = Object.keys(args.C[pixels[i]])
            color = colors[c[0]]
        }

        pixels[i] = color.r
        pixels[i + 1] = color.g
        pixels[i + 2] = color.b
    }

    cb(pixels)
}




export function apply_df (opts, cb) {

    let pixels = opts.pixels

    for (let pos = 0; pos < pixels.length; pos += 4) {
        if (pixels[pos] !== 0)
            continue

        floodFillBase(Object.assign({}, opts, {pos : pos}), 'pop', cb)
    }
    cb(pixels)
}

export function apply_bf (opts, cb) {

    let pixels = opts.pixels

    for (let pos = 0; pos < pixels.length; pos += 4) {
        if (pixels[pos] !== 0)
            continue

        floodFillBase(Object.assign({}, opts, {pos : pos}), 'shift', cb)
    }
    cb(pixels)
}




export function apply_idf (opts, cb) {

    let pixels = opts.pixels

    for (let pos = 0; pos < pixels.length; pos += 4) {
        if (pixels[pos] !== 0)
            continue

        iFloodFillBase(Object.assign({}, opts, {pos : pos}), 'pop', cb)
    }
    cb(pixels)
}

export function apply_ibf (opts, cb) {

    let pixels = opts.pixels

    for (let pos = 0; pos < pixels.length; pos += 4) {
        if (pixels[pos] !== 0)
            continue

        iFloodFillBase(Object.assign({}, opts, {pos : pos}), 'shift', cb)
    }
    cb(pixels)
}




export function apply_sr (opts, cb, tmpCb) {

    let pixels = opts.pixels

    let args = {
        m : 2,
        C : {}
    }

    for (let pos = 0; pos < pixels.length; pos += 4) {
        if (pixels[pos] === 255)
            continue

        opts.pos = pos

        regionLabelingBase(opts, args)
    }

    mergeCollisions(args)
    reindexImage(Object.assign({}, opts), args, cb, tmpCb)

}
