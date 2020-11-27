/*
	|----------------------------|
	| Declare your databse       |
	|----------------------------|
  */

var WMproject = {};
var WMsettings = {};
var IsGoogleDrive = false;
const db = new Dexie("wavemaker");
db.version(1).stores({
  settings: "++id,settings",
  projects: "++id,title,data"
});

/*
Load the settings from the database
*/
db.settings.get(1, function (set) {
  if (set) {
    //cool settings found
    WMsettings = set;
    checkprojectloaded();
  } else {
    WMsettings = {
      currentproject: 0
    };
    db.settings.add(WMsettings).then(function () {
      loadtool("welcome");
    });
  }
});


function checkprojectloaded() {
  //console.log("loading project")
  if (WMsettings.currentproject) {
    db.projects.get(WMsettings.currentproject, function (set) {
      WMproject = set;
      if (!WMproject.state) {
        WMproject.state = {};
      }
      if (!WMproject.state.tool) {
        WMproject.state.tool = "writer";
      }
      if (WMproject.state.tool != "welcome") {
        loadtool(WMproject.state.tool)
        initNav()
      }
    });
  } else {
    loadtool("welcome")
  }
}

function saveWavemaker() {
  //console.log("Save SYNCH");
}

var exportData = {}

function exportDatabase(mode, showfeedback = false) {
  exportData.settings = {};
  exportData.projects = [];

  exportData.settings.id = 1
  exportData.settings.settings = WMsettings

  return db.projects.each(function (set) {
    var newObj = {}
    newObj.id = set.id
    newObj.title = set.title
    newObj.data = set.data
    exportData.projects.push(newObj)
  }).then(() => {

    switch (mode) {
      case "gDriveNew":
           console.log("New Google Drive Created");
        GDriveWrite(JSON.stringify(exportData))
        break;
      case "gDriveSave":
          console.log("Saving Data to Google Drive");
        GDriveWrite(JSON.stringify(exportData))
        break;
        case "gDriveSyncUp":
          console.log("Saving Data to Google Drive");
        GDriveWrite(JSON.stringify(exportData))

        break;
      default:
            console.log("defaults to backup")
        downloadFile(JSON.stringify(exportData))
    }
  });

}


function importWMproj(json, filename) {
  var newObj


  var importData = JSON.parse(json);

  //console.log(importData)
  newObj = {
    title: filename,
    data: {}
  }
  newObj.data.writer = [];
  newObj.data.timeline = [];
  newObj.data.snowflake = [];


  $.each(importData.writer, function (key, xwriter) {

    var notesarray = []
    $.each(xwriter.cards, function (xk, xcard) {
      notesarray.push({
        title: xcard.cardtype,
        content: xcard.cardtext,
        backgroundColor: xcard.cardColor,
        completed: xcard.completed,
      })
    });

    newObj.data.writer.push(
      {
        title: xwriter.title,
        data: {
          content: xwriter.bodytext,
          notes: notesarray
        }
      })


    var snowObj = {
      title: '',
      content: '',
      subcard1: {
        title: '',
        content: ''
      },
      subcard2: {
        title: '',
        content: ''
      },
      subcard3: {
        title: '',
        content: ''
      }
    }
    snowObj.title = xwriter.title;
    snowObj.content = xwriter.bodytext;
    if (xwriter.subcard1) {
      snowObj.subcard1.title = xwriter.subcard1.title;
      snowObj.subcard1.content = xwriter.subcard1.bodytext;
    }

    if (xwriter.subcard2) {
      snowObj.subcard2.title = xwriter.subcard2.title;
      snowObj.subcard2.content = xwriter.subcard2.bodytext;
    }

    if (xwriter.subcard3) {
      snowObj.subcard3.title = xwriter.subcard3.title;
      snowObj.subcard3.content = xwriter.subcard3.bodytext;
    }

    newObj.data.snowflake.push(snowObj)
  })

  $.each(importData.timeline, function (tk, xtimeline) {
    newObj.data.timeline.push(
      {
        title: xtimeline.cardtitle + " : " + xtimeline.cardevent,
        content: xtimeline.cardtext
      })

  })


  //  console.log(newObj)
  db.projects.add(newObj).then(function () {
    db.projects.toArray(function (arr) {
      WMsettings.currentproject = arr[arr.length - 1].id;
      db.settings.update(1, WMsettings).then(function () {
        checkprojectloaded();
      });
    })

  })
}

function importDatabase(json) {
  var importData = JSON.parse(json);
  //  console.log(importData)
  // Clear the database contents
  db.settings.clear()
  db.projects.clear()

  db.settings.add(importData.settings.settings).then(function () {
    //console.log("settings added")
  });

  $.each(importData.projects, function (k, v) {
    //   console.log(v)

    db.projects.add(v).then(function () {
      //  console.log("project " + v.id)
    });

  })
  $("#synchmsg").html("")
  swal("Import Complete!", "Your data file has been imported.", "success");
  exportData = {}
  loadtool("welcome")
}

