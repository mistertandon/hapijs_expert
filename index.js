const HAPI = require('hapi');

const SERVER = new HAPI.Server();

SERVER.connection({port:3000});

SERVER.route({
    method: 'GET',
    path: '/',
    handler: function(request, reply){
        
        reply('Hello from hapiJs :-)');
    }
});

SERVER.route({
    method: 'GET',
    path: '/users/{userName}',
    handler: function(request, reply){
        
        reply(`Hello from ${encodeURIComponent(request.params.userName)} !`);
    }
});

SERVER.start((error) => {

    if (error){

        throw error;
    }

        console.log(`Server running at ${SERVER.info.uri}`);
});