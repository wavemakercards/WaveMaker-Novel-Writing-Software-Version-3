$('#navigation-toggle').hide();
hideNavBar()


if(!WMproject.state){
  WMproject.state={}
}
WMproject.state.tool = "exporting"


savedata()
function savedata() {
  db.projects.update(WMproject.id, WMproject).then(function () {
    saveWavemaker();
  });
}
