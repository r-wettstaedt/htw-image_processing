import {binarize} from './colorConvert'

onmessage = event => {

    console.log('\n---\n')

    let pixels = event.data.pixels
    let config = event.data.config
    let startTime
    let endTime

    startTime = new Date()



    endTime = new Date()
    console.log(`Took ${endTime-startTime}ms to complete`)

}
