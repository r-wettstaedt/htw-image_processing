import {binarize} from './colorConvert'
import pathDecomposition from './path/pathDecomposition'

onmessage = event => {

    console.log('\n---\n')

    let pixels = event.data.pixels
    let config = event.data.config
    let image  = event.data.image
    let startTime
    let endTime

    startTime = new Date()

    pathDecomposition(pixels, image, pixels => {
        postMessage({ pixels : pixels })
    })

    endTime = new Date()
    console.log(`Took ${endTime-startTime}ms to complete`)

    // postMessage({ pixels : pixels })

}
