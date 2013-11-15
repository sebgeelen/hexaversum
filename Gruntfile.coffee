module.exports = (grunt) ->
  
  grunt.loadNpmTasks 'grunt-contrib-less'
  grunt.task.loadNpmTasks 'grunt-contrib-watch'

  grunt.initConfig
    less:
      options:
        paths: ['../assets/css']
        compress: true

      css:
        cwd: ''
        src: ['./css/css.less']
        dest: './css/css.css'

    watch:
      less:
        files: ['./css/*.less'],
        tasks: ['less']

  grunt.event.on 'coffee.error', (msg) ->
    console.log "ERROR : " + msg

  grunt.registerTask 'default', ['less']
