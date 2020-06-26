deInitNav();
getProjects();
WriterKey = '';
GoogleDrivehandleClientLoad();

$("#CreateNewProject")
  .unbind()
  .click(function () {
    $("#CreateNewProjectModal").modal("show");
  });

$("#GdriveUp").unbind().click(function () {
  swal({
    title: "Upload To Google Drive?",
    text: "This Will overwrite your saved copy on there!",
    type: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, Upload it!"
  }).then(result => {
    if (result.value) {
      $("#synchmsg").html("<i class='fa fa-fw fa-spinner fa-spin'></i> Putting Data (May Take short while)")
      exportDatabase("gDriveSave", true);
    }
  })
})

$("#GdriveDown").unbind().click(function () {

  swal({
    title: "Download from Google Drive?",
    text: "This Will overwrite your local saved data!",
    type: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, Download it!"
  }).then(result => {
    if (result.value) {
      $("#synchmsg").html("<i class='fa fa-fw fa-spinner fa-spin'></i> Getting Data")
      GDriveRead()
    }
  })
})

function getProjects() {
  WMsettings.currentproject = false;
  $("#wavemakerprojectList").html('');
  db.projects
    .each(function (set) {
      $("#wavemakerprojectList").append(
        `
        <div class="row">
        <div class="col-8"><Button class='ProjectSelectButton btn ' data-setid='${set.id}'><i class='fa fa-file-text fa-fw '></i>  ${set.title}</button></div>
        <div class="col-4 text-right"><Button class='ProjectDeleteButton btn btn-wavemaker-danger ' data-setid='${set.id}' title ="Delete this Project"><i class='fa fa-trash fa-fw '></i></button></div>
        </div>
        `
      );

    })
    .then(function () {
      ProjectsDisplaySetup();
    });
}


function ProjectsDisplaySetup() {
  $("#CreateNewProject")
    .unbind()
    .click(function () {
      $("#CreateNewProjectModal").modal("show");
    });

  $(".ProjectDeleteButton")
    .unbind()
    .click(function () {
      indexValue = $(this).data("setid");



      swal({
        title: "Delete this project",
        text: "This will remove the project from this system !",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
      }).then(result => {
        if (result.value) {
          //delete the database!!

          db.projects.where("id").equals(indexValue).delete();
          //  console.log("DELETE", indexValue)
          getProjects()
          swal("Deleted!", "The Data has been cleared", "success");

        }
      });






    });

  $(".ProjectSelectButton")
    .unbind()
    .click(function () {
      WMsettings.currentproject = $(this).data("setid");
      db.settings.update(1, WMsettings).then(function () {
        checkprojectloaded();
      });
    });




  $("#ProjectCreateNew")
    .unbind()
    .click(function () {
      if ($("#ProjectNewTitle").val() !== "") {
        var newObj = {};


        if ($("#ProjectNewTemplate").val() !== "") {
          $.getJSON("templates/" + $("#ProjectNewTemplate").val() + ".json", function (data) {
            console.log(data)
            newObj = data;
            newObj.title = $("#ProjectNewTitle").val();
            db.projects.add(newObj).then(function () {
              $(".modal-backdrop").remove();
              db.projects.toArray(function (arr) {
                WMsettings.currentproject = arr[arr.length - 1].id;
                db.settings.update(1, WMsettings).then(function () {
                  checkprojectloaded();
                });
              });

            });
          });
        } else {
          newObj = { title: $("#ProjectNewTitle").val() };
          db.projects.add(newObj).then(function () {
            $(".modal-backdrop").remove();
            db.projects.toArray(function (arr) {
              WMsettings.currentproject = arr[arr.length - 1].id;
              db.settings.update(1, WMsettings).then(function () {
                checkprojectloaded();
              });
            })

          });

        }


      } else {
        swal("Nope!", "You need to write something obviously", "warning");
      }
    });

  $("#ProjectClearAllData")
    .unbind()
    .click(function () {
      swal({
        title: "Clear All Data?",
        text: "This will remove all the projects from this system !",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
      }).then(result => {
        if (result.value) {
          //delete the database!!
          Dexie.delete('wavemaker');
          WMproject = {};
          WMsettings = {};
          swal("Deleted!", "The app will need to re-load", "success");
          location.reload();
        }
      });
    });
}

$(document).off("click", "#ProjectDownloadAllData").on("click", "#ProjectDownloadAllData", function () {
  exportDatabase();
})


$(document).off("click", "#dataformtoggle").on("click", "#dataformtoggle", function () {
  $("#dataform").slideToggle();
})


$(document).off("change", "#filepicker").on("change", "#filepicker", function () {
  var files = document.getElementById('selectFiles').files;
  if (files.length <= 0) {
    swal("Problem!", "You didn't select a file", "warning");
    return false
  }

  var myfilename
  myfilename = files[0].name
  var parts = myfilename.split(".")
  //console.log(parts[parts.length-1])
  var isvalidfile = false
console.log("extension", parts[parts.length - 1].toLowerCase())

  if ((parts[parts.length - 1].toLowerCase()) === "wmdata") {
    isvalidfile = true
  }

  if ((parts[parts.length - 1].toLowerCase()) === "wavemakerdata") {
    isvalidfile = true
  }

  if(!isvalidfile){
    swal("Problem!", "That is not a wmdata file sorry", "warning");
    return false
  }


  swal("Loading!", "Hi, Loading file now, please wait.", "success");

  var fr = new FileReader();
  fr.onloadstart = function (e) {
    // console.log("loading file start")
  }
  fr.onprogress = function (e) {
    //  console.log(e)
  }
  fr.onload = function (e) {
    //  console.log("Loading File complete") 
    //    var result = JSON.parse(e.target.result);
    //   var formatted = JSON.stringify(result, null, 2);
    importDatabase(e.target.result)
  }

  fr.readAsText(files.item(0));

})



$(document).off("change", "#wmProjfilepicker").on("change", "#wmProjfilepicker", function () {
  var files = document.getElementById('wmProjselectFiles').files;
  if (files.length <= 0) {
    swal("Problem!", "You didn't select a file", "warning");
    return false
  }

  var myfilename
  myfilename = files[0].name
  var parts = myfilename.split(".")
  //console.log(parts[parts.length-1])
  var extension = (parts[parts.length - 1].toLowerCase())

  if (extension !== "wmproj" && extension !== "wmprox") {
    swal("Problem!", "That is not a Wavemaker Project file sorry", "warning");
    return false
  }
  swal("Loading!", "Hi, Loading file now, please wait.", "success");

  var fr = new FileReader();
  fr.onloadstart = function (e) {
    // console.log("loading file start")
  }
  fr.onprogress = function (e) {
    //  console.log(e)
  }
  fr.onload = function (e) {
    //  console.log("Loading File complete") 
    //    var result = JSON.parse(e.target.result);
    //   var formatted = JSON.stringify(result, null, 2);
    if (extension === "wmproj") {
      importWMproj(e.target.result, parts[0])
    } else {
      var newObj = JSON.parse(e.target.result)
      delete newObj.id;
      delete newObj.state;
      //  console.log(newObj)
      db.projects.add(newObj).then(function () {
        db.projects.toArray(function (arr) {
          WMsettings.currentproject = arr[arr.length - 1].id;
          db.settings.update(1, WMsettings).then(function () {
            checkprojectloaded();
          });
        })

      })





    }
  }

  fr.readAsText(files.item(0));

})


