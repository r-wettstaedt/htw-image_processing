import React from 'react'

import {store} from '../../_flux/store'
import {addImage, changeActiveImage} from '../../_flux/actions'

export default React.createClass({

    getInitialState : function() {
        let state = store.getState().controls
        return {
            images : state.images,
            selectedImage : state.activeImage
        }
    },

    componentDidMount : function() {
        store.subscribe(() => {
            let state = store.getState().controls
            this.setState({
                images : state.images,
                selectedImage : state.activeImage
            })
        })
    },

    clickHandler : function(event) {
        let id = event.currentTarget.dataset.reactid
        id = parseInt(id.slice(id.length - 1))
        this.setState({selectedImage: id})

        store.dispatch(changeActiveImage(id))
    },

    imageChoosen : function (event) {
        const reader = new FileReader()
        reader.onload = function(data) {
            store.dispatch(addImage( data.target.result ))
        }
        reader.readAsDataURL(event.target.files[0])
    },

    render : function() {
        return (
            <div className='picture-select'>

                {
                    this.state.images.map( (image, index) => {
                        return (
                            <figure className={this.state.selectedImage == index ? 'picture-select__image-wrapper active' : 'picture-select__image-wrapper'} onClick={this.clickHandler} key={index}>
                                <img className='picture-select__image' src={image} />
                            </figure>
                        )
                    })
                }

                <div className='picture-select__image-wrapper picture-select__image-wrapper--upload'>
                    <label htmlFor='input-file'>
                        <i className='glyphicon glyphicon-floppy-open'/>
                    </label>
                    <input id='input-file' className='hide' type='file' accept='.jpg' onChange={this.imageChoosen} />
                </div>

            </div>
        )
    }

})
