/*
	|----------------------------|
	| Declare your databse       |
	|----------------------------|
	*/
var WMproject = {};
var WMsettings = {};
const db = new Dexie("wavemaker");
db.version(1).stores({
  settings: "++id,settings",
  projects: "++id,title,data"
});

/*
Load the settings from the database
*/
db.settings.get(1, function (set) {
  if (set) {
    //cool settings found
    WMsettings = set;
   checkprojectloaded();
  } else {
    WMsettings = { currentproject: 0 };
    db.settings.add(WMsettings).then(function () {
      loadtool("welcome");
    });
  }
});


function checkprojectloaded() {
  //console.log("loading project")
  if(WMsettings.currentproject){
  db.projects.get(WMsettings.currentproject, function (set) {
    WMproject = set;
    if(!WMproject.state){
      WMproject.state={};
    }
    if(!WMproject.state.tool){
      WMproject.state.tool="writer";
    }
    if(WMproject.state.tool!="welcome"){
      loadtool(WMproject.state.tool)
      initNav()
    }
  });
}else{
  loadtool("welcome")
}
}

function saveWavemaker() {
  // console.log("Save SYNCH");
}

var exportData={}
function exportDatabase(mode) {
    exportData.settings = {};
    exportData.projects = [];

    exportData.settings.id=1
    exportData.settings.settings=WMsettings

   return db.projects.each(function (set) {
    var newObj = {}
    newObj.id=set.id
    newObj.title=set.title
    newObj.data=set.data
    exportData.projects.push(newObj)
   }).then(()=>{

    switch (mode){
      case "web" :
      console.log("synch to web");
      break;
      default :
      console.log("defaults to backup")
      downloadFile(JSON.stringify(exportData))
    }
  });
  
}


function importDatabase(json) {
  var importData=JSON.parse(json);
  console.log(importData)
// Clear the database contents
db.settings.clear()
db.projects.clear()

db.settings.add(importData.settings.settings).then(function () {
  console.log("settings added")
});

$.each(importData.projects, function(k,v){
  console.log(v)

 db.projects.add(v).then(function () {
    console.log("project " + v.id)
  });

})

exportData={}
loadtool("welcome")
}



function downloadFile(mydata){
  var d=new Date();
  var str = d.getHours()+"-"+d.getMinutes()+"-"+d.getDate()+"-"+d.getMonth()+"-"+d.getFullYear();
  myfilename = "wavemaker-"+str+".wmdata";
   //
  var element = document.createElement('a');
  element.setAttribute('href', 'data:wmdata/plain;charset=utf-8,' + encodeURIComponent(mydata));
  element.setAttribute('download', myfilename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}
