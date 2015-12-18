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

        showGrid : state.controls.showGrid,
        showPixels : state.controls.showPixels,
        showPath : state.controls.showPath,
        showPolygon : state.controls.showPolygon,

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
            this.drawContent()
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
            context.setState({
                pixels : pixels,
                image : {
                    width : image.width,
                    height : image.height,
                }
            })

            if (event.data.pixels) {
                let imageData = new ImageData( event.data.pixels, image.width, image.height )
                context.state.context.tmp.putImageData(imageData, 0, 0)

                context.state.context.dest.scale(scale, scale)
                context.state.context.dest.imageSmoothingEnabled = false
                context.state.context.dest.drawImage(context.refs.tmp, 0, 0)
                context.state.context.dest.scale(1 / scale, 1 / scale)
            } else if (event.data.straightPaths) {
                context.setState({ straightPaths : event.data.straightPaths })
            } else if (event.data.paths) {
                context.setState({ paths : event.data.paths })
            } else if (event.data.done) {
                context.drawContent()
            }

        }
    }

    drawContent () {
        this.refs.dest.style.width = `${this.props.zoom * 100}%`

        let startTime = new Date()

        this.state.context.dest.clearRect(0, 0, this.refs.dest.width, this.refs.dest.height)

        if (this.props.showPixels) {
            this.state.context.dest.globalAlpha = 1
            this.state.context.dest.scale(this.state.scale, this.state.scale)
            this.state.context.dest.imageSmoothingEnabled = false
            this.state.context.dest.drawImage(this.refs.src, 0, 0)
            this.state.context.dest.scale(1 / this.state.scale, 1 / this.state.scale)
        }

        if (this.props.showGrid) {
            this.drawGrid()
        }

        if (this.props.showPath) {
            this.drawPaths(this.state.paths[0], '#E00051', true)
            this.drawPaths(this.state.paths[1], '#FD8508', true)
        }

        if (this.props.showPolygon) {
            this.drawPaths(this.state.straightPaths, '#445CFB', true)
        }

        let endTime = new Date()
        console.log(`Drawing took ${endTime-startTime}ms to complete`)
    }


    drawGrid () {
        const width = 20
        let i = 0
        this.state.context.dest.beginPath()
        this.state.context.dest.strokeStyle = '#8C8C8C'
        this.state.context.dest.globalAlpha = 0.5
        this.state.context.dest.lineWidth = 1

        while (width * i < this.state.image.width * this.state.scale) {
            this.state.context.dest.moveTo(i * width, 0)
            this.state.context.dest.lineTo(i * width, this.state.image.height * this.state.scale)
            i++
        }
        i = 0

        while (width * i < this.state.image.height * this.state.scale) {
            this.state.context.dest.moveTo(0, i * width)
            this.state.context.dest.lineTo(this.state.image.width * this.state.scale, i * width)
            i++
        }

        this.state.context.dest.stroke()
        this.state.context.dest.closePath()
    }


    drawPaths (paths, color, drawVertices) {
        this.state.context.dest.strokeStyle = color
        this.state.context.dest.fillStyle = color
        this.state.context.dest.lineWidth = 2
        this.state.context.dest.globalAlpha = 1

        for (let path of paths) {
            this.state.context.dest.beginPath()
            this.state.context.dest.moveTo(path[0].x * this.state.scale, path[0].y * this.state.scale)

            for (let edge of path) {
                this.state.context.dest.lineTo(edge.x * this.state.scale, edge.y * this.state.scale)
            }
            this.state.context.dest.stroke()
            this.state.context.dest.closePath()

            if (drawVertices) {
                for (let edge of path) {
                    this.state.context.dest.beginPath()
                    this.state.context.dest.arc(edge.x * this.state.scale, edge.y * this.state.scale, 3, 0, 2 * Math.PI, false)
                    this.state.context.dest.fill()
                }
            }

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
