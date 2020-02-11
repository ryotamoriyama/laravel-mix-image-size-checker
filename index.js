const mix = require('laravel-mix')
const fs = require('fs-extra')
const glob = require('glob')
const imageSize = require('image-size')

const defaultOptions = {
    maxSize: 300000,
    maxWidth: 1600,
    onErrorProcessExit: true
    //srcPattern: 'resources/images/**/*'
}

class ImageSizeChecker {
    register(extraOptions = {}) {
        const options = Object.assign(defaultOptions, extraOptions)
        let result = {
            size: [],
            width: []
        }
        let size
        let width
        const images = glob.sync(options.srcPattern).forEach((path) => {
            if (path.match(/\.(jpe?g|png|gif)$/i) == false) {
                return
            }
            if ((size = fs.statSync(path).size) > options.maxSize) {
                result.size.push({
                    path: path,
                    size: size
                })
            } else if ((width = imageSize(path).width) > options.maxWidth) {
                result.width.push({
                    path: path,
                    size: width
                })
            }
        })
        try {
            if (result.size.length > 0 || result.width.length > 0) {
                result.size.sort(sizeSort)
                result.width.sort(sizeSort)
                throw new Error("Max size is " + options.maxSize + "B. Max width is " + options.maxWidth + "px")
            }
        } catch (e) {
            console.error(result)
            if (options.onErrorProcessExit) {
                console.error(e)
                process.exit()
            }
        }
    }
}

function sizeSort(a, b) {
    if (a.size < b.size) {
        return 1
    } else {
        return -1
    }
}

mix.extend('ImageSizeChecker', new ImageSizeChecker())