export const direction = {
    up : 0,
    right : 1,
    down : 2,
    left : 3,
}

export class Edge {

    constructor (pos, dir) {
        this.pos = pos
        this.dir = dir
    }

}
