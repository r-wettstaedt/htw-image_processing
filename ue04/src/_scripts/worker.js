import {binarize} from './colorConvert'
import pathDecomposition from './path/pathDecomposition'
import straightPath from './path/straightPath'

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
        pixels => {postMessage({ pixels : pixels })

    }).then( paths => {
        postMessage({ paths : paths })

        endTime = new Date()
        console.log(`Path Decomposition took ${endTime-startTime}ms to complete`)
        startTime = new Date()

        return straightPath(paths[0].concat(paths[1]))

    }).then( straightPaths => {
        postMessage({ straightPaths : straightPaths })

        endTime = new Date()
        console.log(`Polygon creation took ${endTime-startTime}ms to complete`)
        startTime = new Date()

        postMessage({ done : true })

    })


}
