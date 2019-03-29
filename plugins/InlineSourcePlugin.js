const HtmlWebpackPlugin = require("html-webpack-plugin");

// 把外链的内容拿出来, 变成内联, 嵌入到index.html
// <link href="main.css" rel="stylesheet"></link>
// <script type="text/javascript" src="bundle.js"></script>
class InlineSourcePlugin {
  constructor({ reg }) {
    this.reg = reg;
  }

  processTag(tag, compilation) {
    // { tagName: 'link', voidTag: true, attributes: { href: 'main.css', rel: 'stylesheet' } }
    // { tagName: 'script', voidTag: false, attributes: { src: 'bundle.js' } }
    // console.log(tag);
    let newTag;
    let url;
    if (tag.tagName === "link" && this.reg.test(tag.attributes.href)) {
      newTag = {
        tagName: "style",
        attributes: { type: "text/css" }
      };
      url = tag.attributes.href;
    }
    if (tag.tagName === "script" && this.reg.test(tag.attributes.src)) {
      newTag = {
        tagName: "script",
        attributes: { type: "text/javascript" }
      };
      url = tag.attributes.src;
    }
    if (url) {
      newTag.innerHTML = compilation.assets[url].source(); // 拿到源码
      delete compilation.assets[url]; // 删除原来节点(外链)
      // console.log(newTag);
      return newTag;
    }
    return tag;
  }

  processTags(data, compilation) {
    const headTags = [];
    const bodyTags = [];
    data.headTags.forEach(headTag => {
      headTags.push(this.processTag(headTag, compilation));
    });
    data.bodyTags.forEach(bodyTag => {
      bodyTags.push(this.processTag(bodyTag, compilation));
    });
    return { ...data, headTags, bodyTags }; // 覆盖源来的data
  }

  apply(compiler) {
    compiler.hooks.compilation.tap("InlineSourcePlugin", compilation => {
      HtmlWebpackPlugin.getHooks(compilation).alterAssetTagGroups.tapAsync(
        "InlineSourcePlugin",
        (data, cb) => {
          // {
          //   headTags: [ { tagName: 'link', voidTag: true, attributes: [Object] } ],
          //   bodyTags: [ { tagName: 'script', voidTag: false, attributes: [Object] } ],
          //   ...
          // }
          // console.log(data);
          data = this.processTags(data, compilation);
          cb(null, data);
        }
      );
    });
  }
}

module.exports = InlineSourcePlugin;
