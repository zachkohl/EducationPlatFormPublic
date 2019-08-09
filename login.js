
function login(config) {
  app = config.app;
  checkSession = config.checkSession;
  query  = config.query;
  pool = config.pool;
  sgMail = config.sgMail;
  requireBasicPlus =  config.requireBasicPlus;
  requireMiddlePlus = config.requireMiddlePlus;
  requireAdminPlus = config.requireAdminPlus;
  checkSessionNolayoutChange = config.checkSessionNolayoutChange;

  //___________________________REGISTRATION____________________________________
  var bcrypt = require('bcrypt');

  // app.get('/register', function (req, res) { //This is how you render views (views are like templates in Jinga/Flask)
  //   res.render('register') //Must use this dictonary looking thing, format appears to be [variable used in view]:[current scope variable or a hard coded value]. 
  // })


  // app.post('/register', function (req, res) {
  //   //form validation
  //   username = req.body.username;
  //   email = req.body.email;
  //   password = req.body.password;
  //   role = "admin" //HARD CODED FOR NOW


  //   bcrypt.hash(password, 10, function (err, hash) { //This code won't fire till the hash variable is ready, this is called a "callback." Now we will only store things in the database once everything is read to go. 
  //     if (err) {
  //       console.log(err)
  //       process.stdout.write('error hashing password')
  //     } else {

  //       //Query

  //       let text = 'INSERT INTO users(users_username, users_email,users_storedHash,users_role) VALUES($1, $2, $3,$4) RETURNING *' // everything after RETURNING are the columns that you want in what gets returned, use a * for everything. 
  //       let values = [username, email, hash, role]

  //       let response = res; //create a globalish variable. 
  //       let request = req;
  //       pool.query(text, values, (err, res) => {
  //         if (err) {
  //           console.log(err.stack)
  //           process.stdout.write('Already have a user by this name')

  //           response.render('register', { message: "Aready have a user by this username" });
  //         } else {
  //           console.log(res.rows[0])
  //           req.session.user = username; //NewUser is the username provided by the form.
  //           login(username, password, request, response)
  //         }
  //       })//end query

  //     }//end else

  //   }); //end hashing function


  // });// end app.post





  app.get('/login', function (req, res) {
    res.render('login')
  })

  app.post('/login', function (req, res) {
    username = req.body.username;
    password = req.body.password;
    login(username, password, req, res);
  });// end app.post


  function login(username, password, req, res) {
    let text = 'SELECT * FROM users WHERE users_username = $1' // everything after RETURNING are the columns that you want in what gets returned, use a * for everything. 
    let values = [username]
    let response = res; //create a globalish variable. 
    pool.query(text, values, (err, res) => {
      if (err) {
        console.log(err.stack)
        process.stdout.write(err)
        response.render('login', { message: "unknown error" });
      }
      else {
        if (res.rows[0]) {
          console.log(res.rows[0].users_id)
          console.log(res.rows[0].users_storedhash)
          var userIdForSession = res.rows[0].users_id;
          var userRole = res.rows[0].users_role;
          bcrypt.compare(password, res.rows[0].users_storedhash, function (err, res) {
            if (err) {
              console.log(err.stack);
              process.stdout.write('error compairing passwords');
              response.render('login', { message: "error compairing passwords" });

            } else {
              if (res) {
                // req.session.user = username;
                // req.session.userId = userIdForSession;
                // finish(req.session.user); 
                // function finish(exists){
                //   console.log('login success');
                //   title = 'login success';
                //   response.redirect('/');
                //   return
                // }
            
                  req.session.user = username;
                   req.session.userId = userIdForSession;
                   req.session.role = userRole;
                   req.session.save(function(err){
                    req.session.reload(function(err) {
                      response.redirect('/');
                    }) 
                })
                
       

                // const msg = {
                //   to: 'zach.kohl@gmail.com',
                //   from: 'DONOTREPLY@stargarnet.net',
                //   subject: 'Sending with SendGrid is Fun',
                //   text: 'and easy to do anywhere, even with Node.js',
                //   html: '<strong>and easy to do anywhere, even with Node.js</strong>',
                // };
                // sgMail.send(msg);
              }
              else {
                console.log('password fail');
                response.render('login', { message: "password fail" });
              }
            }
          });

        }
        else {
          console.log('search resulted in zero')
          response.render('login', { message: "username not registered" });
        }
      }
    })
  }



  app.get('/logout', checkSessionNolayoutChange, function (req, res, next) {

    req.session.destroy(); //Deletes the session after the response is read. https://www.npmjs.com/package/express-session

    res.render('logout')
  });//end logout


  //++++++++++++++EMAIL PASSWORD RESET CODE++++++++++++++++++++++

//   app.get('/passwordreset', checkSession, function (req, res) {
//     res.render('passwordreset', { message: req.flash('info') })
//   })

//   app.post('/passwordreset', checkSession, function (req, res) {

//     username = req.session.user;
//     password = req.body.password;
//     newPassword = req.body.newPassword;

//     console.log('username: ' + username);
//     console.log('old password: ' + password);
//     console.log('new password: ' + newPassword);

//     // console.log('flag 1')
//     let text = 'SELECT users_storedhash FROM users WHERE users_username = $1' // everything after RETURNING are the columns that you want in what gets returned, use a * for everything. 
//     let values = [username]
//     let response = res; //create a globalish variable. 
//     pool.query(text, values, (err, res) => {
//       if (err) {
//         console.log(err.stack)
//         process.stdout.write(err)
//         req.flash('info', "unknown error")
//         response.redirect('/passwordreset')
//       }
//       else {
//         // console.log('flag 2')
//         if (res.rows[0]) {
//           console.log('storedhash: ' + res.rows[0].users_storedhash)
//           // console.log('flag 3: compared passwords')
//           bcrypt.compare(password, res.rows[0].users_storedhash, function (err, res2) {

//             if (err) {

//               console.log(err.stack);
//               req.flash('info', "error compairing passwords")
//               response.redirect('/passwordreset')
//             } else {
//               // console.log('flag 4')
//               console.log(res2)
//               if (res2) {
//                 // console.log('flag 5')
//                 //  console.log(res2)
//                 bcrypt.hash(newPassword, 10, function (err, hash) { //This code won't fire till the hash variable is ready, this is called a "callback." Now we will only store things in the database once everything is read to go. 
//                   if (err) {
//                     console.log(err)
//                     req.flash('info', "error hashing new password")
//                     response.redirect('/passwordreset')
//                   } else {
//                     //  if (hash){
//                     //Query
//                     // console.log('flag 6')
//                     console.log('new hash: ' + hash)
//                     let text = 'UPDATE users SET users_storedhash = $1 WHERE users_username = $2 '
//                     let values = [hash, username]
//                     pool.query(text, values, (err, res) => {
//                       if (err) {
//                         console.log(err.stack)
//                         req.flash('info', "unknown error")
//                         response.redirect('/passwordreset')
//                       } else {
//                         // console.log('flag 7')
//                         req.flash('info', "password reset successfully!")
//                         response.redirect('/passwordreset')
//                       }
//                     })//end query
//                     // }//end if (needed to wait for has to complete)
//                   }//end else

//                 }); //end hashing function
//               }
//               else {
//                 console.log('password fail');
//                 req.flash('info', "not the current password")
//                 response.redirect('/passwordreset')
//               } //end outer else: responsible for compare hash test
//             }
//           })//end compare
//         }//end if rows
//       }//end else
//     })//end pool query
//   })



//   app.get('/sendpasswordreset', function (req, res) {
//     res.render('sendpasswordreset',{message:req.flash('info')})
//   })



//   app.post('/sendpasswordreset', function (req, res) {
//     email = req.body.email;
//     let text = 'SELECT * from users WHERE users_email = $1'
//     let values = [email];
//     query(text, values, callback);
//     function callback(data) {
//       if (data.rows[0]) {
//         console.log('is in database')
//         console.log(data.rows)

//         let crypto = require('crypto'); //https://nodejs.org/api/crypto.html#crypto_crypto_randombytes_size_callback
//         crypto.randomBytes(15, (err, buff) => {
//           if (err) throw err;
//           var randomPassword = buff.toString('hex');
//           console.log(randomPassword)

//           bcrypt.hash(randomPassword, 10, function (err, hash) { //This code won't fire till the hash variable is ready, this is called a "callback." Now we will only store things in the database once everything is read to go. 
//           if (err) {
//             console.log(err)
//             res.render('passwordemailsent')
//           } else {
           
//             let text = 'INSERT INTO temppasswords(temppasswords_storedhash, temppasswords_email) VALUES($1, $2) ON CONFLICT (temppasswords_email) DO UPDATE SET temppasswords_storedhash = $1, temppasswords_timestamp = current_timestamp RETURNING *' // everything after RETURNING are the columns that you want in what gets returned, use a * for everything. 
//             let values = [hash, email]
//             query(text, values, callback);
//             function callback(data) {
//             console.log(data.rows)
           
//               let msg = {
//                 to: email,
//                 from: 'DONOTREPLY@teen-aid.com',
//                 subject: 'Password reset for teen-aid',
//                 text: 'This email was generated because a request was made for a password reset for the teen-aid online application. If this was unintended, please ignore, otherwise, follow this link: http://localhost/sendpasswordreset/',
//                 html: '<strong>TEEN AID PASSWORD RESET REQUESTED</strong>\
//                 <p>To finish resetting your password, please click <a clicktracking=off href="https://teen-aid.herokuapp.com/recievepasswordemail?password=' + randomPassword + '&email='+email+'">here</a></p>\
//                 ',
//               };
//               sgMail.send(msg);
//               res.render('passwordemailsent')

   


//                     }//end callback definition
    
//           }//end else

//         }); //end hashing function

//           //Query

//         });


//       }
//       else {
//         console.log('emal is not in database')
//         res.render('passwordemailsent')
//       }

//     }//end callback definition


//   })//end post sendpasswordreset

//   app.get('/recievepasswordemail',(req,res)=>{
//     password = req.query.password;
//     email = req.query.email;
//     console.log(password)
//     console.log(email)
//     let text = "SELECT * from temppasswords WHERE temppasswords_email = $1 AND temppasswords_timestamp > current_timestamp - interval '12 hours'"
//     let values = [email];
//     query(text, values, callback);
//     function callback(data) {
//       if (data.rows[0]) {
//         console.log('is in database')

//         console.log(data.rows)

//         bcrypt.compare(password, data.rows[0].temppasswords_storedhash, function (err, responseCompare) {
//           if (err) {
//             console.log(err.stack);
//             process.stdout.write('error compairing passwords');
//             res.send('please do not modify the link sent to you in anyway. if this problem parsist, contact your system administrator.');

//           } else {
//             if (responseCompare) {
//             console.log('ready to update real password')
//             let text = "SELECT users_username from users WHERE users_email = $1"
//             let values = [email];
//             query(text, values, callback);
//             function callback(data) {
//               res.render('recievepasswordemail',{username:data.rows[0].users_username})
//             }
             
//             }//end if
//           }//end else
//         });//end compare




//       }//end if
//     }//end callback

//   //  res.send('There was an internal error, please contact your system administrator')
//   })


// app.post('/recievepasswordemail',(req,res)=>{
//   password=req.body.password;
//   username=req.body.username;
//   console.log(password);
//   console.log(username);

//   bcrypt.hash(password, 10, function (err, hash) { //This code won't fire till the hash variable is ready, this is called a "callback." Now we will only store things in the database once everything is read to go. 
//   if (err) {
//     console.log(err)
//     process.stdout.write('error hashing password')
//   } else {

//     //Query

//     let text = 'UPDATE users SET users_storedhash = $1 WHERE users_username= $2' 
//     let values = [hash, username]

//     let response = res; //create a globalish variable. 
//     let request = req;
//     pool.query(text, values, (err, res) => {
//       if (err) {
//         console.log(err.stack)
//         process.stdout.write('Already have a user by this name')

//         response.send('error from pool.query')
//       } else {
//         console.log(res.rows[0])
//         req.session.user = username; //NewUser is the username provided by the form.
//         login(username, password, request, response)
//       }
//     })//end query

//   }//end else

// }); //end hashing function
// })




}//end login stuff



module.exports = login;