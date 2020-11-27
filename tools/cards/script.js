$('#navigation-toggle').show();
autoSyncCall();
// this needs to be updated so that each tool can be reset - the only required entry is TOOL
if (!WMproject.state) {
  WMproject.state = {}
}
WMproject.state.tool = "cards"
if (!WMproject.data) {
  WMproject.data = {};
}
if (!WMproject.data.cards) {
  WMproject.data.cards = [];
}
var editObject = {};

dosave();

function dosave() {
  db.projects.update(WMproject.id, WMproject).then(function () {});
}

var newCardObj = {};
var editcard = "new";
var allHashtags = []



$(document).off("click", "#hashtag-list>li").on("click", "#hashtag-list>li", function () {
  $("#card-search").val($(this).data('hash'))
  drawCards();
})



$(document).off("click", ".CardManagerModalButton").on("click", ".CardManagerModalButton",
  function () {
    //reset the card to blank
    newCardObj = JSON.parse("{}");
    newCardObj.title = '';
    newCardObj.content = '';
    newCardObj.images = [];
    newCardObj.tags = [];
    editcard = "new";
    $("#CardTitle").val(newCardObj.title);
    $("#CardContent").val(newCardObj.content);
    drawPreviewImages();
    hashtags = newCardObj.tags;
    redrawHashtags();
    //$("#wikiImage").attr("src", placeholderImage);
    $("#CardManagerModal").modal({
      backdrop: 'static',
      keyboard: false
    });
  });

$(document).off("click", ".card-edit-button").on("click", ".card-edit-button", function () {
  k = $(this).parent().data("key");
  editObject = results[k];
  editcard = "yes";
  //console.log(k)
  newCardObj = editObject;
  $("#CardTitle").val(editObject.title);
  $("#CardContent").val(editObject.content);

  drawPreviewImages();
  hashtags = editObject.tags;
  redrawHashtags();
  $("#CardManagerModal").modal({
    backdrop: 'static',
    keyboard: false
  });
  autosize.update($("#CardContent"))
});

// hacky way of making sure the modal triggers the atosize
$("#CardManagerModal").unbind().mouseenter(function () {
  //console.log("mouse")
  autosize.update($("#CardContent"))
})



$("#AddCard")
  .unbind()
  .click(function () {
    newCardObj.title = $("#CardTitle").val();
    newCardObj.content = $("#CardContent").val();
    newCardObj.tags = hashtags;
    if (editcard === "new") {
      WMproject.data.cards.push(newCardObj);
    } else {
      editObject = newCardObj;
      editObject = {};
      editcard = "new";
    }
    $("#CardManagerModal").modal("hide");
    dosave();
    drawCards();
  });

$(document).off("click", ".img-preview").on("click", ".img-preview", function () {
  swal({
    title: "Are you sure?",
    text: "This image won't be saved!",
    type: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, Remove it!"
  }).then(result => {
    if (result.value) {
      newCardObj.images.splice($(this).data("key"), 1);
      drawPreviewImages();
      swal("Deleted!", "That has been removed.", "success");
    }
  });


});

$("#toggleGridButton").unbind().click(function () {
  if (WMproject.state.gridDisplay == 1) {
    WMproject.state.gridDisplay = 0;
  } else {
    WMproject.state.gridDisplay = 1;
  }
  dosave();
  drawCards();
})

