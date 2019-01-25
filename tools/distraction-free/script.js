hideNavBar()

if(!WMproject.state){
  WMproject.state={}
}
WMproject.state.tool= "distraction-free" ;
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





var Mydata="";
$("#distraction-free-editor").on("keyup",function(){
repos();
})

function repos(){
   var mypos =getCaretPosition($("#distraction-free-editor"))
 if($("#distraction-free-editor").html()!=""){
    var caretpos = mypos -$("#distraction-free-editor").position().top
    console.log(caretpos)
    var newpos = (window.innerHeight*0.4) - (caretpos)
    $("#distraction-free-editor").css({top: parseInt(newpos)+"px"})
 }
  gomarkdown()
}

function gohtml(){
   converter = new showdown.Converter();
      return converter.makeHtml(Mydata);
}
function gomarkdown(){
  var turndownService = new TurndownService();
      var markdown = turndownService.turndown($("#distraction-free-editor").html());
      Mydata = markdown;
      $("#wc").html(countWords(markdown))
}

function getCaretPosition(editableDiv) {
  var caretPos = 0,
    sel, range;
      sel = window.getSelection();
  range = sel.getRangeAt(0);
  caretPos = range.getBoundingClientRect();
  if(caretPos.y){  
    return caretPos.y;
  }else{
    
 var go = $("#distraction-free-editor").position().top + $(range.startContainer).position().top
    return go               
  }
}


$(function(){
document.execCommand("defaultParagraphSeparator", false, "p");
  $("#distraction-free-editor").css({top: "40%"})
 // $("#distraction-free-editor").focus()
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


  function countWords(str) {
    str = str.replace(/[^\w\s]|_/g, "")
             .replace(/\s+/g, " ");
      res= str.split(' ')
           .filter(function(n) { return n != '' })
           .length;
  return res;
  }