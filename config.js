//Local Variable
if (process.env.NODE_ENV !== 'production') {
require('dotenv').load();
    }
//prep export object
config = {};

//Express +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const express = require('express');
const helmet = require('helmet');
const path = require('path') ;
const PORT = process.env.PORT || 80;
const app = express(); 
app.use(helmet())
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(bodyParser.json()); 
var exphbs = require('express-handlebars');
app.engine('handlebars', exphbs({defaultLayout: 'loggedout'}));
app.set('view engine', 'handlebars');
//app.set('views',[__dirname +"/views"+"/test",__dirname+'/views'])
//app.set('views', [path.join(__dirname,'views'),path.join(__dirname,'views','test')]);
app.set('views','./views')
app.use(express.static('static'));
//app.listen(PORT, () => console.log('Example app listening on port 80!')) //see Socket.io below for new implementation


config.app = app;
//Database +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
var { Pool, Client } = require('pg')

var client = new Client({
connectionString: process.env.DATABASE_URL,
ssl: true,
});

var pool = new Pool({
connectionString: process.env.DATABASE_URL,
ssl: true,
});


client.connect();


function query(text, values,callback,errorLog) {
  //Query

 
  pool.query(text, values, (err, response) => {
    
    if (err) {
      // console.log(JSON.stringify(err.stack));
console.log(err.stack.split('\n',1)[0])
    } 
    else {
      if (response.rows) {
        callback(response); //must use var because we want function scope. 
        return response;
      } 
      else {
        console.log('no rows')
        errorLog('no rows');
      };
      
      };//end else

  })//end pool.query
  
};//end query


async function queryP(text, values,errorLog) {
  //Query
  const client = await pool.connect()
  let response;
  try{
    response = await client.query(text,values)
          if (response.rows) {
        return response;
      } 
      else {
        console.log('no rows')
        errorLog('no rows');
      };
  }
  catch(e){
    console.log(e.stack)
  }
finally{
  client.release();
}
  // (async () => {
  //   const client = await pool.connect()
  //   try {
  //     const res = await client.query('SELECT * FROM users WHERE users_id = $1', [1])
  //     //console.log(res.rows[0])
  //     return new Promise(resolve => {resolve(res)},1000);
  //   } finally {
  //     client.release()
    
  //   }
  // })().catch(e => console.log(e.stack))
  
};//end queryP

// let text = 'INSERT INTO adult (adult_name) VALUES ($1) ON CONFLICT (adult_name) DO UPDATE SET adult_name = $1 RETURNING *'
// let values = [adultNames[i][1]];
// query(text, values, callback);
// function callback(data) {
// //data.rows
//         }//end callback definition

config.query = query;
config.queryP = queryP;
config.pool = pool;
config.client = client;
//Session +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const session = require('express-session');
pgSession = require('connect-pg-simple')(session); //This all ends up encrypted on the client side. Used wireshark to check. 

var sess = {
  store: new pgSession({
    pool : pool,                // Connection pool
     // Use another table-name than the default "session" one
  }),
  secret: process.env.COOKIE_SECRET,
  cookie: {},
  resave: false,
  saveUninitialized: true
}
 
if (app.get('env') === 'production') {
  app.set('trust proxy', 1) // trust first proxy
  sess.cookie.secure = true // serve secure cookies
}
 
app.use(session(sess))

//connect-flash
let cookieParser = require('cookie-parser')
let flash = require('connect-flash');
app.use(cookieParser(process.env.COOKIE_SECRET))
app.use(flash());


//Session stuff
//https://www.npmjs.com/package/express-session
//https://www.npmjs.com/package/connect-pg-simple
//https://www.tutorialspoint.com/expressjs/expressjs_authentication.htm (seems very good)

function checkSession(req, res, next) {
  if (req.session.user){ //Does the session exist? Recall that the express-session is using its own id system in the background to hook into a specific user profile. 
    res.locals.layout = "loggedin";
    next(); //https://stackoverflow.com/questions/10695629/what-is-the-parameter-next-used-for-in-express Basically next is a special object in express that passes control to the next MATCHING route
  } else {
    res.redirect('/login');
    process.stdout.write('not logged in');

  }
};
function requireBasicPlus(req, res, next) {
  if (req.session.user){ //Does the session exist? Recall that the express-session is using its own id system in the background to hook into a specific user profile. 
    res.locals.layout = "loggedin";
    next(); //https://stackoverflow.com/questions/10695629/what-is-the-parameter-next-used-for-in-express Basically next is a special object in express that passes control to the next MATCHING route
  } else {
    res.redirect('login');
    process.stdout.write('not logged in');

  }
};
function requireMiddlePlus(req, res, next) {
  if (req.session.user){ //Does the session exist? Recall that the express-session is using its own id system in the background to hook into a specific user profile. 
    if(req.session.role === 'admin' || req.session.role ==='Debbie' || req.session.role === 'Raja'){
      res.locals.layout = "loggedin";
      next(); 
    }else{
      res.send('Your account does not have premission to view this page, please contact your administrator for asstance with this feature');
      return;
    }
  
  } else {
    res.redirect('login');
    process.stdout.write('not logged in');

  }
};
function requireAdminPlus(req, res, next) {
  if (req.session.user){ //Does the session exist? Recall that the express-session is using its own id system in the background to hook into a specific user profile. 
    if(req.session.role === 'admin'){
      res.locals.layout = "loggedin";
      next(); 
    }else{
      res.send('Your account does not have premission to view this page, please contact your administrator for asstance with this feature');
      return;
    }
  
  } else {
    res.redirect('login');
    process.stdout.write('not logged in');

  }
};

function checkSessionNolayoutChange(req, res, next) {
  if (req.session.user){ //Does the session exist? Recall that the express-session is using its own id system in the background to hook into a specific user profile. 

    next(); //https://stackoverflow.com/questions/10695629/what-is-the-parameter-next-used-for-in-express Basically next is a special object in express that passes control to the next MATCHING route
  } else {
    res.redirect('login');
    process.stdout.write('not logged in');

  }
};

config.checkSession = checkSession;
config.checkSessionNolayoutChange = checkSessionNolayoutChange;
config.requireBasicPlus =requireBasicPlus;
config.requireMiddlePlus =requireMiddlePlus;
config.requireAdminPlus =requireAdminPlus;

//Socket.io++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
var server = require('http').Server(app);
var io = require('socket.io')(server);
server.listen(PORT,console.log('listening on port '+PORT));

config.io = io;

//https://socket.io/docs/#Installing




//FileUpload +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// const fileUpload = require('express-fileupload');
// app.use(fileUpload());


//SENDGRID ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// using SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

config.sgMail = sgMail;




//Export +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


module.exports = config;