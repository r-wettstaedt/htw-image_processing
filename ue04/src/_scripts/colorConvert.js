export function grayscale ( pixel ) {

    return parseInt(( pixel.r + pixel.b + pixel.b ) / 3)

}

export function binarize ( pixel, config ) {

    let value = grayscale( pixel )

    if (value > config.threshold) {
        return {
            r : 255,
            g : 255,
            b : 255,
            a : pixel.a,
        }
    }

    return {
        r : 0,
        g : 0,
        b : 0,
        a : pixel.a,
    }

}

export function randomColor () {
    return {
        r : parseInt( Math.random() * 254 + 1 ),
        g : parseInt( Math.random() * 254 + 1 ),
        b : parseInt( Math.random() * 254 + 1 ),
    }
}
