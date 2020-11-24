var http = require('http')
var axios = require('axios')
var static = require('./static')

var {parse} = require('querystring')
const { resolveSoa } = require('dns')
const hoje = new Date().toISOString().slice(0,10);

// Aux. Functions
// Retrieves student info from request body --------------------------------
function recuperaInfo(request, callback){
    if(request.headers['content-type'] == 'application/x-www-form-urlencoded'){
        let body = ''
        request.on('data', bloco => {
            body += bloco.toString()
        })
        request.on('end', ()=>{
            console.log(body)
            callback(parse(body))
        })
    }
}

function geraPagTasks( tasks, d){

    let pagHTML = `
      <html>
          <head>
              <title>Tasks App</title>
              <meta charset="utf-8"/>
              <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css"> 
          </head>
          <body>
            <div class="w3-container w3-blue-grey" >
                <center><h1><b>Tasks App</b></h1></center>
            </div>
              <div class="w3-panel w3-border w3-bottombar">
                  <div class="w3-container w3-pale-blue" >
                      <center><h2><b>Add Task</b></h2></center>
                  </div>
                  <form class="w3-container" action="http://localhost:7777/tasks" method="POST">
                      <label class="w3-text-blue-grey"><b>Date dued</b></label>
                      <input class="w3-input w3-border w3-light-grey" type="date" min="${hoje}"name="dateDued">
                      <label class="w3-text-blue-grey"><b>Creator</b></label>
                      <input class="w3-input w3-border w3-light-grey" type="text" name="who">
                      <label class="w3-text-blue-grey"><b>Task description</b></label>
                      <input class="w3-input w3-border w3-light-grey" type="text" name="what">
                  
                      <label class="w3-text-blue-grey"><b>Type</b></label>
                      <input class="w3-input w3-border w3-light-grey" type="text" name="type">
                      
                      <center style="margin-top:2vh">
                        <b><input class="w3-btn w3-pale-blue w3-text-dark-grey" type="submit" value="Add Task"></b>
                        <b><input class="w3-btn w3-pale-blue w3-text-dark-grey" type="reset" value="Clear"> </b>
                      </center>
                  </form>
              </div>

                <div class="w3-panel w3-border w3-bottombar">
                    <div class="w3-container w3-pale-blue" >
                        <center><h2><b>Tasks List</b></h2></center>
                    </div>
                    <table class="w3-table w3-bordered">
                    <tr>
                        <th class="w3-text-blue-grey">ID</th>
                        <th class="w3-text-blue-grey">Date Created</th>
                        <th class="w3-text-blue-grey">Date Dued</th>
                        <th class="w3-text-blue-grey">Creator</th>
                        <th class="w3-text-blue-grey">Task</th>
                        <th class="w3-text-blue-grey">Type</th>
                    </tr>           
    `
    tasks.forEach(t => {
        if(t.status=="To Do")
        {
            pagHTML+=`
                    <tr>
                        <td>${t.id}</td>
                        <td>${t.dateCreated}</td>
                        <td>${t.dateDued}</td>
                        <td>${t.who}</td>
                        <td>${t.what}</td>
                        <td>${t.type}</td>
                        <td><a href="http://localhost:7777/tasks/do/${t.id}" class="w3-button w3-black">Mark as done</a></td>
                    </tr>`
        }   
    });
    pagHTML+=`
                    </table>
                </div>
                <div class="w3-panel w3-border w3-bottombar">
                    <div class="w3-container w3-pale-blue" >
                        <center><h2><b>Tasks Done</b></h2></center>
                    </div>
                    <table class="w3-table w3-bordered">
                    <tr>
                        <th class="w3-text-blue-grey">ID</th>
                        <th class="w3-text-blue-grey">Date Created</th>
                        <th class="w3-text-blue-grey">Date Dued</th>
                        <th class="w3-text-blue-grey">Creator</th>
                        <th class="w3-text-blue-grey">Task</th>
                        <th class="w3-text-blue-grey">Type</th>
                    </tr> 
                    `
                    tasks.forEach(t => {
                        if(t.status=="Done")
                        {
                            pagHTML+=`
                                    <tr>
                                        <td>${t.id}</td>
                                        <td>${t.dateCreated}</td>
                                        <td>${t.dateDued}</td>
                                        <td>${t.who}</td>
                                        <td>${t.what}</td>
                                        <td>${t.type}</td>
                                        <td><a href="http://localhost:7777/tasks/delete/${t.id}" class="w3-button w3-red">Delete</a></td>
                                    </tr>`
                        }
                    });
    pagHTML+=`
                    </table>
                </div>
          </body>
      </html>
    `
    return pagHTML
  }



