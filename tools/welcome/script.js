deInitNav();

  getProjects();



$("#CreateNewProject")
  .unbind()
  .click(function () {
    $("#CreateNewProjectModal").modal("show");
  });

function getProjects() {
  
   $("#WMprojectprojectList").html('');
  db.projects
    .each(function (set) {
      $("#wavemakerprojectList").append(
        `<Button class='ProjectSelectButton btn ' data-setid='${set.id}'><i class='fa fa-file-text fa-fw fa-4x'></i> <br><br> ${set.title}</button>`
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

