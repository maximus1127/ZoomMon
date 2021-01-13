

const electron = require('electron');
// Importing the net Module from electron remote
const net = electron.remote.net;
var FtpDeploy = require("ftp-deploy");
var ftpDeploy = new FtpDeploy();
const fs = require('fs');

var user = ""
var password = ""
var host = ""

var config = {}


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function renameFiles(){
  // fs.rename(store.get('default_path') + '/patient', store.get('default_path') +"/"+ document.getElementById('encounter').value + "-patient", ()=>{})
  config.localRoot = store.get('default_path') +"/encounter"
  config.remoteRoot = "zoom/" + document.getElementById('encounter').value + "-encounter" + Date.now()
  await sleep(1000)
  ftpDeploy
      .deploy(config)
      .then(res => {
        fs.rename(store.get('default_path') +"/encounter", store.get('local_path') +"/"+ document.getElementById('encounter').value + "-encounter" + Date.now(), err => {
          if (err) {
            console.error(err)
            return
          }
          document.getElementById('encounter').value =""
          ipcRenderer.send('processInput', true);
        })
        console.log("finished:", res)
      })
      .catch(err => console.log(err));


}

//
// if(store.get('default_path') != null){
//   files = fs.readdirSync(store.get('default_path'));
//   if(files.length > 0){
//   files.forEach(file => {
//     console.log(file);
//     fs.readdirSync(store.get('default_path') + "/" + file).forEach(subfiles => {
//       console.log(subfiles)
//     })
//   });
// }
// }

var token = store.get('api');
function getFtpCreds() {
  if(token){
    const request = net.request({
        method: 'GET',
        protocol: 'https:',
        hostname: 'eyemax.test',
        path: '/api/zoom-monitor?api_token=' + token,
        redirect: 'follow'
    });
    request.on('response', (response) => {
        // console.log(`STATUS: ${response.statusCode}`);
        // console.log(`HEADERS: ${JSON.stringify(response.headers)}`);
        // console.log(response)
        response.on('data', (chunk) => {
            theData = JSON.parse(chunk)[0]
            // console.log(`BODY: ${theData.host}`)

              config = {
                  user: theData.user,
                  // Password optional, prompted if none given
                  password: theData.password,
                  host: theData.host,
                  port: 21,
                  localRoot: "",
                  remoteRoot: "",
                  include: ["*", "**/*"],      // this would upload everything except dot files
                  // include: ["*.php", "dist/*", ".*"],
                  // e.g. exclude sourcemaps, and ALL files in node_modules (including dot files)
                  exclude: ["dist/**/*.map", "node_modules/**", "node_modules/**/.*", ".git/**"],
                  // delete ALL existing files at destination before uploading, if true
                  deleteRemote: false,
                  // Passive mode is forced (EPSV command is not sent)
                  forcePasv: true,
                  // use sftp or ftp
                  sftp: false
              };
        });
    });
    request.on('finish', () => {
        console.log('Request is Finished')
    });
    request.on('abort', () => {
        console.log('Request is Aborted')
    });
    request.on('error', (error) => {
        console.log(`ERROR: ${JSON.stringify(error)}`)
    });
    request.on('close', (error) => {
        console.log('Last Transaction has occured')
    });
    request.setHeader('Content-Type', 'application/json');
    request.end();
  }


};
