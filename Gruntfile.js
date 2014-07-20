module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
			options: {
				jshintrc: '.jshintrc'
			},
            build: ['src/js/*.js']
        },
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> */\n'
			},
			build: {
				files: {
					'src/app.min.js': 'src/js/*.js'
				}
			}
		}
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('default', ['jshint']);
    grunt.registerTask('build', ['jshint', 'uglify:build']);
};
