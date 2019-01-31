$('#navigation-toggle').hide();
hideNavBar()

// this needs to be updated so that each tool can be reset - the only required entry is TOOL
if(!WMproject.state){
  WMproject.state={}
}
WMproject.state.tool = "planningboard"

if (!WMproject.data) {
  WMproject.data = {};
}

var listTargetid=0; 

dosave();
function dosave() {
  db.projects.update(WMproject.id, WMproject).then(function () {
    //console.log("Saved gridplanner");
  });
}

var panelwidth;
drawpage()


var dropObj = {}
function drawpage(){
  panelwidth =0;
  $.each(WMproject.data.writer, function(k,v){
    WriteColumns(v)
  });

  $(".sortableCards").unbind().sortable({
    connectWith: ".connectedSortable",
    start: function (event, ui) {    },
    receive : function (event, ui) {
    //  console.log(ui)
      dropObj.startlist =$(ui.sender[0]).parent()
      dropObj.startpos =$(ui.item[0]).data().position

      dropObj.endlist =$(this).parent()
      dropObj.endpos =0; // if none then top of list
      if($(ui.item[0]).prev()){
        dropObj.endpos = $(ui.item[0]).prev().data().position +1 // add 1 o the prev id and do the splice
      }

      if(dropObj.startlist === dropObj.endlist ){
        // same list just update position
        if(dropObj.endpos!==dropObj.startpos){
          dropObj.endpos.data("objTarget").notes.splice()
        }
      }





    console.log(dropObj)
    }
}).disableSelection();
 }













 


























function WriteColumns(dta){
 if(dta.data){
    panelwidth = panelwidth + 370
    mycol= $(`
    <div class="cardsorter">
    <button class="addNewCard"><i class="fa fa-plus"></i></button>
    <div class="CardmanagerTitle">${dta.title}</div>
    <ul id="List_${listTargetid}_list" class="sortableCards connectedSortable"></ul>
    </div>
    `);

    mycol.data("objTarget",dta);
    $("#cardmanager").append(mycol)
   
    $.each(dta.data.notes, function (cardID, currentNote) {    
     
        addStyle = "";
        if (currentNote.completed) {
            addStyle=addStyle+" markAsDone " ;
        }
        if(currentNote.cardColor){
                addStyle=addStyle+" color"+currentNote.cardColor+" " ;
        }
       
        $(`#List_${listTargetid}_list`).append(`
        <li data-position="${cardID}"  ><div class="wmcard cardSelect ${addStyle}"   >
        <button type="button" class="pull-right btn btn-danger btn-circle btn-xs deleteCard">
        <i class="fa fa-times" title="Delete this Section"></i></button>
        <div class="wmcard-body">
        <div class="wmcard-title">${currentNote.title} ${cardID}</div>
        <p class="wmcard-text">${nl2br(currentNote.content)}</p>
        </div>
        <button class="smallButtons cardEdit" ><i class="fa fa-edit"></i></button>
        <button class="smallButtons cardToggle pull-right" title="Toggle Card Off" ><i class="fa fa-check"></i></button>
        </div>
        </li>
        `);

     
      
    })

    listTargetid++


$('#cardmanager').width(panelwidth + "px")

    if(dta.children !== undefined){
        $.each(dta.children, function(k,v){
        WriteColumns(v)
        });
    }
}
}




$("#addSection").unbind().click(function () {
  addEditorSection();
  drawpage();
})



$("#addCardsManagerChapter").unbind().click(function () {

  addEditorSection();
  drawpage();
})

$("#addCard").unbind().click(function () {
  selectedCard = false;
  $("#CardModal").modal("show");
  $("#CardText").val("");
  autosize($('.texteditor'));
})

$(".addNewCard").unbind().click(function () {

  selectedSection = $(this).parent().attr("id");
  selectedCard = false;
  $("#CardModal").modal("show");
  $("#CardText").val("");
  $("#cardColorCoice").val('')
  autosize($('.texteditor'));
})


$('.cardToggle').unbind().click(function () {
  toggleCardDone($(this).parent());
})


$("#toggleCompletedCards").unbind().click(function () {
  toggleCards()
})


$("#toggleCompletedCardsCardEditor").unbind().click(function () {
  toggleCards()
})

$('.cardEdit').unbind().click(function () {
  selectedCard = $(this).parent().attr("id");
  selectedSection = $(this).parent().data("parent")
  $("#CardType").val(WaveMaker.writer[selectedSection].cards[selectedCard].cardtype);
  $("#CardText").val(WaveMaker.writer[selectedSection].cards[selectedCard].cardtext);
  $("#cardColorCoice").val(WaveMaker.writer[selectedSection].cards[selectedCard].cardColor)
  $("#CardModal").modal("show");
  autosize($('.texteditor'));
  autosize.update($(".texteditor"));
})



$('.deleteCard').unbind().click(function (evt) {
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
          kill = $(this).parent().attr("id")
          section = $(this).parent().data("parent")
          $("#" + kill).remove()
          delete WaveMaker.writer[section].cards[kill];
          //setupRightHandSide()
          swal(
              'Deleted!',
              'Your Card has been deleted.',
              'success'
          )
      }
  })
})













var cardColors=['default','#71cac4','#e2e647','#f49ebb','#fbad4b']; cardToolsave = true;



function saveCard() {
    //console.log(selectedSection)
    cardsObj = WaveMaker.writer[selectedSection].cards;
    type = $("#CardType").val();
    text = $("#CardText").val();
    color = $("#cardColorCoice").val();
    if (!selectedCard) {
        timestamp = new Date().getTime() + "" + new Date().getUTCMilliseconds();
        cardsObj["card_" + timestamp] = {
            cardtype: type,
            cardtext: text,
            cardColor: color,
            position: Object.size(cardsObj)
        }
    } else {
        cardsObj[selectedCard].cardtype = type
        cardsObj[selectedCard].cardtext = text
        cardsObj[selectedCard].cardColor = color
    }
    $("#" + selectedCard).find(".wmcard-title").html(type)
    $("#" + selectedCard).find(".wmcard-text").html(nl2br(text))
    selectedCard = false;
    $("#CardModal").modal("hide")

    $('.modal-backdrop').remove();

    if (cardToolsave) {
        drawpage();
    } else {
        setupRightHandSide()
    }
}


function toggleCardDone(mycard) {
    myref = mycard.attr("id")
    myparent = mycard.data("parent")
    if ($("#" + myref).hasClass("markAsDone")) {
        $("#" + myref).removeClass("markAsDone")
        WaveMaker.writer[myparent].cards[myref].completed = false
    } else {
        $("#" + myref).addClass("markAsDone")
        WaveMaker.writer[myparent].cards[myref].completed = true
    }
    updatecompletedcards();
}


function toggleCards() {
    showcompletedcards = !showcompletedcards;
    updatecompletedcards()
}



function updatecompletedcards() {
    if (showcompletedcards) {
        $(".markAsDone").slideDown();
    } else {
        $(".markAsDone").slideUp();
    }
}


$(".CardsColourPickerButton").unbind().click(function () {
    $("#cardColorCoice").val($(this).data("color"))
})


