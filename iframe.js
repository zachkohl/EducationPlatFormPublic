


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
    var bcrypt = require('bcrypt');
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++



    app.get('/iframe', async function (req, res) {

        res.render('iframe')
     });//end '/home'

     app.post('/iframe', async function (req, res) {
        whatYouWant = req.body.whatYouWant
        name = req.body.name;
        phone = req.body.phone;
        studentFirstName = req.body.studentFirstName;
        studentLastName= req.body.studentLastName;
        address = req.body.address;
        city = req.body.city;
        state = req.body.state;
        zip = req.body.zip;
        email = req.body.email;
        studentTelephone = req.body.studentTelephone;
        studentCell = req.body.studentCell;
        age = req.body.age;
        grade = req.body.grade;
        gender = req.body.gender;
        adultsName = req.body.adultsName;
        parentEmail = req.body.parentEmail;
        IAmA = req.body.IAmA;
        other = req.body.other;




      
        whatYouwantHTML = '';
        if(typeof whatYouWant !='undefined'){
        if(typeof whatYouWant ==='string'){
            whatYouWant = [whatYouWant]
        }
        for (i=0;i<whatYouWant.length;i++){
            whatYouwantHTML = whatYouwantHTML + "<li>"+whatYouWant[i]+'</li>'
        }
        }//end check if it is defined

        let msg = {
            to: 'info@teen-aid.com',
            from: 'DONOTREPLY@teen-aid.com',
            subject: 'New registration form submission',
            text: 'this email must be viewed in HTML',
            html: `<h1>New Registration form submitted</h1>
            <p>The checkboxes indicating what the applicant wants to do included:</p>
            <ul>${whatYouwantHTML}</ul>
            <br>
            <br>
            <p>NAME:  ${name}</p>
            <p>PHONE:  ${phone}</p>
            <p>Student's First Name:  ${studentFirstName}</p>
            <p>Student's Last Name:  ${studentLastName}</p>
            <p>Address:  ${address}</p>
            <p>City:  ${city}</p>
            <p>State:  ${state}</p>
            <p>Email:  ${email}</p>
            <p>Student's Telephone:  ${studentTelephone}</p>
            <p>Student's Cell Phone:  ${studentCell}</p>
            <p>Age:  ${age}</p>
            <p>Grade:  ${grade}</p>
            <p>Gender:  ${gender}</p>
            <p>Parent(s)/Adult(s) Name:  ${adultsName}</p>
            <p>Parent/Adult Email:  ${parentEmail}</p>
            <p>"I am a" radio selection:  ${IAmA}</p>
            <p>Other:  ${other}</p>`,
          };
          sgMail.send(msg);
console.log(msg)




        res.send('form submitted successfully!')
     });//end '/home'























}//end ModelForExport





module.exports = modelForExport;