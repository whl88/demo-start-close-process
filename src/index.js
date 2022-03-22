const { start,kill } = require('./processStarter');

/* start('D:\\tool\\KWMusic\\KwMusic.exe').then((a)=>{
    console.log(a)
}) */


kill(3152).then(()=>{

}).catch(e=>{
    console.log('e',e)
})