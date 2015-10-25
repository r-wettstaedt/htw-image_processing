import React from 'react'

import {store} from '../../_flux/store'
import {changeThreshold} from '../../_flux/actions'

let Worker = require('worker!../../_scripts/worker')

export default React.createClass({

    getInitialState : function() {
        this.drawSrc().then(this.drawDest)
        return {
            context : null
        }
    },

    componentDidMount : function() {
        store.subscribe( () => {
            this.drawSrc().then(this.drawDest)
        })
        this.setState({
            context : {
                src : this.refs.src.getContext('2d'),
                dest : this.refs.dest.getContext('2d')
            }
        })
    },

    drawSrc : function() {
        let state = store.getState().controls
        let imageData = state.images[state.activeImage]

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
    },

    drawDest : function( image ) {
        let state = store.getState().controls
        if (this.worker)
            this.worker.terminate()
        if (state.thresholdByISOData)
            return

        let pixels = this.state.context.src.getImageData( 0, 0, image.width, image.height ).data

        this.worker = new Worker()
        this.worker.postMessage({
            pixels : pixels,
            config : state,
            image: {
                height : image.height,
                width : image.width,
            }
        })

        this.refs.dest.width = image.width
        this.refs.dest.height = image.height
        let self = this
        this.worker.onmessage = e => {
            let imageData = new ImageData( e.data.pixels, image.width, image.height )
            self.state.context.dest.putImageData( imageData, 0, 0 )

            if (state.useISOData)
                store.dispatch(changeThreshold(e.data.threshold))
        }
    },

    render : function () {
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

})
