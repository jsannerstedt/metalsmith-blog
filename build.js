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

Metalsmith(__dirname)
    .use(staticFiles({src: 'public', dest: ''}))
    .use(concat({files: 'public/style/**/*.css', output: 'style/main.css'}))
    .use(collections({
        articles: {
            pattern: 'articles/**.md',
            sortBy: 'date',
            reverse: true
        }
    }))
    .use(markdown())
    .use(permalinks({pattern: ':title'}))
    .use(template({engine: 'handlebars'}))
    .use(serve({
        port: 8080,
        verbose: true
    }))
    .use(watch({
        paths: {
            "${source}/**/*": true, // every changed files will trigger a rebuild of themselves
            "templates/**/*": "**/*" // every templates changed will trigger a rebuild of all files
        },
        livereload: true
    }))
    .build(function (err) {
        if (err) {
            throw err;
        }
    });