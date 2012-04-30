Ext.define('JWub.view.ui.LoginForm', {
  id: 'loginForm',
  extend: 'Ext.form.Panel',
  height: 250,
  style: 'margin:0 auto;margin-top:100px;',
  width: 400,
  layout: {
    type: 'absolute'
  },
  defaults: {
    listeners: {
      specialkey: function(field, event) {
        if (event.getKey() == event.ENTER) {
          var form = Ext.getCmp('loginForm');
          if (form.form.isValid()) {
            form.submit({
              url: '/login',
              method: 'POST',
              success: function(form, action) {
                Ext.Msg.alert('Success', action.result.msg);
                window.location = action.result.next;
              },
              failure: function(form, action) {
                Ext.Msg.alert('Failed', action.result.msg);
              }
            });
          }
        }
      }
    }
  },
  bodyPadding: 10,
  title: 'SRX Login',
  initComponent: function() {
    var me = this;
    Ext.applyIf(me, {
      items: [{
        xtype: 'textfield',
        fieldLabel: 'Username',
        allowBlank: false,
        name: 'username',
        x: 50,
        y: 60
      }, {
        xtype: 'textfield',
        fieldLabel: 'Password',
        name: 'password',
        inputType: 'password',
        allowBlank: false,
        x: 50,
        y: 100
      }, {
        xtype: 'button',
        height: 20,
        width: 80,
        text: 'Login',
        type: 'submit',
        x: 110,
        y: 160,
        handler: function() {
          var form = Ext.getCmp('loginForm');
          if (form.form.isValid()) {
            // Submit the Ajax request and handle the response
            form.submit({
              url: '/login',
              method: 'POST',
              success: function(form, action) {
                Ext.Msg.alert('Success', action.result.msg);
                window.location = action.result.next;
              },
              failure: function(form, action) {
                Ext.Msg.alert('Failed', action.result.msg);
              }
            });
          }
        }
      }, {
        xtype: 'button',
        height: 20,
        width: 80,
        text: 'Cancel',
        x: 230,
        y: 160,
        handler: function() {
          //clear the fields
          Ext.getCmp('username').setValue();
          Ext.getCmp('password').setValue();
        }
      }],
      renderTo: Ext.getBody()
    });
    me.callParent(arguments);
  }
});

Ext.application({
  name: 'JWub',
  launch: function() {
    Ext.create('JWub.view.ui.LoginForm', {

    });
  }
});