//commands module
var netconfCmd = require('./netconf-commands.js');

//ssh stuff
var util = require('util');
var parser = require('xml2json');
var spawn = require('child_process').spawn;
var ssh;
var count = 0;
var data2process = new String();

//configure express
var express = require('express');
var app = require('express').createServer();
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
    app.set('view options', {
    layout: false
  });
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

//handle errors


app.get('/', function(req, res) {
  res.render('index', {
    title: 'Dashboard'
  });
});


app.get('/login', function(req, res){
  ssh = spawn('ssh', ['root@10.0.1.11', '-s' ,'netconf']); //spawn on connect
  ssh.stderr.on('data', function (data) {
    console.log('XXXXX stderr: ' + data + ' XXXX');
  });
  
  ssh.on('exit', function (code) {
    console.log('child process exited with code ' + code);
  });
  ssh.stdout.on('data', function (data) {
    console.log(data.toString());
  });
  ssh.stdin.write(netconfCmd.sendHello());
  var callback = function (data) {
    if (data.toString().match(/\]\]>\]\]>/g)) {
      data2process = data2process + data.toString();
      processData(data2process,ssh,res);
      data2process = '';
      ssh.stdout.removeListener('data',callback);
    } else {
      data2process = data2process + data.toString();
      console.log(data.toString());
    };
  };
  ssh.stdout.on('data', callback);
});

app.get('/op/get-firewall-policies', function(req, res){
  ssh.stdin.write(netconfCmd.getPolicy());
  var callback = function (data) {
    if (data.toString().match(/\]\]>\]\]>/g)) {
      data2process = data2process + data.toString();
      processData(data2process,ssh,res);
      data2process = '';
      ssh.stdout.removeListener('data',callback);
    } else {
      data2process = data2process + data.toString();
    };
  };
  ssh.stdout.on('data', callback);
});

app.get('/op/get-fwdd-information', function(req,res){
 //run command against SSH
 ssh.stdin.write(netconfCmd.getFwddInformation());
  var callback = function (data) {
    if (data.toString().match(/\]\]>\]\]>/g)) {
      data2process = data2process + data.toString();
      processData(data2process,ssh,res);
      data2process = '';
      ssh.stdout.removeListener('data',callback);
    } else {
      data2process = data2process + data.toString();
    };
  };
  ssh.stdout.on('data', callback);
});

app.get('/op/get-route-engine-information', function(req,res){
 //run command against SSH
 ssh.stdin.write(netconfCmd.getRouteEngineInformation());
  var callback = function (data) {
    if (data.toString().match(/\]\]>\]\]>/g)) {
      data2process = data2process + data.toString();
      processData(data2process,ssh,res);
      data2process = '';
      ssh.stdout.removeListener('data',callback);
    } else {
      data2process = data2process + data.toString();
    };
  };
  ssh.stdout.on('data', callback);
});

app.listen(3000);
console.log('I\'m listening on port 3000');

//process data once complete
var processData = function(data,child,res){
  var dataStr = data;
  var json = parser.toJson(dataStr.replace(/\]\]>\]\]>/g,'').replace(/^\s+|\s+$/g, ''));
  res.header('Content-Type', 'application/json');
  res.send(json);
};