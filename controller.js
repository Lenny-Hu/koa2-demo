const fs = require('fs');
const path = require('path');

let addMapping = (router, mapping) => {
  for (let url in mapping) {
    if (url.startsWith('GET')) {
      // 处理get请求
      let path = url.substring(4);
      router.get(path, mapping[url]);
      console.log(`register url mapping: get ${path}`);
    } else if (url.startsWith('POST')) {
      // 处理post请求
      let path = url.substring(5);
      router.post(path, mapping[url]);
      console.log(`register url mapping: post ${path}`);
    } else {
      console.log('invalid url: ${url}');
    }
  }
};

let addControllers = (router, dir) => {
  let resPath = path.resolve(__dirname, `./${dir}`);
  // 获取并自动加载控制器
  let controllersFiles = fs.readdirSync(resPath);
  // 过滤出js文件
  let jsFiles = controllersFiles.filter((file) => {
    return file.endsWith('.js');
  });
  // 处理每个js文件
  for (let f of jsFiles) {
    console.log(`当前js文件 ${f}`);
    // 导入js文件
    let mapping = require(`${resPath}/${f}`);
    addMapping(router, mapping);
  }
};

module.exports = (dir) => {
  let controllersDir = dir || 'controllers';
  let router = require('koa-router')();
  addControllers(router, controllersDir);
  return router.routes();
};
