/**
 * convert md to json
 */

var marked = require('marked');
var fs = require('fs');

var prefix = process.argv[2] ? process.argv[2] : '';
var renderer = new marked.Renderer();

marked.setOptions({
  highlight: function (code) {
    return require('highlight.js').highlightAuto(code).value;
  }
});

renderer.table = (header, body) => {
	return '<table class="table table-bordered table-striped">' + header + body + '</table>';
}

var inputDoc = 'static/docs_original';
var outputDoc = 'static/docs';
var outputMenu = 'static/menu.json';
var versions = [];

var sortNumber = (a,b) => {
    a = a.replace(prefix, '');
    b = b.replace(prefix, '');
    return a<b?1:(a>b?-1:0)
}

fs.readdir(inputDoc, (err, files) => {
    if(err) throw err;

    files.sort(sortNumber);

    if( files.indexOf('.DS_Store') !== -1 ) {
      files.pop();
    }

    files.forEach( (filename, x) => {
    	if( ! filename.indexOf(prefix) ) {

    		var outputName = filename.replace(prefix, '');
        outputName = outputName.substr(0, outputName.length - 3);

        if ( typeof x == 'number' ) {
          versions[x] = {"v":outputName};
        }

    		outputName = outputName + '.json';

    		fs.readFile(inputDoc + '/' + filename, 'utf8', (err, data) => {

    			var data = marked(data, { renderer: renderer });
          data = data.replace(/&amp;/g,'&');

          var patternH2 = /<h2 id="(.*?)">(.*?)<\/h2>/g;
          var patternH3 = /<h3 id="(.*?)">(.*?)<\/h3>/g;
          var match;
          var num = 0;
          var id = 1;
          var result = {};
          result['menu'] = [];
          while ((match = patternH2.exec(data)) != null) {

            result['menu'][num] = {};
            result['menu'][num]['id'] = id;
            result['menu'][num]['name'] = match[2].replace(/&amp;/g,'&');
            result['menu'][num]['target'] = match[1];
            result['menu'][num]['list'] = [];

            num++;
            id++;
          }

          result['menu'].forEach( (array, m) => {
            var perTag = '<h2 id="' + array['target'] + '">' + array['name'] + '</h2>';
            var tag = '';
            var subData = '';
            
            if( result['menu'].length == (m + 1) ) {
              subData = data.substr(data.indexOf(perTag), data.length - data.indexOf(perTag));
            } else {
              tag = '<h2 id="' + result['menu'][m+1]['target'] + '">' + result['menu'][m+1]['name'] + '</h2>';
              subData = data.substr(data.indexOf(perTag), data.indexOf(tag) - data.indexOf(perTag));
            }

            var n = 0;
            while ((match = patternH3.exec(subData)) != null) {
              result['menu'][m]['list'][n] = {};
              result['menu'][m]['list'][n]['id'] = (m + 1) + '-' + (n + 1);
              result['menu'][m]['list'][n]['name'] = match[2].replace(/&amp;/g,'&');
              result['menu'][m]['list'][n]['target'] = match[1];
              n++;
            }
          });

    			// data = data.replace(/\n/g, '<br>');
          data = data.replace(/"lang-(.*?)"/ig, '"$1" v-highlight');
    			data = data.replace(/"(.*?)"/ig, '\"$1\"');

          result['data'] = data;

    			fs.writeFile(outputDoc + '/' + outputName, JSON.stringify(result, null, '\t'), (err) => {
    			
          })
    		})
    	}
    });

    fs.writeFile(outputMenu, JSON.stringify(versions, null, '\t'), (err) => {
    
    })
});
