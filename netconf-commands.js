//message methods
exports.sendHello = function() {
  var hello = '<hello><capabilities><capability>urn:ietf:params:xml:ns:netconf:base:1.0</capability><capability>urn:ietf:params:xml:ns:netconf:candidate:1.0</capability><capability>urn:ietf:params:xml:ns:netconf:confirmed-commit:1.0</capability><capability>urn:ietf:params:xml:ns:netconf:validate:1.0</capability><capability>urn:ietf:params:xml:ns:netconf:url:1.0?protocol=http,ftp,file</capability><capability>http://xml.juniper.net/netconf/junos/1.0</capability></capabilities></hello>]]>]]>';
  return hello;
};

exports.getChassis = function() {
  var rpc = '<rpc><get-software-information></get-software-information></rpc>]]>]]>';
  return rpc;
};

exports.getPolicy = function() {
  var rpc = '<rpc><get-firewall-policies></get-firewall-policies></rpc>';
  return rpc;
};

exports.getFwddInformation = function() {
  var rpc = '<rpc><get-fwdd-information></get-fwdd-information></rpc>';
  return rpc;
};

exports.getRouteEngineInformation = function() {
  var rpc = '<rpc><get-route-engine-information></get-route-engine-information></rpc>';
  return rpc;
};