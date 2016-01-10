import React, {Component, PropTypes} from 'react'

export default class SVG extends Component {

    render () {
        let el = <div />

        if (this.props.curves) {
            let viewBox = `0 0 ${this.props.image.width} ${this.props.image.height}`
            el = (
            <svg xmlns='http://www.w3.org/2000/svg' className={this.props.className} width='100%' height='100%' viewBox={viewBox}>
                {this.props.curves.map( (curve, index) => {

                    let d = 'M '

                    if (curve.data[0].x)
                        d += `${curve.data[0].x} ${curve.data[0].y} `

                    else
                        d += `${curve.data[0].z0.x} ${curve.data[0].z0.y} `

                    for (let bezier of curve.data) {
                        if (bezier.x)
                            d += `L ${bezier.x} ${bezier.y} `

                        else
                            d += `C ${bezier.z1.x} ${bezier.z1.y} ${bezier.z2.x} ${bezier.z2.y} ${bezier.z3.x} ${bezier.z3.y} `
                    }
                    return <path fill={curve.type === 0 ? '#fff' : '#000'} d={d} key={index}></path>
                })}
            </svg>
            )
        }

        return el
    }

}
