const Store = require('electron-store');

const store = new Store();


function saveValues(){
store.set('api', document.getElementById('api').value);
store.set('default_path', document.getElementById('path1').value);
store.set('local_path', document.getElementById('path2').value);
}
