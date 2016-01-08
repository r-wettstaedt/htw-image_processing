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

    norm () {
        return Math.sqrt( Math.pow(this.x, 2) + Math.pow(this.y, 2) )
    }

    normalize () {
        let length = this.norm()
        return new Vector(this.x / length, this.y / length)
    }

    static scalarProduct (a, b) {
        return a.x * b.x + a.y * b.y
    }

    static crossProduct (a, b) {
        return a.x * b.y - a.y * b.x
    }

}


export class Bezier {

    constructor (z0, z1, z2, z3, corner) {
        this.z0 = z0
        this.z1 = z1
        this.z2 = z2
        this.z3 = z3
        this.corner = corner
    }

}
