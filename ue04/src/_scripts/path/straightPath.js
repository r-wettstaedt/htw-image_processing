import {Vector} from '../edge'

export default function (paths) {

    let straightPaths = []

    for (let path of paths) {
        // let path = paths[0]
        let i = 0
        let straightPath = []

        for (let edge of path) {
            let c0 = new Vector(0, 0)
            let c1 = new Vector(0, 0)

            let directions = 0
            let v_i = new Vector(path[i].x, path[i].y)
            let k

            for (let kk = i + 1; kk < path.length; kk++) {
                k = kk % path.length

                if (path[k].dir !== path[k - 1].dir)
                    directions++

                if (directions > 3) break

                let v_k = new Vector(path[k].x, path[k].y)
                let v = new Vector(v_k.x - v_i.x, v_k.y - v_i.y)

                let cp0 = Vector.crossProduct(c0, v)
                let cp1 = Vector.crossProduct(c1, v)

                if (cp0 < 0 || cp1 > 0) {
                    // console.log("msg")
                    break
                }

                updateConstraints(v, c0, c1)
            }

            if (path[k])
                straightPath.push(path[k])

            i++
        }
        straightPaths.push(straightPath)

    }

    return new Promise(function (resolve) {
        resolve(straightPaths)
    })

}


function updateConstraints (v, c0, c1) {
    if (Math.abs(v.x) <= 1 && Math.abs(v.y) <= 1)
        return

    /* c0 */
    let d = new Vector()

    if (v.y >= 0 && (v.y > 0 || v.x < 0))
        d.x = v.x + 1
    else
        d.x = v.x - 1


    if (v.x <= 0 && (v.x < 0 || v.y < 0))
        d.y = v.y + 1
    else
        d.y = v.y - 1


    if (Vector.crossProduct(c0, d) >= 0) {
        c0.x = d.x
        c0.y = d.y
    }


    /* c1 */
    d = new Vector()

    if (v.y <= 0 && (v.y < 0 || v.x < 0))
        d.x = v.x + 1
    else
        d.x = v.x - 1


    if (v.x >= 0 && (v.x > 0 || v.y < 0))
        d.y = v.y + 1
    else
        d.y = v.y - 1


    if (Vector.crossProduct(c1, d) <= 0) {
        c1.x = d.x
        c1.y = d.y
    }


}






