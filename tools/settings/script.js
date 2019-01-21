// this needs to be updated so that each tool can be reset - the only required entry is TOOL
WMproject.state = { tool: "settings" };
if (!WMproject.data) {
  WMproject.data = {};
}
if (!WMproject.data.settings) {
  WMproject.data.settings = [{ title: "", content: "" }];
}
dosave();
function dosave() {
  db.projects.update(WMproject.id, wavemaker).then(function () {
    console.log("Saved");
  });
}


$(document).off("click", "#savefile").on("click", "#savefile", function () {

  myfilename = WMproject.title.replace(/[^a-z0-9]/gi, '_').toLowerCase() + ".wmProj";
  var element = document.createElement('a');
  element.setAttribute('href', 'data:wmProj/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(wavemaker)));
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
      wavemaker = {};
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
