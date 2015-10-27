import {grayscale} from './colorConvert'

export default function(pixels) {

    let threshold = 0
    let newTreshold = 128
    let iterationCounter = 0

    let histogram = Array(256)
    histogram.fill(0, 0, 256)

    for (let i = 0; i < pixels.length; i++) {
        let pixel = grayscale({
            r : pixels[i] || 0,
            g : pixels[++i] || 0,
            b : pixels[++i] || 0,
            a : pixels[++i] || 0,
        })
        histogram[pixel]++
    }

    while (Math.abs(newTreshold - threshold) > 1) {
        threshold = newTreshold

        let sum = {pre : 0, pre2 : 0, post : 0, post2 : 0}
        for (let i = 0; i < threshold; i++) {
            sum.pre += histogram[i]
            sum.pre2 += i * histogram[i]
        }
        for (let i = threshold; i < histogram.length; i++) {
            sum.post += histogram[i]
            sum.post2 += i * histogram[i]
        }
        let mean = {
            pre: (sum.pre2 / sum.pre) || threshold,
            post: (sum.post2 / sum.post) || threshold,
        }
        // console.log(`Mean pre : ${parseInt(mean.pre)}`)
        // console.log(`Mean post: ${parseInt(mean.post)}`)
        newTreshold = Math.round((mean.pre + mean.post) / 2)

        // console.log(`Iteration ${iterationCounter}: ${newTreshold}\n\n`)

        iterationCounter++
        if (iterationCounter >= 100) {
            console.log('Aborted after 100 iterations')
            break
        }
    }

    console.log(`Found threshold (${newTreshold}) after ${iterationCounter} iterations`)

    return newTreshold

}
