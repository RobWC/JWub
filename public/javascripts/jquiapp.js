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
        });
      } else {
        $('div[id="login"] div[id="status"]').text('Log In Failed');
      };
    });
	  return false;
	});
});