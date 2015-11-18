import React, {Component, PropTypes} from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux';
import {changeMethod, changeVisual} from '../../_flux/actions'

import PictureSelect from '../pictureSelect/pictureSelect'

@connect(
    state => ({
        useVisual : state.controls.useVisual,

        showPixels : state.controls.showPixels,
        showPath : state.controls.showPath,
    }),
    dispatch => bindActionCreators({changeMethod, changeVisual}, dispatch))

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

    render () {

        return (
            <div id='controls'>

                <div className='controls-wrapper'>
                    <PictureSelect/>
                </div>

                <div className='row'>

                    <div className='controls-wrapper center-content col-xs-6 col-sm-2'>
                        <label>
                            Visual
                            <input type='checkbox' onChange={this.visualChanged.bind(this)} checked={this.props.useVisual} />
                        </label>
                    </div>

                    <div className='controls-wrapper center-content col-xs-6 col-sm-2'>
                        <label>
                            Show Pixels
                            <input type='checkbox' onChange={this.pixelsChanged.bind(this)} checked={this.props.showPixels} />
                        </label>
                    </div>

                    <div className='controls-wrapper center-content col-xs-6 col-sm-2'>
                        <label>
                            Show Path
                            <input type='checkbox' onChange={this.pathChanged.bind(this)} checked={this.props.showPath} />
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
}
