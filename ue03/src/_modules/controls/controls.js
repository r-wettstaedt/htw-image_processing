import React, {Component, PropTypes} from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux';
import {changeVisual, changePixels, changePath, changeZoom} from '../../_flux/actions'

import PictureSelect from '../pictureSelect/pictureSelect'

@connect(
    state => ({
        useVisual : state.controls.useVisual,

        showPixels : state.controls.showPixels,
        showPath : state.controls.showPath,

        zoom : state.controls.zoom,
    }),
    dispatch => bindActionCreators({changeVisual, changePixels, changePath, changeZoom}, dispatch))

export default class Controls extends Component {

    visualChanged (event) {
        this.props.changeVisual(event.target.checked)
    }

    pixelsChanged (event) {
        this.props.changePixels(event.target.checked)
    }

    pathChanged (event) {
        this.props.changePath(event.target.checked)
    }

    zoomChanged (event) {
        this.props.changeZoom(event.target.value)
    }

    render () {

        return (
            <div id='controls'>

                <div className='controls-wrapper'>
                    <PictureSelect/>
                </div>

                <div className='row'>

                    <div className='controls-wrapper center-content col-xs-6 col-sm-3'>
                        <label>
                            Visual
                            <input type='checkbox' onChange={this.visualChanged.bind(this)} checked={this.props.useVisual} />
                        </label>
                    </div>

                    <div className='controls-wrapper center-content col-xs-6 col-sm-3'>
                        <label>
                            Show Pixels
                            <input type='checkbox' onChange={this.pixelsChanged.bind(this)} checked={this.props.showPixels} />
                        </label>
                    </div>

                    <div className='controls-wrapper center-content col-xs-6 col-sm-3'>
                        <label>
                            Show Path
                            <input type='checkbox' onChange={this.pathChanged.bind(this)} checked={this.props.showPath} />
                        </label>
                    </div>

                    <div className='controls-wrapper center-content col-xs-12'>
                        <label>
                            Zoom
                            <input type='range' min='1' max='10' step='0.5' value={this.props.zoom} onChange={this.zoomChanged.bind(this)} />
                            <p className='zoom-label'>
                                {this.props.zoom}%
                            </p>
                        </label>
                    </div>

                </div>

            </div>
        )

    }

}

Controls.propTypes = {
    changeVisual : PropTypes.func,
    changePixels : PropTypes.func,
    changePath : PropTypes.func,
    changeZoom : PropTypes.func,
}
