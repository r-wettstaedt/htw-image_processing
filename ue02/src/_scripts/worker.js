import {binarize} from './colorConvert'
import * as floodFill from './floodFill'

onmessage = event => {

    console.log('\n---\n')

    let pixels = event.data.pixels
    let config = event.data.config
    let startTime
    let endTime

    startTime = new Date()

    let methodToCall = floodFill[`apply_${config.activeMethod}`]
    let iterations = config.speedtest ? 1000 : 1

    for (let i = 0; i < iterations; i++) {

        methodToCall(Object.assign({}, event.data, {pixels : event.data.pixels.slice(0)} ),
            pixels => {
                if (!config.speedtest)
                    postMessage({ pixels : pixels })
            }, pixels => {
                if (!config.speedtest)
                    postMessage({ pixels : pixels, tmp : true })
            }
        )

    }

    endTime = new Date()
    console.log(`${config.methods[config.activeMethod].name} took ${endTime-startTime}ms to complete`)

}
