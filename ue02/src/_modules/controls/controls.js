import React, {Component, PropTypes} from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux';
import {changeMethod, changeVisual} from '../../_flux/actions'

import PictureSelect from '../pictureSelect/pictureSelect'

@connect(
    state => ({
        activeMethod : state.controls.activeMethod,
        methods : state.controls.methods,
        useVisual : state.controls.useVisual
    }),
    dispatch => bindActionCreators({changeMethod, changeVisual}, dispatch))

export default class Controls extends Component {

    methodChanged (event) {
        this.props.changeMethod(event.target.value)
    }

    visualChanged (event) {
        this.props.changeVisual(event.target.checked)
    }

    render () {

        return (
            <div id='controls'>

                <div className='controls-wrapper'>
                    <PictureSelect/>
                </div>

                <div className='row'>

                    <div className='controls-wrapper center-content col-xs-6 col-sm-6'>
                        <label>
                            Method
                            <select onChange={this.methodChanged.bind(this)} value={this.props.activeMethod}>

                                {
                                    Object.keys(this.props.methods).map( (method, index ) => {
                                        return (
                                            <option value={this.props.methods[method].short} key={index}>
                                                {this.props.methods[method].name}
                                            </option>
                                        )
                                    })
                                }

                            </select>
                        </label>
                    </div>

                    <div className='controls-wrapper center-content col-xs-6 col-sm-6'>
                        <label>
                            Visual
                            <input type='checkbox' onChange={this.visualChanged.bind(this)} checked={this.props.useVisual} disabled={this.props.activeMethod === 'sr'} />
                        </label>
                    </div>

                </div>

            </div>
        )

    }

}

Controls.propTypes = {
    changeMethod : PropTypes.func,
    changeVisual : PropTypes.func,
}
