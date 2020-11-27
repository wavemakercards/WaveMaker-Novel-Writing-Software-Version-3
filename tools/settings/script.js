$('#navigation-toggle').hide();
hideNavBar()
autoSyncCall();

console.log("settinsg")

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

$(document).off("click", "#ExportProjectFile").on("click", "#ExportProjectFile", function () {

  myfilename = WMproject.title.replace(/[^a-z0-9]/gi, '_').toLowerCase() + ".wmProj";
  var element = document.createElement('a');
  element.setAttribute('href', 'data:wmProj/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(WMproject)));
  element.setAttribute('download', myfilename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
})

$(document).off("click", "#deleteproject").on("click", "#deleteproject", function () {
  swal({
    title: "Delete Whole Project?",
    text: "Are you ABSOLUTELY sure you want to delete this project",
    type: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!"
  }).then(result => {
    if (result.value) {

      db.projects.delete(WMsettings.currentproject)
      WMproject = {};
      WMsettings.currentproject = 0;
      loadtool("welcome");
      swal("Deleted!", "That has been deleted.", "success")
      console.log("DELETEE")

    }
  });
})


$("#settings_title").val(WMproject.title);

$(document).off("click", "#settings_title_save").on("click", "#settings_title_save", function () {
  if ($("#settings_title").val() != "" && $("#settings_title").val() != WMproject.title) {
    WMproject.title = $("#settings_title").val();
    swal("Changed!", "The title change has been saved", "success")
    dosave();
  }

});

$(document).off("click", "#synchronise").on("click", "#synchronise", function () {
  swal({
    title: "Synchronise File to Remote?",
    text: "Are you ABSOLUTELY sure you want to delete this project",
    type: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, Synch it!"
  }).then(result => {
    if (result.value) {
       swal("Synch Done!", "That has been deleted.", "success")
    }
  });
})
