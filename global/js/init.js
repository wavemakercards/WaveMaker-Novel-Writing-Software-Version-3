var WriterKey = '';
var CURRENTNODE;
var CURRENTLI;
var viewDocSettings = 0
var selectedSection;
var selectedNote;
var dropObj = {}
function checkMobile () {
  return ($("#mobilecheck").is(":visible"))
}


function initNav () {
  loadNavBar()
}

function deInitNav () {
  hideNavBar();
  $("#navigation-holder").remove()
  $('.popover').remove()
  $("#wavemakerApp").css("left", "0px");
}

/*****************************************
 * EVENTS MANAGER
 * 
 * 
 */


$(document).on("click", ".navtrigger", function () {
  action = $(this).data("action");
  $("#navigation-side-nav").html('')
  loadtool(action)
  showNavBar();
})

$(document).off("click", "#ProjectHome").on("click", "#ProjectHome", function () {
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


$(document).off("click", "#SyncUpGdrive").on("click","#SyncUpGdrive",function () {
  console.log("Attempting Quick Sync")
  if(IsGoogleDrive){
  console.log("Database Upload sync triggered from new button")
  $(this).html('<i class="fa fa-refresh fa-spin fa-fw">')
  exportDatabase("gDriveSave", false);
  }else{

    swal({
      title: "No Google Drive!!",
      text: "Your google drive account is not linked. Do you want to connect it now?",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes Please!'
    }).then((result) => {
      if (result.value) {
       
    GoogleQuickSignIn()
   
      }
    })


  }
})


$(document).off('click', '#navigation-toggle').on('click', '#navigation-toggle', function () {
  if ($('#navigation-side-nav').data("visible")) {
    hideNavBar();
  } else {
    showNavBar();
  }
})


/*******************
 * END  * 
 */

function showNavBar () {
  $('#navigation-side-nav').css({ left: 50 })
  $('#navigation-side-nav').data("visible", 1);
  $("#wavemakerApp").css({ left: 370 })
}

function hideNavBar () {
  $('#navigation-side-nav').css({ left: -270 })
  $('#navigation-side-nav').data("visible", 0);
  $("#wavemakerApp").css({ left: 50 })
}

function loadNavBar () {
  navbar = $("<div id='navigation-holder'></div>");
  navbar.load("components/navigationbar.html", function () {
    $("body").append(navbar);
    $('[data-toggle="popover"]').popover();
    if (checkMobile()) {
      hideNavBar()
    } else {
      showNavBar()
    }

  });

}

function nl2br (str, is_xhtml) {
  if (typeof str === 'undefined' || str === null) {
    return '';
  }
  var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>';
  return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
}

$.ajaxSetup({ cache: true });
var IntitalCount = 0;
function loadtool (toolname) {
  console.log("Loading tool" , toolname)
  gatherStats();
  $("#wavemakerApp").load("tools/" + toolname + "/html.html", function () {
    // load and run the script
    $.getScript("tools/" + toolname + "/script.js", function () {

    });
  });
}

function InitialWC (dta) {
  //console.log(dta)
  if (dta.data) {
    IntitalCount = IntitalCount + countWords(dta.data.content);
    if (dta.children !== undefined) {
      $.each(dta.children, function (k, v) {
        InitialWC(v)
      });
    }
  }
}

function gatherStats () {
  if (!WMproject.data) {
    console.log("no project loaded for stats")
  } else {
    console.log("Checking Stats")
    var d = new Date();
    // for logging I am  creating an entry in the settings with a wordcount for the previous day

    if (!WMsettings.wclog) {
      WMsettings.wclog = {};
    }
    today = d.getUTCFullYear() + "-" + (d.getUTCMonth() + 1) + "-" + d.getUTCDate();

    if (!WMsettings.wclog[today]) {
      console.log("getting Stats")
      $.each(WMproject.data.writer, function (k, v) {
        InitialWC(v)
      });
      WMsettings.wclog[today] = IntitalCount;
    }

  }


}

function countWords (str) {
  if (!str) {
    return 0;
  } else {
    str = str.replace(/[^\w\s]|_/g, "")
      .replace(/\s+/g, " ");

    res = str.split(' ')
      .filter(function (n) { return n != '' })
      .length;
    return res;
  }
}



function setManuscript () {

  if (!WMproject.data.settings) {
    WMproject.data.settings = {};
  }

  if (!WMproject.data.settings.manuscript) {
    WMproject.data.settings.manuscript = {};
  }
  var manu = WMproject.data.settings.manuscript
  $.each(manu, function (k, i) {
    document.documentElement.style.setProperty('--' + k, i);
    // console.log("--"+k, " : " , i)
  })
  dosave();
}

function setManuscriptform () {
  if (!WMproject.data.settings) {
    WMproject.data.settings = {};
  }

  if (!WMproject.data.settings.manuscript) {
    WMproject.data.settings.manuscript = {};
  }
  var manu = WMproject.data.settings.manuscript
  $.each(manu, function (k, i) {
    $('#' + k).val(i);
  })
}

function html2markdown (html) {
  var turndownService = new TurndownService();
  html = html.replaceAll("---", "&mdash;");
   html = html.replaceAll("--", "&ndash;");
  var markdown = turndownService.turndown(html);
  return markdown;
}


function markdown2html (markdown) {
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
$(document).off("focus", ".fancytree-edit-input").on("focus", ".fancytree-edit-input", function () {
  $(this).select();
}
)


/*
function disableF5(e) { if ((e.which || e.keyCode) == 116) {e.preventDefault();} };
$(document).on("keydown", disableF5);
*/
/*
// No longer needed as if they close it so what! It saves

window.onbeforeunload = function () {
  //swal("Hmmm", 'Saving "just happens" with wavemaker!', "success");;
  return false;

}
*/

// catch ctrl s

$(window).bind('keydown', function (event) {
  if (event.ctrlKey || event.metaKey) {
    switch (String.fromCharCode(event.which).toLowerCase()) {
      case 's':
        event.preventDefault();
        swal("No Need!", 'Saving "just happens" with wavemaker!', "success");
        break;
      case 'f':
        //  event.preventDefault();
        // alert('ctrl-f');
        break;
      case 'g':
        //   event.preventDefault();
        //  alert('ctrl-g');
        break;
    }
  }
});

$(document).bind('keydown', ".texteditor", function (event) {
  if (event.ctrlKey || event.metaKey) {
    switch (String.fromCharCode(event.which).toLowerCase()) {
      case 'b':
      document.execCommand("bold");
        event.preventDefault();
        break;
      case 'i':
      document.execCommand("italic");
          event.preventDefault();
        break;
    }
  }
});


$(document).off("click", ".noteCardAdd").on("click", ".noteCardAdd", function () {
  selectedSection = $(this).parent().data("objTarget");
  selectedNote = false;
  $("#CardModal").modal("show");
  $("#NoteCardtext").val("");
  $("#cardColorCoice").val('')
  autosize($('.noteTextEditor'));
})

$(document).off("click", ".CardsColourPickerButton").on("click", ".CardsColourPickerButton", function () {
  $("#cardColorCoice").val($(this).data("color"))
})


$(document).off("click", ".noteCardEdit").on("click", ".noteCardEdit", function () {
  selectedSection = $(this).parent().parent().parent().parent().data().objTarget;
  selectedNote = $(this).parent().parent().data().position;
  $("#CardType").val(selectedSection.data.notes[selectedNote].title);
  $("#NoteCardtext").val(selectedSection.data.notes[selectedNote].content);
  $("#cardColorCoice").val(selectedSection.data.notes[selectedNote].backgroundColor)
  $("#CardModal").modal("show");
  autosize($('.noteTextEditor'));
  autosize.update($(".noteTextEditor"));
})

$(document).off("click", "#saveCard").on("click", "#saveCard", function () {
  type = $("#CardType").val();
  text = $("#NoteCardtext").val();
  color = $("#cardColorCoice").val();
  if (selectedNote === false) {
    selectedSection.data.notes.push({
      title: type,
      content: text,
      backgroundColor: color
    })
  } else {
    selectedSection.data.notes[selectedNote].title = type
    selectedSection.data.notes[selectedNote].content = text
    selectedSection.data.notes[selectedNote].backgroundColor = color
  }
  // selectedSection = false;
  selectedNote = false;
  $("#CardModal").modal("hide")
  $('.modal-backdrop').remove();

  dosave()
  drawNotes();
})


$(document).off("click", ".deleteNoteCard").on("click", ".deleteNoteCard", function (evt) {
  evt.stopPropagation();
  swal({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Delete it!'
  }).then((result) => {
    if (result.value) {
      selectedNote = $(this).parent().parent().parent().parent().data().objTarget;
      kill = $(this).parent().parent().data().position;
      selectedNote.data.notes.splice(kill, 1)
      dosave()
      drawNotes()
      swal(
        'Deleted!',
        'Your Card has been deleted.',
        'success'
      )
    }
  })
})


$(document).off("click", ".cardToggle").on("click", ".cardToggle", function () {
  selectedSection = $(this).parent().parent().parent().parent().data().objTarget;
  selectedNote = $(this).parent().parent().data().position;
  selectedSection.data.notes[selectedNote].completed = !selectedSection.data.notes[selectedNote].completed;
  dosave()
  drawNotes()
})
