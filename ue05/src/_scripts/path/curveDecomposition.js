import {Vector, Bezier} from '../edge'
import straightPath from './straightPath'

export default function (polygons, config) {

    let curves = []

    for (let polygon of polygons) {
        polygon.data.pop()
        let curve = []

        for (let i = 0; i < polygon.data.length; i++) {

            let p_i = i % polygon.data.length

            let a_m_1   = polygon.data[p_i]
            let a       = polygon.data[(p_i + 1) % polygon.data.length]
            let a_p_1   = polygon.data[(p_i + 2) % polygon.data.length]

            let b_m_1   = new Vector((a.x + a_m_1.x) / 2, (a.y + a_m_1.y) / 2)
            let b       = new Vector((a.x + a_p_1.x) / 2, (a.y + a_p_1.y) / 2)

            let s_hat = new Vector(b.y - b_m_1.y, -(b.x - b_m_1.x))
            let s = s_hat.normalize()

            let d = Math.abs( Vector.scalarProduct(s, new Vector(a.x - b.x, a.y - b.y)) )

            let alpha = 4 / 3 * ((d - 0.5) / d)
            alpha = Math.max(alpha, 0.55)
            let path

            if (alpha < 1) {
                let a_b_m_1 = new Vector(a.x - b_m_1.x, a.y - b_m_1.y)
                let a_b     = new Vector(a.x - b.x, a.y - b.y)

                let z1 = new Vector(b_m_1.x + (a_b_m_1.x * alpha), b_m_1.y + (a_b_m_1.y * alpha))
                let z2 = new Vector(b.x + (a_b.x * alpha)        , b.y + (a_b.y * alpha))

                path = new Bezier(b_m_1, z1, z2, b)
            } else {
                path = a
            }

            curve.push(path)

        }

        curves.push({
            data : curve,
            type : polygon.type,
        })
    }

    return new Promise(function (resolve) {
        resolve(curves)
    })

}
