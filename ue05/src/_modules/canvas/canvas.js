import React, {Component, PropTypes} from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux';
import {store} from '../../_flux/store'
import {direction} from '../../_scripts/edge'
import SVG from '../svg/svg'

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
        showCurve : state.controls.showCurve,
        showSVG : state.controls.showSVG,

        zoom : state.controls.zoom,
    })
)

export default class Canvas extends Component {

    constructor (props) {
        super(props)
        this.state = {}
    }

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

            } else if (event.data.paths) {

                context.setState({ paths : event.data.paths })

            } else if (event.data.polygons) {

                context.setState({ polygons : event.data.polygons })

            } else if (event.data.curves) {

                context.setState({ curves : event.data.curves })

            }
            if (event.data.done) {
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

        if (this.props.showPath && this.state.paths) {
            this.drawPaths(this.state.paths, {
                0   : '#FD8508',
                255 : '#E00051',
            })
        }

        if (this.props.showPolygon && this.state.polygons) {
            this.drawPaths(this.state.polygons, '#445CFB', true)
        }

        if (this.props.showCurve && this.state.curves) {
            this.drawPaths(this.state.curves, '#7ABA3A')
        }

        let endTime = new Date()
        console.log(`Drawing took ${endTime-startTime}ms to complete`)
    }


    drawGrid () {
        const ctx = this.state.context.dest
        const width = this.state.scale
        const img = this.state.image

        let i = 0

        ctx.beginPath()
        ctx.strokeStyle = '#8C8C8C'
        ctx.globalAlpha = 0.5
        ctx.lineWidth = 1

        while (width * i < img.width * width) {
            ctx.moveTo(i * width, 0)
            ctx.lineTo(i * width, img.height * width)
            i++
        }
        i = 0

        while (width * i < img.height * width) {
            ctx.moveTo(0, i * width)
            ctx.lineTo(img.width * width, i * width)
            i++
        }

        ctx.stroke()
        ctx.closePath()
    }


    resetContext (color) {
        if (typeof color === 'string') {
            this.state.context.dest.strokeStyle = color
            this.state.context.dest.fillStyle = color
        } else if (typeof color === 'object') {
            this.state.context.dest.strokeStyle = color[255]
            this.state.context.dest.fillStyle = color[255]
        }
        this.state.context.dest.lineWidth = 2
        this.state.context.dest.globalAlpha = 1
    }


    drawPaths (paths, color, drawVertices) {
        this.resetContext(color)
        const ctx = this.state.context.dest
        const scale = this.state.scale

        for (let path of paths) {

            if (typeof color === 'object') {
                ctx.strokeStyle = color[path.type]
                ctx.fillStyle = color[path.type]
            }
            ctx.beginPath()


            if (path.data[0].x)
                ctx.moveTo(path.data[0].x * scale, path.data[0].y * scale)
            else
                ctx.moveTo(path.data[0].z0.x * scale, path.data[0].z0.y * scale)


            for (let edge of path.data) {

                if (edge.x)
                    ctx.lineTo(edge.x * scale, edge.y * scale)

                else
                    ctx.bezierCurveTo(
                        edge.z1.x * scale, edge.z1.y * scale,
                        edge.z2.x * scale, edge.z2.y * scale,
                        edge.z3.x * scale, edge.z3.y * scale)

            }

            ctx.stroke()
            ctx.closePath()

            if (drawVertices) {
                for (let edge of path.data) {
                    ctx.beginPath()
                    ctx.arc(edge.x * scale, edge.y * scale, 3, 0, 2 * Math.PI, false)
                    ctx.fill()
                    ctx.closePath()
                }
            }

        }
    }


    render () {
        if (this.refs.src) {
            var sizeLabel = <p className='canvas__text'>{this.refs.src.width}px * {this.refs.src.height}px</p>
        }

        return (
            <div>
                <div className={this.props.showSVG ? 'hidden' : 'row'}>
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

                <SVG className={this.props.showSVG ? '' : 'hidden'} curves={this.state.curves} image={this.state.image} />
            </div>
        )
    }

}
