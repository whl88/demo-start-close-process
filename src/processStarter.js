const { spawn, exec} = require('child_process');
const {parse} = require('path');
const fs = require('fs')

/**
 * 启动进程
 * @param {string} softPath 软件启动文件的路径。
 * @returns 
 */
function start(softPath){
    return new Promise((resolve,reject)=>{
        if(!fs.existsSync(softPath)){
            reject('file is not exist')
            return 
        }
        spawn(softPath)
        const procInfo = _getProcInfo(parse(softPath).base)
        resolve(procInfo)
    })
}

/**
 * 关闭进程
 * @param {string | Number} target pid或进程名
 */
function kill(target) {
    return new Promise(async (resolve,reject)=>{
        const procInfo = await _getProcInfo(target)
        if(procInfo){
            try{
                process.kill(procInfo.pid)
                resolve()
            }catch(err){
                reject(err)
            }
        }else{
            reject(`process ${target} is not exist`)
        }
    })
}

/**
 * 获取进程信息
 * @param {string} target 进程名或PID
 * @returns 
 */
 function _getProcInfo(target){
    let cmd = process.platform === 'win32' ? 'tasklist /v' : 'ps aux'

    return new Promise((resolve,reject)=>{
        exec(cmd,function (err, stdout, stderr) {
            if (err) {
                reject(err)
            }

            const proc = stdout.split('\n').map((line) => {
                const processMessage = line.trim().split(/\s+/)
                return {
                    name:processMessage[0] ,
                    pid:Number.parseInt(processMessage[1]),
                }
            }).find((p)=>{
                return (typeof target === 'string' && p.name === target) || 
                (typeof target === 'number' && p.pid === target)
            })

            resolve(proc)
        })
    })
}

module.exports = {
    start,
    kill,
}