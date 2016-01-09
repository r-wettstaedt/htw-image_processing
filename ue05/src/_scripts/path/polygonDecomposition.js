import {Vector} from '../edge'
import straightPath from './straightPath'

export default function (paths, config, notify) {

    let polygons = []

    for (let path of paths) {

        let i = 0
        let polygon = [new Vector(path.data[i + 1].x, path.data[i + 1].y)]

        while (true) {

            let j = straightPath(i, path.data)
            j = --j < 0 ? path.data.length + j : j

            if (j < i) {
                polygon.push(new Vector(path.data[1].x, path.data[1].y))
                break
            }

            polygon.push(new Vector(path.data[j].x, path.data[j].y))

            if (config.useVisual) {
                let tmp1 = polygons.slice(0)
                tmp1.push(polygon)
                notify(tmp1)
            }

            i = --j

        }

        polygons.push({
            data : polygon,
            type : path.type,
        })
        if (config.useVisual) {
            notify(polygons)
        }

    }


    return new Promise(function (resolve) {
        resolve(polygons)
    })

}
