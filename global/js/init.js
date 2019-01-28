var WriterKey = '';
var CURRENTNODE;
var CURRENTLI;

function checkMobile(){
  return($("#mobilecheck").is(":visible"))
}


function initNav(){   
loadNavBar()
}

function deInitNav(){
  hideNavBar();
  $("#navigation-holder").remove()
  $('.popover').remove()
  $("#wavemakerApp").css("left","0px");
}

/*****************************************
 * EVENTS MANAGER
 * 
 * 
 */


$(document).on("click",".navtrigger", function(){
 action=$(this).data("action");
 $("#navigation-side-nav").html('')

  loadtool(action)
  showNavBar(); 
 
})

$(document).off("click","#ProjectHome").on("click","#ProjectHome", function(){
  swal({
    title: "Are you sure?",
    text: "You will return to the main menu",
    type: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes!"
  }).then(result => {
    if (result.value) {
      WMproject = {};
      WMsettings.currentproject = 0;
      db.settings.update(1, WMsettings).then(function () {
        loadtool("welcome");
      });
    }
  });
})


$(document).off('click','#navigation-toggle').on('click','#navigation-toggle' ,function(){
  if($('#navigation-side-nav').data("visible")){
    hideNavBar();
  }else{
    showNavBar();
  }
})


 /*******************
  * END  * 
  */

  function showNavBar(){
    $('#navigation-side-nav').css({left : 50})
    $('#navigation-side-nav').data("visible",1);
  $("#wavemakerApp").css({left : 370})
  }

  function hideNavBar(){
    $('#navigation-side-nav').css({left : -270})
    $('#navigation-side-nav').data("visible",0);
    $("#wavemakerApp").css({left : 50})
  }

function loadNavBar() {
    var d = new Date();
    navbar = $("<div id='navigation-holder'></div>");
    navbar.load("components/navigationbar.html?t=" + d.getTime(), function () {
      $("body").append(navbar);
      $('[data-toggle="popover"]').popover();
      if(checkMobile()){
        hideNavBar()
      }else{
        showNavBar()
      }
    });

  }
  
  function nl2br(str, is_xhtml) {
    if (typeof str === 'undefined' || str === null) {
      return '';
    }
    var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>';
    return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
  }
  


function loadtool(toolname) {
    // this loads the html into the app div and then gets the script file and runs i
    /*
    if (toolname !== "welcome") {
      // check if wavemaker is set if not we go to the welcome page
      if (!wavemaker.title) {
        loadtool("welcome");
        return false;
      }
    }
    */
    var d = new Date();
    $("#wavemakerApp").load("tools/" + toolname + "/html.html?t=" + d.getTime(), function () {
      // load and run the script
      $.getScript("tools/" + toolname + "/script.js?t=" + d.getTime(), function () {
  
      });
    });
  }



  function countWords(str) {
    if(!str){
      return 0;
    }else{
    str = str.replace(/[^\w\s]|_/g, "")
             .replace(/\s+/g, " ");
  
    res= str.split(' ')
           .filter(function(n) { return n != '' })
           .length;
  return res;
    }
  }
  


  function setManuscript(){
    if(!WMproject.data.settings.manuscript){
      WMproject.data.settings.manuscript = {};
    }
    var manu = WMproject.data.settings.manuscript
    $.each(manu, function (k, i){
     document.documentElement.style.setProperty('--'+k, i);
     console.log("--"+k, " : " , i)
    })
   dosave();
  }
  
  function setManuscriptform(){
    if(!WMproject.data.settings){
      WMproject.data.settings = {};
    }

    if(!WMproject.data.settings.manuscript){
      WMproject.data.settings.manuscript = {};
    }
   var manu = WMproject.data.settings.manuscript
   $.each(manu, function (k, i){
       $('#'+k).val(i);
   })
 }

 function html2markdown(html){
  var turndownService = new TurndownService();
var markdown = turndownService.turndown(html);
return markdown;
}


function markdown2html(markdown){
  converter = new showdown.Converter();
  html = converter.makeHtml(markdown);
  return html
}

 /*
var Interfacetimeout = null;

$(document).on("mousemove", function() {
  $(".interfacehider").show();
  clearTimeout(Interfacetimeout);

  Interfacetimeout = setTimeout(function() {
    $(".interfacehider").fadeOut(1000);
    console.log("Mouse idle for 3 sec");
  }, 3000);
});
*/

/* This makes any inputs in the fancytree select all when they get create and fcused on */
$(document).off("focus", ".fancytree-edit-input").on("focus", ".fancytree-edit-input",function(){
  $(this).select();
}
)


/*
function disableF5(e) { if ((e.which || e.keyCode) == 116) {e.preventDefault();} };
$(document).on("keydown", disableF5);
*/
var changes = true;        
window.onbeforeunload = function() {
  //swal("Hmmm", 'Saving "just happens" with wavemaker!', "success");;
  return false;
 
}


// catch ctrl s

$(window).bind('keydown', function(event) {
  if (event.ctrlKey || event.metaKey) {
      switch (String.fromCharCode(event.which).toLowerCase()) {
      case 's':
          event.preventDefault();
          swal("No Need!", 'Saving "just happens" with wavemaker!', "success");
          break;
      case 'f':
          event.preventDefault();
         // alert('ctrl-f');
          break;
      case 'g':
          event.preventDefault();
        //  alert('ctrl-g');
          break;
      }
  }
});