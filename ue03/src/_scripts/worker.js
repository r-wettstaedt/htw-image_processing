import {binarize} from './colorConvert'
import pathDecomposition from './path/pathDecomposition'

onmessage = event => {

    console.log('\n---\n')

    let pixels = event.data.pixels
    let config = event.data.config
    let image  = event.data.image
    let startTime
    let endTime

    postMessage({ pixels : pixels })

    startTime = new Date()

    pathDecomposition(pixels, config, image,
        pixels => {
        postMessage({ pixels : pixels })
    }, (outerPaths, innerPaths) => {
        postMessage({ outerPaths : outerPaths, innerPaths : innerPaths })
    })

    endTime = new Date()
    console.log(`Path Decomposition took ${endTime-startTime}ms to complete`)

}
