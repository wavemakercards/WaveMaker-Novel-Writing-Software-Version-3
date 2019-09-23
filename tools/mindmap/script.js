$('#navigation-toggle').show();
// this needs to be updated so that each tool can be reset - the only required entry is TOOL
if (!WMproject.state) {
  WMproject.state = {}
}
WMproject.state.tool = "mindmap"
if (!WMproject.data) {
  WMproject.data = {};
}
if (!WMproject.data.mindmaps) {
  WMproject.data.mindmaps = [];
}



SaveMindMap();

var placeholderImage = "data:image/png;base64,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sAUWFhZqMBh89rOtzc0aj8e1uLAw5anmz3g8ru3t7To6Ojrx31yzHxolWC1w48aN+vjx44mfv9/amuI0nKTb7dbi4mLTY8w1p4QtsLK6Wleu2BVtt3Z7zQOnDfNX0gLdbrfu3LnT9Bicotvt1vq6fdQ0wWqJ79bX68bNm02PwQkePXpUvZ4rKE0TrJbodDr15MmTuilardLpdOrR48e1vLLS9ChUVWdje3fc9BD833g8rvdbW7WxsXHq3Sou3/UbN+r+/fvV7/ebHoU/CVZLHR8f1+7ubu3//nsNh8M6HttN09Drdmux36/l5WUvlreQYAExXMMCYggWEEOwgBiCBcQQLCCGYAExBAuIIVhADMECYggWEEOwgBiCBcQQLCCGYAExBAuIIVhADMECYggWEEOwgBiCBcQQLCCGYAExBAuIIVhADMECYggWEEOwgBiCBcQQLCCGYAExBAuIIVhADMECYggWEEOwgBiCBcQQLCCGYAExBAuIIVhADMECYggWEEOwgBiCBcQQLCCGYAExBAuIIVhADMECYggWEEOwgBiCBcQQLCCGYAExBAuIIVhADMECYggWEEOwgBiCBcQQLCCGYAExBAuIIVhADMECYggWEEOwgBiCBcQQLCCGYAExBAuIIVhADMECYggWEEOwgBiCBcQQLCCGYAExBAuIIVhADMECYggWEEOwgBiCBcQQLCCGYAExBAuIIVhADMECYggWEEOwgBiCBcQQLCCGYAExBAuIIVhADMECYggWEEOwgBiCBcQQLCCGYAExBAuIIVhADMECYggWEOO/jJ5izESHF+4AAAAASUVORK5CYII=";


var CurrentMindmapItemKey = ""
var mindmapkey;

function loadMindMap(mykey) {
  mindmap = WMproject.data.mindmaps[mykey]
  mindmap = {};
}




function SaveMindMap() {
  db.projects.update(WMproject.id, WMproject).then(function () {});
}

var mindmap = {}
var linkem = {
  start: '',
  end: ''
};
var linkKey = -1

DrawMindMapNav()


function DrawMindMapNav() {
  SaveMindMap()
  $("#navigation-side-nav").html('')
  $("#navigation-side-nav").append("<ul id='mindmap-list'></ul>")
  $("#mindmap-list").append("<li data-key='add' class='btn  btn-wavemaker'><i class='fa fa-fw fa-plus'></i> Create a Mindmap</li>")
  $.each(WMproject.data.mindmaps, function (k, i) {
    var newli = $("<li><i class='fa fa-fw fa-sitemap fa-rotate-270'></i> <input class='mindmap-title' value='" + i.title + "' /></li>")
    /*
    <input id="mindmap-title" value="">
    */
    newli.data("key", k);
    $("#mindmap-list").append(newli)
  })
}


$(document).off("click", "#mindmap-list>li").on("click", "#mindmap-list>li", function () {
  var key = $(this).data('key');
  if (key === "add") {
    var newmap = {
      title: "New Mindmap",
      links: [],
      items: []
    }
    WMproject.data.mindmaps.push(newmap)
    SaveMindMap()
    DrawMindMapNav()
  } else {
    mindmapkey = key;
    mindmap = WMproject.data.mindmaps[key]
    DrawMindMap()
  }
})