function downloadFile(mydata) {
  var d = new Date();
  var str = d.getHours() + "-" + d.getMinutes() + "-" + d.getDate() + "-" + d.getMonth() + "-" + d.getFullYear();
  myfilename = "wavemaker-" + str + ".wmdata";
  //
  var element = document.createElement('a');
  element.setAttribute('href', 'data:wmdata/plain;charset=utf-8,' + encodeURIComponent(mydata));
  element.setAttribute('download', myfilename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}



// Client ID and API key from the Developer Console
var CLIENT_ID = '196875539919-18arpm8l3es472u2pjpf1vi8qgj3rdtl.apps.googleusercontent.com';
var API_KEY = 'AIzaSyAuG0KiJEMyzQYEj6jFiWD476y6QxQY5V0';
// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];
// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = 'https://www.googleapis.com/auth/drive.file';
var SHOW_CREATE
var CURRENT_FILE_OBJ

function GoogleQuickSignIn(){
  console.log("Attempting Quick Google drive login")
  gapi.load('client:auth2', GoogleQuickSignIn2)
}

function GoogleQuickSignIn2(){
  gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    discoveryDocs: DISCOVERY_DOCS,
    scope: SCOPES
  }).then(function () {
    gapi.auth2.getAuthInstance().isSignedIn.listen(GoogleSigninStatus);
    GoogleSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
  });
}

function GoogleQuickSignIn3(){
swal("Connection Done", "You will need to click the button to trigger an upload.", "success");
}
function GoogleDrivehandleClientLoad() {
  $("#showGoogle").hide();
  $("#GoogleError").show();
  gapi.load('client:auth2', GoogleDriveInit);
}

function GoogleDriveInit() {
  console.log("initialising Google Drive")
  gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    discoveryDocs: DISCOVERY_DOCS,
    scope: SCOPES
  }).then(function () {

    // Listen for sign-in state changes.
    gapi.auth2.getAuthInstance().isSignedIn.listen(GoogleSigninStatus);
    // Handle the initial sign-in state.
    GoogleSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    $('#authorize-button').unbind().click(function () {
      gapi.auth2.getAuthInstance().signIn()
    });
    $('#signout-button').unbind().click(function () {
      gapi.auth2.getAuthInstance().signOut();
    });
    $("#GoogleError").hide();
    $("#showGoogle").show();
  });

}

function GoogleSigninStatus(isSignedIn) {
  console.log("GoogleSigninStatus", isSignedIn)
  if (isSignedIn) {
    //  console.log("Signed In")
    $('#authorize-button').hide();
    $('#signout-button').show();
    $("#okGoogle").show();
    IsGoogleDrive = true;
    GDriveFileGet();
  } else {
    DoAutoSave=false
    //  console.log("Signed Out")
    $('#authorize-button').show();
    $('#signout-button').hide();
    $("#okGoogle").hide();
    IsGoogleDrive = false;
  }
}

function GDriveFileGet() {
  gapi.client.drive.files.list({
    'pageSize': 100,
    'fields': "nextPageToken, files(id, name)",
    'q': "name contains '.wavemakerData'",
  }).then(function (response) {
    var files = response.result.files;
    // get the first one found!
    if (files && files.length > 0) {
      // console.log("File exists - using first one found")
      CURRENT_FILE_OBJ = files[0]
    } else {
      exportDatabase('gDriveNew');
    }
  });
}

function GDriveRead() {
  //console.log("Reading File");
  var request = gapi.client.drive.files.get({
    fileId: CURRENT_FILE_OBJ.id,
    alt: 'media'
  })
  request.then(function (response) {
    CURRENT_FILE_OBJ = response;
    importDatabase(response.body)
    // console.log(CURRENT_FILE_OBJ)
  }, function (error) {
    //   console.error(error)
  })
  //console.log("Got" , CURRENT_FILE_OBJ);
  return request; //for batch request

}





function GDriveWrite(FILEDATA, callback) {
  var filePath = "";
  //console.log(CURRENT_FILE_OBJ);
  if (CURRENT_FILE_OBJ) {
    filePath = CURRENT_FILE_OBJ.id
  }
  const boundary = '-------314159265358979323846';
  const delimiter = "\r\n--" + boundary + "\r\n";
  const close_delim = "\r\n--" + boundary + "--";
  const contentType = 'application/json';
  var metadata = { 'name': "wm.wavemakerData", 'mimeType': contentType };
  var multipartRequestBody = delimiter + 'Content-Type: application/json\r\n\r\n' + JSON.stringify(metadata) + delimiter + 'Content-Type: ' + contentType + '\r\n\r\n' + FILEDATA + close_delim;
  var request
  if (filePath == "") {
    request = gapi.client.request({
      'path': '/upload/drive/v3/files',
      'method': 'POST',
      'params': {
        'uploadType': 'multipart'
      },
      'headers': {
        'Content-Type': 'multipart/related; boundary="' + boundary + '"'
      },
      'body': multipartRequestBody
    });
  } else {
    request = gapi.client.request({
      'path': '/upload/drive/v3/files/' + filePath,
      'method': 'PATCH',
      'params': {
        'uploadType': 'multipart'
      },
      'headers': {
        'Content-Type': 'multipart/related; boundary="' + boundary + '"'
      },
      'body': multipartRequestBody
    });
  }


  if (!callback) {
    callback = function (file) {
      if (CURRENT_FILE_OBJ) {
        console.log("Data Saved to GDrive");
      } else {
        console.log("Data Created on GDrive");
      }
  if(ShowUploadFeedback){
    if($("#SyncUpGdrive").length){
      $("#SyncUpGdrive").html('<i class="fa fa-fw fa-cloud-upload"></i>')
    }else{
      $("#synchmsg").html("")
      swal("Uploaded!", "That has been Uploaded.", "success");
    }
  }
  ShowUploadFeedback=true;
      CURRENT_FILE_OBJ = file;
    };
  }
  request.execute(callback);
}

