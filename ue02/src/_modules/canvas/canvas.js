import React, {Component, PropTypes} from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux';
import {store} from '../../_flux/store'

let Worker = require('worker!../../_scripts/worker')

@connect(
    state => ({
        activeImage : state.controls.activeImage,
        images : state.controls.images,
        activeMethod : state.controls.activeMethod,
        methods : state.controls.methods,
        useVisual : state.controls.useVisual,
        speedtest : state.controls.speedtest,
    })
)

export default class Canvas extends Component {

    componentDidMount () {
        this.setState({
            context : {
                src : this.refs.src.getContext('2d'),
                dest : this.refs.dest.getContext('2d'),
                tmp :  this.refs.tmp.getContext('2d'),
            }
        })
        this.drawCanvas.bind(this)()
        store.subscribe( () => {
            setTimeout(this.drawCanvas.bind(this))
        })
    }

    drawCanvas () {
        this.drawSrc().then( image => {
            this.drawDest.bind(this)(image)
            this.forceUpdate()
        })
    }

    drawSrc () {
        let imageData = this.props.images[this.props.activeImage]

        let image = new Image()
        image.src = imageData

        return new Promise( resolve => {
            image.onload = () => {
                this.refs.src.width = image.width
                this.refs.src.height = image.height
                this.state.context.src.drawImage(image, 0, 0)
                resolve(image)
            }
        })
    }

    drawDest (image) {
        if (this.worker)
            this.worker.terminate()

        let pixels = this.state.context.src.getImageData( 0, 0, image.width, image.height ).data

        this.worker = new Worker()
        this.worker.postMessage({
            pixels : pixels,
            config : {
                activeMethod : this.props.activeMethod,
                methods : this.props.methods,
                useVisual : this.props.useVisual,
                speedtest : this.props.speedtest,
            },
            image: {
                height : image.height,
                width : image.width,
            }
        })

        this.refs.dest.width = image.width
        this.refs.dest.height = image.height
        this.refs.tmp.width = image.width
        this.refs.tmp.height = image.height

        let context = this
        this.worker.onmessage = event => {
            let imageData = new ImageData( event.data.pixels, image.width, image.height )

            if (event.data.tmp) {
                return context.state.context.tmp.putImageData( imageData, 0, 0 )
            }
            context.state.context.dest.putImageData( imageData, 0, 0 )
        }
    }

    render () {
        if (this.refs.src) {
            var sizeLabel = <p className='canvas__text'>{this.refs.src.height}px * {this.refs.src.width}px</p>
        }

        let canvasClassName = 'canvas col-xs-12 col-lg-6'
        let tmpClassName = canvasClassName
        if (this.props.activeMethod !== 'sr') {
            canvasClassName = 'canvas col-xs-12 col-lg-12'
            tmpClassName += `${canvasClassName} hidden`
        }

        return (
            <div className='row'>
                <div className='canvas hidden'>
                    <canvas className='canvas__canvas' ref='src' id='src' />
                    {sizeLabel}
                </div>

                <div className={tmpClassName}>
                    <canvas className='canvas__canvas' ref='tmp' id='tmp' />
                    {sizeLabel}
                </div>

                <div className={canvasClassName}>
                    <canvas className='canvas__canvas' ref='dest' id='dest' />
                    {sizeLabel}
                </div>
            </div>
        )
    }

}
