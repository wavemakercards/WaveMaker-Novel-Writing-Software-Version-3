$('#navigation-toggle').hide();
hideNavBar()
autoSyncCall();


if(!WMproject.state){

  WMproject.state={}

}

WMproject.state.tool= "writer" ; // not distraction free as wont know what to load

if (!WMproject.data) {

  WMproject.data = {};

}

if (!WMproject.data.distraction_free) {

  WMproject.data.distraction_free = [];

}

savedata()

function savedata() {

  db.projects.update(WMproject.id, WMproject).then(function () {

    saveWavemaker();

  });

}

if(!CURRENTNODE){

  $("#navigation-holder").show()

  loadtool("writer")

}





$("#distraction-free-editor").on("keyup",function(){

  repos();

dosave();

})


var lastpos
function repos(){
   var mypos =getCaretPosition($("#distraction-free-editor"))
   if(mypos!==0){
    var newpos = (mypos -$("#distraction-free-editor").position().top)
   // console.log("Target pos", parseInt(newpos))
  //  $("#editorholder").scrollTop(parseInt(newpos))

      //  newpos=newpos-100;
     if(lastpos!==newpos){
     lastpos=newpos
     
       $("#editorholder").animate({
                    scrollTop: parseInt(newpos)
                }, 400);
     }
     
   }
}





function getCaretPosition(editableDiv) {

  var caretPos = 0,

    sel, range;

      sel = window.getSelection();

  range = sel.getRangeAt(0);

  caretPos = range.getBoundingClientRect();
  return caretPos.y;

  /*
  if(caretPos.y){  

    return caretPos.y;

  }else{



 var go = $("#distraction-free-editor").position().top + $(range.startContainer).position().top

    return go               

  }
  */

}





$(function(){

document.execCommand("defaultParagraphSeparator", false, "p");

  $("#distraction-free-editor").css({top: "40%"})

 // $("#distraction-free-editor").focus()



 $("#distraction-free-editor").html(markdown2html(CURRENTNODE.data.content))


 dosave()



})



$(document).off("click","#bold").on("click","#bold", function(){

  document.execCommand("bold", false, null);

})



$(document).off("click","#italic").on("click","#italic", function(){

  document.execCommand("italic", false, null);

})



$(document).off("click","#h1").on("click","#h1", function(){

  document.execCommand("formatBlock", false, "h1");

})



$(document).off("click","#h2").on("click","#h2", function(){

  document.execCommand("formatBlock", false, "h2");

})



$(document).off("click","#h3").on("click","#h3", function(){

  document.execCommand("formatBlock", false, "h3");

})



$(document).off("click","#paragraph").on("click","#paragraph", function(){

  document.execCommand("formatBlock", false, "p");

})



$(document).off("click", "#distraction-free").on("click", "#distraction-free", function () {

  $("#navigation-holder").show()

  loadtool("writer")

});



$('#distraction-free-editor').off('paste').on('paste', function(e) {

    e.preventDefault();

    var text = '';

    if (e.clipboardData || e.originalEvent.clipboardData) {

      text = (e.originalEvent || e).clipboardData.getData('text/plain');

    } else if (window.clipboardData) {

      text = window.clipboardData.getData('Text');

    }

    if (document.queryCommandSupported('insertText')) {

      document.execCommand('insertText', false, text);

    } else {

      document.execCommand('paste', false, text);

    }

});



  function dosave() {

      var markdown = html2markdown($("#distraction-free-editor").html())
      CURRENTNODE.data.content = markdown;
  

    $("#distraction-free-wc").html(countWords(markdown)+" Wd")



    WMproject.data.writer = $("#manuscript")

      .fancytree("getTree")

      .toDict();

    if (!WMproject.data.writer) {

      WMproject.data.writer = [{

        title: "Your Story"

      }];

      $('#manuscript').fancytree("getTree").reload()

    }

    db.projects.update(WMproject.id, WMproject).then(function () {

    });

  }

