'use strict';

const Hapi = require('@hapi/hapi');
const Path = require('path');
const {CaptchaMiddleware} = require("./CaptchaMiddleware");

const init = async () => {

    const server = Hapi.server({
        port: 3000,
        host: 'localhost',
        routes: {
            files: {
                relativeTo: Path.join(__dirname)
            }
        },
        app: {
            CaptchaMap: new Map(),
        }
    });

    await server.register(require('@hapi/inert'))

    server.route({
        method: 'GET',
        path: '/',
        handler: (request, h) => {
            return h.file('./index.html');
        },
        options: {
            pre: [
                CaptchaMiddleware
            ]
        }
    })
    server.route({
        method: 'GET',
        path: '/styles.css',
        handler: (request, h) => {
            return h.file('./styles.css');
        },
    })
    server.route({
        method: 'GET',
        path: '/logo.jpeg',
        handler: (request, h) => {
            return h.file('./logo.jpeg');
        },
    })
    server.route({
        method: 'GET',
        path: '/page1',
        handler: (request, h) => {
            return h.file('./page1.html');
        },
        options: {
            pre: [
                CaptchaMiddleware
            ]
        }
    })
    server.route({
        method: 'GET',
        path: '/page2',
        handler: (request, h) => {
            return h.file('./page2.html');
        },
        options: {
            pre: [
                CaptchaMiddleware
            ]
        }
    })

    server.route({
        method: 'GET',
        path: '/captcha',
        handler: (request, h) => {
            return h.file('./captcha.html')
        }
    })

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();
