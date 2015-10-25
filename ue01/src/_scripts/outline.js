const kernel = [0, 1, 0,
                1, 1, 1,
                0, 1, 0]

function erode(pixels, index, image) {

    let filterPixels = [
        pixels[index - 4 - (image.width * 4)],
        pixels[index - (image.width * 4)],
        pixels[index + 4 - (image.width * 4)],
        pixels[index - 4], pixels[index], pixels[index + 4],
        pixels[index - 4 + (image.width * 4)],
        pixels[index + (image.width * 4)],
        pixels[index + 4 + (image.width * 4)]
    ]

    for (let i = 0; i < kernel.length; i++) {
        let k = kernel[i]
        let p = filterPixels[i]

        if (!k) continue

        if (p !== 0) {
            return false
        }
    }

    return true

}

export default function(pixels, image) {

    let newPixels = new Uint8ClampedArray(pixels.length)

    for (let i = 0; i < pixels.length; i++) {
        let keepPixel = erode(pixels, i, image)
        let pixel = pixels[i]

        newPixels[i] = pixel === 0 && keepPixel ? 255 : pixel
        newPixels[++i] = pixel === 0 && keepPixel ? 255 : pixel
        newPixels[++i] = pixel === 0 && keepPixel ? 255 : pixel
        newPixels[++i] = 255
    }
    return newPixels

}
