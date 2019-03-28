class DonePlugin {
  constructor() {}

  apply(compiler) {
    console.log(1); // 根据 webpack.config.js 中 plugins 中的顺序执行

    compiler.hooks.done.tap("DonePlugin", state => {
      console.log(`编译完成~~~${state}`);
    });
  }
}

module.exports = DonePlugin;
