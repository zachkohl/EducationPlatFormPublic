config = require('./config');

config.app.get('/',config.checkSession, function (req, res) {
   switch(req.session.role){
case 'student':
res.redirect('quiz');
break;
case 'admin':
res.render('landing')
break;
case 'Debbie':
res.redirect('answers');
break;
case 'Raja':
res.redirect('answers');
break;
default:
res.redirect('login')
}



});//end '/'

config.app.get('/test', function (req, res) {

    res.render('test')
 });//end '/home'
//show all routes



 //FEATURES

 login = require('./login.js')(config);

 questionEditor = require('./questionEditor.js')(config);

 quiz = require('./quiz.js')(config);

catagoryEditor = require('./catagoryEditor.js')(config);

readAnswers = require('./readAnswers.js')(config);

//grader = require('./grader.js')(config);

users = require('./users.js')(config);

chat = require('./chat.js')(config);

iframe = require('./iframe.js')(config);

prepData = require('./prepdata.js')(config);
