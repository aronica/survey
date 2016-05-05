var express = require("express");
var log = require('debug')('survey:log');
var verbose = require('debug')('survey:verbose');
//var swig = require("swig");
var fs = require("fs");
var app = express();
var path = require("path");
var statement = require("./data/state");
var bodyParser = require("body-parser");
var log4js = require("log4js");

log4js.configure({
   appenders: [
      { type: 'console' },
      { type: 'file', filename: 'survey.log', category: 'survey' }
   ]
});

app.use(log4js.connectLogger(log4js.getLogger("survey"), {level: log4js.levels.INFO}));

var logger = log4js.getLogger("App");
logger.info("Yes");

app.use(bodyParser.json());
//app.engine('html', swig.renderFile);
app.use(express.static(path.join(__dirname, 'public')));
//app.set('view engine', 'html');
//app.set('views', __dirname + '/view');

// Swig will cache templates for you, but you can disable
// that and use Express's caching instead, if you like:
app.set('view cache', false);
// To disable Swig's cache, do the following:
//swig.setDefaults({ cache: false });

app.get("/statement",function(req,res){
   res.send(JSON.stringify(statement));
});
app.post("/",function(req,res){
   var body = req.body;
   console.info(body);
   console.info(body["Company"]);
   fs.appendFileSync(path.join(__dirname,"data.csv"),""+body["Company"]+","+body["Title"]+","+body["Functions"]+
   ",\"" + body["group"][0].join(",")+"\""+
   ",\"" + body["group"][1].join(",")+"\""+
   ",\"" + body["group"][2].join(",")+"\""+
   ",\"" + body["group"][3].join(",")+"\""+
   ",\"" + body["group"][4].join(",")+"\""+"\n"
       );
   res.send("{\"status\":200}");
});

app.get("/data",function(req,res){
   var options = {
      root: __dirname + '/',
      dotfiles: 'deny',
      headers: {
         'x-timestamp': Date.now(),
         'x-sent': true
      }
   };
   res.sendFile("data.csv", options, function (err) {
      if (err) {
         console.log(err);
         res.status(err.status).end();
      }
      else {
         console.log('Sent:', "ok");
      }
   });

});

var port = process.env.PORT || 3000;
app.listen(port, function(){
   log("Listening on %s", port);
});

// 微信接口地址只允许服务放在 80 端口
// 所以需要做一层 proxy
app.enable('trust proxy');

// 当然，如果你的服务器允许，你也可以直接用 node 来 serve 80 端口
// app.listen(80);

if(!process.env.DEBUG){
   console.log("set env variable `DEBUG=webot-example:*` to display debug info.");
}