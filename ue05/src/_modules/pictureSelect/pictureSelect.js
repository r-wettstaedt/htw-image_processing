import React, {Component, PropTypes} from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux';
import {changeActiveImage, addImage} from '../../_flux/actions'


@connect(
    state => ({
        activeImage : state.controls.activeImage,
        images : state.controls.images,
    }),
    dispatch => bindActionCreators({changeActiveImage, addImage}, dispatch))

export default class PictureSelect extends Component {

    clickHandler (event) {
        let id = event.currentTarget.attributes.getNamedItem('data-index').value
        id = parseInt(id)
        this.props.changeActiveImage(id)
    }

    imageChoosen (event) {
        const reader = new FileReader()
        reader.onload = data => {
            this.props.addImage(data.target.result)
        }
        reader.readAsDataURL(event.target.files[0])
    }

    render () {
        return (
            <div className='picture-select'>

                {
                    this.props.images.map( (image, index) => {
                        return (
                            <figure className={this.props.activeImage == index ? 'picture-select__image-wrapper active' : 'picture-select__image-wrapper'} onClick={this.clickHandler.bind(this)} data-index={index} key={index}>
                                <img className='picture-select__image' src={image} />
                            </figure>
                        )
                    })
                }

                <div className='picture-select__image-wrapper picture-select__image-wrapper--upload'>
                    <label htmlFor='input-file'>
                        <i className='glyphicon glyphicon-floppy-open'/>
                    </label>
                    <input id='input-file' className='hide' type='file' accept='.jpg' onChange={this.imageChoosen.bind(this)} />
                </div>

            </div>
        )
    }

}

PictureSelect.propTypes = {
    changeActiveImage : PropTypes.func,
    addImage : PropTypes.func,
}

