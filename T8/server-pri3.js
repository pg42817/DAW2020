var express = require('express')
var bodyParser = require('body-parser')
var templates = require('./html-templates')
var jsonfile=require('jsonfile')
var logger = require('morgan')
var multer=require('multer')
const { json } = require('body-parser')
const { fstat } = require('fs')
var upload = multer({dest:'uploads/'})
var app = express()
var fs = require('fs')

app.use(bodyParser.urlencoded({extended:false}))

app.use(bodyParser.json())

app.use(express.static('public'))

app.get('/',function(req,res){
    var d=new Date().toISOString().substr(0,16)
    var files=jsonfile.readFileSync('./dbFiles.json')
    res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'})
    res.write(templates.fileList(files,d))
    res.end()
})

app.get('/files/upload',function(req,res){
    var d=new Date().toISOString().substr(0,16)
    res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'})
    res.write(templates.fileForm(d))
    res.end()
})

app.get('/files/download/:fname',function(req,res){
    res.download(__dirname+'/public/fileStore/'+req.params.fname)
})

app.post('/files',upload.array('myFiles'),function(req,res){
    var d=new Date().toISOString().substr(0,16)

    
    var files=jsonfile.readFileSync('./dbFiles.json')

    for(var i = 0; i < req.files.length; i++){
        let oldPath = __dirname + '/' + req.files[i].path
        let newPath = __dirname + '/public/fileStore/' + req.files[i].originalname
    
        fs.rename(oldPath,newPath, function(err){
            if(err) throw err
        })
        
        
        files.push(
            {
                date: d,
                name: req.files[i].originalname,
                size: req.files[i].size,
                mimetype: req.files[i].mimetype,
                desc: req.body.desc
            }
        )
    }
    jsonfile.writeFileSync('./dbFiles.json',files)
    res.redirect('/')
})


app.listen(7703,()=>console.log('Servidor à escuta na porta 7703...'))