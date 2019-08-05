# Valid HTTPS certificates for localhost

## Description

[mkcert](https://github.com/FiloSottile/mkcert) is a tool that hides all the arcane knowledge required to generate valid TLS certificates. It doesn't generate self-signed certificates, but certificates signed by your own private CA, which your machine is automatically configured to trust when you run:

```bash
$ mkcert -install 
```
## Installation

See mkcert [installation](https://github.com/FiloSottile/mkcert#installation) for details.

## Certificate creation

```bash
$ mkcert example.com "*.example.com" example.test localhost 127.0.0.1 ::1 
```

## Usage

After creating the certificate, reference the key and cert file in the https dev server configuration (quasar.conf.js).

Aditionally, you'll need the root CA file, which you can find (in Linux) in ~/.local/share/mkcert/

```js
// quasar.conf.js
const fs = require('fs')
// ...

devServer: {
  https: {
    key: fs.readFileSync('./certs/localhost+10-key.pem'),
    cert: fs.readFileSync('./certs/localhost+10.pem'),
    ca: fs.readFileSync('./certs/rootCA.pem'),
  }
}
```
