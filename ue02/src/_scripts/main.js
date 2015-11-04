import React from 'react'
import dom from 'react-dom'

import { Provider } from 'react-redux'
import Controls from '../_modules/controls/controls'
import Canvas from '../_modules/canvas/canvas'
import {initStore, store} from '../_flux/store'


let App = React.createClass({
    render: () => {
        return (
            <Provider store={store}>
                <main>
                    <div className='container'>
                        <Controls />
                    </div>

                    <div className='container'>
                        <Canvas />
                    </div>
                </main>
            </Provider>
        )
    }
})

initStore()

dom.render(
    <App/>,
    document.getElementById('app')
)
