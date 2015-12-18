export const direction = {
    up : 'up',//Symbol('up'),
    right : 'right',//Symbol('right'),
    down : 'down',//Symbol('down'),
    left : 'left',//Symbol('left'),
}

export class Edge {

    constructor (pos, dir, image) {
        this.pos = pos
        this.dir = dir

        if (image) {
            this.x = this.pos % image.width
            this.y = (this.pos - this.x) / image.width
        }
    }

}

export class Vector {

    constructor (x, y) {
        this.x = x
        this.y = y
    }

    static crossProduct(a, b) {
        return a.x * b.y - a.y * b.x
    }

}
