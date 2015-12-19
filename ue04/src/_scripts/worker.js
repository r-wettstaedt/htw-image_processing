import pathDecomposition from './path/pathDecomposition'
import straightPath from './path/straightPath'
import polygon from './path/polygonDecomposition'

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

        return polygon(paths[0].concat(paths[1]), config,
            polygons => {
                postMessage({ polygons : polygons, done : true })
        })

    }).then( polygons => {
        postMessage({ polygons : polygons })

        endTime = new Date()
        console.log(`Polygon creation took ${endTime-startTime}ms to complete`)
        startTime = new Date()

        postMessage({ done : true })

    })


}
