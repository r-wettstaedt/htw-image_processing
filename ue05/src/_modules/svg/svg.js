import React, {Component, PropTypes} from 'react'

export default class SVG extends Component {

    render () {
        let el = <div />
        if (this.props.curves) {
            let viewBox = `0 0 ${this.props.image.width} ${this.props.image.height}`
            el = (
            <svg width='100%' height='100%' viewBox={viewBox}>
                {
                    this.props.curves.map( (curve, index) => {
                        let d = `M ${curve[0].z0.x} ${curve[0].z0.y}`
                        for (let bezier of curve) {
                            d += ` C ${bezier.z1.x} ${bezier.z1.y} ${bezier.z2.x} ${bezier.z2.y} ${bezier.z3.x} ${bezier.z3.y} `
                        }
                        return <path fill={index < this.props.concatCount ? '#7ABA3A' : '#FDB50D'} d={d} key={index}></path>
                    })
                }
            </svg>
            )

        }

        return el
    }

}
