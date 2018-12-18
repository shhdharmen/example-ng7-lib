var fs = require('fs');
var ncp = require('ncp').ncp;

var source = './projects/example-ng7-lib/src/lib/foo/foo.component.scss';
var destination = './dist/example-ng7-lib/assets/theme.scss';

fs.mkdir('./dist/example-ng7-lib/assets', function (err) {
  if (err) {
    console.error(err);
    process.exit(-1);
  }
  console.log('assets directory created');
  ncp(source, destination, function (err) {
    if (err) {
      console.error(err);
      process.exit(-1);
    }
    console.log('assets-copy done!');
  });
});
