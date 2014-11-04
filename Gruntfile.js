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
					src: [
						'src/scripts/**/*.js',
						'!src/scripts/**/*.min.js'
					]
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
		'compile-handlebars': {
			index: {
				template: 'src/index.handlebars',
				templateData: [
					'package.json',
					'src/data/index.json'
				],
				output: 'dist/gh-pages/index.html'
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
		},
		connect: {
			server: {
				options: {
					port: 9001,
					base: 'dist/gh-pages/'
				}
			}
		},
		watch: {
			options: {
				spawn: false,
			},
			scripts: {
				files: [
					'src/scripts/**/*.js',
					'!src/scripts/**/*.min.js'
				],
				tasks: [
					'jshint',
					'clean:scripts',
					'uglify'
				]
			},
			minimizedJs: {
				files: 'src/scripts/**/*.min.js',
				tasks: 'copy:minimizedJs'
			},
			html: {
				files: 'src/**/*.handlebars',
				tasks: [
					'clean:html',
					'compile-handlebars'
				]
			},
			rootCfg: {
				files: ['src/*', '!src/*.handlebars'],
				tasks: ['copy:rootCfg']
			},
			less: {
				files: 'src/styles/**/*.less',
				tasks: [
					'clean:styles',
					'less'
				]
			},
			grunt: {
				files: 'Gruntfile.js',
				tasks: [
					'jshint',
					'clean',
					'uglify',
					'compile-handlebars',
					'less'
				]
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-compile-handlebars');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('default', [
		'jshint',
		'clean',
		'uglify',
		'less',
		'compile-handlebars',
	]);

	grunt.registerTask('server', [
		'jshint',
		'clean',
		'uglify',
		'less',
		'compile-handlebars',
		'connect',
		'watch'
	]);
};
