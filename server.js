// 需要先安装 ecstatic `npm install ecstatic` 才能正常使用.

let {createServer} = require("http");
let fs = require("fs");
let url = require("url");
let port = process.argv[2];
let ecstatic = require("ecstatic");
let fileServer = ecstatic({root:"."});

if(!port) {
  console.log("No port found!");
  process.exit(1);
}

let server = createServer((request, response) => {
 let parsedUrl = url.parse(request.url, true);
 let path = parsedUrl.pathname;
 let query = parsedUrl.query;
 let amount = fs.readFileSync("./db", "utf8");
 amount -= 1;
 fs.writeFileSync("./db", amount);

   if(path === '/'){
     fileServer(request, response);
   } else if (path === "/pay") {
     response.statusCode = 200;
     response.setHeader("Content-Type", "application/javascript");
     response.write(`
       ${query.callback}.call(undefined, ${amount});
       `)
      response.end();
    } else {
       response.statusCode = 404
       response.setHeader('Content-Type', 'text/html;charset=utf-8')
       response.write('呜呜呜')
       response.end()
    }
  })


server.listen(port);
