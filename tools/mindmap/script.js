$('#navigation-toggle').show();
// this needs to be updated so that each tool can be reset - the only required entry is TOOL
if (!WMproject.state) {
  WMproject.state = {}
}
WMproject.state.tool = "mindmap"
if (!WMproject.data) {
  WMproject.data = {};
}
if (!WMproject.data.cards) {
  WMproject.data.mindmaps = [];
}



dosave();
function dosave() {
  db.projects.update(WMproject.id, WMproject).then(function () {
  });
}

var CurrentMindmapItemKey = ""
function loadMindMap(mykey) {
  mindmap = WMproject.data.mindmaps[mykey]
  mindmap = {};
}




function SaveMindMap() {
  db.projects.update(WMproject.id, WMproject).then(function () {
  });
}


var linkem = { start: 0, end: 0 };


$("#navigation-side-nav").html("<ul id='mindmap-list'></ul>")


$(document).off("click", "#mindmap-list>li").on("click", "#mindmap-list>li", function () {
  var key = $(this).data('key');
  if (key === "add") {
    console.log("adding")
    var newmap = {
      title: "New Mindmap",
      links: [],
      items: []
    }
    WMproject.data.mindmaps.push(newmap)
    SaveMindMap()
    DrawMindMapNav()
  } else {
    mindmap = WMproject.data.mindmaps[key]
    DrawMindMap()
  }



})


DrawMindMapNav()
function DrawMindMapNav() {
  $("#mindmap-list").html('')
  $("#mindmap-list").append("<li data-key='add' class='btn  btn-wavemaker'><i class='fa fa-fw fa-plus'></i> Create a Mindmap</li>")
  $.each(WMproject.data.mindmaps, function (k, i) {
    var newli = $("<li><i class='fa fa-fw fa-sitemap fa-rotate-270'></i> " + i.title + "</li>")
    newli.data("key", k);
    $("#mindmap-list").append(newli)
  })


}


function DrawMindMap() {
  SaveMindMap()
  $("#mindmap_items").html('')
  $.each(mindmap.items, function (k, i) {
    newnode = $('<div class="mindmap-item" tabindex="1"></div>')
    newnode.attr("id", i.id);
    newnode.data("key", k);
    newnode.data("uid", i.id);
    newnode.append("<div class='handle'  style='display:none'><i class='fa fa-fw fa-arrows'></i></div>")
    newnode.append("<textarea rows='1' class='notes' tabindex='1' style ='width:" + i.width + "px; height:" + i.height + "px;  ' >" + i.content + "</textarea>")

    newnode.append("<div class='linker' style='display:none'><i class='fa fa-fw fa-link'></i></div>")
    newnode.append("<div class='trash' style='display:none'><i class='fa fa-fw fa-close'></i></div>")
    $(newnode).css({ "top": i.top + "px" });
    $(newnode).css({ "left": i.left + "px" });
    $("#mindmap_items").append(newnode)

  })
  redrawlines()
  if (CurrentMindmapItemKey) {
    $("#" + CurrentMindmapItemKey).focus();
  }
  autosize($(".notes"))

}
function redrawlines() {
  $("#mindmap_line").html('');
  $.each(mindmap.links, function (k, i) {
    newline = createLine($("#" + i.start), $("#" + i.end));
    newline = $(newline)
    newline.attr("id", "Line" + k)
    newline.data("key", k);
    isLinked = CurrentMindmapItemKey
    if (isLinked == i.start) {
      newline.addClass("activelines");
    }
    $("#mindmap_line").append($(newline));
  })
}


function uuID() {
  return Math.random().toString(36).substring(2) + (new Date()).getTime().toString(36);
}



$(document).on("click", ".trash", function (e) {
  swal({
    title: "Are you sure?",
    text: "You Will remove this node and all it's links",
    type: "warning",
    showCancelButton: true,
    confirmButtonClass: "btn-danger",
    confirmButtonText: "Yes, delete it!",
    closeOnConfirm: false
  },
    function () {
      var key = $("#" + CurrentMindmapItemKey).data("key");
      // find all links with this one in there
      var cleanarray = [];
      $.each(mindmap.links, function (k, i) {
        if (i.start != CurrentMindmapItemKey && i.end != CurrentMindmapItemKey) {
          cleanarray.push(i);
        }
      })
      mindmap.links = cleanarray;


      mindmap.items.splice(key, 1);
      swal("Deleted!", "Your imaginary file has been deleted.", "success");
      DrawMindMap();
    });
})


var linkKey = -1
$(document).on("click", ".connectingLines", function (e) {
  e.stopPropagation()
  linkKey = $(this).data("key");
  swal({
    title: "Are you sure?",
    text: "You Will remove this node and all it's links",
    type: "warning",
    showCancelButton: true,
    confirmButtonClass: "btn-danger",
    confirmButtonText: "Yes, delete it!",
    closeOnConfirm: false
  },
    function () {
      console.log("Deleting line :", linkKey)
      mindmap.links.splice(linkKey, 1);
      linkKey = -1
      swal("Deleted!", "Your imaginary file has been deleted.", "success");
      DrawMindMap();
    });
})

$(document).on("click", ".mindmap-item", function (e) {
  e.stopPropagation()
})

