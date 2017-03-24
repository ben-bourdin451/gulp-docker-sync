var path = require('path');
var gutil = require('gulp-util');
var through = require('through2');
var plur = require('plur');
var exec = require('child_process').exec;

function copy(container, localPath, containerPath, callback) {
	if (process.argv.indexOf('--verbose') !== -1) {
		gutil.log('gulp-docker-sync:', 'copy [' + localPath + '] to [' + container + ':' + containerPath + ']');
	}
	exec('docker cp ' + localPath + ' ' + container + ':' + containerPath, callback);
};

module.exports = {
	cp: copy,
	dest: (options = {}) => {
		options.verbose = process.argv.indexOf('--verbose') !== -1;

		if (options.container === undefined) {
			throw new gutil.PluginError('gulp-docker-sync', '`container` required');
		}
		if (options.remotePath === undefined) {
			throw new gutil.PluginError('gulp-docker-sync', '`remotePath` required');
		}

		let dirCount = 0;
		let fileCount = 0;
		let stream = through.obj((file, enc, callback) => {
			if (file.isStream()) {
				throw new gutil.PluginError('gulp-docker-sync', 'Streaming not supported');
			}

			let finalRemotePath = path.join(options.remotePath, file.relative).replace(/\\/g, '/');
			
			// remove name from remote path when syncing dirs
			if (file.isDirectory()) {
				finalRemotePath = finalRemotePath.substr(0, finalRemotePath.lastIndexOf('/') + 1);
			}
			
			copy(options.container, file.path, finalRemotePath, (err) => {
				if (err) {
					throw new gutil.PluginError('gulp-docker-sync', err, { fileName: file.path });
				}

				if (file.isDirectory) {
					dirCount++;
				} else {
					fileCount++;
				}
				callback();
			});
		}, (callback) => {
			if (fileCount > 0 || dirCount > 0) {
				gutil.log('gulp-docker-sync:', gutil.colors.green(
					dirCount + ' ' + plur('directory', dirCount),
					'and',
					fileCount + ' ' + plur('file', fileCount),
					'copied successfully'));
			} else {
				gutil.log('gulp-docker-sync:', gutil.colors.yellow('No files uploaded'));
			}

			callback();
		});
		
		return stream;
	}
};