function drawCards() {
  allHashtags = [];
  $("#navigation-side-nav").html("<ul id='hashtag-list'></ul>")
  $.each(WMproject.data.cards, function (k, v) {
    $.each(v.tags, function (kk, vv) {
      // //console.log(allHashtags.indexOf(vv))
      if (allHashtags.indexOf(vv) == -1) {
        allHashtags.push(vv)
      }
    })
  })
  allHashtags.sort()
  $("#hashtag-list").append("<li data-hash='' class='btn btn-wavemaker' id='showAll'><i class='fa fa-fw fa-hashtag'></i> Show All</li>")
  $.each(allHashtags, function (k, v) {
    $("#hashtag-list").append("<li data-hash='" + v + "'><i class='fa fa-fw fa-hashtag'></i> " + v + "</li>")
  })
  $("#hashtag-list").append("<li data-hash='' class='btn  CardManagerModalButton'><i class='fa fa-fw fa-plus'></i>Click  here to add a Card</li>")





  var query = $("#card-search").val();
  if (query != "") {
    results = [];
    query = query.toLowerCase().replace(/ /g, "") // turns natural text into hashtage matching format
    ////console.log("searching", query);
    $.each(WMproject.data.cards, function (k, i) {
      var matchfound = 0;
      $.each(i.tags, function (kk, ii) {
        if (ii.indexOf(query) !== -1) {
          matchfound = 1;
        }
        if (matchfound) {
          //// //console.log("Match", query, i);
        }

      });
      if (matchfound) {
        results.push(i);
      }
    });

  } else {
    results = WMproject.data.cards;
  }

  $("#cards").html("");
  $.each(results, function (k, card) {
    if (WMproject.state.gridDisplay) {
      cardholder = $(`<div class="col-12 listview"></div>`);
      $("#toggleGridButton").html("<i class='fa fa-fw fa-th'></i>")
    } else {
      cardholder = $(`<div class="col-12 col-sm-6 col-md-4 col-lg-3"></div>`);
      $("#toggleGridButton").html("<i class='fa fa-fw fa-bars'></i>")
    }

    mycard = $(
      `<div class="cardy"><button class="card-delete-button"><i class="fa fa-fw fa-trash"></i></button><button class="card-edit-button"><i class="fa fa-fw fa-edit"></i></button></div>`
    );
    mycard.data("key", k);
    mycard.append("<div class='card-title'>" + card.title + "</div>");

    imageholder = $("<div class='card-images'></div>");
    // images to be laid out 

    switch (card.images.length) {
      case 1:
        var newImg = $('<div class="div-img" style=" background-image: url(' + card.images[0] + '); width:100%; height:100px;"></div>');
        newImg.data("key", 0);
        newImg.data("src", card.images[0]);
        newImg.attr("src", card.images)[0];
        imageholder.append(newImg);
        break;
      case 2:
        $.each(card.images, function (k, i) {
          var newImg = $('<div class="div-img" style=" background-image: url(' + i + '); width:50%; height:100px;"></div>');
          newImg.data("key", k);
          newImg.data("src", i);
          imageholder.append(newImg);
        });
        break;

      case 3:

        var newImg = $('<div class="div-img" style=" background-image: url(' + card.images[0] + '); width:50%; height:200px; float:left;"></div>');
        newImg.data("key", 0);
        newImg.data("src", card.images[0]);
        imageholder.append(newImg);

        var newImg = $('<div class="div-img" style=" background-image: url(' + card.images[1] + '); width:50%; height:100px; float:left;"></div>');
        newImg.data("key", 1);
        newImg.data("src", card.images[1]);
        imageholder.append(newImg);

        var newImg = $('<div class="div-img" style=" background-image: url(' + card.images[2] + '); width:50%; height:100px;  float:left;"></div>');
        newImg.data("key", 2);
        newImg.data("src", card.images[2]);
        imageholder.append(newImg);

        break;


      case 4:

        var newImg = $('<div class="div-img" style=" background-image: url(' + card.images[0] + '); width:50%; height:100px; float:left;"></div>');
        newImg.data("key", 0);
        newImg.data("src", card.images[0]);
        imageholder.append(newImg);

        var newImg = $('<div class="div-img" style=" background-image: url(' + card.images[1] + '); width:50%; height:100px; float:left;"></div>');
        newImg.data("key", 1);
        newImg.data("src", card.images[1]);
        imageholder.append(newImg);

        var newImg = $('<div class="div-img" style=" background-image: url(' + card.images[2] + '); width:50%; height:100px;  float:left;"></div>');
        newImg.data("key", 2);
        newImg.data("src", card.images[2]);
        imageholder.append(newImg);

        var newImg = $('<div class="div-img" style=" background-image: url(' + card.images[3] + '); width:50%; height:100px;  float:left;"></div>');
        newImg.data("key", 3);
        newImg.data("src", card.images[3]);
        imageholder.append(newImg);

        break;


      case 5:

        var newImg = $('<div class="div-img" style=" background-image: url(' + card.images[0] + '); width:50%; height:200px; float:left;"></div>');
        newImg.data("key", 0);
        newImg.data("src", card.images[0]);
        imageholder.append(newImg);

        var newImg = $('<div class="div-img" style=" background-image: url(' + card.images[1] + '); width:25%; height:100px; float:left;"></div>');
        newImg.data("key", 1);
        newImg.data("src", card.images[1]);
        imageholder.append(newImg);

        var newImg = $('<div class="div-img" style=" background-image: url(' + card.images[2] + '); width:25%; height:100px;  float:left;"></div>');
        newImg.data("key", 2);
        newImg.data("src", card.images[2]);
        imageholder.append(newImg);

        var newImg = $('<div class="div-img" style=" background-image: url(' + card.images[3] + '); width:25%; height:100px;  float:left;"></div>');
        newImg.data("key", 3);
        newImg.data("src", card.images[3]);
        imageholder.append(newImg);

        var newImg = $('<div class="div-img" style=" background-image: url(' + card.images[4] + '); width:25%; height:100px;  float:left;"></div>');
        newImg.data("key", 4);
        newImg.data("src", card.images[4]);
        imageholder.append(newImg);

        break;


      default:
        $.each(card.images, function (k, i) {
          var newImg = $('<div class="div-img" style=" background-image: url(' + i + '); width:25%; height:100px; float:left"></div>');
          newImg.data("key", k);
          newImg.data("src", i);
          imageholder.append(newImg);
        });
    }

    imageholder.append('<div style="clear:both"></div>');


    mycard.append(imageholder);

    mycard.append(
      "<div class='card-description'>" + nl2br(card.content) + "</div>"
    );

    tagHolder = $("<div class='card-tags'></div>");
    $.each(card.tags, function (k, i) {
      var newTag = $('<span class="badge badge-info">' + i + '</span>');
      tagHolder.append(newTag);
    });
    mycard.append(tagHolder);

    cardholder.append(mycard);
    $("#cards").append(cardholder);
  });

  if (results.length === 0) {
    if (query != "") {
      $("#cards").html("<h1>No matches found</h1>");
    } else {
      $("#cards").html(`<div class=''><button class='btn btn-wavemaker btn-block CardManagerModalButton' style='padding:60px; height:auto;'><i class='fa fa-fw fa-plus'></i>Click  here to add a Card</button></div>`);
    }
  }

  $(".card-img").unbind().bind("click", function () {
    var viewer = $("<div id='imageview'></div>");
    var img = $("<img />");
    img.attr("src", $(this).attr('src'));
    viewer.append(img);
    $("body").append(viewer);
  });

  $(".div-img").unbind().bind("click", function () {
    var viewer = $("<div id='imageview'></div>");
    var img = $("<img />");
    img.attr("src", $(this).data('src'));
    viewer.append(img);
    $("body").append(viewer);
  });

  if (!WMproject.state.gridDisplay) {
    var maxh = 0
    $.each($(".cardy"), function () {
      // //console.log($(this).height())
      if (maxh < $(this).height()) {
        maxh = $(this).height()
      }
      //console.log(maxh)
    })
    //$(".cardy").height(maxh);
  }

}

