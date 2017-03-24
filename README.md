# gulp-docker-sync

Sync files with a Docker container.

## Install

```
$ npm install --save-dev gulp-docker-sync
```


## Usage

#### gulpfile.js
```js
var gulp = require('gulp');
var gutil = require('gulp-util');
var dockersync = require('gulp-docker-sync');

gulp.task('sync', function () {
	return gulp.src('src/html')
		.pipe(dockersync({
			remotePath: '/var/www/html'
		}));
});
```

#### Run
`gulp sync --verbose`

## API

### dest(options)

#### options.container
Type: `string`  
Required: `true`

Specify the name of the container to sync to

#### options.remotePath
Type: `string`  
Required: `true`  

The remote path to copy to.


## Caveats

This should only be used to sync high level folder structures at the moment. Trying to sync a large amount of files/blobs will be very slow!

## Notes

This was inspired and is an alternative to the [gulp-docker-dest](https://github.com/erikxiv/gulp-docker-dest) repo but instead uses the native `docker cp` command to copy files.

## License

MIT
