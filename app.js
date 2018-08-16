const path = require('path');
const _  = require('lodash');
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const views = require('koa-views');
const koaStatic = require('koa-static');

const routes = require('./controller');
const logger = require('./middlewares/logger');

const app = new Koa();

// 记时间
app.use(async (ctx, next) => {
  let timeLabel = `${Date.now()}-${ctx.request.url}`;
  console.time(timeLabel);
  await next();
  console.timeEnd(timeLabel);
});

// 使用pug模块
app.use(views(path.join(__dirname, './views'), {extension: 'pug'}));

// 静态资源
app.use(koaStatic(path.join(__dirname, './static'), {maxage: 1000 * 60})); // 缓存单位：毫秒

// 使用nunjucks模块引擎
// const nunjucks = require('nunjucks');
// let cteateNunjucksEnv = (path, opts) => {
//   // 更多参数查看 http://mozilla.github.io/nunjucks/cn/api.html#environment
//   let autoescape = opts.autoescape === undefined ? true : opts.autoescape;
//   let noCache = opts.noCache || false;
//   let watch = opts.watch || false;
//   let throwOnUndefiend = opts.throwOnUndefined || false;
//
//   let env = new nunjucks.Environment(
//     // 使用 FileSystemLoader 加载模板
//     new nunjucks.FileSystemLoader(path || 'views', {
//       noCache: noCache, // Nunjucks会缓存已读取的文件内容，也就是说，模板文件最多读取一次，就会放在内存中，后面的请求是不会再次读取文件的
//       watch: watch
//     }, {
//       autoescape: autoescape,
//       throwOnUndefined: throwOnUndefiend
//     })
//   );
//
//   // 添加过滤函数
//   if (opts.filters) {
//     for (let f in opts.filters) {
//       console.log('添加过滤器', f);
//       env.addFilter(f, opts.filters[f]);
//     }
//   }
//   return env; // 返回Nunjucks模板引擎对象
// };
// let nunjucksEnv = cteateNunjucksEnv('views', {
//   watch: true,
//   noCache: true,
//   filters: { // 过滤函数主要用在模版html中，类似vue，angular的过滤器，如：{{data | shorten}}
//     hex: (n) => {
//       return '0x' + n.toString(16);
//     },
//     shorten: (str, count) => {
//       return str.slice(0, count || 5);
//     }
//   }
// });
// 结合koa-views使用
// app.use(views(`${__dirname}/views`, {
//   options: {
//     nunjucksEnv: nunjucksEnv
//   },
//   map: {
//     html: 'nunjucks'
//   }
// }));
// // 单独使用
// let test = nunjucksEnv.render('hello.html', {header: '1111', body: '2222'});
// console.log(test);

app.use(bodyParser());

app.use(logger);

// 写cookie
app.use(async (ctx, next) => {
  ctx.cookies.set('koa-cookie', Date.now());
});

app.use(routes());

// 自定义404
app.use(async (ctx, next) => {
  ctx.response.status = 404;
  ctx.response.body = 'Not Found';
});

// 错误处理
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (e) {
    let status = 500;
    let message = 'Server Error';
    if (_.isObject(e)) {
      status = e.statusCode || err.status || status;
      message = e.message || message;
    }
    ctx.response.status = status;
    ctx.response.body = message;
    ctx.app.emit('error', e, ctx);
  }
});

// 处理没有被中间件处理的路由
app.use(async (ctx, next) => {
  ctx.throw(500);
});

app.on('error', (err, ctx) => {
  // 此处可将错误日志写入文件
  console.log('可将错误日志写入文件');
  console.log(err);
});

app.listen(3000);

console.log('app started at port 3000...');
