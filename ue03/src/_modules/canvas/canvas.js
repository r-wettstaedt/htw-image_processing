import React, {Component, PropTypes} from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux';
import {store} from '../../_flux/store'

let Worker = require('worker!../../_scripts/worker')

@connect(
    state => ({
        activeImage : state.controls.activeImage,
        images : state.controls.images,
        imageChanged : state.controls.imageChanged,

        useVisual : state.controls.useVisual,
        showPixels : state.controls.showPixels,
        showPath : state.controls.showPath,
        zoom : state.controls.zoom,
    })
)

export default class Canvas extends Component {

    componentDidMount () {
        this.setState({
            context : {
                src : this.refs.src.getContext('2d'),
                dest : this.refs.dest.getContext('2d'),
            }
        })
        this.drawCanvas.bind(this)()
        store.subscribe( () => {
            setTimeout(this.drawCanvas.bind(this))
        })
    }

    drawCanvas () {
        if (this.props.imageChanged)
            this.drawSrc().then( image => {
                this.drawDest.bind(this)(image)
                this.forceUpdate()
            })

        else
            this.adjustDest()
    }

    drawSrc () {
        let imageData = this.props.images[this.props.activeImage]

        let image = new Image()
        image.src = imageData

        return new Promise( resolve => {
            image.onload = () => {
                image.width += 2
                image.height += 2
                this.refs.src.width = image.width
                this.refs.src.height = image.height
                this.state.context.src.drawImage(image, 1, 1)
                resolve(image)
            }
        })
    }

    drawDest (image) {
        if (this.worker)
            this.worker.terminate()

        let pixels = this.state.context.src.getImageData( 0, 0, image.width, image.height ).data

        for (let i = 3; i < pixels.length; i += 4) {
            if (pixels[i] === 0) {
                pixels[i - 3] = 255
                pixels[i - 2] = 255
                pixels[i - 1] = 255
                pixels[i] = 255
            }
        }

        this.worker = new Worker()
        this.worker.postMessage({
            pixels : pixels,
            config : {
                useVisual : this.props.useVisual,

                showPixels : this.props.showPixels,
                showPath : this.props.showPath,
            },
            image: {
                height : image.height,
                width : image.width,
            }
        })

        this.refs.dest.width = image.width
        this.refs.dest.height = image.height

        let context = this
        this.worker.onmessage = event => {

            if (event.data.pixels) {
                let imageData = new ImageData( event.data.pixels, image.width, image.height )
                context.state.context.dest.putImageData( imageData, 0, 0 )
            } else if (event.data.path) {
                context.setState({
                    pixels : pixels,
                    path : event.data.path,
                    image : {
                        width : image.width,
                        height : image.height,
                    }
                })
                context.adjustDest()
            }

        }
    }

    adjustDest () {
        this.refs.dest.style.width = `${this.props.zoom * 100}%`

        let pixels = new Uint8ClampedArray(this.state.pixels.length)
        pixels.fill(255, 0, pixels.length)

        for (let i = 0; i < pixels.length; i += 4) {
            let c = 0
            let r, g, b
            r = g = b = 0

            if (this.props.showPixels) {
                pixels[i] = this.state.pixels[i]
                pixels[i + 1] = this.state.pixels[i + 1]
                pixels[i + 2] = this.state.pixels[i + 2]
            }
            if (this.props.showPath) {
                if (this.state.path[i] < 255) {
                    pixels[i] = this.state.path[i]
                    pixels[i + 1] = this.state.path[i + 1]
                    pixels[i + 2] = this.state.path[i + 2]
                }
            }

            pixels[i + 3] = 255
        }
        let imageData = new ImageData( pixels, this.state.image.width, this.state.image.height )
        this.state.context.dest.putImageData( imageData, 0, 0 )
    }


    render () {
        if (this.refs.src) {
            var sizeLabel = <p className='canvas__text'>{this.refs.src.height}px * {this.refs.src.width}px</p>
        }

        return (
            <div className='row'>
                <div className='canvas hidden'>
                    <canvas className='canvas__canvas' ref='src' id='src' />
                    {sizeLabel}
                </div>

                <div className='canvas col-xs-12 hidden'>
                    <canvas className='canvas__canvas' ref='tmp' id='tmp' />
                    {sizeLabel}
                </div>

                <div className='canvas col-xs-12'>
                    <canvas className='canvas__canvas' ref='dest' id='dest' />
                    {sizeLabel}
                </div>
            </div>
        )
    }

}
