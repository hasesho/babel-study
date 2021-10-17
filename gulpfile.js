const { series, src, dest } = require('gulp');
const babel = require('gulp-babel');
const rename = require('gulp-rename');
const browserify = require('browserify');
const babelify    = require("babelify");
const source     = require('vinyl-source-stream');
const del     = require('del');

function _babel() {
    return src(['src/pdf.js', 'src/pdf.worker.js'])
    .pipe(babel({
        sourceType: 'script',
        presets: [
            ['@babel/preset-env',{
                    "modules": false,
                    "targets": {
                        "ie": "11"
                    }
                }],
			],
            plugins: [
                ["@babel/plugin-transform-runtime", { "corejs":3 }]
            ]            
        }))
        .pipe(rename({
            suffix: '.tmp'
        }))
        .pipe(dest('dist'));
}
function _browserifyPdf() {
    return browserify('dist/pdf.tmp.js')
        // .transform(babelify.configure({
        //     presets: ["es2015"]
        // }))
        .bundle()
        .pipe(source('pdf.js'))
        .pipe(dest('dist'));
}
function _browserifyPdfWorker() {
    return browserify('dist/pdf.worker.tmp.js')
        // .transform(babelify.configure({
        //     presets: ["es2015"]
        // }))
        .bundle()
        .pipe(source('pdf.worker.js'))
        .pipe(dest('dist'));
}
function _copy() {
    return src(['src/index.html', 'src/sample.pdf'])
        .pipe(dest('dist'));
};
function _samplejs() {
    return src(['src/index.js'])
        .pipe(babel({
            presets: [
                ['@babel/preset-env',{
                    "targets": {
                        "ie": "11"
                    }
                }],
			],
            plugins: [
                ["@babel/plugin-transform-runtime", { "corejs":3 }]
            ]            
        }))
        .pipe(dest('dist'));
}

function _clean(cb) {
    return del([
      'dist/*'
    ], cb);
}
  
exports.default = series(_clean, _copy, _samplejs, _babel, _browserifyPdf, _browserifyPdfWorker);
