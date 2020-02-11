# Laravel Mix Image Size Checker

This extention provides a method to checking images size and width.

## Usage

First, install the extension.

```
npm install laravel-mix-image-size-checker --save-dev
```

Then, add `imageSizeChecker` function on `webpack.mix.js`, and set `srcPattern` is required. like so:

```js
let mix = require('laravel-mix')

require('laravel-mix-image-size-checker')

mix
  .ImageSizeChecker({
    maxSize: 300000,
    maxWidth: 1600,
    onErrorProcessExit: true,
    srcPattern: 'resources/images/**/*'
  })
```

And you're done!