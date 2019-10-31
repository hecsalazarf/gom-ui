# Gom UX

## Description
Gom (Graph Order Management) is a small, yet powerful solution, built on top of [Quasar Framework](https://quasar.dev), for managing orders . Our target business is direct selling. However, it might apply to other scenarios.

## Prerequisites
[Gom API](https://github.com/hecsalazarf/gom-api) deployment

Node.js >= 8.9.0

npm >= 5.6.0

## Installation
```bash
$ npm install
```

## Running the app
Below command starts a Node.js local development server:
```bash
$ npx quasar dev -m pwa
```

For a full list of options, check [Quasar command list](https://quasar.dev/quasar-cli/cli-documentation/commands-list).

Gom needs an HTTPS connection to work properly with all included features. Generate TLS certificates either for development (see [certs](./certs/README.md) folder) or production environments ([let's encrypt](https://letsencrypt.org)).

## Deployment
To generate a production-ready bundle, execute the following command:
```bash
$ npm run build
```
You can use any web server to serve these static files. Just consider that you have to add a catch-all fallback route to your server, since Gom uses Vou Router in history mode.

For example, with Nginx, you could do this:

```Nginx
location / {
  try_files $uri $uri/ /index.html =404;
}
```

### Proxy
Gom communicates with its backend through a proxy. All endpoints under the `/api/` route are proxied to the [Gom API](https://github.com/hecsalazarf/gom-api), including web socket connections.

On development environments, Quasar utilizes [http-proxy-middleware](https://github.com/chimurai/http-proxy-middleware) which is configurable in `quasar.conf.js`. 

```js
module.exports = function (ctx) {
  return {
    devServer: {
      proxy: {
        // proxy all requests starting with /api
        '/api': {
          target: 'http://172.18.0.1:3000',
          changeOrigin: true,
          ws: true, // proxy websockets
          pathRewrite: {
            '^/api': ''
          },
          xfwd: true // add x-forward headers
        }
      }
    }
  }
}
```

On production, refer to your web server configuration. Nginx can be set up the following way:

```Nginx
# The trailing slash in proxy_pass is what makes a difference. It also ensures that
# proxy_redirect stays at default, so, you could still use 302 et al within your 
# backend, and have it work correctly everywhere.
location = /api {
  # Path rewrite
  return 302 /api/;
}
location /api/ {
  # Proxy pass 
  proxy_pass <GOM_API_SERVER>;
  proxy_buffering off;
  proxy_set_header X-Real-IP $remote_addr;
  # Express required headers when 'trust proxy' is enabled
  proxy_set_header X-Forwarded-For $realip_remote_addr;
  proxy_set_header X-Forwarded-Host $hostname;
  proxy_set_header X-Forwarded-Proto $scheme;
  # Support web sockets
  proxy_http_version 1.1;
  proxy_set_header Upgrade $http_upgrade;
  proxy_set_header Connection "Upgrade";
}
```

Also observe that you can have Quasar [serve](https://quasar.dev/quasar-cli/cli-documentation/commands-list#serve) command, supplied by the @quasar/cli package, act as a production static web server. Adjust the proxy configuration in `proxy.conf.js`, which esentially exposes the same properties as of `quasar.conf.js`. Then simply run:
```bash
$ npm run serve:build
```

### Configuration variables
Configuration is done by adding variables to the `process.env` object. They are located in `env.js` and grouped in three categories: def (default), development and production. During the build process, we merge them depending on the target build.


* CHROME_V: Minimum required version of Chrome.
* SAFARI_V: Minimum required version of Safari.
* FIREFOX_V: Minimum required version of Firefox.
* CSRF_TOKEN_COOKIE: Cookie name for the CSRF token.
* SESSION_TOKEN_COOKIE: Cookie name for the session token.
* VAPID_PUBLIC_KEY: Public key to verify push notifications according to the VAPID specification.
* WS_ENDPOINT: Web socket endpoint.


## Versioning

0.4.0

## Authors

* **Héctor Salazar** - *hecsalazarf*

## Acknowledgments

Thanks to anyone whose code was used. This project is built on top of talented programmers' work; I just put the pieces together. 