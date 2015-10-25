import {binarize} from './colorConvert'
import ISOData from './ISOData'
import outline from './outline'

onmessage = e => {

    console.log('\n---\n')

    let pixels = e.data.pixels
    let config = e.data.config
    let image  = e.data.image
    let startTime
    let endTime

    if (config.useISOData) {
        startTime = new Date()
        config.threshold = ISOData(pixels)
        endTime = new Date()
        console.log(`ISOData took ${endTime-startTime}ms to complete`)
    }

    startTime = new Date()
    for (let i = 0; i < pixels.length; i++) {
        let pixel = binarize({
            r : pixels[i],
            g : pixels[i + 1],
            b : pixels[i + 2],
            a : pixels[i + 3],
        }, config)

        pixels[i] = pixel.r
        pixels[++i] = pixel.g
        pixels[++i] = pixel.b
        pixels[++i] = pixel.a
    }
    endTime = new Date()
    console.log(`Binarizing took ${endTime-startTime}ms to complete`)

    if (config.useOutline) {
        startTime = new Date()
        pixels = outline(pixels, image)
        endTime = new Date()
        console.log(`Outlining took ${endTime-startTime}ms to complete`)
    }

    // console.log('\n---\n')

    postMessage({ pixels : pixels, threshold : config.threshold })

}
