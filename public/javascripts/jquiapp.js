$(function() {
	$('div[id="login"] button').button();
	$('div[id="login"] button').click(function() { 
	  $.ajax({
      type: "get",
      url: "/login",
      timeout: 5000
    }).done(function( msg ) {
      if (!!msg.hello.sessionid) {
        $('div[id="login"] div[id="status"]').text('Logged In ' + msg.hello.sessionid);
        $.ajax({
          type: "get",
          url: "/op/get-fwdd-information",
          timeout: 15000
        }).done(function( msg ) {
          $('div[id="fwd-status"] p[id="uptime"]').text('Uptime ' + msg.rpcreply.scbinformation.scb.uptime.$t);
          $('div[id="fwd-status"] p[id="fwdd"]').text('FWDD ' + msg.rpcreply.scbinformation.scb.cputotalrt);
          $('div[id="fwd-status"] p[id="memory"]').text('Memory ' + msg.rpcreply.scbinformation.scb.memoryheaputilization);
          $('div[id="fwd-status"] p[id="state"]').text('FWDD Status ' + msg.rpcreply.scbinformation.scb.state);
          $.ajax({
            type: "get",
            url: "/op/get-route-engine-information",
            timeout: 50000
          }).done(function(msg){
            $('div[id="re-status"] p[id="model"]').text('Model ' + msg.rpcreply.routeengineinformation.routeengine.model);
            $('div[id="re-status"] p[id="cpuuser"]').text('CPU User ' + msg.rpcreply.routeengineinformation.routeengine.cpuuser);
            $('div[id="re-status"] p[id="cpuidle"]').text('CPU Idle ' + msg.rpcreply.routeengineinformation.routeengine.cpuidle);
            $('div[id="re-status"] p[id="cpusystem"]').text('CPU User ' + msg.rpcreply.routeengineinformation.routeengine.cpusystem);

                        /*
              p(id="cpubackground")
              p(id="cpuidle")
              p(id="cpusystem")
              p(id="cpuuser")
              p(id="model")
            */
          });
        });
      } else {
        $('div[id="login"] div[id="status"]').text('Log In Failed');
      };
    });
	  return false;
	});
});