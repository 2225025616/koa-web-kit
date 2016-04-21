var router = require('koa-router')({
  // prefix: '/i'
});


router.use(function *(next) {
  console.log('index path: %s', this.path);
  yield next;
});

router.get('/', function *(next) {
  console.log('in index');
  this.body = 'OK';
});

router.get('/market/mall', function *(next) {
  console.log('in mall');
  logRequestInfo(this);
  this.body = 'Mall';
});

router.get('/userx/:id', function *(next) {
  console.log('in user');
  this.redirect('/user/id-' + this.params.id);
});

router.post('/login', function *(next) {
  console.log('body:', this.request.body);
  this.body = this.request.body;
});

router.get('/session', function *(next) {
  var n = this.session.views || 0;
  this.session.views = ++n;
  this.body = n + ' views';
});

function logRequestInfo(ctx) {
  console.log(typeof ctx.query, ctx.query);
  console.log('method: %s', ctx.method);
  console.log('url: %s', ctx.url);
  console.log('original url: %s', ctx.originalUrl);
  console.log('path: %s', ctx.path);
  console.log('query: %s', ctx.query);
  console.log('host: %s', ctx.host);
  console.log('hostname: %s', ctx.hostname);
}

module.exports = router;


