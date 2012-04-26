//commands module
var netconfCmd = require('./netconf-commands.js');

//ssh stuff
var parser = require('xml2json');
var spawn = require('child_process').spawn;
var sshSessions = new Array();
var data2process = new String();

//configure express
var express = require('express');
var app = require('express').createServer();
var RedisStore = require('connect-redis')(express);
app.configure(function(){
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.session({ secret: "the pants are undefeated",store: new RedisStore,  cookie: { path: '/', httpOnly: true, maxAge: 300000 }}));
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
    app.set('view options', {
    layout: false
  });
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

app.get('/',loginNeeded,function(req, res) {
  //check if logged in already
  res.render('login', {
    title: 'Login'
  });
});

app.get('/portal',requiresLogin,function(req,res){
  res.render('portal', {
    title: 'Home Portal'
  });
});

app.post('/login', function(req, res){
  //console.log(req.body.username);
  //console.log(req.body.password);
  var ssh = spawn('ssh', ['root@10.0.1.2', '-s' ,'netconf']); //spawn on connect
  var callback = function (data) {
    if (data.toString().match(/\]\]>\]\]>/g)) {
      data2process = data2process + data.toString();
      var dataStr = data2process;
      data2process = '';
      var json = parser.toJson(dataStr.replace(/\]\]>\]\]>/g,'').replace(/^\s+|\s+$/g,'').replace(/(\w)[-]{1}(\w)/gi, '$1$2'));
      var parsedJson = JSON.parse(json);
      if (!!parsedJson.hello.sessionid) {
        req.session.junosid = parsedJson.hello.sessionid;
        sshSessions[parsedJson.hello.sessionid] = ssh;
      };
      res.header('Content-Type', 'application/json');
      res.send({"success":true, "msg":"Login Success", "next":"/portal"});
      ssh.stdout.removeListener('data',callback);
    } else {
      data2process = data2process + data.toString();
    };
  };
  
  ssh.stdout.on('data', callback);
  
  ssh.stderr.on('data', function (data) {
    console.log('XXXXX stderr: ' + data + ' XXXX');
  });
  
  ssh.on('exit', function (code) {
    console.log('child process exited with code ' + code);
  });
  
  ssh.stdin.write(netconfCmd.sendHello()); 
  
});

app.get('/op/get-firewall-policies',requiresLogin,function(req, res){
  var options = {
    req: req,
    res: res,
    command: netconfCmd.getPolicy()
  };
  
  sendCommand(options);
  /*
  console.log(req);
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
  */
});

//OLD VERSION
app.get('/op/get-route-engine-information',requiresLogin, function(req,res){
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
console.log('I\'m listening on port 3000 and my pid is ' + process.pid);

//process data once complete
var processData = function(data,child,res,sessionCallback,req){
  var dataStr = data;
  var json = parser.toJson(dataStr.replace(/\]\]>\]\]>/g,'').replace(/^\s+|\s+$/g,'').replace(/(\w)[-]{1}(\w)/gi, '$1$2'));
  res.header('Content-Type', 'application/json');
  res.send(json);
  if (!!sessionCallback) {
    sessionCallback.callback(JSON.parse(json),sessionCallback.req);
  };
};

function loginNeeded(req,res,next) {
  var sessionID = req.sessionID;
  console.log(sessionID);
  req.sessionStore.get(sessionID, function(err,data){
    if (!!data) {
      if (req.session.junosid == data.junosid) {
        //check the ssh session is active somehow
        console.log('next');
        next();
      } else {
        next();
        res.redirect('/portal');
      };
    } else {
      res.redirect('/');
    };
  });
};

function requiresLogin(req,res,next) {
  var sessionID = req.sessionID;
  req.sessionStore.get(sessionID, function(err,data){
    if (!!data) {
      if (req.session.junosid == data.junosid) {
        //check the ssh session is active somehow
        next();
      } else {
        res.redirect('/');
      };
    } else {
      res.redirect('/');
    };
  });
};

function sendCommand(options) {
  //options res: req: callback:
  //grab session ID
  //grab session object
  //check to see if session is alive
  //return alive session s
  // options: { req:, res:, command:}
  var sessID = options.req.session.junosid;
  options.req.sessionStore.get(sessID, function(err,data){
    if (err) {
      console.log(err);
    };
    console.log('test session');
    if (!!data) {
      if (sessID == data.junosid) {
        //check the ssh session is active somehow
        //try and send a command getAuthorizationInformation
        var sshSession = sshSessions[data.junosid];
        console.log('Session');
        console.log(sshSession);
        //callback(sshSessions[data.junosid]); //ssh session
        sshSession.stdin.write(netconfCmd.getAuthorizationInformation());
        var callback = function (data,command) {
          if (data.toString().match(/\]\]>\]\]>/g)) {
            data2process = data2process + data.toString();
            processData(data2process,ssh,res);
            data2process = '';
            sshSession.stdout.removeListener('data',callback);
            sshSession.stdin.write(sshSession);
          } if (!!data) {
            console.log(data.toString());
          } else {
            console.log(data.toString());
            data2process = data2process + data.toString();
          };
        };
        sshSession.stdout.on('data', callback);      
      } else {
        return 1;
      };
    } else {
      return 1;
    };
    return 1; //return 1 as something bad happened
  });
};

function getSSHSession(req,command) {
  //grab session ID
  //grab session object
  //check to see if session is alive
  //return alive session s
  var sessID = req.session.junosid;
  req.sessionStore.get(sessID, function(err,data){
    if (err) {
      console.log(err);
    };
    console.log('test session');
    if (!!data) {
      if (sessID == data.junosid) {
        //check the ssh session is active somehow
        //try and send a command getAuthorizationInformation
        var sshSession = sshSessions[data.junosid];
        console.log('Session');
        console.log(sshSession);
        //callback(sshSessions[data.junosid]); //ssh session
        sshSession.stdin.write(netconfCmd.getAuthorizationInformation());
        var callback = function (data,command) {
          if (data.toString().match(/\]\]>\]\]>/g)) {
            data2process = data2process + data.toString();
            processData(data2process,ssh,res);
            data2process = '';
            sshSession.stdout.removeListener('data',callback);
            sshSession.stdin.write(sshSession);
          } if (!!data) {
            console.log(data.toString());
          } else {
            console.log(data.toString());
            data2process = data2process + data.toString();
          };
        };
        sshSession.stdout.on('data', callback);      
      } else {
        return 1;
      };
    } else {
      return 1;
    };
    return 1; //return 1 as something bad happened
  });
};