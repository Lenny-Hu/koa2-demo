let fns = {
  signin: async (ctx, next)=> {
    let username = ctx.request.body.username || '';
    let password = ctx.request.body.password || '';

    console.log(`username ${username} - password ${password}`);

    if (username === 'koa' && password === '123456') {
      ctx.response.body = `hello ${username}`;
    } else {
      ctx.response.body = `login failed! <br> try again`;
    }
  },
  index: async (ctx, next) => {
    ctx.response.body = `<h1>index</h1>
    <form action="/signin" method="post">
      <p>name: <input type="text" name="username" /></p>
      <p>password: <input type="password" name="password" /></p>
      <p><input type="submit" value="submit" /></p>
    </form>    
    `;
  }
};

module.exports = {
  'GET /': fns.index,
  'POST /signin': fns.signin
};
