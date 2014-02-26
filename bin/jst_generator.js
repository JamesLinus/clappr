// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

var glob = require('glob').sync;
var path = require('path');
var fs = require('fs');
var _ = require('underscore');

var codeTemplate = _.template("//This file is generated by bin/jst_generator.js\n" +
  "var _ = require('underscore');\n" +
  "module.exports = { " +
  "<% _.each(templates, function(template) { %>" +
  "'<%= template.name %>': _.template('<%= template.content %>')," +
  "<% }); %>" +
  "CSS: {" +
    "<% _.each(styles, function(style) { %>" +
      "'<%= style.name %>': '<%= style.content %>'," +
    "<% }); %>" +
  "}" +
"};");

var jstFile = 'src/base/jst.js';

function format(filePath) {
  var expression = path.dirname(filePath) + '/../' + path.basename(filePath);
  var name = path.basename(path.dirname(path.resolve(expression)));
  var content = fs.readFileSync(filePath).toString().replace(/\r?\n|\r/g, '');
  return {name: name, content: content};
}

pluginsTemplates = _(glob('src/plugins/**/*.html')).map(format);
templates = pluginsTemplates.concat(_(glob('src/components/**/*.html')).map(format));
pluginsStyles = _(glob('src/plugins/**/*.css')).map(format);
styles = pluginsStyles.concat(_(glob('src/components/**/*.css')).map(format));

fs.writeFileSync(jstFile, codeTemplate({templates: templates, styles: styles}));