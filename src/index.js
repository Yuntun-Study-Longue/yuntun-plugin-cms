const Hapi = require('hapi');

let app = require('./server').default;

if (module.hot) {
  module.hot.accept('./server', function() {
    console.log('🔁  HMR Reloading `./server`...');
    try {
      app = require('./server').default;
    } catch (error) {
      console.error(error);
    }
  });
  console.info('✅  Server-side HMR Enabled!');
}

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT || 3000,
    host: 'localhost',
    routes: {
      files: {
          relativeTo: process.env.RAZZLE_PUBLIC_DIR
      }
    }
  });
  await server.register(require('inert'))
  server.route([
    {
      method: 'GET',
      path: "/static/{param*}",
      config: {
        handler: {
          directory: { 
            path: './static' ,
            redirectToSlash: true,
            index: true,
            listing: true,
          }
        }
      }
    }
  ])
  server.route([
    {
      method: 'GET',
      path: "/mock/{param*}",
      config: {
        handler: {
          directory: { 
            path: './mock' ,
            redirectToSlash: true,
            index: true,
            listing: true,
          }
        }
      }
    }
  ])
  await server.register({
    plugin: app
  });
  
  await server.start();
  console.log('> Started on port ', server.info.uri);
};

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

export default init()