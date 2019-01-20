
function initNav(){   
loadNavBar()
showNavBar();
}

function deInitNav(){
  hideNavBar();
  $("#navigation-holder").remove()
  $('.popover').remove()

}



/*****************************************
 * EVENTS MANAGER
 * 
 * 
 */


$(document).on("click",".navigation-tool-bar-button", function(){
 action=$(this).data("action");
 $("#navigation-side-nav").html('')
if(action ==="welcome"){
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

}else{
  loadtool(action)
  showNavBar(); 
  }
})

$(document).on('click','#navigation-toggle' ,function(){
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
    $('#navigation-side-nav').fadeIn()
    $('#navigation-side-nav').data("visible",1);
  $("#wavemakerApp").css({left : 370})
  }

  function hideNavBar(){
    $('#navigation-side-nav').fadeOut()
    $('#navigation-side-nav').data("visible",0);
    $("#wavemakerApp").css({left : 50})
  }

function loadNavBar() {
    var d = new Date();
    navbar = $("<div id='navigation-holder'></div>");
    navbar.load("components/navigationbar.html?t=" + d.getTime(), function () {
      $("body").append(navbar);
      $('[data-toggle="popover"]').popover()
    });
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
      var d = new Date();
      // load and run the script
      $.getScript("tools/" + toolname + "/script.js?t=" + d.getTime(), function () {
  
      });
    });
  }