$(document).off("click", "#imageview").on("click", "#imageview", function () {
  $(this).remove();
});


drawCards();


$(function () {
  autosize($('#CardContent'));
});

$(document).off("change", "#wmImageUploadSelect").on("change", "#wmImageUploadSelect", function () {
  wmUploadFile(this);
});

var wmUploadFile = function (myinput) {

  // hides the button so we get a neat swap
  // $(".wm-image-upload-form").hide()
  var fileReader = new FileReader();
  var filterType = /^(?:image\/bmp|image\/cis\-cod|image\/gif|image\/ief|image\/jpeg|image\/jpeg|image\/jpeg|image\/pipeg|image\/png|image\/svg\+xml|image\/tiff|image\/x\-cmu\-raster|image\/x\-cmx|image\/x\-icon|image\/x\-portable\-anymap|image\/x\-portable\-bitmap|image\/x\-portable\-graymap|image\/x\-portable\-pixmap|image\/x\-rgb|image\/x\-xbitmap|image\/x\-xpixmap|image\/x\-xwindowdump)$/i;

  fileReader.onload = function (event) {
    var image = new Image();

    image.onload = function () {
      // document.getElementById("original-Img").src=image.src;
      var canvas = document.createElement("canvas");
      var context = canvas.getContext("2d");
      // set a width and calculate the ratio for the height
      endWidth = "600";
      endHeight = height = image.height / (image.width / endWidth);

      canvas.width = endWidth;
      canvas.height = endHeight;
      context.drawImage(
        image,
        0,
        0,
        image.width,
        image.height,
        0,
        0,
        canvas.width,
        canvas.height
      );
      // create  preview image and attach to parent
      if (!newCardObj.images) {
        newCardObj.images = [];
      }
      newCardObj.images.push(canvas.toDataURL());


      drawPreviewImages();

      // document.getElementById("base64").value = canvas.toDataURL();
      /*    idarray=parentDiv.attr("id").split("_");
       // //console.log(idarray)
        WMproject.wiki[idarray[1]].wiki_components[idarray[3]].content=canvas.toDataURL();*/
    };
    image.src = event.target.result;
  };

  var uploadImage = document.getElementById("wmImageUploadSelect");
  //check and retuns the length of uploded file.
  if (uploadImage.files.length === 0) {
    return;
  }
  //Is Used for validate a valid file.
  var uploadFile = uploadImage.files[0];
  if (!filterType.test(uploadFile.type)) {
    swal("Ooops!", "Please select a valid image.", "warning");
    return;
  }
  fileReader.readAsDataURL(uploadFile);
};

