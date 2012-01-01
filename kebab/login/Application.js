/**
 * @class Desktop
 * @singleton
 * @author Tayfun Öziş ERİKAN <tayfun.ozis.erikan@lab2023.com>
 *
 * Kebab Desktop
 */
Ext.define('Kebab.login.Application', {
    singleton: true,
    extend: 'Ext.app.Application',

    /**
     * Application namespace
     */
    name: 'Kebab.login',

    /**
     * Application root folder
     */
    appFolder: Kebab.helper.root('kebab/login'),

    /**
     * Application viewport auto create property
     * @type Boolean
     */
    autoCreateViewport: true,

    /**
     * Application References and selectors
     * @type Array
     */
    refs: [{
        ref: 'viewport',
        selector: 'viewport'
    }],

    /**
     * Application Controllers
     * @type Array
     */
    controllers: [
        'Index',
        'SignIn',
        'PasswordReset'
    ],

    /**
     * Application after launch method
     * @return void
     */
    launch: function() {
        console.log('Kebab.login.Application was launched...');
    }
});