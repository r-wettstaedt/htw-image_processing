import {Vector} from '../edge'
import straightPath from './straightPath'

export default function (paths, config, notify) {

    let polygons = []

    for (let path of paths) {

        let i = 0
        let polygon = [new Vector(path[i + 1].x, path[i + 1].y)]

        while (true) {

            let j = straightPath(i, path)
            j = --j < 0 ? path.length + j : j

            if (j < i) {
                polygon.push(new Vector(path[1].x, path[1].y))
                break
            }

            polygon.push(new Vector(path[j].x, path[j].y))

            if (config.useVisual) {
                let tmp1 = polygons.slice(0)
                tmp1.push(polygon)
                notify(tmp1)
            }

            i = --j

        }

        polygons.push(polygon)
        if (config.useVisual) {
            notify(polygons)
        }

    }


    return new Promise(function (resolve) {
        resolve(polygons)
    })

}
