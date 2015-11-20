export const direction = {
    up : Symbol('up'),
    right : Symbol('right'),
    down : Symbol('down'),
    left : Symbol('left'),
}

export class Edge {

    constructor (pos, dir) {
        this.pos = pos
        this.dir = dir
    }

}
