import React from 'react'

import PictureSelect from '../pictureSelect/pictureSelect'

import {store} from '../../_flux/store'
import * as actions from '../../_flux/actions'

export default React.createClass({

    componentDidMount : function() {
        store.subscribe(() => {
            let state = store.getState().controls
            this.refs['controls-threshold'].value = state.threshold
            this.forceUpdate()
        })
    },

    outlineChanged : function (event) {
        store.dispatch(actions.changeOutline( event.target.checked ))
    },

    methodChanged : function (event) {
        store.dispatch(actions.changeMethod( event.target.checked ))
    },

    thresholdChanged : function (event) {
        store.dispatch(actions.changeThreshold( event.target.value ))
    },

    render : function() {

        return (
            <div id='controls'>

                <div className='controls-wrapper'>
                    <PictureSelect/>
                </div>

                <div className='row'>

                    <div className='controls-wrapper center-content col-xs-6 col-sm-2'>
                        <label>
                            Outline
                            <input type='checkbox' onChange={this.outlineChanged} checked={store.getState().controls.useOutline}/>
                        </label>
                    </div>

                    <div className='controls-wrapper center-content col-xs-6 col-sm-2'>
                        <label>
                            IsoData
                            <input type='checkbox' onChange={this.methodChanged} checked={store.getState().controls.useISOData}/>
                        </label>
                    </div>

                    <div className='controls-wrapper center-content col-xs-9 col-sm-6'>
                        <input id='input-slider' type='range' min='0' max='255' value={store.getState().controls.threshold} onChange={this.thresholdChanged} disabled={store.getState().controls.useISOData} />
                    </div>


                    <div className='controls-wrapper center-content col-xs-3 col-sm-2'>
                        <input id='controls-threshold' readOnly ref='controls-threshold' type='text' value={store.getState().controls.threshold} />
                    </div>

                </div>

            </div>
        )

    }

})
