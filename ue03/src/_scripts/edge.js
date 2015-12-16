export const direction = {
    up : 'up',//Symbol('up'),
    right : 'right',//Symbol('right'),
    down : 'down',//Symbol('down'),
    left : 'left',//Symbol('left'),
}

export class Edge {

    constructor (pos, dir) {
        this.pos = pos
        this.dir = dir
    }

}
