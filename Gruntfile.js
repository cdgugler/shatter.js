module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        smash: {
            voronoi: {
                src: 'src/d3voronoi.js',
                dest: 'build/d3voronoi.js'
            },
        },
    });
    grunt.loadNpmTasks('grunt-smash');
    grunt.registerTask('default', ['smash']);
}
