module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  devServer: {
    disableHostCheck: true,
     public: `${process.env.C9_PID}.vfs.cloud9.us-east-1.amazonaws.com`,
  },
}
