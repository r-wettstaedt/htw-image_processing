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
            g : pixels[i + 1] || 0,
            b : pixels[i + 2] || 0,
            a : pixels[i + 3] || 0,
        })
        histogram[pixel]++
    }

    let thresholds = []

    while (Math.abs(newTreshold - threshold) > 1) {
        threshold = newTreshold

        let sum = {pre : 0, post : 0}
        for (let i = 0; i < threshold; i++) {
            sum.pre += histogram[i]
        }
        for (let i = threshold; i < histogram.length; i++) {
            sum.post += histogram[i]
        }
        let mean = {
            pre: sum.pre / (threshold - 1),
            post: sum.post / (histogram.length - threshold)
        }
        // console.log(`Mean: ${parseInt(mean.pre)}`)
        // console.log(`Mean: ${parseInt(mean.post)}`)
        let diff = {
            pre : {value : Number.MAX_SAFE_INTEGER},
            post : {value : Number.MAX_SAFE_INTEGER}
        }

        for (let i = 0; i < threshold; i++) {
            let delta = Math.abs(histogram[i] - mean.pre)
            if (delta < diff.pre.value) {
                diff.pre = {
                    index : i,
                    value : delta
                }
            }
        }
        for (let i = threshold; i < histogram.length; i++) {
            let delta = Math.abs(histogram[i] - mean.post)
            if (delta < diff.post.value) {
                diff.post = {
                    index : i,
                    value : delta
                }
            }
        }
        // console.log(`Diff: ${diff.pre.index} ${parseInt(diff.pre.value)}`)
        // console.log(`Diff: ${diff.post.index} ${parseInt(diff.post.value)}`)
        newTreshold = Math.round(diff.pre.index + (diff.post.index - diff.pre.index) / 2)

        // console.log(`Iteration: ${iterationCounter} - ${newTreshold}\n\n`)

        thresholds.push(newTreshold)

        iterationCounter++
        if (iterationCounter >= 1000) {
            console.log('Aborted after 1000 iterations')
            break
        }
    }

    console.log(`Found threshold (${newTreshold}) after ${iterationCounter} iterations`)

    return newTreshold

}
