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
  console.log("loading project")
  if(WMsettings.currentproject){
  db.projects.get(WMsettings.currentproject, function (set) {
    WMproject = set;
    loadtool("writer");
    initNav()
  
  });
}else{
  loadtool("welcome")
}
}

function saveWavemaker() {
  // console.log("Save SYNCH");
}
