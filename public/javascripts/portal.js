$(document).ready(function() {
  // Handler for .ready() called.
  $.getJSON('/op/get-software-information', function(data) {
    $('#hostname').append(' ' + data.rpcreply.softwareinformation.hostname);
    $('#model').append(' ' + data.rpcreply.softwareinformation.productmodel);
    $('#version').append(' ' + data.rpcreply.softwareinformation.packageinformation.comment);
  });
});