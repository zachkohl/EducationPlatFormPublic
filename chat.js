function modelForExport(config) {
    app = config.app;
    checkSession = config.checkSession;
    query = config.query;
    queryP = config.queryP;
    pool = config.pool;
    sgMail = config.sgMail;
    requireBasicPlus =  config.requireBasicPlus;
    requireMiddlePlus = config.requireMiddlePlus;
    requireAdminPlus = config.requireAdminPlus;
    checkSessionNolayoutChange = config.checkSessionNolayoutChange;
    io =config.io;
    const fs = require('fs'); //because we want to write static files. 
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


    // app.get('/chat',requireMiddlePlus, async (req, res) => {
    //     res.render('chat')
  
    // })//end get   

    // io.on('connection', function (socket) {

    //   });

    //   io.on('sendToThisId',function(id,msg){
    //     console.log(id)
    //     console.log(msg)
    //     io.broadcast.to(id).emit('my message', msg);
    // });

    // io.on('my other event', function (data) {
    //   console.log(data);
    // });


// //AJAX reciever
// app.get('/chat/api/connect',checkSession, async (req, res) => {
// console.log(req.session.username)
// io.emit('my message',req.session.username)
// })//end get   



// //SOCKET IO +++++++++++++++++++++++++++++++++++++++
// connections = []
//       io.on('connection', function(socket){
// connections.push(socket);
// console.log("Connected: %s sockets connected",connections.length)

// //disconect
// socket.on('disconnect', function(data){
//     connections.splice(connections.indexOf(socket),1)
//     console.log('Disconnected: %s sockets connected',connections.length)
// })
// //Send Message
// socket.on('send message',function(data){
//     console.log(data.msg)
//    var targetId_1 = data.socketId;
//     console.log(targetId_1)
//     io.sockets.emit('new message',{msg:data.msg})
// })
// socket.on('send message',function(data){
//     console.log(data.msg)
//    var targetId_1 = data.socketId;
//     console.log(targetId_1)
//     io.sockets.emit('new message',{msg:data.msg})
// })

//       });


      app.get('/chat',checkSession, async (req, res) => {
          //chatkit stuff https://docs.pusher.com/chatkit/reference/server-node
        chatkit.createUser({
            id: req.session.username,
            name: req.session.username,
          })
            .then(() => {
              console.log('User created successfully');
            }).catch((err) => {
              console.log(err);
            });
        res.render('chat2',{userId:req.session.uesrname})
  
    })//end get   

//PUSHER+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const Chatkit = require('@pusher/chatkit-server');
    const chatkit = new Chatkit.default({
        instanceLocator: 'v1:us1:b57aef20-cabf-4023-9289-475f1847df96',
        key: '013ad45f-8a77-4a32-98c9-50951db4f534:7/w/o5nv0kpCE1BDhafBAFHSIZV22q7PBpnAaoU+lkk=',
      })

}//end ModelForExport



module.exports = modelForExport;