function drawPreviewImages() {
  $("#ImagePreviewHolder").html('');
  $.each(newCardObj.images, function (k, i) {
    newImg = $('<img class="img-preview" />');
    newImg.data("key", k);
    newImg.attr("src", i);
    $("#ImagePreviewHolder").append(newImg);
  });
}



var hashtags = [];

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

$(document).off("click", ".deletehashtag").on("click", ".deletehashtag", function () {
  key = $(this).data("key");
  hashtags.splice(key, 1);
  redrawHashtags();
});
$(document).off("click", "#hashtagger").on("click", "#hashtagger", function () {
  redrawHashtags();
});

$(document).off("keyup", "#ht").on("keyup", "#ht", function (e) {
  if (e.which == 13 || e.which == 32) //enter or space
  {
    if ($("#ht").val() == "") {
      // alert("Need to enter something")
    } else {
      hashtags.push($("#ht").val().toLowerCase().replace(/ /g, ""));
      hashtags = hashtags.filter(onlyUnique);
      hashtags.sort();
      redrawHashtags();
    }

  }

});

function redrawHashtags() {
  $("#hashtagger").html('');

  $.each(hashtags, function (k, i) {
    $("#hashtagger").append("<label class='badge badge-danger'>#" + i + " <i title='Delete this hashtag'  class='fa fa-times-circle deletehashtag' data-key='" + k + "'></i></badge>");
  });
  $("#hashtagger").append("<input id='ht' placeholder='#tag it' value=''>");
  $("#ht").focus();
}


$(document).off("click", ".card-delete-button").on("click", ".card-delete-button", function () {
  k = $(this).parent().data("key");
  swal({
    title: "Are you sure?",
    text: "This Card will be deleted",
    type: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, Remove it!"
  }).then(result => {
    if (result.value) {
      WMproject.data.cards.splice(k, 1);
      dosave();
      drawCards();
      swal("Deleted!", "That has been removed.", "success");
    }
  });
});



$('#card-search').unbind().bind("keyup", function () {
  drawCards();
});