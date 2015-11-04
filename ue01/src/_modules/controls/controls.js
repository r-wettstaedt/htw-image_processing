import React, {Component, PropTypes} from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux';
import {changeOutline, changeMethod, changeThreshold} from '../../_flux/actions'

import PictureSelect from '../pictureSelect/pictureSelect'

@connect(
    state => ({
        useOutline : state.controls.useOutline,
        useISOData : state.controls.useISOData,
        threshold : state.controls.threshold,
    }),
    dispatch => bindActionCreators({changeOutline, changeMethod, changeThreshold}, dispatch))

export default class Controls extends Component {

    outlineChanged (event) {
        this.props.changeOutline(event.target.checked)
    }

    methodChanged (event) {
        this.props.changeMethod(event.target.checked)
    }

    thresholdChanged (event) {
        this.props.changeThreshold(event.target.value)
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
                            Outline
                            <input type='checkbox' onChange={this.outlineChanged.bind(this)} checked={this.props.useOutline}/>
                        </label>
                    </div>

                    <div className='controls-wrapper center-content col-xs-6 col-sm-2'>
                        <label>
                            IsoData
                            <input type='checkbox' onChange={this.methodChanged.bind(this)} checked={this.props.useISOData}/>
                        </label>
                    </div>

                    <div className='controls-wrapper center-content col-xs-9 col-sm-6'>
                        <input id='input-slider' type='range' min='0' max='255' value={this.props.threshold} onChange={this.thresholdChanged.bind(this)} disabled={this.props.useISOData} />
                    </div>


                    <div className='controls-wrapper center-content col-xs-3 col-sm-2'>
                        <input id='controls-threshold' readOnly type='text' value={this.props.threshold} />
                    </div>

                </div>

            </div>
        )

    }

}

Controls.propTypes = {
    changeOutline : PropTypes.func,
    changeMethod : PropTypes.func,
    changeThreshold : PropTypes.func,
}
