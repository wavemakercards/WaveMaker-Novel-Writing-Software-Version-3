$('#navigation-toggle').hide();
hideNavBar()
autoSyncCall();

// this needs to be updated so that each tool can be reset - the only required entry is TOOL
if(!WMproject.state){
  WMproject.state={}
}
WMproject.state.tool = "gridplanner"

if (!WMproject.data) {
  WMproject.data = {};
}


if (!WMproject.data.gridplanner) {
  WMproject.data.gridplanner = [
    [
      { title: "x" },
      { title: "" }
    ],
    [
      { title: "" },
      { title: "", content: [""] }
    ]
  ];
}

var datatable = WMproject.data.gridplanner;

dosave();
function dosave() {
  db.projects.update(WMproject.id, WMproject).then(function () {
    //console.log("Saved gridplanner");
  });
}

var rowcount = 0;
var colcount = 0;
function drawTable() {
  rowcount = 0;
  $("#manage").html("");
  $.each(datatable, function (k, row) {
    rowcount++;
    newrow = $("<tr></tr>");
    colcount = 0;
    if (k == 0) {
      $.each(row, function (d, col) {
        if (d == 0) {
          newrow.append(`<th></th>`);
        } else {
          newrow.append(
            `<th data-x='${k}' data-y='${d}'><textarea class='table-title' placeholder='Title here'  data-x='${k}' data-y='${d}'>${col.title}</textarea></th>`
          );
        }
        colcount++;
      });
    } else {
      $.each(row, function (d, col) {
        if (d == 0) {
          newrow.append(
            `<th data-x='${k}' data-y='${d}'><textarea class='table-title'  placeholder='Title here'  data-x='${k}' data-y='${d}'>${col.title}</textarea></th>`
          );
        } else {
          newrow.append(
            `<td><div class='timeline-block'><ul class='grid-drag' id='list-${k}-${d}' data-x='${k}' data-y='${d}'></ul></div></td>`
          );
        }
        colcount++;
      });
    }
    $("#manage").append(newrow);
  });

  $.each($(".grid-drag"), function () {
    x = $(this).data("x");
    y = $(this).data("y");
    mylist = $(this)
    //$(this).html();
    $.each(WMproject.data.gridplanner[x][y].content, function (k, i) {
      mylist.append("<li><textarea class='grideditabletextarea' placeholder='write here'>" + i + "</textarea></li>");
    })
  });


  addbutton = $("<button class='addnewbit'><i class='fa fa-fw fa-plus'></i></button>");
  $(".timeline-block").append(addbutton)

  removebutton = $("<button class='removeme'><i class='fa fa-fw fa-trash'></i></button>");


  $(".table-title").parent().append(removebutton)

  autosize($(".table-title"))
  autosize($(".grideditabletextarea"))

  $("#addrow").unbind().click(function () {
    addrow();
  });
  $("#addcol").unbind().click(function () {
    addcol();
  });

  $(".addnewbit").unbind().click(function () {
    $(this).prev().append("<li><textarea class='grideditabletextarea' placeholder='write here'></textarea></li>")
    autosize($(".grideditabletextarea"))
    gridsave()
    dosave();
  });

  $(".removeme").unbind().click(function () {
    var toremove = $(this).parent().data()


    if (toremove.y === 0) {
      swal({
        title: "Delete Whole Row?",
        text: "This will remove the entire row and cannot be undone!",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
      }).then(result => {
        if (result.value) {
          datatable.splice(toremove.x, 1);
         // console.log(datatable)
          drawTable()
          dosave("remove");
          swal("Deleted!", "That has been deleted.", "success");
        }
      });

    } else {
      swal({
        title: "Delete Entire Column?",
        text: "This will remove the entire column and cannot be undone!",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
      }).then(result => {
        if (result.value) {
          //console.log("delete Col", toremove.y);
          $.each(datatable, function (k, i) {
            i.splice(toremove.y, 1);
          });
          //  datatable.splice(toremove.x, 1);
          //console.log(datatable)
          drawTable()
          //    dosave("remove");
          swal("Deleted!", "That has been deleted.", "success");
        }
      });
    }


  });


  $('.grid-drag').sortable({
    helper: function () {
      //debugger;
      return $("<div class='helper'></div>");
    },
    connectWith: '.grid-drag',
    placeholder: 'placeholder',
    start: function (event, ui) {

      //console.log("Start", ui.item.parent().attr("id"));

    },
    stop: function (event, ui) {
      gridsave()
      dosave();
      //console.log("Stop", ui.item.parent().attr("id"));
      /*
          if (stopindex == null) { stopindex = 0 } else { stopindex++ }
          if (startCard === endCard) {
            //Same Array issues
            indexfix = 1;
            if (startindex < stopindex) { indexfix = 0 }
            WaveMakerData[endCard].components.splice(stopindex, 0, datatoMove); // add
            WaveMakerData[startCard].components.splice(startindex + indexfix, 1); //delete
          } else {
            //different array - easy!
            WaveMakerData[endCard].components.splice(stopindex, 0, datatoMove); // add
            WaveMakerData[startCard].components.splice(startindex, 1); //delete
          }
        
      */

    }
  }).disableSelection();
}


$(document).on("keyup", ".grideditabletextarea", function () {
  gridsave()
  dosave();
})




$(document).on("keyup", ".table-title", function () {
  x = $(this).data("x")
  y = $(this).data("y")
  //console.log(x, y)
  WMproject.data.gridplanner[x][y] = { title: $(this).val() }
  dosave();
})

drawTable();

function addrow() {
  newrow = Array(colcount);
  //console.log(newrow)
  $.each(newrow, function (k) {
    newrow[k] = { title: "" };
  });
  datatable.push(newrow);
  dosave();
  drawTable();
}

function addcol() {
  $.each(datatable, function (k, row) {
    datatable[k].push({ title: "" });
  });
  dosave();
  drawTable();
}

function gridsave() {

  $.each($(".grid-drag"), function (o, p) {
    newdata = [];
    x = $(this).data("x");
    y = $(this).data("y");
    //$(this).html();
    $.each($(p).children(), function (k, i) {
      newdata.push($(i).children().first().val())
    })
    WMproject.data.gridplanner[x][y].content = newdata;
  });

}





