$('#navigation-toggle').hide();
hideNavBar()
autoSyncCall();

if(!WMproject.state){
  WMproject.state={}
}
WMproject.state.tool = "snowflake"



if (!WMproject.data) {
  WMproject.data = {};
}
if (!WMproject.data.snowflake) {
  WMproject.data.snowflake = [];
}
savedata()
function savedata() {
  db.projects.update(WMproject.id, WMproject).then(function () {
    saveWavemaker();
  });
}

function redrawCards() {
  $("#snowflakeCards").html("");

  if (WMproject.data.snowflake.length === 0) {
    WMproject.data.snowflake = [{
      title: "",
      content: "",
      subcard1: { title: "", content: "" },
      subcard2: { title: "", content: "" },
      subcard3: { title: "", content: "" },
      active: 0
    }]
  }



  $.each(WMproject.data.snowflake, function (key, set) {


    showstyle = "display:none;";
    if (set.active === 1) {
      showstyle = "";
    }

    if (!set.subcard1) { set.subcard1 = { title: '', content: '' }; }
    if (!set.subcard2) { set.subcard2 = { title: '', content: '' }; }
    if (!set.subcard3) { set.subcard3 = { title: '', content: '' }; }

    cardhtml = `<div class='container' data-snowflakeid='${key}'><div class="row w-100 justify-content-center align-self-center"><div class="col-md-6 align-self-center"><div class="wmcard snowflakeCard">
    <button type="button" class="smallButtons snowflakeTrigger" data-snowflaketoggle='${key}'><i class="fa fa-snowflake-o"></i></button>
    <button type="button" class="smallButtons snowflakeDelete" data-snowflaketoggle='${key}'><i class="fa fa-trash"></i></button>
    
    <input class="snflk-title snowflaketitle snowflaketext" placeholder="Card Title" data-snowflakeid='${key}' data-card='' data-inp='title' value="${set.title}"><textarea class="snflk-text texteditor snowflaketext" placeholder="Write Here" data-snowflakeid='${key}' data-card='' data-inp='content' >${set.content}</textarea>
            </div>
        </div>

        <div class="col-xs-11 offset-1 col-md-6 offset-md-0 " style="${showstyle}" id='snowflaketoggle_${key}'>
            <div class="wmcard snowflakeCard">
                <input class="snflk-title snowflaketitle snowflaketext"  data-snowflakeid='${key}' data-card='subcard1' data-inp='title' placeholder="Sub Card Title" value="${set.subcard1.title}">
                <textarea class="snflk-text texteditor snowflaketext" data-snowflakeid='${key}' data-card='subcard1' data-inp='content' placeholder="New Card Text">${set.subcard1.content}</textarea>
            </div>
            <div class="wmcard snowflakeCard">
                <input class="snflk-title snowflaketitle snowflaketext" data-snowflakeid='${key}' data-card='subcard2' data-inp='title' placeholder="Sub Card Title" value="${set.subcard2.title}">
                <textarea class="snflk-text texteditor snowflaketext" data-snowflakeid='${key}' data-card='subcard2' data-inp='content' placeholder="New Card Text">${set.subcard2.content}</textarea>
            </div>
            <div class="wmcard snowflakeCard">
                <input class="snflk-title snowflaketitle snowflaketext" data-snowflakeid='${key}' data-card='subcard3' data-inp='title' placeholder="Sub Card Title" value="${set.subcard3.title}">
                <textarea class="snflk-text texteditor snowflaketext" data-snowflakeid='${key}' data-card='subcard3' data-inp='content' placeholder="New Card Text">${set.subcard3.content}</textarea>
            </div>
            <div class="row d-flex justify-content-center">
                <div class="col-12">
                    <button type="button" class="replaceCard"><i class="fa fa-code"></i>
                        Replace the Original card</button>
                </div>
            </div>
            <hr>
        </div>

    </div>
  </div>`;
    $("#snowflakeCards").append(cardhtml);
  });

  autosize($(".texteditor"));

  $(".snowflakeTrigger")
    .unbind()
    .click(function () {
      ref = $(this).data("snowflaketoggle");

      if (WMproject.data.snowflake[ref].active == 1) {
        WMproject.data.snowflake[ref].active = 0;
      } else {
        WMproject.data.snowflake[ref].active = 1;
      }
      $("#snowflaketoggle_" + ref).slideToggle();
    });


  $(".snowflakeDelete")
    .unbind()
    .click(function () {
      ref = $(this).data("snowflaketoggle");
      WMproject.data.snowflake.splice(ref, 1);
      savedata();
      redrawCards()
    });



  /*
remove the ADD Card option from this one
$("#snowflakeCards").append(
  "<button class='btn btn-block btn-primary ' id='AddNewSnowflake'>Add New</button>"
);
*/

  $("#snowflakeCards").append(
    "<button class='btn btn-wavemaker sendtowriter' id='SendSnowflakeToManuscript'><i class='fa fa-fw fa-share-square'></i><span>&nbsp;Send to Writer</span></button>"
  );


  $("#SendSnowflakeToManuscript")
    .unbind()
    .click(function () {
        var newSection = {
          icon: "fa fa-fw fa-snowflake-o",
          title: "Snowflake",
          children: JSON.parse(JSON.stringify(WMproject.data.snowflake))
        }
        WMproject.data.writer.push(newSection);

      swal("Exported!", "You will now find this data in the writer mode.", "success")

      savedata();
    });


  $("#AddNewSnowflake")
    .unbind()
    .click(function () {
      var newObj = {
        title: "",
        content: "",
        subcard1: { title: "", content: "" },
        subcard2: { title: "", content: "" },
        subcard3: { title: "", content: "" },
        active: 0
      };
      WMproject.data.snowflake.push(newObj);
      redrawCards();
      savedata()
    });

  $(".snowflaketext").on("keyup", function () {
    ref = $(this).data("snowflakeid");
    card = $(this).data("card");
    inp = $(this).data("inp");
    if (card != "") {
      WMproject.data.snowflake[ref][card][inp] = $(this).val();
    } else {
      WMproject.data.snowflake[ref][inp] = $(this).val();
    }
    savedata()
  });
}

$(document).off("click", ".replaceCard").on("click", ".replaceCard", function () {
  var ref = $(this).parent().parent().parent().parent().parent().data("snowflakeid");
  var subcard1 = WMproject.data.snowflake[ref].subcard1
  var subcard2 = WMproject.data.snowflake[ref].subcard2
  var subcard3 = WMproject.data.snowflake[ref].subcard3
  WMproject.data.snowflake.splice(ref, 1, subcard1, subcard2, subcard3);
  redrawCards();
})

redrawCards();
