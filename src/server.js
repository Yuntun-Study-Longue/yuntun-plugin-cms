import { renderApp } from './renderApp';

const handleSSR = {
    name: 'luna-plugin-story',
    version: '1.0.0',
    register: async function (server, options) {
        server.route([
            {
                method: 'GET',
                path: "/{param*}",
                config: {
                    handler: async function(request, h) {
                        const context = {};
                        
                        if (context.url) {
                            return h.redirect(context.url);
                        } else {
                            const { html } = await renderApp(request, h);
                            return h.response(html)
                        }
                    },
                }
            },
            {
                method: ['GET', 'POST'],
                path: "/sysware/{param*}",
                config: {
                    handler: {
                        proxy: {
                            host: '192.168.5.202',
                            port: '8825',
                            protocol: 'http',
                            passThrough: true,
                            localStatePassThrough: true,
                            xforward: true
                        }
                    }
                }
            }
        ])
    }
};

export default handleSSR