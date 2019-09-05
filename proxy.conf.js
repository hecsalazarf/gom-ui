module.exports = [
  {
    // proxy all requests starting with /api
    path: '/api',
    rule: {
      target: 'http://172.18.0.1:3000',
      changeOrigin: true,
      ws: true, // proxy websockets
      pathRewrite: {
        '^/api': ''
      },
      xfwd: true // add x-forward headers
    }
  }
]
