var http = require('http')
var fs = require('fs')
var aux = require('./mymod')

http.createServer(function(req,res){
    console.log(req.method + " " + req.url + " " + aux.myDateTime())
    
    if(req.url.match(/\/arq\/[0-9]{1,3}$/))
    {   
        var pag = req.url.replace('/arq/', '');
        fs.readFile("site/arq"+pag+".html",function(err,data){
        res.writeHead(200,{'Content-Type':'text/html'})
        res.write(data)
        res.end()
        })
    }
    else{
        fs.readFile("site/index.html",function(err,data){
        res.writeHead(200,{'Content-Type':'text/html'})
        res.write(data)
        res.end()
        })
    }

}).listen(7777)