/**
 * Created by joel on 2015-06-17.
 */
'use strict';

var Metalsmith = require('metalsmith');
var concat = require('metalsmith-concat');
var staticFiles = require('metalsmith-static');
var markdown = require('metalsmith-markdown');
var permalinks = require('metalsmith-permalinks');
var template = require('metalsmith-templates');
var collections = require('metalsmith-collections');
var watch = require('metalsmith-watch');
var serve = require('metalsmith-serve');
var branch = require('metalsmith-branch');

Metalsmith(__dirname)
    .use(collections({
        posts: {
            pattern: 'posts/**.md',
            sortBy: 'date',
            reverse: true
        },
        nav: {}
    }))
    .use(markdown())
    .use(branch('pages/**.html')
        .use(permalinks({
            pattern: "./:title",
            relative: false
        })))
    .use(branch('posts/**.html')
        .use(permalinks({
            pattern: 'posts/:title'
        })))
    .use(staticFiles({src: 'public', dest: ''}))
    .use(concat({files: 'public/style/**/*.css', output: 'style/main.css'}))
    .use(template('swig'))
    .use(serve())
    //.use(watch({
    //    paths: {
    //        //"${source}/**/*": true, // every changed files will trigger a rebuild of themselves
    //        "templates/**/*": "**/*" // every templates changed will trigger a rebuild of all files
    //    },
    //    livereload: true
    //}))
    .build(function (err) {
        if (err) {
            throw err;
        }
    });