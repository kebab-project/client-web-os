/* -----------------------------------------------------------------------------
 Kebab Project 2.x (Kebab Revolution) - Web OS Client Platform for Ext JS 4.x
 http://kebab-project.com
 Copyright (c) 2011-2012 lab2023 - internet technologies TURKEY Inc.
 http://www.lab2023.com
----------------------------------------------------------------------------- */

/**
 * This file is part of Kebab
 *
 * Prepare environment, enable loader and boot kebab automatically
 *
 * @singleton
 */
(function() {

    /**
     * The DOM object
     *
     * @type {Object}
     */
    var global = this;

    // Kebab is not defined!
    if (typeof Kebab === 'undefined') {

        /**
         * Kebab global object
         * @class Kebab
         * @singleton
         */
        global.Kebab = {

            /**
             * System base configuration
             *
             * @param {Object} bootData Current boot data.
             * @param {String} root Cdn & root path, for example: http://static.kebab.local
             * @param {String} baseURL Base URL (if blank: Auto detected)
             */
            config: {
                authenticity_token: "your_token_here",
                tenant:{
                    "id": 0,
                    "name": "lab2023 - internet technologies",
                    "host": "lab2023.kebab.local"
                },
                user: {
                    "id": 0,
                    "name" : "Sample User"
                },
                locale :{
                    "default_locale": "en",
                    "available_locales": ["en", "tr", "ru"]
                },
                root :  "",
                baseURL: ""
            },

            /**
             * System boot status flag
             *
             * @type {Boolean}
             */
            bootStatus: false,

            /**
             * Kebab boot loader
             *
             * Load
             *
             * Example:
             *  Kebab.boot(
             *      'Kebab.desktop.Application',
             *      'http://static.kebab.local'
             *  );
             *
             * @param {String} application To load the Kebab's application name
             * @param {Object} config The kebab system configuration
             */
            boot: function(application, config) {
                var me = this;

                if (!me.bootStatus) {

                    console.log(application + ' was booting...');

                    // Setup system config
                    me.setConfig(config || me.config);

                    // Dependency check
                    if (typeof Ext === 'undefined') {
                        me.helper.redirect('500.html?extjs_required');
                    }

                    // Ext Loader configuration
                    Ext.Loader.setConfig({
                        enabled: true,
                        paths: {
                            'Kebab' : me.helper.root('kebab'),
                            'Apps' : me.helper.root('apps'),
                            'Ext.ux' : me.helper.root('vendors/ext-ux')
                        }
                    });

                    // Load core resources
                    me.helper.loadCSS('resources/css/kernel.css');

                    // Load Ext JS focale file
                    me.helper.loadJS(Ext.util.Format.format(
                        'vendors/ext-4.0.7-gpl/locale/ext-lang-{0}.js',
                        me.helper.config('locale').default_locale || 'en' // Default en
                    ));

                    Ext.require('Kebab.kernel.Base');

                    // Require the application
                    Ext.require(application);

                    // DOM ready ?
                    Ext.onReady(function(){
                        // Create and set application
                        me.setApplication(Ext.create(application));

                        // Set all data proxy requests global token parameter eg: &authenticity_token=123456
                        Ext.Ajax.extraParams = {
                            authenticity_token: me.helper.config('authenticity_token')
                        };

                        // Set boot status is true
                        me.bootStatus = true;
                    });

                } else {
                    console.warn('System already started...');
                }
            },

            reboot: function(url) {
                var me = this;
                url ? me.helper.redirect(url) : window.location.reload();
            },

            reload: function(url) {
                window.location.reload();
            },

            /**
             * Get kebab environment
             * @return {String} Current kebab environment
             */
            getEnvironment: function() {
                return (window.location.search.match('(\\?|&)dev') !== null)
                    ? 'development' : 'production';
            },

            /**
             * Set system configuration
             * @param {Object} config
             */
            setConfig: function(config) {
                var me = this;
                me.config = config || me.config;
            },

            /**
             * Get system configuration
             *
             * @param {String} key Get the boot data key
             * @return {Object/String} bootData
             */
            getConfig: function(key) {
                var me = this;
                return key ? me.config[key] : me.config;
            },

            /**
             * Get system root
             */
            getRoot: function() {
                var me = this;
                return me.getConfig('root') || '';
            },

            /**
             * Get system base url
             */
            getBaseURL: function() {
                var me = this;
                return me.getConfig('baseURL') ?
                    me.getConfig('baseURL') : window.location.protocol + '//' + window.location.hostname;
            },

            /**
             * Set application instance
             * @param {String} application
             */
            setApplication: function(application) {
                var me = this;
                me.application = application;
            },

            /**
             * Get the application instance
             *
             * @return {Object} Ext.app.Application
             */
            getApplication: function() {
                var me = this;
                return me.application
            },

            /**
             * Kebab helpers
             */
            helper: {

                /**
                 * Root path helper
                 * Get the generated full root path
                 *
                 * @param path
                 * @return {String} Generated full root path
                 */
                root: function(path) {
                    var ps = Kebab.getRoot('root') == '' ? '' : '/'; // Path seperator
                    return path ? Kebab.getRoot('root') + ps + path : Kebab.getRoot('root');
                },

                /**
                 * Generate full url
                 * Get the generated full url (baseUrl + url)
                 *
                 * @param url
                 * @return {String} Generated full url
                 */
                url: function(url) {
                    return url ? Kebab.getBaseURL() + '/' + url : Kebab.getBaseURL();
                },

                /**
                 * Redirector helper
                 * Redirect page any url
                 *
                 * @param url
                 */
                redirect: function(url) {
                    window.location.href = Kebab.helper.url(url);
                },

                /**
                 * Application helper
                 * Get application name or instance
                 *
                 * @return {Object} Ext.app.Application
                 */
                application: function() {
                    return Kebab.getApplication();
                },

                /**
                 * Config helper
                 * Get system configuration object or value
                 *
                 * @param {String} key Get the config data key
                 * @return {Object/String} bootData
                 */
                config: function(key) {
                    return Kebab.getConfig(key);
                },

                /**
                 * Notification helper
                 *
                 * @param {String} title
                 * @param {String} msg
                 */
                notify: function(title, msg) {

                    var win = Ext.create('Ext.ux.window.Notification', {
                        corner: 'tr',
                        paddingX: 15,
                        paddingY: 50,
                        slideInDelay: 800,
                        slideDownDelay: 1500,
                        autoDestroyDelay: 4000,
                        resizable: false,
                        slideInAnimation: 'elasticIn',
                        slideDownAnimation: 'elasticIn',
                        cls: 'kebab-notification',
                        autoShow: true,
                        closable: false,
                        title: title || 'Notification',
                        html: msg || 'Lorem ipsum dolor sit amet'
                    });
                    win.getEl().on('click', function() {
                        win.close();
                    });
                },

                /**
                 * Stylesheet loader helper
                 * Load css file(s) from document head
                 *
                 * @param {String} arguments
                 */
                loadCSS: function() {
                    var docHead = Ext.getHead(),
                        disableCaching = Kebab.getEnvironment() == 'development' ? '?' + Ext.id() : '';

                    for(var css in arguments) {
                        Ext.DomHelper.append(
                            docHead, {
                                tag: 'link',
                                type: 'text/css',
                                rel: 'stylesheet',
                                href: Kebab.helper.root(arguments[css]) + disableCaching
                            }
                        );
                    }
                },

                /**
                 * Javascript loader helper
                 * Load js file(s) from document head
                 *
                 * @param {String} arguments
                 */
                loadJS: function() {
                    var docHead = Ext.getHead(),
                        disableCaching = Kebab.getEnvironment() == 'development' ? '?' + Ext.id() : '';
                        scriptCount = arguments.length,
                        loadedCount = 0;

                    for(var js in arguments) {
                        var scriptTag = document.createElement('script');
                        scriptTag.type = 'text/javascript';
                        scriptTag.src = Kebab.helper.root(arguments[js]) + disableCaching;
                        docHead.appendChild(scriptTag);
                    }
                },

                /**
                 * Wallpaper helper
                 * Change the body wallpaper
                 *
                 * @param {String} img
                 */
                loadWallpaper: function(img) {
                    var imgUrl = Kebab.helper.root('resources/wallpapers/' + img);
                    Ext.getBody().setStyle({
                        backgroundImage: 'url( ' + imgUrl + ')',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        backgroundAttachment: 'fixed'
                    });
                }
            },

            /**
             * Initialize test suite & execute all specs
             *
             * @private
             */
            _runTests: function() {
                var me = this;

                // Load jasmine js files
                me.helper.loadJS(
                    'vendors/jasmine-1.1.0/jasmine.js',
                    'vendors/jasmine-1.1.0/jasmine-html.js'
                );

                // TODO load specs

                // Load jasmine css file
                me.helper.loadCSS('vendors/jasmine-1.1.0/jasmine.css');

                Ext.defer(function() {

                    // Dependency check
                    if (typeof jasmine === 'undefined') {
                        //me.helper.redirect('500.html?jasmine_required');
                    } else {

                        // Jasmine Initializer
                        jasmine.getEnv().addReporter(new jasmine.TrivialReporter());
                        jasmine.getEnv().execute();

                        // Override Jasmine styles
                        Ext.select('.jasmine_reporter').setStyle({
                            'z-index': '100000',
                            'background': 'rgba(0, 0, 0, .6)',
                            'position': 'fixed',
                            'width': '100%',
                            'bottom': '0',
                            'padding': '15px',
                            'margin': 'auto'
                        });

                        console.log('Testing suite has been initialized...');
                    }
                }, 200);
            }
        };
    }
})();