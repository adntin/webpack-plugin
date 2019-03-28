class FileListPlugin {
  constructor({ filename }) {
    this.filename = filename;
  }

  apply(compiler) {
    // 文件已经准备好了, 要进行发射
    compiler.hooks.emit.tap("FileListPlugin", compilation => {
      const { assets } = compilation;
      // console.log(assets);
      // { 'bundle.js':
      //     CachedSource {
      //       _source: ConcatSource { children: [Array] },
      //       _cachedSource: undefined,
      //       _cachedSize: 3888,
      //       _cachedMaps: {},
      //       node: [Function],
      //       listMap: [Function]
      //     },
      //   'index.html': {
      //     source: [Function: source],
      //     size: [Function: size]
      //   }
      // }
      let content = "###  文件名  资源大小\r\n";
      Object.entries(assets).forEach(([key, value]) => {
        content += `- ${key}  ${value.size()} bytes\r\n`;
      });
      // 资源对象, 只要往里添加, 就会被发射出来
      assets[this.filename] = {
        source() {
          return content;
        },
        size() {
          return content.length;
        }
      };
    });
  }
}

module.exports = FileListPlugin;
