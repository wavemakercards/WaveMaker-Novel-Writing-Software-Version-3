$('#navigation-toggle').hide();
hideNavBar()
autoSyncCall();

if(!WMproject.state){
  WMproject.state={}
}
WMproject.state.tool= "challenge" ;
if (!WMproject.data) {
  WMproject.data = {};
}

savedata()
function savedata() {
  db.projects.update(WMproject.id, WMproject).then(function () {
    saveWavemaker();
  });
}

var target = 150;

var timer = 5 * 60;
var timeoutElement


$(function () {
  $("#result").hide();
  autosize($('.ChallengeModeTextarea'));
  //setTimeout(typeWriter, speed);
  $("#letsgo").unbind().click(
    function () {
      //console.log($("#ds_settings").val())
      timer = $("#ds_settings").val() * 60
      target = $("#ds_settings").val() * 30
      $("#startform").fadeOut()
      timeoutElement= setTimeout(writetimer, 1000);
      $('#challengeEditor').focus();
      document.getElementById("challengeEditor").onkeydown = checkKey;
    })
})



function writetimer() {
  if (timer == 0) {
    $("#displayTimer").html('<button onclick="finish()" class="timerselect">Finish</button>')
  } else {
    timer = timer - 1;
    $("#displayTimer").html(timer + " seconds left")
    timeoutElement= setTimeout(writetimer, 1000);
  }
}

$(document).off("paste", "#challengeEditor").on("paste", "#challengeEditor", function (e) {
  e.preventDefault();
  var text = "";
  if (e.clipboardData || e.originalEvent.clipboardData) {
    text = (e.originalEvent || e).clipboardData.getData("text/plain");
  } else if (window.clipboardData) {
    text = window.clipboardData.getData("Text");
  }
  if (document.queryCommandSupported("insertText")) {
    document.execCommand("insertText", false, text);
  } else {
    document.execCommand("paste", false, text);
  }
});

function checkKey(e) {
  e = e || window.event;
  if (e.keyCode == '38') {
    // up arrow
    e.preventDefault();
  }
  else if (e.keyCode == '40') {
    // down arrow
    e.preventDefault();
  }
  else if (e.keyCode == '37') {
    e.preventDefault();
    // left arrow
  }
  else if (e.keyCode == '39') {
    e.preventDefault();
    // right arrow
  }
  getwordcount($("#challengeEditor"))
}


function getwordcount(el) {

  var val = $.trim(el.val());

  if (val === "") {

    words = 0;

  } else {

    words = val.replace(/\s+/gi, ' ').split(' ').length;

    chars = val.length;

  }

  per = (100 / target) * words

  if (per > 100) { per = 100; }

  per = parseInt(per);

  per = per / 100;

  if (per < 0.2) { per = 0.2 }



  $("#displayCount").css('color', 'rgba(255,255,255,' + per + ')');

  res = target - words

  if (res < 1) {

    res = "All Done";

    $("#displayCount").html('<button onclick="finish()" class="timerselect">Finish</button>')

  } else {

    res = res + " words remain"

    $("#displayCount").text(res);

  }





}



function finish() { 
  clearTimeout(timeoutElement)
  html=markdown2html(nl2br($("#challengeEditor").val()));

  markdown= html2markdown(html)

  $(".resultholder").html(html)

  var eventtime = new Date();



  WMproject.data.writer.push({

    icon: "fa fa-fw fa-trophy",

    title : eventtime,

    data : {

      content : markdown

    }

  })

  $("#result").show();

  $("#challengeEditor").val('');

}

