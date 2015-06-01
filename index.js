//Librerias Necesarias para correr este script, deben instalarse con npm de node.

var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var _ = require('underscore');
//Terminan las librerias

var participantes = [];

//Declaracion del puerto en el que se abrira el localhost, en este caso, http://localhost:1234
var port=1234;
//termina la declaracion del puerto

//Mensaje cuando se inicia el servidor correctamente
server.listen(port,function(){
  console.log('Puedes entrar a');
});

require('dns').lookup(require('os').hostname(), function (err, add, fam) { 
  global.direccion=add+':'+port;
  console.log(direccion);
})



//Declaracion de scripts y archivos utilizados para el juego
app.get('/public/modernizr-1.5.min.js', function(req, res) {
  res.sendFile( __dirname + '/public/modernizr-1.5.min.js');
});

app.get('/public/pacman.js', function(req, res) {
  res.sendFile( __dirname + '/public/pacman.js');
});

app.get('/BD_Cartoon_Shout-webfont.ttf', function(req, res) {
  res.sendFile( __dirname + '/BD_Cartoon_Shout-webfont.ttf');
});

app.get('/audio/eating.short.ogg', function(req, res) {
  res.sendFile( __dirname + '/audio/eating.short.ogg');
});

app.get('/audio/eatghost.ogg', function(req, res) {
  res.sendFile( __dirname + '/audio/eatghost.ogg');
});

app.get('/audio/die.ogg', function(req, res) {
  res.sendFile( __dirname + '/audio/die.ogg');
});

app.get('/audio/opening_song.ogg', function(req, res) {
  res.sendFile( __dirname + '/audio/opening_song.ogg');
});

app.get('/qr.png', function(req, res) {
  res.sendFile( __dirname + '/qr.png');
});

app.get('/audio/eatpill.ogg', function(req, res) {
  res.sendFile( __dirname + '/audio/eatpill.ogg');
});

  app.get('/', function(req, res) {
    res.sendFile( __dirname + '/index.html');
  });

 
app.get('/control', function(req, res) {
  res.sendFile( __dirname + '/control.html');
});


io.on('connection', function(socket) {
  
  socket.on('envio', function(data) {
    io.emit('envio', {msg:data.msg,id:socket.id,key:data.key});
    console.log('- El usuario con ID: '+socket.id+' envio el color: '+data.msg);
  });

  socket.on('conexion', function(data) {

    participantes.push({id:data.id,key:data.key});
    console.log('- Usuario conectado con ID: '+data.id);
  });


socket.emit('direccion', { url: global.direccion });


  socket.on('pair', function(data) {
    padre = _.findWhere(participantes,{key:data.key});
    if(padre!=undefined){
      io.to(padre.id).emit('envio', {msg:data.color,id:padre.id,key:data.key});
      console.log('- Se conecto un usuario con la llave correcta :'+data.key);
    }
  });
  
  socket.on('disconnect', function() {
    participantes=_.without(participantes,_.findWhere(participantes,{id:socket.id}));
    console.log('- Se desconecto el usuario con el  ID: '+socket.id);
  });
  
});