let fns = {
  hello: async (ctx, next) => {
    let name = ctx.params.name;
    // ctx.response.body = `<h1>hello ${name}</h1>`;
    await ctx.render('hello', {header: '1111', body: `hello ${name}`});
  }
};

module.exports = {
  'GET /hello/:name': fns.hello
};
