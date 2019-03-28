class AsyncPlugin {
  constructor() {}

  apply(compiler) {
    console.log(2); // 根据 webpack.config.js 中 plugins 中的顺序执行

    compiler.hooks.emit.tapAsync("AsyncPlugin", (compilation, cb) => {
      setTimeout(() => {
        console.log(`tabAsync, 发射文件, 等1秒~~~${compilation}`);
        cb();
      }, 1000);
    });

    compiler.hooks.emit.tapPromise("AsyncPlugin", compilation => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log(`tapPromise, 发射文件, 等1秒~~~${compilation}`);
          resolve();
        }, 1000);
      });
    });
  }
}

module.exports = AsyncPlugin;
