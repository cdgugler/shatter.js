module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        smash: {
            d3voronoi: {
                src: 'src/d3voronoi.js',
                dest: 'build/d3voronoi.js'
            },
            shatterjs: {
                src: 'src/build.js',
                dest: 'build/shatter.js'
            },
        },
        watch: {
            scripts: {
                files: ['src/*.js'],
                tasks: ['build'],
            },
        },
        uglify: {
            target: {
                files: {
                    'build/shatter.min.js': ['build/shatter.js']
                },
            },
        },
    });
    grunt.loadNpmTasks('grunt-smash');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.registerTask('build', ['smash', 'uglify']);
}