// Server setup
var tasksServer = http.createServer(function (req, res) {
    // Logger: que pedido chegou e quando
    var d = new Date().toISOString().substr(0, 16)
    console.log(req.method + " " + req.url + " " + d)

    // Request processing
    // Tests if a static resource is requested
    if(static.recursoEstatico(req)){
        static.sirvoRecursoEstatico(req, res)
    }
    else{
    // Normal request
    switch(req.method){
        case "GET": 
            // GET /alunos --------------------------------------------------------------------
            if((req.url == "/") || (req.url == "/tasks")){
                axios.get("http://localhost:3000/tasks?_sort=dateDued")
                    .then(response => {
                        var tasks = response.data
                        res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                        res.write(geraPagTasks(tasks, d))
                        res.end()
                    })
                    .catch(function(erro){
                        res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                        res.write("<p>Não foi possível obter a lista de alunos...")
                        res.end()
                    })
            }
            else if(req.url.match(/\/tasks\/do\/[0-9]+$/)){
                var partes = req.url.split('/')
                var idTask = partes[partes.length -1 ]            
                axios.get("http://localhost:3000/tasks/"+idTask)
                    .then(response => {
                        var task = response.data
                        task.status = "Done"
                        axios.put("http://localhost:3000/tasks/" +idTask,task)
                            .then(resp => {                                               
                                axios.get("http://localhost:3000/tasks?_sort=dateDued")
                                .then(response => {
                                    var tasks = response.data
                                    res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                                    res.write(geraPagTasks(tasks, d))
                                    res.end()
                                })
                                .catch(function(erro){
                                    res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                                    res.write("<p>Não foi possível obter a lista de alunos...")
                                    res.end()
                                })
                            })
                            .catch(erro => {
                                res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                                res.write('<p>Erro no PUT: ' + erro + '</p>')
                                res.write('<p><a href="/">Voltar</a></p>')
                                res.end()
                            })
                        
                    })
                    .catch(function(erro){
                        res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                        res.write("<p>Não foi possível obter a task...")
                        res.end()
                    })
            }
            else if(req.url.match(/\/tasks\/delete\/[0-9]+$/)){
                var partes = req.url.split('/')
                var idTask = partes[partes.length -1 ]            
                axios.get("http://localhost:3000/tasks/"+idTask)
                    .then(response => {
                        var task = response.data
                        task.status = "Done"
                        axios.delete("http://localhost:3000/tasks/" +idTask,task)
                            .then(resp => { 
                                axios.get("http://localhost:3000/tasks?_sort=dateDued")
                                .then(response => {
                                    var tasks = response.data
                                    res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                                    res.write(geraPagTasks(tasks, d))
                                    res.end()
                                })
                                .catch(function(erro){
                                    res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                                    res.write("<p>Não foi possível obter a lista de alunos...")
                                    res.end()
                                })                                       
                            })
                            .catch(erro => {
                                res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                                res.write('<p>Erro no PUT: ' + erro + '</p>')
                                res.write('<p><a href="/">Voltar</a></p>')
                                res.end()
                            })
                        
                    })
                    .catch(function(erro){
                        res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                        res.write("<p>Não foi possível obter a task...")
                        res.end()
                    })
            }
            else{
                res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                res.write("<p>" + req.method + " " + req.url + " não suportado neste serviço.</p>")
                res.end()
            }
            break
        case "POST":
            if(req.url=="/tasks"){
                recuperaInfo(req,resultado =>{
                    resultado.status="To Do"
                    resultado.dateCreated= hoje;
                    console.log("POST de task " + JSON.stringify(resultado.id))
                    axios.post("http://localhost:3000/tasks",resultado)
                        .then(resp=>{
                            axios.get("http://localhost:3000/tasks?_sort=dateDued")
                            .then(response => {
                                var tasks = response.data
                                res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                                res.write(geraPagTasks(tasks, d))
                                res.end()
                            })
                            .catch(function(erro){
                                res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                                res.write("<p>Não foi possível obter a lista de alunos...")
                                res.end()
                            })       
                                
                        })
                        .catch(erro => {
                            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                            res.write('<p>Erro no POST: ' + erro + '</p>')
                            res.write('<p><a href="/">Voltar</a></p>')
                            res.end()
                        })
                })
            }
        default: 
            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
            res.write("<p>" + req.method + " não suportado neste serviço.</p>")
            res.end()
    }
    }
})

tasksServer.listen(7777)
console.log('Servidor à escuta na porta 7777...')


