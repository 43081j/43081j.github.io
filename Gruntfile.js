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
					'app.min.js': 'src/js/*.js'
				}
			}
		},
		sass: {
			build: {
				options: {
					style: 'compressed',
					banner: '/*! <%= pkg.name %> */\n'
				},
				files: {
					'app.css': 'css/app.scss'
				}
			}
		}
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-sass');

    grunt.registerTask('default', ['jshint']);
    grunt.registerTask('build', ['jshint', 'uglify:build', 'sass:build']);
};
