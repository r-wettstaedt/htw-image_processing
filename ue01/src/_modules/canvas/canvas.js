import React, {Component, PropTypes} from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux';
import {changeThreshold} from '../../_flux/actions'
import {store} from '../../_flux/store'

let Worker = require('worker!../../_scripts/worker')

@connect(
    state => ({
        activeImage : state.controls.activeImage,
        images : state.controls.images,
        threshold : state.controls.threshold,
        thresholdByISOData : state.controls.thresholdByISOData,
        useISOData : state.controls.useISOData,
        useOutline : state.controls.useOutline,
    }),
    dispatch => bindActionCreators({changeThreshold}, dispatch))

export default class Canvas extends Component {

    componentDidMount () {
        this.setState({
            context : {
                src : this.refs.src.getContext('2d'),
                dest : this.refs.dest.getContext('2d')
            }
        })
        this.drawSrc().then(this.drawDest.bind(this))
        store.subscribe( () => {
            setTimeout( () => {
                this.drawSrc().then(this.drawDest.bind(this))
            })
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

        if (this.props.thresholdByISOData)
            return

        let pixels = this.state.context.src.getImageData( 0, 0, image.width, image.height ).data

        this.worker = new Worker()
        this.worker.postMessage({
            pixels : pixels,
            config : {
                threshold : this.props.threshold,
                useISOData : this.props.useISOData,
                useOutline : this.props.useOutline,
            },
            image: {
                height : image.height,
                width : image.width,
            }
        })

        this.refs.dest.width = image.width
        this.refs.dest.height = image.height
        let context = this
        this.worker.onmessage = e => {
            let imageData = new ImageData( e.data.pixels, image.width, image.height )
            context.state.context.dest.putImageData( imageData, 0, 0 )

            if (context.props.useISOData)
                context.props.changeThreshold(e.data.threshold)
        }
    }

    render () {
        return (
            <div className='row'>
                <div className='col-xs-12 col-sm-6'>
                    <canvas ref='src' id='src' />
                </div>

                <div className='col-xs-12 col-sm-6'>
                    <canvas ref='dest' id='dest' />
                </div>
            </div>
        )
    }

}

Canvas.propTypes = {
    changeThreshold : PropTypes.func,
}
