exports.loginNeeded = function(req, res, next) {
  var sessionID = req.sessionID;
  console.log(sessionID);
  req.sessionStore.get(sessionID, function(err, data) {
    if ( !! data) {
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

exports.requiresLogin = function(req, res, next) {
  var sessionID = req.sessionID;
  req.sessionStore.get(sessionID, function(err, data) {
    if ( !! data) {
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