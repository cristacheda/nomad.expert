module.exports = {
  globDirectory: ".",
  cacheId: 'nomadexpert',
  globPatterns: [
    "**/*.{css,png,xml,ico,webmanifest,svg,js,json,html}"
  ],
  // globIgnores: [
  //   '**/prepros.config',
  //   'node_modules/**',
  //   'assets/scss/**',
  //   'pug/**',
  // ],
  swDest: "sw.js",

  runtimeCaching: [{
    // Match any request that ends with .png, .jpg, .jpeg or .svg.
    urlPattern: /\.(?:png|jpg|jpeg|svg)$/,

    // Apply a cache-first strategy.
    handler: 'NetworkFirst',

    options: {
      // Use a custom cache name.
      cacheName: 'images',

      // Only cache 10 images.
      expiration: {
        maxEntries: 10,
      },
    },
  }],
};