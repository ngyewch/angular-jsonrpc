/*global module:false*/
module.exports = function(grunt) {
  'use strict';

  var paths = {
    src: 'src',
    build: 'build'
  };

  var date = '<%= grunt.template.today("yyyy-mm-dd") %>';
  var year = '<%= grunt.template.today("yyyy") %>';

  var bannerBase = [
    '/**!',
    ' * <%= pkg.name %> v<%= pkg.version %> [build ' + date + ']',
    ' * @copyright ' + year + ' <%= pkg.author %>. All Rights Reserved.',
    ' * @license <%= pkg.license %>; see LICENCE.',
    ' * [<%= pkg.repository.url %>]',
    ' */'
  ];

  var banner = bannerBase.join('\n') + '\n';

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    paths: paths,
    pkg: grunt.file.readJSON('package.json'),

    // Task configuration.
    clean: {
      build: ['<%= paths.build %>']
    },
    concat: {
      build: {
        files: {
          '<%= paths.build %>/jsonrpc.js': [
            '<%= paths.src %>/jsonrpc.js'
          ]
        },
        options: {
          banner: banner
        }
      }
    },
    'regex-replace': {
      build: {
        src: '<%= paths.build %>/jsonrpc.js',
        actions: [
          {
            name: 'single-blankline',
            search: /\n\n+/g,
            replace: '\n\n'
          }
        ]
      }
    },
    ngmin: {
      build: {
        files: {
          '<%= paths.build %>/jsonrpc.ngmin.js': [
            '<%= paths.build %>/jsonrpc.js'
          ]
        }
      }
    },
    uglify: {
      build: {
        files: {
          '<%= paths.build %>/jsonrpc.min.js': [
            '<%= paths.build %>/jsonrpc.ngmin.js'
          ]
        }
      },
      options: {
        banner: banner
      }
    },
    jshint: {
      options: {
        node: true,
        browser: true,
        esnext: true,
        bitwise: true,
        camelcase: true,
        curly: true,
        eqeqeq: true,
        immed: true,
        indent: 2,
        latedef: true,
        newcap: true,
        noarg: true,
        quotmark: 'single',
        regexp: true,
        undef: true,
        unused: true,
        strict: true,
        trailing: true,
        smarttabs: true,
        globals: {
          angular: false
        }
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      libTest: {
        src: ['<%= paths.src %>/**/*.js', 'test/**/*.js']
      }
    },
    karma: {
      unit: {
        configFile: 'unittest.conf.js',
        singleRun: true
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-ngmin');
  grunt.loadNpmTasks('grunt-regex-replace');

  // Tasks
  grunt.registerTask('build', [
    'jshint',
    'clean',
    'concat',
    'regex-replace',
    'ngmin',
    'uglify'
  ]);

  grunt.registerTask('default', [
    'karma',
    'build'
  ]);
};
