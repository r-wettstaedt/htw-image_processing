import React, {Component, PropTypes} from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux';
import {store} from '../../_flux/store'
import {direction} from '../../_scripts/edge'

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
                tmp : this.refs.tmp.getContext('2d'),
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
            this.drawContours()
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

        let scale = parseInt(window.getComputedStyle(this.refs.dest).width) / this.props.zoom / image.width
        scale = parseInt(scale)
        scale = Math.max(1, scale)
        this.setState({ scale : scale })

        this.refs.tmp.width = image.width
        this.refs.tmp.height = image.height
        this.refs.dest.width = image.width * scale
        this.refs.dest.height = image.height * scale

        let context = this
        this.worker.onmessage = event => {

            if (event.data.pixels) {
                let imageData = new ImageData( event.data.pixels, image.width, image.height )
                context.state.context.tmp.putImageData(imageData, 0, 0)

                context.state.context.dest.scale(scale, scale)
                context.state.context.dest.imageSmoothingEnabled = false
                context.state.context.dest.drawImage(context.refs.tmp, 0, 0)
                context.state.context.dest.scale(1 / scale, 1 / scale)
            } else {
                context.setState({
                    pixels : pixels,
                    outerPaths : event.data.outerPaths,
                    innerPaths : event.data.innerPaths,
                    image : {
                        width : image.width,
                        height : image.height,
                    }
                })
                context.drawContours()
            }

        }
    }

    drawContours () {
        this.refs.dest.style.width = `${this.props.zoom * 100}%`

        let startTime = new Date()

        this.state.context.dest.clearRect(0, 0, this.refs.dest.width, this.refs.dest.height)

        if (this.props.showPixels) {
            this.state.context.dest.scale(this.state.scale, this.state.scale)
            this.state.context.dest.imageSmoothingEnabled = false
            this.state.context.dest.drawImage(this.refs.src, 0, 0)
            this.state.context.dest.scale(1 / this.state.scale, 1 / this.state.scale)
        }

        if (this.props.showPath) {
            this.drawPaths(this.state.outerPaths, '#ff0000')
            this.drawPaths(this.state.innerPaths, '#ff8800')
        }

        let endTime = new Date()
        console.log(`Drawing took ${endTime-startTime}ms to complete`)
    }


    drawPaths (paths, color) {
        this.state.context.dest.strokeStyle = color

        for (let path of paths) {
            let first = true
            for (let edge of path) {
                let posX = edge.pos % this.state.image.width
                let posY = (edge.pos - posX) / this.state.image.width

                if (first) {
                    this.state.context.dest.beginPath()
                    this.state.context.dest.moveTo(posX * this.state.scale, posY * this.state.scale)
                }

                this.state.context.dest.lineTo(posX * this.state.scale, posY * this.state.scale)
                first = false
            }
            this.state.context.dest.stroke()
            this.state.context.dest.closePath()
        }
    }


    render () {
        if (this.refs.src) {
            var sizeLabel = <p className='canvas__text'>{this.refs.src.height}px * {this.refs.src.width}px</p>
        }

        return (
            <div className='row'>
                <div className='canvas col-xs-12 hidden'>
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
