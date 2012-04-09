Ext.application({
    name: 'JWub',
    launch: function() {
        Ext.create('JWub.view.ui.LoginForm', {
            renderTo: Ext.getBody()
        });
    }
});

Ext.define('JWub.view.ui.LoginForm', {
        extend: 'Ext.form.Panel',
        height: 250,
        style: 'margin:0 auto;margin-top:100px;',
        width: 400,
        layout: {
            type: 'absolute'
        },
        bodyPadding: 10,
        title: 'SRX Login',
        initComponent: function() {
            var me = this;
            Ext.applyIf(me, {
                items: [
                    {
                        xtype: 'textfield',
                        fieldLabel: 'Username',
                        id: 'username',
                        x: 50,
                        y: 60
                    },
                    {
                        xtype: 'textfield',
                        fieldLabel: 'Password',
                        id: 'password',
                        x: 50,
                        y: 100
                    },
                    {
                        xtype: 'button',
                        height: 20,
                        width: 80,
                        text: 'Login',
                        x: 110,
                        y: 160,
                        handler: function() {
                          var form = this.up('form').getForm();
                          if (form.isValid()) {
                            var username = Ext.getCmp('username').getValue();
                            var password = Ext.getCmp('password').getValue();
                            $.ajax({
                                type: 'post',
                                url: '/login',
                                data: {username: username, password: password}
                            });
                            console.log(username);
                          }
                        }
                    },
                    {
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
                    }
                ]
            });
            me.callParent(arguments);
        }
    });