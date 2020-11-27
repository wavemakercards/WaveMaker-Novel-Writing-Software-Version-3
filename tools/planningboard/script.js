$('#navigation-toggle').hide();
hideNavBar()
autoSyncCall();
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



drawNotes()


function drawNotes(){
    $("#cardmanager").html('')

  panelwidth =0;
  $.each(WMproject.data.writer, function(k,v){
    WriteColumns(v)
  });

  $(".sortableCards").unbind().sortable({
    connectWith: ".connectedSortable",
    start : function (event, ui) {
        dropObj.startlist =ui.item.parent().parent().data("objTarget")
        dropObj.startpos =$(ui.item[0]).data().position
        dataToMove=JSON.parse(JSON.stringify(dropObj.startlist.data.notes[dropObj.startpos]))
       // console.log(dropObj.startlist.data.notes[dropObj.startpos])
    },
    stop : function (event, ui) {
    dropObj.endlist =ui.item.parent().parent().data("objTarget")
      dropObj.endpos =0; // if none then top of list
      if (typeof $(ui.item[0]).prev().data() !== 'undefined') {
        dropObj.endpos = $(ui.item[0]).prev().data().position +1 // add 1 o the prev id and do the splice
      }       
     
        if(dropObj.startlist === dropObj.endlist){
        // same list just update position
      //  if(dropObj.endpos===dropObj.startpos)  
            indexfix = 1;
            if (dropObj.startpos < dropObj.endpos) { indexfix = 0 }
            dropObj.endlist.data.notes.splice(dropObj.endpos, 0, dataToMove); // add
            dropObj.startlist.data.notes.splice(dropObj.startpos + indexfix, 1); //delete
     //   }
      }else{
        dropObj.endlist.data.notes.splice(dropObj.endpos, 0, dataToMove); // add
        dropObj.startlist.data.notes.splice(dropObj.startpos, 1); //delete
      }
      dosave()
      drawNotes()

    }
}).disableSelection();
 }


function WriteColumns(dta){
    //console.log(dta)
    listTargetid++
    panelwidth = panelwidth + 370
    mycol= $(`
    <div class="cardsorter">
    <button class="noteCardAdd"><i class="fa fa-plus"></i></button>
    <div class="CardmanagerTitle">${dta.title}</div>
    <ul id="List_${listTargetid}_list" class="sortableCards connectedSortable"></ul>
    </div>
    `);

    mycol.data("objTarget",dta);
    $("#cardmanager").append(mycol)

    if(dta.data){
    $.each(dta.data.notes, function (cardID, currentNote) {    
     
        addStyle = "";
        if (currentNote.completed) {
            addStyle=addStyle+" markAsDone " ;
        }
        if(currentNote.backgroundColor){
                addStyle=addStyle+" color"+currentNote.backgroundColor+" " ;
        }
       
        $(`#List_${listTargetid}_list`).append(`
        <li data-position="${cardID}"  ><div class="wmcard cardSelect ${addStyle}"   >
        <button type="button" class="pull-right btn btn-danger btn-circle btn-xs deleteNoteCard">
        <i class="fa fa-times" title="Delete this Section"></i></button>
        <div class="wmcard-body">
        <div class="wmcard-title">${currentNote.title}</div>
        <p class="wmcard-text">${nl2br(currentNote.content)}</p>
        </div>
        <button class="smallButtons noteCardEdit" ><i class="fa fa-edit"></i></button>
        <button class="smallButtons cardToggle pull-right" title="Toggle Card Off" ><i class="fa fa-check"></i></button>
        </div>
        </li>
        `);
    })

    
    if(dta.children !== undefined){
        $.each(dta.children, function(k,v){
        
        WriteColumns(v)
        });
    }
}
$('#cardmanager').width(panelwidth + "px")
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




