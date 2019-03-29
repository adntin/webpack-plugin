const qiniu = require("qiniu");
const path = require("path");

// 七牛 Node.js 文档 https://developer.qiniu.com/kodo/sdk/1289/nodejs
class UploadPlugin {
  constructor(options) {
    const {
      bucket = "",
      domain = "",
      accessKey = "",
      secretKey = ""
    } = options;
    const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
    const options = {
      scope: bucket
    };
    const putPolicy = new qiniu.rs.PutPolicy(options);
    this.uploadToken = putPolicy.uploadToken(mac);
    const config = new qiniu.conf.Config();
    this.formUploader = new qiniu.form_up.FormUploader(config);
    this.putExtra = new qiniu.form_up.PutExtra();
  }

  apply(compiler) {
    compiler.hooks.afterEmit.tapPromise("UploadPlugin", compilation => {
      const { assets } = compilation;
      const promises = [];
      Object.keys(assets).forEach(filename => {
        promises.push(this.upload(filename));
      });
      return Promise.all(promises);
    });
  }

  upload(filename) {
    const localFile = path.resolve(__dirname, "../dist", filename);
    return new Promise((resolve, reject) => {
      this.formUploader.putFile(
        this.uploadToken,
        filename,
        localFile,
        this.putExtra,
        function(respErr, respBody, respInfo) {
          if (respErr) {
            reject(respErr);
          }
          if (respInfo.statusCode == 200) {
            resolve(respBody);
          } else {
            console.log(respInfo.statusCode);
            console.log(respBody);
            reject(respBody);
          }
        }
      );
    });
  }
}

module.exports = UploadPlugin;
