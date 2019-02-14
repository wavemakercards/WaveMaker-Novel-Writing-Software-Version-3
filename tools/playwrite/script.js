$('#navigation-toggle').show();
if (!WMproject.state) {
  WMproject.state = {}
}

WMproject.state.tool = "playwrite"; // not distraction free as wont know what to load
if (!WMproject.data) {
  WMproject.data = {};
}
if (!WMproject.data.playwrite) {
  WMproject.data.playwrite = [];
}
savedata();
function savedata() {
  db.projects.update(WMproject.id, WMproject).then(function () {
    saveWavemaker();
  });
}


var ScriptNode;
var ScriptPage;


function drawScriptMenu() {
  $("#navigation-side-nav").html('');
  $("#navigation-side-nav").append("<button class='btn btn-wavemaker btn-block' id='playwrightsceneadd'>Add</button>");
  $("#navigation-side-nav").append("<ul id='scenelist'></ul>");

  $.each(WMproject.data.playwrite, function (k, v) {
    var node = $("<li class='pw_sc'></li>");
    node.data("key", k)
    node.text(v.title)
    $("#scenelist").append(node);
  });
}

$(function () {
  drawScriptMenu()
})

var arrIndex = 0

$(document).on("focus", ".wm_", function () {
  arrIndex = $(this).parent().data("key") + 1;
})


function drawScriptPage() {
  $("#scriptwriter").html("");

  ScriptPage = WMproject.data.playwrite[ScriptNode].content
  if (ScriptPage.length === 0) {
    ScriptPage.push({
      type: 'description',
      name: '',
      content: "Start Here"
    });
  }


  $("#scriptwriter").append("<input class='form-control' value='" + WMproject.data.playwrite[ScriptNode].title + "' />")


  mychars = {}
  $.each(ScriptPage, function (k, v) {
    var NewBlock
    switch (v.type) {
      case "description":
        NewBlock = $("<div class='wm_description clearfix' data-key='" + k + "'></div>");

        NewBlock.append("<textarea data-type='content' class='wm_content wm_' placeholder='Write Here ....'>" + v.content + "</textarea>")
        break;
      case "dialogue":
        NewBlock = $("<div class='wm_dialogue clearfix'  data-key='" + k + "'></div>");

        NewBlock.append("<input  list='charnames' data-type='name' class='wm_name wm_' value='" + v.name + "' placeholder='Character Name'/>")
        mychars[v.name] = 1;

        NewBlock.append("<textarea data-type='content' class='wm_content wm_' placeholder='Write Here ....'>" + v.content + "</textarea>")
        break;
    }




    $("#scriptwriter").append(NewBlock)
    // $("#page").append("<div class='breaker'></div>")    
  })

  // run the autosize code
  autosize($(".wm_"))
  // find which elemenr
  $("[data-key = '" + arrIndex + "']").children(":first").focus();

  $('#charnames').html('')
  $.each(mychars, function (kk, vv) {
    $('#charnames').append("<option value='" + kk + "' />");
  })

}

$(document).on("keydown", ".wm_", function () {
  if ($(this).hasClass('wm_content') && event.keyCode == 9) {
    if ($(this).parent()[0] === $("#scriptwriter").children().last()[0]) {

      item = { type: 'dialogue', name: '', content: "" }

      ScriptPage.splice(arrIndex, 0, item)
      drawScriptPage();

      event.stopPropagation();
      return false;
    }
  }
  if (event.keyCode == 13) {
    if (event.shiftKey) {

      item = { type: 'dialogue', name: '', content: "" }

      ScriptPage.splice(arrIndex, 0, item)
      drawScriptPage();
      event.stopPropagation();
      return false;
    }
  }
  if (event.ctrlKey || event.metaKey) {
    if (event.keyCode == 13) {
      item = { type: 'description', content: "" }
      ScriptPage.splice(arrIndex, 0, item)
      drawScriptPage();
      event.stopPropagation();
      return false;
    }
  }


  if (event.ctrlKey || event.metaKey) {
    if (event.keyCode == 88) {  // ctrl X     
      ScriptPage.splice($(this).parent().data("key"), 1)
      drawScriptPage();
      event.stopPropagation();
      return false;
    }
  }

  if (event.ctrlKey || event.metaKey) {
    if (event.keyCode == 83) {  // ctrl S - switch    
      newtype = 'description';
      key = $(this).parent().data("key");
      if (ScriptPage[key].type === 'description') {
        newtype = "dialogue"
      }
      ScriptPage[key].type = newtype,
        arrIndex = key;
      drawScriptPage();
      event.stopPropagation();
      return false;
    }
  }

  // only do these on main block
  if ($(this).hasClass('wm_content')) {
    if (event.keyCode == 40) {  // down

      if (arrIndex != $("#scriptwriter").children().length) {
        arrIndex = $(this).parent().data("key") + 1
        drawScriptPage();
      }
      event.stopPropagation();
      return false;
    }


  }


  if (event.keyCode == 38) {  // up

    if (arrIndex != 1) {
      arrIndex = $(this).parent().data("key") - 1
      drawScriptPage();
    }
    event.stopPropagation();
    return false;
  }


  var key = $(this).parent().data("key")
  var type = $(this).data("type")
  ScriptPage[key][type] = $(this).val();
  savedata();

})


$(document).off("click", "#playwrightsceneadd").on("click", "#playwrightsceneadd", function () {
  WMproject.data.playwrite.push({ title: "New Scene", content: [] })
  savedata();
  drawScriptMenu();
})


$(document).off("click", ".pw_sc").on("click", ".pw_sc", function () {
  ScriptNode = $(this).data("key");
  drawScriptPage();
})
