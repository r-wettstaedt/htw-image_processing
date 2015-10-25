import React from 'react'
import dom from 'react-dom'

import Controls from '../_modules/controls/controls'
import Canvas from '../_modules/canvas/canvas'
import {initStore} from '../_flux/store'


let App = React.createClass({
    render: () => {
        return (
            <main>
                <div className='container'>
                    <Controls />
                </div>

                <div className='container'>
                    <Canvas />
                </div>
            </main>
        )
    }
})

initStore()

dom.render(
    <App/>,
    document.getElementById('app')
)
