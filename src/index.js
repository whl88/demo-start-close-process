const { start,kill,find } = require('./processStarter');

/* start('D:\\tool\\KWMusic\\KwMusic.exe').then((a)=>{
    console.log(a)
}) */


/* kill(3152).then(()=>{

}).catch(e=>{
    console.log('e',e)
}) */

/* find('KwMusic.exe').then((p)=>{
    console.log(p)
}) */
find(8108).then((p)=>{
    console.log(p)
})