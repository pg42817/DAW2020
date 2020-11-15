var http = require('http')
var axios = require('axios')
http.createServer(function(req,res){
    console.log(req.method +' '+ req.url)
    if(req.method=='GET')
    {
        if(req.url=='/')
        {
            res.writeHead(200,{'Content-type':'text/html;charset=utf-8'})
            res.write('<h2>Escola de Música</h2>')
            res.write('<ul>')
            res.write('<li><a href="/alunos">Lista de Alunos</a></li>')
            res.write('<li><a href="/cursos">Lista de Cursos</a></li>')
            res.write('<li><a href="/instrumentos">Lista de Instrumentos</a></li>')
            res.write('</ul>')
            res.end()
        }
        else if(req.url=='/alunos')
        {
            axios.get('http://localhost:3000/alunos')
            .then(function(resp){
                alunos=resp.data;
                res.writeHead(200,{'Content-type':'text/html;charset=utf-8'})
                res.write('<h2>Lista de Alunos</h2>')
                res.write('<ul>')
                alunos.forEach(a => {
                    res.write('<li><a href="/alunos/'+a.id+'">'+ a.id + " - "+ a.nome +'</li>')
                });
                res.write('</ul>')
                res.write('<address>[<a href="/">Voltar</a>]</address>')
                res.end()
            })
            .catch(function(error){
                console.log('Erro na obtenção da lista de alunos: '+error)
            })
        }
        else if(req.url=='/cursos')
        {
            axios.get('http://localhost:3000/cursos')
            .then(function(resp){
                curso=resp.data;
                res.writeHead(200,{'Content-type':'text/html;charset=utf-8'})
                res.write('<h2>Lista de Cursos</h2>')
                res.write('<ul>')
                curso.forEach(c=> {
                    res.write('<li><a href="/cursos/'+c.id+'">'+ c.id + " - "+ c.designacao +'</li>')
                });
                res.write('</ul>')
                res.write('<address>[<a href="/">Voltar</a>]</address>')
                res.end()
            })
            .catch(function(error){
                console.log('Erro na obtenção da lista de cursos: '+error)
            })
        }else if(req.url=='/instrumentos')
        {
            axios.get('http://localhost:3000/instrumentos')
            .then(function(resp){
                instrumento=resp.data;
                res.writeHead(200,{'Content-type':'text/html;charset=utf-8'})
                res.write('<h2>Lista de Instrumentos</h2>')
                res.write('<ul>')
                instrumento.forEach(i=> {
                    res.write('<li><a href="/instrumentos/'+i.id+'">'+ i.id + " - "+ i["#text"] +'</li>')
                });
                res.write('</ul>')
                res.write('<address>[<a href="/">Voltar</a>]</address>')
                res.end()
            })
            .catch(function(error){
                console.log('Erro na obtenção da lista de instrumentos: '+error)
            })
        }
        else if(req.url.match('(\/alunos\/A[0-9]+)$'))
        {
            axios.get('http://localhost:3000'+req.url)
            .then(function(resp){
                aluno=resp.data;
                res.writeHead(200,{'Content-type':'text/html;charset=utf-8'})
                res.write('<h2>Aluno '+ aluno.id +'</h2>')
                res.write('<p> ID: '+aluno.id+'</p>')
                res.write('<p> Nome: '+aluno.nome+'</p>')
                res.write('<p> Data de Nascimento: '+aluno.dataNasc+'</p>')
                res.write('<p>Curso: <a href="/cursos/'+aluno.curso+'">'+aluno.curso+'</a></p>')
                res.write('<p> Ano: '+aluno.anoCurso+'</p>')
                res.write('<p> Instrumento: '+aluno.instrumento+'</p>')
                res.write('<address>[<a href="/alunos">Voltar</a>]</address>')
                res.end()
            })
            .catch(function(error){
                console.log('Erro na obtenção do aluno: '+error)
            })
        }
        else if(req.url.match('(\/cursos\/(CB|CS)[0-9]+)$'))
        {
            axios.get('http://localhost:3000'+req.url)
            .then(function(resp){
                curso=resp.data;
                res.writeHead(200,{'Content-type':'text/html;charset=utf-8'})
                res.write('<h2>Curso '+ curso.designacao +'</h2>')
                res.write('<p> ID: '+curso.id+'</p>')
                res.write('<p> Duração: '+curso.duracao+'</p>')
                res.write('<p>ID do instrumento: ' + curso.instrumento.id + ' </p>')
                res.write('<p>Nome do instrumento: ' + curso.instrumento["#text"] + ' </p>')
                res.write('<address>[<a href="/cursos">Voltar</a>]</address>')
                res.end()
            })
            .catch(function(error){
                console.log('Erro na obtenção do aluno: '+error)
            })
        }
        else if(req.url.match('(\/instrumentos\/I[0-9]+)$'))
        {
            axios.get('http://localhost:3000'+req.url)
            .then(function(resp){
                instrumento=resp.data;
                res.writeHead(200,{'Content-type':'text/html;charset=utf-8'})
                res.write('<h2>' + instrumento['#text'] +'</h2>')
                res.write('<p> ID: '+instrumento.id+'</p>')
                res.end()
            })
            .catch(function(error){
                console.log('Erro na obtenção do aluno: '+error)
            })
        }
        else{
            res.writeHead(200,{'Content-type':'text/html'})
            res.write("<p>Pedido não suportado: "+req.method + " "+ req.url+"</p>")
            res.end()
        }
    }
    else
    {
        res.writeHead(200,{'Content-type':'text/html'})
        res.write("<p>Pedido não suportado: "+req.method + " "+ req.url+"</p>")
        res.end()
    }
    
}).listen(4000)

console.log('Servidor à escuta na porta 4000')