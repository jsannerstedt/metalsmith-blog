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
var branch = require('metalsmith-branch');
var excerpts = require('metalsmith-excerpts');
var browserSync = require('browser-sync');



browserSync({
    server     : "build",
    files      : ["src/**/*.md", "templates/**/*.html"],
    middleware : function (req, res, next) {
        build(next);
    }
});


function build(callback) {
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
        .use(excerpts())

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
        .build(function (err) {
            if (err) {
                throw err;
            }
            callback();
        });
}
