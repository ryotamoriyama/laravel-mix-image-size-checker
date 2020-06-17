const mix = require('laravel-mix')
const fs = require('fs-extra')
const glob = require('glob')
const imageSize = require('image-size')

const defaultOptions = {
    maxSize: 500000,
    maxWidth: 2560,
    onErrorProcessExit: false,
    srcPattern: 'resources'
}

class ImageSizeChecker {
    register(extraOptions = {}) {
        const {
            srcPattern,
            maxSize,
            maxWidth,
            forceResize,
            onErrorProcessExit
        } = Object.assign(defaultOptions, extraOptions)
        let errRes = {}
        glob.sync(srcPattern).forEach((imagePath) => {
            if (imagePath.match(/\.(jpe?g|png|gif)$/i) === null) {
                return
            }

            let size = fs.statSync(imagePath).size
            if (size > maxSize) {
                errRes[imagePath] = {}
                errRes[imagePath]['size'] = (size >= 1024 * 1024) ? Math.floor(size / (1024 * 1024)) + 'MB' : Math.floor(size / 1024) + 'KB';
            }

            let width = imageSize(imagePath).width
            if (width > maxWidth) {
                if (!errRes[imagePath]) errRes[imagePath] = {}
                errRes[imagePath]["width"] = width + 'px';
            }
        })

        try {
            if (Object.keys(errRes).length > 0) {
                throw new Error("Max size is " + maxSize + "B. Max width is " + maxWidth + "px")
            }
        } catch (e) {
            console.log("Over Size Images");
            console.error(errRes)
            if (onErrorProcessExit) {
                console.error(e)
                process.exit()
            }
        }
    }
}

mix.extend('ImageSizeChecker', new ImageSizeChecker())