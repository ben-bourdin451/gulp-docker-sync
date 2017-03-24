
var assert = require('chai').assert
var gutil = require('gulp-util')
var dockersync = require('./index.js')


describe('options', () => {
	it('should throw an error if container is undefined', () => {
		assert.throws(dockersync.dest, gutil.PluginError, "`container` required");
	});
	
	it('should throw an error if remotePath is undefined', () => {
		assert.throws(() => { dockersync.dest({container: "myContainer"}) }, gutil.PluginError, "`remotePath` required");
	});
});
