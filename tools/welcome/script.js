deInitNav();
getProjects();

GoogleDrivehandleClientLoad();

$("#CreateNewProject")
  .unbind()
  .click(function () {
    $("#CreateNewProjectModal").modal("show");
  });

$("#GdriveUp").unbind().click(function(){
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
      exportDatabase("gDriveSave", true);
    }
  })
})

$("#GdriveDown").unbind().click(function(){
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
      GDriveRead()    
    }
  })
})

function getProjects() {
  
   $("#WMprojectprojectList").html('');
  db.projects
    .each(function (set) {
      $("#wavemakerprojectList").append(
        `<Button class='ProjectSelectButton btn ' data-setid='${set.id}'><i class='fa fa-file-text fa-fw '></i>  ${set.title}</button>`
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
        var newObj = { title: $("#ProjectNewTitle").val() };
        db.projects.add(newObj).then(function () {
          $(".modal-backdrop").remove();
          db.projects.toArray(function (arr) {
            WMsettings.currentproject = arr[arr.length - 1].id;
            db.settings.update(1, WMsettings).then(function () {
              checkprojectloaded();
            });
          })

        });
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
           swal("Deleted!", "The Data has been cleared", "success");
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


$(document).on("change", "#filepicker", function(){
  var files =document.getElementById('selectFiles').files;
  if (files.length <= 0) {
    swal("Problem!", "You didn't select a file", "warning");
    return false
  }

  var myfilename
  myfilename = files[0].name
  var parts=myfilename.split(".")
  console.log(parts[parts.length-1])
  if((parts[parts.length-1].toLowerCase()) !=="wmdata"){
    swal("Problem!", "That is not a wmdata file sorry", "warning");
    return false
  }
  swal("Loading!", "Hi, Loading file now, please wait.", "success");

 var fr = new FileReader();
  fr.onloadstart =function(e){
    console.log("loading file start")
  }
  fr.onprogress =function(e){
    console.log(e)
  }
  fr.onload = function(e) { 
    console.log("Loading File complete") 
//    var result = JSON.parse(e.target.result);
 //   var formatted = JSON.stringify(result, null, 2);
    importDatabase(e.target.result)
  }
  
  fr.readAsText(files.item(0));
  
})


