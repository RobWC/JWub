/*

This file is part of Ext JS 4

Copyright (c) 2011 Sencha Inc

Contact:  http://www.sencha.com/contact

Commercial Usage
Licensees holding valid commercial licenses may use this file in accordance with the Commercial Software License Agreement provided with the Software or, alternatively, in accordance with the terms contained in a written agreement between you and Sencha.

If you are unsure which license is appropriate for your use, please contact the sales department at http://www.sencha.com/contact.

*/
/**
 * @class Ext.toolbar.Separator
 * @extends Ext.toolbar.Item
 * A simple class that adds a vertical separator bar between toolbar items (css class: 'x-toolbar-separator').
 *
 *     @example
 *     Ext.create('Ext.panel.Panel', {
 *         title: 'Toolbar Seperator Example',
 *         width: 300,
 *         height: 200,
 *         tbar : [
 *             'Item 1',
 *             { xtype: 'tbseparator' },
 *             'Item 2'
 *         ],
 *         renderTo: Ext.getBody()
 *     });
 */
Ext.define('Ext.toolbar.Separator', {
    extend: 'Ext.toolbar.Item',
    alias: 'widget.tbseparator',
    alternateClassName: 'Ext.Toolbar.Separator',
    baseCls: Ext.baseCSSPrefix + 'toolbar-separator',
    focusable: false
});
