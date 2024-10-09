module.exports = {
  presets: [
    [
      '@vue/cli-plugin-babel/preset',
      {
        targets: {
          esmodules: true,
          browsers: [
            "last 2 versions",
            "not dead",
            "not ie 11",
            "not < 1%"
          ]
        }
      }
    ]
  ]
};
