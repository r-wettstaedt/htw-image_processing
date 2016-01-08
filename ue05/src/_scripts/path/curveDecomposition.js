import {Vector, Bezier} from '../edge'
import straightPath from './straightPath'

export default function (polygons, config) {

    let curves = []

    for (let polygon of polygons) {
        polygon.pop()
        let curve = []

        for (let i = 0; i < polygon.length; i++) {

            let p_i = i % polygon.length

            let a_m_1   = polygon[p_i]
            let a       = polygon[(p_i + 1) % polygon.length]
            let a_p_1   = polygon[(p_i + 2) % polygon.length]

            let b_m_1   = new Vector((a.x + a_m_1.x) / 2, (a.y + a_m_1.y) / 2)
            let b       = new Vector((a.x + a_p_1.x) / 2, (a.y + a_p_1.y) / 2)

            let s_hat = new Vector(b.y - b_m_1.y, -(b.x - b_m_1.x))
            let s = s_hat.normalize()

            let d = Math.abs( Vector.scalarProduct(s, new Vector(a.x - b.x, a.y - b.y)) )

            let alpha = 4 / 3 * ((d - 0.5) / d)
            alpha = Math.max(alpha, 0.55)
            if (alpha >= 1) console.warn("oho")

            let a_b_m_1 = new Vector(a.x - b_m_1.x, a.y - b_m_1.y)
            let a_b     = new Vector(a.x - b.x, a.y - b.y)

            let z1 = new Vector(b_m_1.x + (a_b_m_1.x * alpha), b_m_1.y + (a_b_m_1.y * alpha))
            let z2 = new Vector(b.x + (a_b.x * alpha)        , b.y + (a_b.y * alpha))

            let bez = new Bezier(b_m_1, z1, z2, b)
            curve.push(bez)

        }

        curves.push(curve)
    }

    return new Promise(function (resolve) {
        resolve(curves)
    })

}
