module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		banner: [
			'/*!',
			' * Name: <%= pkg.name %> - <%= pkg.description %>',
			' * Version: v<%= pkg.version %>',
			' * Homepage: <%= pkg.homepage %>',
			' * License: <%= pkg.license %>',
			' */\n\n'
		].join('\n'),
		jshint: {
			hint: {
				files: {
					src: 'src/**/*.js'
				}
			}
		},
		clean: {
			options: {
				force: true
			},
			scripts: "dist/**/*.js",
			images: "dist/gh-pages/images/**/*.*",
			html: "dist/gh-pages/**/*.html",
			styles: "dist/gh-pages/styles/**/*.css"
		},
		uglify: {
			beautify: {
				options: {
					banner: '<%= banner %>',
					mangle: false,
					compress: false,
					beautify: true,
					preserveComments: true,
					footer: '\n'
				},
				files: [{
					expand: true,
					cwd: 'src/scripts/placeholder/',
					src: '**/*.js',
					dest: 'dist/placeholder/'
				}]
			},
			minify: {
				options: {
					banner: '<%= banner %>',
					footer: '\n'
				},
				files: [
					{
						expand: true,
						cwd: 'src/scripts/',
						src: ['**/*.js', '!**/*.min.js'],
						dest: 'dist/gh-pages/scripts/',
						ext: '.min.js',
						extDot: 'last'
					},
					{
						expand: true,
						cwd: 'src/scripts/placeholder/',
						src: '**/*.js',
						dest: 'dist/placeholder/',
						ext: '.min.js',
						extDot: 'last'
					}
				]
			}
		},
		less: {
			style: {
				options: {
					compress: false,
					cleancss: true,
					banner: '<%= banner %>',
					cleancssOptions: {
						keepBreaks: true,
						keepSpecialComments: 1
					}
				},
				files: [{
					expand: true,
					cwd: 'src/styles/',
					src: ['**/*.less', '!**/_*.less'],
					dest: 'dist/gh-pages/styles/',
					ext: '.css',
					extDot: 'last'
				}]
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-less');

	grunt.registerTask('default', [
		'jshint',
		'clean',
		'uglify',
		'less'
	]);
};