$(document).on("click", "#mindmap_items", function (e) {
  e.stopPropagation()
  CurrentMindmapItemKey = '';
  linkem = { start: 0, end: 0 };
  DrawMindMap();
})


$(document).on("keyup", ".notes", function () {
  key = $(this).parent().data("key")
  mindmap.items[key].content = $(this).val();

})

$(document).on("click", ".linker", function (e) {
  e.stopPropagation()
  myLinkButton = $(this).parent().attr("id");
  if (linkem.start == 0) {
    linkem.start = myLinkButton;
    linkem.end = 0;
  } else {
    if (linkem.start != myLinkButton) {
      linkem.end = myLinkButton;
      links.push(linkem)

      // clean up the  links array
      nodupes = ArrNoDupe(mindmap.links); // no duplicate links
      mindmap.links = nodupes;


      DrawMindMap();
      linkem = { start: 0, end: 0 };
    } else {
      console.log("not linking to the same one")
    }

  }
})

$("#add_mindmap_item").click(function () {
  var newnode = {
    "id": uuID(),
    "content": "",
    "top": 70,
    "left": 70
  }
  mindmap.items.push(newnode)
  DrawMindMap();

})

var $dragging = null;
$(document.body).on("mousemove", function (e) {
  if (linkem.start != 0 && linkem.end == 0) {
    $("#mindmap_link_tooltip").css({ "top": (e.pageY) + "px" })
    $("#mindmap_link_tooltip").css({ "left": (e.pageX) + "px" })
  } else {
    $("#mindmap_link_tooltip").css({ "top": "-100px" })
  }
  if ($dragging) {
    $dragging.offset({
      top: e.pageY - 15,
      left: e.pageX - 15
    });
    redrawlines();
  }
});

$(document).on("mousedown", ".handle", function (e) {
  $dragging = $(this).parent();
});


$(document).on("mouseup", function (e) {
  if ($dragging) {
    var index = $($dragging).data("key")
    mindmap.items[index].top = parseInt($($dragging).css("top"), 10);
    mindmap.items[index].left = parseInt($($dragging).css("left"), 10);
    $dragging = null;
    DrawMindMap();
  }
});



$(document).on("focus", ".mindmap-item", function (e) {
  $(this).find(".handle").show();
  $(this).find(".linker").show();
  $(this).find(".trash").show();

  CurrentMindmapItemKey = $(this).attr("id");
  redrawlines()
});

$(document).on("blur", ".mindmap-item", function (e) {
  $(this).find(".handle").hide();
  $(this).find(".linker").hide();
  $(this).find(".trash").hide();

  //store the dimensions here??

  $.each(mindmap.items, function (k, i) {
    i.width = $("#" + i.id + ">.notes").width() + 20; // the + 50 is the 20 padding and 5px for border!!!
    i.height = $("#" + i.id + ">.notes").height() + 20;
  })

  //  CurrentMindmapItemKey = "";
});

function createLine(el1, el2) {
  var off1 = getElementProperty(el1);
  var off2 = getElementProperty(el2);
  // center of first point
  var dx1 = off1.left + off1.width / 2;
  var dy1 = off1.top + off1.height / 2;
  // center of second point
  var dx2 = off2.left + off2.width / 2;
  var dy2 = off2.top + off1.height / 2;
  // distance
  var length = Math.sqrt(((dx2 - dx1) * (dx2 - dx1)) + ((dy2 - dy1) * (dy2 - dy1)));
  // center
  var cx = ((dx1 + dx2) / 2) - (length / 2);
  var cy = ((dy1 + dy2) / 2) - (2 / 2);
  // angle
  var angle = Math.atan2((dy1 - dy2), (dx1 - dx2)) * (180 / Math.PI);
  // draw line

  return "<div class='connectingLines' style='left:" + cx + "px; top:" + cy + "px; width:" + length + "px; -webkit-transform:rotate(" + angle + "deg); transform:rotate(" + angle + "deg);'></div>";
};

function getElementProperty(el) {
  var dx = 0;
  var dy = 0;
  var width = el.width() | 0;
  var height = el.height() | 0;

  dx += el.position().left;
  dy += el.position().top;

  return { top: dy, left: dx, width: width, height: height };
};


function ArrNoDupe(a) {
  var output = [];
  $.each(a, function (k, i) {
    if ($.inArray(i, output) == -1) {
      output.push(i);
    }
  })

  return output;
}


$(document).unbind().keydown(function (e) {
  var key = $("#" + CurrentMindmapItemKey).data("key")
  switch (e.which) {
    case 37: // left
      mindmap.items[key].left = $("#" + CurrentMindmapItemKey).position().left - 10;
      DrawMindMap()
      break;
    case 38: // up
      mindmap.items[key].top = $("#" + CurrentMindmapItemKey).position().top - 10;
      DrawMindMap()
      break;
    case 39: // right
      mindmap.items[key].left = $("#" + CurrentMindmapItemKey).position().left + 10;
      DrawMindMap()
      break;

    case 40: // down
      mindmap.items[key].top = $("#" + CurrentMindmapItemKey).position().top + 10;

      DrawMindMap()
      break;

    default: return; // exit this handler for other keys
  }
  e.preventDefault(); // prevent the default action (scroll / move caret)
});