function DrawMindMap() {
  SaveMindMap()
  $("#mindmap_items").html('')
  $.each(mindmap.items, function (k, i) {
    newnode = $('<div class="mindmap-item" tabindex="1"></div>')
    newnode.attr("id", i.id);
    newnode.data("key", k);
    newnode.data("uid", i.id);
    newnode.append("<div class='mindmapHandle'  style='display:none'><i class='fa fa-fw fa-arrows'></i></div>")

    if (i.type === "note") {
      nodecontent = $("<textarea rows='1' class='notes nodeitem' tabindex='1' style ='width:" + i.width + "px; height:" + i.height + "px;  ' >" + i.content + "</textarea>")
      nodecontent.data("key", k);
      // newnode.append("<div class='edit nodeimageedit data-key='" + k + "' style='display:none'><i class='fa fa-fw fa-upload'></i></div>")
    }

    if (i.type === "image") {
      nodecontent = $("<img class='nodeimage nodeitem'  >");
      nodecontent.attr("src", i.content);
      nodecontent.data("key", k);
      newnode.append("<div class='edit nodeimageedit' data-key='" + k + "' style='display:none'><i class='fa fa-fw fa-upload'></i></div>")
    }
    newnode.append(nodecontent)
    newnode.append("<div class='linker' style='display:none'><i class='fa fa-fw fa-link'></i></div>")
    newnode.append("<div class='trash' style='display:none'><i class='fa fa-fw fa-close'></i></div>")

    $(newnode).css({
      "top": i.top + "px"
    });
    $(newnode).css({
      "left": i.left + "px"
    });
    $("#mindmap_items").append(newnode)

  })
  redrawlines()
  if (CurrentMindmapItemKey) {
    $("#" + CurrentMindmapItemKey).focus();
  }
  autosize($(".notes"))
  console.log("MINDMAP : ", mindmap)
  $("#mindmap-title").val(mindmap.title)
  $("#mindmap-hide-tools").show();

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
$(document).off("click", ".trash").on("click", ".trash", function (e) {



  swal({
    title: "Are you sure?",
    text: "You Will remove this node and all it's links",
    type: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, Remove it!"
  }).then(result => {
    if (result.value) {
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
      swal("Deleted!", "That has been deleted.", "success");
      DrawMindMap();



    }
  });

})


$(document).off("click", ".connectingLines").on("click", ".connectingLines", function (e) {
  e.stopPropagation()
  linkKey = $(this).data("key");

  swal({
    title: "Are you sure?",
    text: "You Will remove this link",
    type: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, Remove it!"
  }).then(result => {
    if (result.value) {
      mindmap.links.splice(linkKey, 1);
      linkKey = -1
      swal("Deleted!", "That has been deleted.", "success");
      DrawMindMap();
    }
  });

})

$(document).on("click", ".mindmap-item", function (e) {
  e.stopPropagation()

})

$(document).off("click", "#mindmap_items").on("click", "#mindmap_items", function (e) {
  e.stopPropagation()
  CurrentMindmapItemKey = '';
  linkem = {
    start: '',
    end: ''
  };
  DrawMindMap();
})


$(document).off("keyup", ".notes").on("keyup", ".notes", function () {
  key = $(this).parent().data("key")
  mindmap.items[key].content = $(this).val();

})

$(document).off("click", ".linker").on("click", ".linker", function (e) {
  e.stopPropagation()
  myLinkButton = $(this).parent().attr("id");
  if (linkem.start == 0) {
    linkem.start = myLinkButton;
    linkem.end = 0;
  } else {
    if (linkem.start != myLinkButton) {
      linkem.end = myLinkButton;
      mindmap.links.push(linkem)

      // clean up the  links array
      nodupes = ArrNoDupe(mindmap.links); // no duplicate links
      mindmap.links = nodupes;


      DrawMindMap();
      linkem = {
        start: '',
        end: ''
      };
    } else {
      console.log("not linking to the same one")
    }

  }
})

$("#add_mindmap_item").click(function () {
  var newnode = {
    "id": uuID(),
    "content": "",
    "type": "note",
    "top": 70,
    "left": 70
  }
  mindmap.items.push(newnode)
  DrawMindMap();

})

$("#add_mindmap_image").click(function () {
  var newnode = {
    "id": uuID(),
    "content": placeholderImage,
    "type": "image",
    "top": 70,
    "left": 70
  }
  mindmap.items.push(newnode)
  DrawMindMap();

})

var $dragging = null;
$(document.body).off("mousemove").on("mousemove", function (e) {

  if (linkem.start !== '') {
    var relativeX = (e.pageX - $("#mindmap_items").offset().left + 10),
      relativeY = (e.pageY - $("#mindmap_items").offset().top + 10);
    $("#linktip").css({
      "top": relativeY + "px",
      "left": relativeX + "px"
    });
  } else {
    $("#linktip").css({
      "top": "-100px",
      "left": "0px"
    });
  }


  if ($dragging) {
    $dragging.offset({
      top: e.pageY - 15,
      left: e.pageX - 15
    });
    redrawlines();
  }
});

$(document).off("mousedown", ".mindmapHandle").on("mousedown", ".mindmapHandle", function (e) {
  $dragging = $(this).parent();
});


$(document).off("mouseup").on("mouseup", function (e) {
  if ($dragging) {
    var index = $($dragging).data("key")
    mindmap.items[index].top = parseInt($($dragging).css("top"), 10);
    mindmap.items[index].left = parseInt($($dragging).css("left"), 10);
    $dragging = null;
    DrawMindMap();
  }
});



$(document).off("focus", ".mindmap-item").on("focus", ".mindmap-item", function (e) {
  $(this).find(".mindmapHandle").show();
  $(this).find(".linker").show();
  $(this).find(".trash").show();
  $(this).find(".edit").show();

  CurrentMindmapItemKey = $(this).attr("id");
  redrawlines()
});

$(document).off("blur", ".mindmap-item").on("blur", ".mindmap-item", function (e) {
  $(this).find(".mindmapHandle").hide();
  $(this).find(".linker").hide();
  $(this).find(".trash").hide();
  $(this).find(".edit").hide();

  //store the dimensions here??

  $.each(mindmap.items, function (k, i) {
    i.width = $("#" + i.id + ">.notes").width() + 30; // the + 30 is the 20 padding and 5px for border!!!
    i.height = $("#" + i.id + ">.notes").height() + 30;
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
  var dy2 = off2.top + off2.height / 2;
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

  return {
    top: dy,
    left: dx,
    width: width,
    height: height
  };
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

var editingnote = false;


$(document).off("focus", ".notes").on("focus", ".notes", function (e) {
  editingnote = true;
});

$(document).off("blur", ".notes").on("blur", ".notes", function (e) {
  editingnote = false;
});

$("#mindmap_items").keydown(function (e) {
  if (!editingnote) {
    switch (e.which) {
      case 37: // left
        mindmap.items[$("#" + CurrentMindmapItemKey).data("key")].left = $("#" + CurrentMindmapItemKey).position().left - 10;
        DrawMindMap()
        break;
      case 38: // up
        mindmap.items[$("#" + CurrentMindmapItemKey).data("key")].top = $("#" + CurrentMindmapItemKey).position().top - 10;
        DrawMindMap()
        break;
      case 39: // right
        mindmap.items[$("#" + CurrentMindmapItemKey).data("key")].left = $("#" + CurrentMindmapItemKey).position().left + 10;
        DrawMindMap()
        break;

      case 40: // down
        mindmap.items[$("#" + CurrentMindmapItemKey).data("key")].top = $("#" + CurrentMindmapItemKey).position().top + 10;
        DrawMindMap()
        break;

      default:
        return; // exit this mindmapHandler for other keys
    }
    e.preventDefault(); // prevent the default action (scroll / move caret)
  }
});



$(document).off("keyup", ".mindmap-title").on("keyup",".mindmap-title", function () {
  mindmap.title = $(this).val()
  console.log(mindmapkey)
  //  $("#mindmap-title-" + mindmapkey).text($(this).val())

})

$("#delete-current-mindmap").unbind().click(function () {
  swal({
    title: "Are you sure?",
    text: "You will remove this Mindmap and all it's data?",
    type: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, Remove it!"
  }).then(result => {
    if (result.value) {

      WMproject.data.mindmaps.splice(mindmapkey, 1);
      swal("Deleted!", "That has been deleted.", "success");
      DrawMindMapNav();
      $("#mindmap_items").html('');
      $("#mindmap_line").html('');
      $("#mindmap-hide-tools").hide();
      mindmapkey = '';
    }
  });
})

var imageNodeKey = -1
$(document).off("click", ".nodeimageedit").on("click", ".nodeimageedit", function () {
  imageNodeKey = $(this).data("key")
  $("#mindmapImageUpload").click()
})

$(document).off("change", "#mindmapImageUpload").on("change", "#mindmapImageUpload", function () {
  MMUploadFile(this)
})


var MMUploadFile = function (myinput) {
  var fileReader = new FileReader();
  var filterType = /^(?:image\/bmp|image\/cis\-cod|image\/gif|image\/ief|image\/jpeg|image\/jpeg|image\/jpeg|image\/pipeg|image\/png|image\/svg\+xml|image\/tiff|image\/x\-cmu\-raster|image\/x\-cmx|image\/x\-icon|image\/x\-portable\-anymap|image\/x\-portable\-bitmap|image\/x\-portable\-graymap|image\/x\-portable\-pixmap|image\/x\-rgb|image\/x\-xbitmap|image\/x\-xpixmap|image\/x\-xwindowdump)$/i;
  fileReader.onload = function (event) {
    var image = new Image();
    image.onload = function () {
      var canvas = document.createElement("canvas");
      var context = canvas.getContext("2d");
      endWidth = "300";
      endHeight = height = image.height / (image.width / endWidth)


      canvas.width = endWidth;
      canvas.height = endHeight;
      context.drawImage(image,
        0,
        0,
        image.width,
        image.height,
        0,
        0,
        canvas.width,
        canvas.height
      );

      mindmap.items[imageNodeKey].content = canvas.toDataURL();
      DrawMindMap();
    }
    image.src = event.target.result;

  };

  var uploadImage = document.getElementById("mindmapImageUpload");
  //check and retuns the length of uploded file.
  if (uploadImage.files.length === 0) {
    return;
  }
  //Is Used for validate a valid file.
  var uploadFile = uploadImage.files[0];
  if (!filterType.test(uploadFile.type)) {
    alert("Please select a valid image.");
    return;
  }
  fileReader.readAsDataURL(uploadFile);
}