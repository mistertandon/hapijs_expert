    'use strict';
    const HAPI = require('hapi');
    const PATH = require('path');
    const MYSQL = require('mysql');

    const SERVER = new HAPI.Server();

    SERVER.connection({
        port: 3000
    });

    let pool = MYSQL.createPool({
        host: 'localhost',
        user: 'root',
        password: 'times@123',
        database: '121keys'
    });


    SERVER.route({
        method: 'GET',
        path: '/02_mpd',
        handler: function(request, reply) {

            pool.getConnection(function(err, pConnection) {

                if (err) throw err;

                pConnection.query(
                    'SELECT id, session_id, client_ip, table_name FROM usertracking ORDER BY table_name limit 0,10',
                    function(err, rows) {

                        if (err) {

                            throw err;
                        }

                        pConnection.release();
                        
                        reply(rows);
                    });
            });

        }
    });

    SERVER.register(require('vision'), function(err) {

        if (err) {

            throw err;
        }

        /**
         * vpd: HapiJs plugin <vision> demo.
         */
        SERVER.route({
            method: 'GET',
            path: '/01_vpd',
            handler: function(request, reply) {

                reply.view('01_vision_plugin_demo', {
                    title: 'HapiJs vision plugin demo',
                    dscription: 'Basic demonstartion of how we can start with HapiJs <VISION> plugin and pass parameter to HTML file using <handlebars> template engine.',
                });
            }
        });

        SERVER.views({
            engines: {
                html: require('handlebars')
            },
            relativeTo: __dirname,
            path: 'templates'
        });

    });

    SERVER.route({
        method: 'GET',
        path: '/',
        handler: function(request, reply) {

            reply('Hello from hapiJs :-)');
        }
    });

    SERVER.route({
        method: 'GET',
        path: '/users/{userName}',
        handler: function(request, reply) {

            reply(`Hello from ${encodeURIComponent(request.params.userName)} !`);
        }
    });

    SERVER.start((error) => {

        if (error) {

            throw error;
        }

        console.log(`Server running at ${SERVER.info.uri}`);
    });