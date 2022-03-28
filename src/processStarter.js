const { spawn, exec} = require('child_process')
const {parse} = require('path')
const fs = require('fs')

/**
 * 启动进程
 * @param {string} softPath 软件启动文件的路径。
 * @returns 启动成功将resovle进程信息{name:'xxxx',pid:xxxx}；启动失败reject失败原因
 */
function start(softPath){
  return new Promise((resolve,reject)=>{
    if(!fs.existsSync(softPath)){
      reject('file is not exist')
      return 
    }
    spawn(softPath)
    const procInfo = find(parse(softPath).base)
    resolve(procInfo)
  })
}

/**
 * 关闭进程
 * @param {string | Number} target pid或进程名
 * @returns 关闭成功将resovle；关闭失败reject失败原因
 */
function kill(target) {
  return new Promise((resolve,reject)=>{
    const procInfo = find(target)
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
 * @returns 进程信息{name:'xxxx',pid:xxxx}
 */
function find(target){
  let cmd = null
  if(typeof target === 'string'){
    cmd = process.platform === 'win32' ? `tasklist /v /fi "IMAGENAME eq ${target}"` : 'ps aux'
  }else if(typeof target === 'number'){
    cmd = process.platform === 'win32' ? `tasklist /v /fi "PID eq ${target}"` : 'ps aux'
  }

  return new Promise((resolve,reject)=>{
    exec(cmd,function (err, stdout) {
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
  find,
}