// 自定义中间件，虽然下面的代码是同步的！，异步的一定要写成async这种形式的
module.exports = async (ctx, next) => {
  console.log(`logger-----> ${ctx.request.method} ${ctx.request.url}`);
  await next();
};

