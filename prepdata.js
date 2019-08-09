function events(config) {
    app = config.app;
    checkSession = config.checkSession;
    query  = config.query;
    pool = config.pool;
    sgMail = config.sgMail;
    requireBasicPlus =  config.requireBasicPlus;
    requireMiddlePlus = config.requireMiddlePlus;
    requireAdminPlus = config.requireAdminPlus;
    checkSessionNolayoutChange = config.checkSessionNolayoutChange;
  getJob = config.getJob;
  io = config.io;
    
  
  
  
  
    // app.get('/prepData',checkSession, function (req, res) {
      
  
    //   res.send('a prep Data route')
    // })





//     var fs = require('fs');
//     var text;
//     var values;
//     var userID = 108;
//     var counter = 0;
//     deleteSpecialRows();
// //     //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// async function deleteSpecialRows() {
//   let eachLine = fs.readFileSync('idsForQuestionsToClear_teen_aid.csv').toString().split('\n')
//   for (i in eachLine) {
//   let eachLine = fs.readFileSync('idsForQuestionsToClear_teen_aid.csv').toString().split('\n')

//   text = "DELETE from answers WHERE answers_users_id  = $1 AND answers_questions_id =$2";
//   values = [userID,i];
//   x = await queryP(text, values);
  
//   console.log(counter)
//   counter++;

// }//end for loop

// }// end function

// let eachLine = fs.readFileSync('idsForQuestionsToClear_teen_aid.csv').toString().split('\n')
// for (i in eachLine) {
// console.log(i)

// }
// let tempNames = eachLine[i].split('. ')

// let tempISO = tempNames[1].toString().slice(0,-1);



// let trimmedNames = tempNames[0].split('..');
// trimmedNames = trimmedNames[0].trim();

// ISOnames.push({code:tempISO,name:trimmedNames})
// }
// console.log('got here')

// //write the file
// jsonBlob = JSON.stringify(ISOnames)
// fs.writeFileSync('dataCleaning/countryInfoNoTradeDeals.json',jsonBlob, 'utf8')

// //get trade data
// // let tradeData = [];
// // let eachLine = fs.readFileSync('static/Copy_of_Duty_Calculator_Lists.csv').toString().split('\n')
// // for (i in eachLine) {
// //     console.log('start processing row: '+i)
// // let tempRow = eachLine[i].split('&')
// // //new line created, clean up time
// // console.log(tempRow)
// // let code = tempRow[0].trim();
// // let name = tempRow[1].trim();
// // if(temRow[2]==='undefined'){
// // let members = '';
// // }else{
// //     let members = tempRow[2].split(',')
// // }



// //  tradeData.push({code:code,name:name,members:members})
// // }//end for loop

// // jsonBlob = JSON.stringify(tradeData)
// //  fs.writeFile('static/tariffInfo.json',jsonBlob, 'utf8')

// // for(i=0;i<tradeData.length;i++){
// //     console.log(tradeData[i][1])
// // }

// // var obj
// // fs.readFile('static/tariffInfo.json', 'utf8', function (err, data) {
// //     if (err) throw err;
// //     obj = JSON.parse(data)
// // })
// // obj = [["﻿AU,","United States-Australia Free Trade Agreement,","Australia\r"],["BH,","United States-Bahrain Free Trade Agreement Implementation Act.,","Bahrain\r"],["JO,","United States-Jordan Free Trade Area Implementation Act,","Jordan\r"],["CL,","United States-Chile Free Trade Agreement,","Chile\r"],["CO,","United States-Colombia Trade Promotion Agreement Implementation Act,","Colombia\r"],["CA,\"","NAFTA: Goods of Canada, under the terms of general note 12 to this schedule\",","Canada\r"],["MX,\"","NAFTA: Goods of Mexico, under the terms of general note 12 to this schedule\",","Mexico\r"],["KR,","United States-Korea Free Trade Agreement Implementation Act,","Korea\r"],["OM,","United States-Oman Free Trade Agreement Implementation Act,","Oman\r"],["P,\"","Dominican Republic-Central America-United States Free Trade Agreement Implementation"],["Act\",\"","Costa Rica, Dominican Republic, El Salvador, Guatemala, Honduras, Nicaragua \"\r"],["P+,","Dominican Republic-Central America-United States Free Trade Agreement Implementation Act,\"","Costa Rica, Dominican Republic, El Salvador, Guatemala, Honduras, Nicaragua\"\r"],["PA,","United States-Panama Trade Promotion Agreement Implementation Act,","Panama\r"],["PE,","United States-Peru Trade Promotion Agreement Implementation Act,","Peru\r"],["SG,","United States-Singapore Free Trade Agreement,","Singapore\r"],["IL,","United States-Israel Free Trade Area,","Israel\r"],["A,","Generalized System of Preferences,\"","Afghanistan,Albania,Algeria,Angola,Armenia,Azerbaijan,BelizeBenin,Bhutan,Bolivia,Bosnia and,Hercegovina,Botswana,Brazil,Burkina Faso,Burma,Burundi,Côte d'Ivoire,Cambodia,Cameroon,Cape Verde,Central African Republic,Chad,Comoros,Congo (Brazzaville),Congo (Kinshasa),Djibouti,Dominica,Ecuador,Egypt,Eritrea,Ethiopia,Fiji,Gabon,Gambia, TheGeorgia,Ghana,Grenada,Guinea,Guinea-Bissau,Guyana,Haiti,India,Indonesia,Iraq,Jamaica,Jordan,Kazakhstan,Kenya,Kiribati,Kosovo,Kyrgyzstan,Lebanon,Lesotho,Liberia,Macedonia,Madagascar,Malawi,Maldives,Mali,Mauritania,Mauritius,Moldova,Mongolia,Montenegro,Mozambique,Namibia,Nepal,Niger,Nigeria,Pakistan,Papua New Guinea,Paraguay,Philippines,Republic of Yemen,Rwanda,Saint Lucia,Saint Vincent and the Grenadines,Samoa,Sao Tomé and Principe,Senegal,Serbia,Sierra Leone,Solomon Islands,Somalia,South Africa,South Sudan,Sri Lanka,Suriname,Swaziland,Tanzania,Thailand,Timor-Leste,Togo,Tonga,Tunisia,Turkey,Tuvalu,Uganda,Ukraine,Uzbekistan,Vanuatu,Zambia,Zimbabwe\"\r"],["A+,","Generalized System of Preferences: Least Developed","Afghanistan,Angola,Benin,Bhutan,Burkina Faso,Burma,Burundi,Cambodia,Central African,Republic,Chad,Comoros,Congo (Kinshasa),Djibouti,Ethiopia,Gambia (The),Guinea,Guinea-Bissau,Haiti,Kiribati,Lesotho,Liberia,Madagascar,Malawi,Mali,Mauritania,Mozambique,Nepal,Niger,Republic of,Yemen,Rwanda,Samoa,Sao Tomé and Principe,Senegal,Sierra Leone,Somalia,South Sudan,Tanzania,The Solomon,Islands,Timor-Leste,Togo,Tuvalu,Uganda,Vanuatu,Zambia"],["NP,","Section 915 of the Trade Facilitation and Trade Enforcement Act of 2015,Nepal"],["E,","Caribbean Basin Economic Recovery Act,\"","Antigua and Barbuda,Aruba,Bahamas,Barbados,Belize,Curaçao,Dominica,Grenada,Guyana,Haiti,Jamaica,Montserrat,Netherlands,Antilles 1/,St. Kitts and Nevis,Saint Lucia,Saint Vincent and the,Grenadines,Trinidad and Tobago,Virgin Islands\"\r"],["E*,\"","Caribbean Basin Economic Recovery Act: Exceptions: articles of beef or veal, however provided for in chapter 2 or chapter 16 and heading 2301, and sugars, sirups and molasses, provided for in heading 1701 and subheadings 1702.90.20 and 2106.90.44, if a product of the following countries, pursuant to section 213(c) of the CBERA:\",\"Antigua and Barbuda,Montserrat,Netherlands Antilles,Saint Lucia,Saint Vincent and the Grenadines\"\r"],["MA,","United States-Morocco Free Trade Agreement Implementation Act,Morocco\r"]]
// // JSONofTariffs = [];
// // for(i=0;i<obj.length;i++){
// // obj[i][0]
// // JSONofTariffs.push({code:obj[i][0],name:obj[i][1],members:obj[i][2]})
// // }
// // Tariffs = [{"code":"﻿AU,","name":"United States-Australia Free Trade Agreement,","members":"Australia\r"},{"code":"BH,","name":"United States-Bahrain Free Trade Agreement Implementation Act.,","members":"Bahrain\r"},{"code":"JO,","name":"United States-Jordan Free Trade Area Implementation Act,","members":"Jordan\r"},{"code":"CL,","name":"United States-Chile Free Trade Agreement,","members":"Chile\r"},{"code":"CO,","name":"United States-Colombia Trade Promotion Agreement Implementation Act,","members":"Colombia\r"},{"code":"CA,\"","name":"NAFTA: Goods of Canada, under the terms of general note 12 to this schedule\",","members":"Canada\r"},{"code":"MX,\"","name":"NAFTA: Goods of Mexico, under the terms of general note 12 to this schedule\",","members":"Mexico\r"},{"code":"KR,","name":"United States-Korea Free Trade Agreement Implementation Act,","members":"Korea\r"},{"code":"OM,","name":"United States-Oman Free Trade Agreement Implementation Act,","members":"Oman\r"},{"code":"P,\"","name":"Dominican Republic-Central America-United States Free Trade Agreement Implementation"},{"code":"Act\",\"","name":"Costa Rica, Dominican Republic, El Salvador, Guatemala, Honduras, Nicaragua \"\r"},{"code":"P+,","name":"Dominican Republic-Central America-United States Free Trade Agreement Implementation Act,\"","members":"Costa Rica, Dominican Republic, El Salvador, Guatemala, Honduras, Nicaragua\"\r"},{"code":"PA,","name":"United States-Panama Trade Promotion Agreement Implementation Act,","members":"Panama\r"},{"code":"PE,","name":"United States-Peru Trade Promotion Agreement Implementation Act,","members":"Peru\r"},{"code":"SG,","name":"United States-Singapore Free Trade Agreement,","members":"Singapore\r"},{"code":"IL,","name":"United States-Israel Free Trade Area,","members":"Israel\r"},{"code":"A,","name":"Generalized System of Preferences,\"","members":"Afghanistan,Albania,Algeria,Angola,Armenia,Azerbaijan,BelizeBenin,Bhutan,Bolivia,Bosnia and,Hercegovina,Botswana,Brazil,Burkina Faso,Burma,Burundi,Côte d'Ivoire,Cambodia,Cameroon,Cape Verde,Central African Republic,Chad,Comoros,Congo (Brazzaville),Congo (Kinshasa),Djibouti,Dominica,Ecuador,Egypt,Eritrea,Ethiopia,Fiji,Gabon,Gambia, TheGeorgia,Ghana,Grenada,Guinea,Guinea-Bissau,Guyana,Haiti,India,Indonesia,Iraq,Jamaica,Jordan,Kazakhstan,Kenya,Kiribati,Kosovo,Kyrgyzstan,Lebanon,Lesotho,Liberia,Macedonia,Madagascar,Malawi,Maldives,Mali,Mauritania,Mauritius,Moldova,Mongolia,Montenegro,Mozambique,Namibia,Nepal,Niger,Nigeria,Pakistan,Papua New Guinea,Paraguay,Philippines,Republic of Yemen,Rwanda,Saint Lucia,Saint Vincent and the Grenadines,Samoa,Sao Tomé and Principe,Senegal,Serbia,Sierra Leone,Solomon Islands,Somalia,South Africa,South Sudan,Sri Lanka,Suriname,Swaziland,Tanzania,Thailand,Timor-Leste,Togo,Tonga,Tunisia,Turkey,Tuvalu,Uganda,Ukraine,Uzbekistan,Vanuatu,Zambia,Zimbabwe\"\r"},{"code":"A+,","name":"Generalized System of Preferences: Least Developed","members":"Afghanistan,Angola,Benin,Bhutan,Burkina Faso,Burma,Burundi,Cambodia,Central African,Republic,Chad,Comoros,Congo (Kinshasa),Djibouti,Ethiopia,Gambia (The),Guinea,Guinea-Bissau,Haiti,Kiribati,Lesotho,Liberia,Madagascar,Malawi,Mali,Mauritania,Mozambique,Nepal,Niger,Republic of,Yemen,Rwanda,Samoa,Sao Tomé and Principe,Senegal,Sierra Leone,Somalia,South Sudan,Tanzania,The Solomon,Islands,Timor-Leste,Togo,Tuvalu,Uganda,Vanuatu,Zambia"},{"code":"NP,","name":"Section 915 of the Trade Facilitation and Trade Enforcement Act of 2015,Nepal"},{"code":"E,","name":"Caribbean Basin Economic Recovery Act,\"","members":"Antigua and Barbuda,Aruba,Bahamas,Barbados,Belize,Curaçao,Dominica,Grenada,Guyana,Haiti,Jamaica,Montserrat,Netherlands,Antilles 1/,St. Kitts and Nevis,Saint Lucia,Saint Vincent and the,Grenadines,Trinidad and Tobago,Virgin Islands\"\r"},{"code":"E*,\"","name":"Caribbean Basin Economic Recovery Act: Exceptions: articles of beef or veal, however provided for in chapter 2 or chapter 16 and heading 2301, and sugars, sirups and molasses, provided for in heading 1701 and subheadings 1702.90.20 and 2106.90.44, if a product of the following countries, pursuant to section 213(c) of the CBERA:\",\"Antigua and Barbuda,Montserrat,Netherlands Antilles,Saint Lucia,Saint Vincent and the Grenadines\"\r"},{"code":"MA,","name":"United States-Morocco Free Trade Agreement Implementation Act,Morocco\r"}];
// // console.log(Tariffs.length)
// // Tariffs[0].code = "AU";
// // for(i=0;i<Tariffs.length;i++){
// // Tariffs[i].code = Tariffs[i].code.replace(/,/g,'');
// // Tariffs[i].code = Tariffs[i].code.replace(/"/g,'');

// // //Tariffs[i].members = Tariffs[i].members.split(',')

// // console.log(Tariffs[i].members)
// // }//end for loop




// //  jsonBlob = JSON.stringify(Tariffs)
// //   fs.writeFile('static/tarrifs1.json',jsonBlob, 'utf8')

// //   Tariffs =[{"code":"AU","name":"United States-Australia Free Trade Agreement","members":"Australia"},{"code":"BH","name":"United States-Bahrain Free Trade Agreement Implementation Act.,","members":"Bahrain"},{"code":"JO","name":"United States-Jordan Free Trade Area Implementation Act,","members":"Jordan"},{"code":"CL","name":"United States-Chile Free Trade Agreement","members":"Chile"},{"code":"CO","name":"United States-Colombia Trade Promotion Agreement Implementation Act,","members":"Colombia"},{"code":"CA","name":"NAFTA: Goods of Canada, under the terms of general note 12 to this schedule","members":"Canada"},{"code":"MX","name":"NAFTA: Goods of Mexico, under the terms of general note 12 to this schedule","members":"Mexico"},{"code":"KR","name":"United States-Korea Free Trade Agreement Implementation Act,","members":"Korea\r"},{"code":"OM","name":"United States-Oman Free Trade Agreement Implementation Act,","members":"Oman"},{"code":"P","name":"Dominican Republic-Central America-United States Free Trade Agreement Implementation","members":"Costa Rica, Dominican Republic, El Salvador, Guatemala, Honduras, Nicaragua"},{"code":"P+","name":"Dominican Republic-Central America-United States Free Trade Agreement Implementation Act","members":"Costa Rica, Dominican Republic, El Salvador, Guatemala, Honduras, Nicaragua"},{"code":"PA","name":"United States-Panama Trade Promotion Agreement Implementation Act","members":"Panama"},{"code":"PE","name":"United States-Peru Trade Promotion Agreement Implementation Act,","members":"Peru"},{"code":"SG","name":"United States-Singapore Free Trade Agreement,","members":"Singapore"},{"code":"IL","name":"United States-Israel Free Trade Area,","members":"Israel"},{"code":"A","name":"Generalized System of Preferences","members":"Afghanistan,Albania,Algeria,Angola,Armenia,Azerbaijan,BelizeBenin,Bhutan,Bolivia,Bosnia and,Hercegovina,Botswana,Brazil,Burkina Faso,Burma,Burundi,Côte d'Ivoire,Cambodia,Cameroon,Cape Verde,Central African Republic,Chad,Comoros,Congo (Brazzaville),Congo (Kinshasa),Djibouti,Dominica,Ecuador,Egypt,Eritrea,Ethiopia,Fiji,Gabon,Gambia, TheGeorgia,Ghana,Grenada,Guinea,Guinea-Bissau,Guyana,Haiti,India,Indonesia,Iraq,Jamaica,Jordan,Kazakhstan,Kenya,Kiribati,Kosovo,Kyrgyzstan,Lebanon,Lesotho,Liberia,Macedonia,Madagascar,Malawi,Maldives,Mali,Mauritania,Mauritius,Moldova,Mongolia,Montenegro,Mozambique,Namibia,Nepal,Niger,Nigeria,Pakistan,Papua New Guinea,Paraguay,Philippines,Republic of Yemen,Rwanda,Saint Lucia,Saint Vincent and the Grenadines,Samoa,Sao Tomé and Principe,Senegal,Serbia,Sierra Leone,Solomon Islands,Somalia,South Africa,South Sudan,Sri Lanka,Suriname,Swaziland,Tanzania,Thailand,Timor-Leste,Togo,Tonga,Tunisia,Turkey,Tuvalu,Uganda,Ukraine,Uzbekistan,Vanuatu,Zambia,Zimbabwe"},{"code":"A+","name":"Generalized System of Preferences: Least Developed","members":"Afghanistan,Angola,Benin,Bhutan,Burkina Faso,Burma,Burundi,Cambodia,Central African,Republic,Chad,Comoros,Congo (Kinshasa),Djibouti,Ethiopia,Gambia (The),Guinea,Guinea-Bissau,Haiti,Kiribati,Lesotho,Liberia,Madagascar,Malawi,Mali,Mauritania,Mozambique,Nepal,Niger,Republic of,Yemen,Rwanda,Samoa,Sao Tomé and Principe,Senegal,Sierra Leone,Somalia,South Sudan,Tanzania,The Solomon,Islands,Timor-Leste,Togo,Tuvalu,Uganda,Vanuatu,Zambia"},{"code":"NP","name":"Section 915 of the Trade Facilitation and Trade Enforcement Act of 2015","members":"Nepal"},{"code":"E","name":"Caribbean Basin Economic Recovery Act","members":"Antigua and Barbuda,Aruba,Bahamas,Barbados,Belize,Curaçao,Dominica,Grenada,Guyana,Haiti,Jamaica,Montserrat,Netherlands,Antilles 1/,St. Kitts and Nevis,Saint Lucia,Saint Vincent and the,Grenadines,Trinidad and Tobago,Virgin Islands"},{"code":"E*","name":"Caribbean Basin Economic Recovery Act: Exceptions: articles of beef or veal, however provided for in chapter 2 or chapter 16 and heading 2301, and sugars, sirups and molasses, provided for in heading 1701 and subheadings 1702.90.20 and 2106.90.44, if a product of the following countries, pursuant to section 213(c) of the CBERA:","members":"Antigua and Barbuda,Montserrat,Netherlands Antilles,Saint Lucia,Saint Vincent and the Grenadines"},{"code":"MA","name":"United States-Morocco Free Trade Agreement Implementation Act","members":"Morocco"}]

// //   Tariffs[0].code = "AU";
// //   for(i=0;i<Tariffs.length;i++){
// // // if(typeof Tariffs[i].members ==="undefined"){
// // //     console.log(Tariffs[i].name)
// // // }
  
// //    Tariffs[i].members = Tariffs[i].members.split(',')
  
// //    console.log(Tariffs[i].members)
// //   }//end for loop
 
// //DON NOT UNCOMMENT++++++++
// // Tariffs = [{"code":"AU","name":"United States-Australia Free Trade Agreement","members":["Australia"]},{"code":"BH","name":"United States-Bahrain Free Trade Agreement Implementation Act.,","members":["Bahrain"]},{"code":"JO","name":"United States-Jordan Free Trade Area Implementation Act,","members":["Jordan"]},{"code":"CL","name":"United States-Chile Free Trade Agreement","members":["Chile"]},{"code":"CO","name":"United States-Colombia Trade Promotion Agreement Implementation Act,","members":["Colombia"]},{"code":"CA","name":"NAFTA: Goods of Canada, under the terms of general note 12 to this schedule","members":["Canada"]},{"code":"MX","name":"NAFTA: Goods of Mexico, under the terms of general note 12 to this schedule","members":["Mexico"]},{"code":"KR","name":"United States-Korea Free Trade Agreement Implementation Act,","members":["Korea\r"]},{"code":"OM","name":"United States-Oman Free Trade Agreement Implementation Act,","members":["Oman"]},{"code":"P","name":"Dominican Republic-Central America-United States Free Trade Agreement Implementation","members":["Costa Rica"," Dominican Republic"," El Salvador"," Guatemala"," Honduras"," Nicaragua"]},{"code":"P+","name":"Dominican Republic-Central America-United States Free Trade Agreement Implementation Act","members":["Costa Rica"," Dominican Republic"," El Salvador"," Guatemala"," Honduras"," Nicaragua"]},{"code":"PA","name":"United States-Panama Trade Promotion Agreement Implementation Act","members":["Panama"]},{"code":"PE","name":"United States-Peru Trade Promotion Agreement Implementation Act,","members":["Peru"]},{"code":"SG","name":"United States-Singapore Free Trade Agreement,","members":["Singapore"]},{"code":"IL","name":"United States-Israel Free Trade Area,","members":["Israel"]},{"code":"A","name":"Generalized System of Preferences","members":["Afghanistan","Albania","Algeria","Angola","Armenia","Azerbaijan","BelizeBenin","Bhutan","Bolivia","Bosnia and","Hercegovina","Botswana","Brazil","Burkina Faso","Burma","Burundi","Côte d'Ivoire","Cambodia","Cameroon","Cape Verde","Central African Republic","Chad","Comoros","Congo (Brazzaville)","Congo (Kinshasa)","Djibouti","Dominica","Ecuador","Egypt","Eritrea","Ethiopia","Fiji","Gabon","Gambia"," TheGeorgia","Ghana","Grenada","Guinea","Guinea-Bissau","Guyana","Haiti","India","Indonesia","Iraq","Jamaica","Jordan","Kazakhstan","Kenya","Kiribati","Kosovo","Kyrgyzstan","Lebanon","Lesotho","Liberia","Macedonia","Madagascar","Malawi","Maldives","Mali","Mauritania","Mauritius","Moldova","Mongolia","Montenegro","Mozambique","Namibia","Nepal","Niger","Nigeria","Pakistan","Papua New Guinea","Paraguay","Philippines","Republic of Yemen","Rwanda","Saint Lucia","Saint Vincent and the Grenadines","Samoa","Sao Tomé and Principe","Senegal","Serbia","Sierra Leone","Solomon Islands","Somalia","South Africa","South Sudan","Sri Lanka","Suriname","Swaziland","Tanzania","Thailand","Timor-Leste","Togo","Tonga","Tunisia","Turkey","Tuvalu","Uganda","Ukraine","Uzbekistan","Vanuatu","Zambia","Zimbabwe"]},{"code":"A+","name":"Generalized System of Preferences: Least Developed","members":["Afghanistan","Angola","Benin","Bhutan","Burkina Faso","Burma","Burundi","Cambodia","Central African","Republic","Chad","Comoros","Congo (Kinshasa)","Djibouti","Ethiopia","Gambia (The)","Guinea","Guinea-Bissau","Haiti","Kiribati","Lesotho","Liberia","Madagascar","Malawi","Mali","Mauritania","Mozambique","Nepal","Niger","Republic of","Yemen","Rwanda","Samoa","Sao Tomé and Principe","Senegal","Sierra Leone","Somalia","South Sudan","Tanzania","The Solomon","Islands","Timor-Leste","Togo","Tuvalu","Uganda","Vanuatu","Zambia"]},{"code":"NP","name":"Section 915 of the Trade Facilitation and Trade Enforcement Act of 2015","members":["Nepal"]},{"code":"E","name":"Caribbean Basin Economic Recovery Act","members":["Antigua and Barbuda","Aruba","Bahamas","Barbados","Belize","Curaçao","Dominica","Grenada","Guyana","Haiti","Jamaica","Montserrat","Netherlands","Antilles 1/","St. Kitts and Nevis","Saint Lucia","Saint Vincent and the","Grenadines","Trinidad and Tobago","Virgin Islands"]},{"code":"E*","name":"Caribbean Basin Economic Recovery Act: Exceptions: articles of beef or veal, however provided for in chapter 2 or chapter 16 and heading 2301, and sugars, sirups and molasses, provided for in heading 1701 and subheadings 1702.90.20 and 2106.90.44, if a product of the following countries, pursuant to section 213(c) of the CBERA:","members":["Antigua and Barbuda","Montserrat","Netherlands Antilles","Saint Lucia","Saint Vincent and the Grenadines"]},{"code":"MA","name":"United States-Morocco Free Trade Agreement Implementation Act","members":["Morocco"]}]
// // tariffsToJSON = JSON.stringify(Tariffs)
// // fs.writeFileSync('tariffs.json',tariffsToJSON, 'utf8')
// //end ++++++

// // var Tariffs2
// // fs.readFile('dataCleaning/tariffs.json', 'utf8', function (err, data) {
// //     if (err) throw err;
// //     Tariffs2 = JSON.parse(data)
// // })
// var Tariffs;
// Tariffs =   JSON.parse(fs.readFileSync('dataCleaning/tariffs.json','utf8')); 


// // for(i=0;i<Tariffs.length;i++){
// //     for(k=0;k<Tariffs[i].members.length;k++){
// //         Tariffs[i].members[k] = Tariffs[i].members[k].trim();
// //     }

// // }//end for loop
// // fs.writeFileSync('dataCleaning/tariffs.json',JSON.stringify(Tariffs), 'utf8')


// var countryInfo;
// countryInfo =   JSON.parse(fs.readFileSync('dataCleaning/countryInfoNoTradeDeals.json','utf8')); 
//     console.log('hello world')

// // //Check every member of every trade deal against eveyr country for a match, if a match is not found, report it
// noMatch = [];
// noMatchNames = [];
// for(i=0;i<Tariffs.length;i++){
// for(k=0;k<Tariffs[i].members.length;k++){
// flagFoundCountry = false;    
// for(j=0;j<countryInfo.length;j++){

//     if (countryInfo[j].name.toLowerCase().indexOf(Tariffs[i].members[k].toLowerCase()) > -1) {
//         if(typeof countryInfo[j].tradeDeals ==="undefined"){
//             countryInfo[j].tradeDeals = []
//             countryInfo[j].tradeDeals.push({code:Tariffs[i].code,name:Tariffs[i].name})
//             console.log(j)
//         }else{
//             countryInfo[j].tradeDeals.push({code:Tariffs[i].code,name:Tariffs[i].name})
//             console.log(countryInfo[j].tradeDeals)
//         }
    
//         flagFoundCountry = true;
//     }//end if statement

// }//end for loop all countries
// if(flagFoundCountry ===false){
//     console.log({country:Tariffs[i].members[k],tarrif:Tariffs[i]})
// noMatch.push({country:Tariffs[i].members[k],tariff:Tariffs[i]})
// noMatchNames.push(Tariffs[i].members[k])
// }
// }//end for loop Tariffs.members
// }//end for loop Tariffs
  
  
//    jsonBlob = JSON.stringify(countryInfo)
//     fs.writeFile('dataCleaning/countryInfo.json',jsonBlob, 'utf8')


// //REPORT THE MISSMATCHES
//     // noMatchString = JSON.stringify(noMatch)
//     // fs.writeFile('dataCleaning/noMatch.json',noMatchString, 'utf8')

// stringReport = ''
// stringReport =stringReport+ `Missmatches: ${noMatch.length}\n`
// for(i=0;i<noMatch.length;i++){
//     stringReport =stringReport+ `${noMatch[i].country}\n`
//     stringReport =stringReport+ `${noMatch[i].tariff.name}\n`
// }

// // fs.writeFile('dataCleaning/noMatch.txt',stringReport, 'utf8')















  
  }//end stuff for export 
  
  
  
  module.exports = events;