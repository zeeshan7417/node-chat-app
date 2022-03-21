 const moment = require('moment');
 function commontext( username, msg){
      return {
           username: username,
           message: msg,
           time: moment().format('MMMM Do YYYY, h:mm:ss a')
      }
 }

 module.exports = commontext;

  