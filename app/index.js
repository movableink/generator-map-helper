'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

module.exports = yeoman.generators.Base.extend({
  initializing: function () {
    this.pkg = require('../package.json');
  },

  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the ' + chalk.red('Movable Ink Map Helper') + ' generator!'
    ));

    var prompts = [{
      type: 'input',
      name: 'mapKey',
      message: 'What is the map key? (the 16-character string of random letters and numbers after "/p/gp/" in the local map URL)',
      validate: function(input) { return !!input.match(/^[a-z0-9]{16}$/); }
    },{
      type: 'list',
      name: 'separate',
      message: 'Are the results all in the same image, or individual images?',
      choices: ['all in the same image', 'individual images'],
      default: 'all in the same image'
    },{
      type: 'input',
      name: 'maxResults',
      message: 'How many results should be shown?',
      when: function(answers) { return answers.multiple && answers.separate == 'all in the same image'; }
    },{
      type: 'input',
      name: 'defaultImage',
      message: 'What image url should be shown when user is not near any points of interest, or is not geolocatable? (blank for 1x1 pixel)'
    }];

    this.prompt(prompts, function (props) {
      this.mapKey = props.mapKey;
      this.defaultImage = props.defaultImage;

      this.separate = (props.separate == 'individual images');
      if(this.separate) {
        this.maxResults = parseInt(props.maxResults, 10);
      }

      done();
    }.bind(this));
  },

  writing: {
    app: function () {
      this.fs.copyTpl(
        this.templatePath('_package.json'),
        this.destinationPath('package.json'),
        { name: this.appname.replace(/\s/, '-'), author: this.username }
      );
      this.fs.copyTpl(
        this.templatePath('_bower.json'),
        this.destinationPath('bower.json'),
        { name: this.appname.replace(/\s/, '-'), author: this.username }
      );
      this.fs.copyTpl(
        this.templatePath('index.html'),
        this.destinationPath('index.html'),
        {
          name: this.appname,
          mapKey: this.mapKey,
          defaultImage: this.defaultImage,
          maxResults: this.maxResults
        }
      );
    },

    projectfiles: function () {
      this.fs.copy(
        this.templatePath('editorconfig'),
        this.destinationPath('.editorconfig')
      );
      this.fs.copy(
        this.templatePath('jshintrc'),
        this.destinationPath('.jshintrc')
      );
    }
  },

  install: function () {
    this.installDependencies({
      skipInstall: this.options['skip-install']
    });
  }
});
