exports.sendCommand = function(options) {
  //options res: req: callback:
  //grab session ID
  //grab session object
  //check to see if session is alive
  //return alive session s
  // options: { req:, res:, command:}
  var JUNOSsessID = options.req.session.junosid; // pull the existing session cookie
  var sessID = options.req.session.id;
  options.req.sessionStore.get(sessID, function(err, data) {
    if (err) {
      console.log(err); //cant grab the cookie, something bad has happened
    };
    if ( !! data) { //alright we have some sort of cookie data
      console.log('session exists!');
      if (JUNOSsessID == data.junosid) { //hey is this 
        //check the ssh session is active somehow
        //try and send a command getAuthorizationInformation
        console.log('pulling session');
        var sshSession = sshSessions[data.junosid]; //alright we have the session identified
        sshSession.stdin.write(netconfCmd.getAuthorizationInformation()); // alright lets test this shit
        var callback = function(data, command) {
          if (data.toString().match(/\]\]>\]\]>/g)) {
            var dataStr = data2process + data.toString();
            data2process = '';
            var json = parser.toJson(dataStr.replace(/\]\]>\]\]>/g, '').replace(/^\s+|\s+$/g, '').replace(/(\w)[-]{1}(\w)/gi, '$1$2'));
            var parsedJson = JSON.parse(json);
            //validate that the connection worked if it did then move forward, if not throw error
            if (parsedJson.rpcreply.authorizationinformation.userinformation.user == 'root') {
              //start nested callback
              sshSession.stdout.removeListener('data', callback);
              //send actual command here
              
              sshSession.stdin.write(options.command);
              
              var commandCallback = function(data, command) {
                if (data.toString().match(/\]\]>\]\]>/g)) {
                  var dataStr = data2process + data.toString();
                  data2process = '';
                  var json = parser.toJson(dataStr.replace(/\]\]>\]\]>/g, '').replace(/^\s+|\s+$/g, '').replace(/(\w)[-]{1}(\w)/gi, '$1$2'));
                  var parsedJson = JSON.parse(json);
                  //validate that the connection worked if it did then move forward, if not throw error
                  options.res.send(parsedJson);
                  sshSession.stdout.removeListener('data', commandCallback);

                } else if ( !! data) {
                  data2process = data2process + data.toString();
                } else {
                  console.log('ELSE');
                  data2process = data2process + data.toString();
                };
              };
              
              sshSession.stdout.on('data', commandCallback);
            } else {
              //session is dead
              console.log('SSH session not found or is dead');
            };
          } else if ( !! data) {
            data2process = data2process + data.toString();
          } else {
            console.log('ELSE');
            data2process = data2process + data.toString();
          };
        };

        sshSession.stdout.on('data', callback);
      } else {
        return 1; //return 1 as something bad happened
      };
    } else {
      return 1; //return 1 as something bad happened
    };
    return 1; //return 1 as something bad happened
  });
};