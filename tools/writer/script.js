
var emptyWriter = [
    {
        title: "Your Story"
    }
  ];

  var CURRENTNODE;
var CURRENTLI;

var CLIPBOARD = null;
   
  // this needs to be updated so that each tool can be reset - the only required entry is TOOL
  WMproject.state = { tool: "writer" };
  if (!WMproject.data) {
    WMproject.data = {};
  }
  if (!WMproject.data.writer) {
    WMproject.data.writer = emptyWriter;
  }

$("#navigation-side-nav").html('');
$("#navigation-side-nav").append(`<button class='btn btn-wavemaker btn-block' id="#add-chapter-button"><i class="fa fa-fw fa-plus"></i> Add Section</button>`);
$("#navigation-side-nav").append(`<div id="manuscript"></div>`);



function drawEditor(){
    console.log("editor" )
}


drawtree();
function drawtree() {

  listSource = WMproject.data.writer;

  $("#manuscript")
    .fancytree({
      checkbox: false,
      titlesTabbable: true, // Add all node titles to TAB chain
      quicksearch: false, // Jump to nodes when pressing first character
      // source: SOURCE,
      source: listSource,
      glyph: {
        preset: "awesome4",
        map: {}
      },
      extensions: ["edit", "dnd5", "glyph"],

      click: function (event, data) {
        var node = data.node;
        targetType = data.targetType;
        if (targetType === "expander") {
          // if it's the expander give  60 MS before saving
          setTimeout(function () {
            dosave();
          }, 60);
        }
      },
      dnd5: {
        preventVoidMoves: true,
        preventRecursiveMoves: true,
        autoExpandMS: 400,
        dragStart: function (node, data) {

          if (node.data.protect == 1) {
            return false;
          } else {
            return true;
          }
        },
        dragEnter: function (node, data) {

          //return ["before", "after"];
          if (node.data.protect == 1) {
            return false;
          }
          return true;
        },
        dragDrop: function (node, data) {

          if (node.data.protect == 1) {
            return false;
          } else {
            data.otherNode.moveTo(node, data.hitMode);
          }
        }
      },
      activate: function (event, data) {
        var node = data.node;

        CURRENTNODE = node;
        CURRENTLI = CURRENTNODE.li;
        drawEditor();

      },
      edit: {
        //triggerStart: ["f2", "shift+click", "mac+enter"],
        close: function (event, data) {

          if (data.save) {
            dosave();
            // Quick-enter: add new nodes until we hit [enter] on an empty title
            // $("#manuscript").trigger("nodeCommand", { cmd: "addSibling" });
          }
        }
      },
      createNode: function (event, data) {
        var node = data.node,
          $tdList = $(node.tr).find(">td");

        // Span the remaining columns if it's a folder.
        // We can do this in createNode instead of renderColumns, because
        // the `isFolder` status is unlikely to change later
        if (node.isFolder()) {
          $tdList
            .eq(2)
            .prop("colspan", 6)
            .nextAll()
            .remove();
        }
      },
      renderColumns: function (event, data) {
        var node = data.node,
          $tdList = $(node.tr).find(">td");

        // (Index #0 is rendered by fancytree by adding the checkbox)
        // Set column #1 info from node data:
        $tdList.eq(1).text(node.getIndexHier());
        // (Index #2 is rendered by fancytree)
        // Set column #3 info from node data:
        $tdList
          .eq(3)
          .find("input")
          .val(node.key);
        $tdList
          .eq(4)
          .find("input")
          .val(node.data.foo);

        // Static markup (more efficiently defined as html row template):
        // $tdList.eq(3).html("<input type='input' value='" + "" + "'>");
        // ...
      }
    })
    .on("nodeCommand", function (event, data) {
      // Custom event handler that is triggered by keydown-handler and
      // context menu:
      var refNode,
        moveMode,
        tree = $(this).fancytree("getTree"),
        node = tree.getActiveNode();

      switch (data.cmd) {
        case "moveUp":
          refNode = node.getPrevSibling();
          if (refNode) {
            node.moveTo(refNode, "before");
            node.setActive();
          }
          dosave("moveUp");
          break;
        case "moveDown":
          refNode = node.getNextSibling();
          if (refNode) {
            node.moveTo(refNode, "after");
            node.setActive();
          }
          dosave("moveDown");
          break;
        case "indent":
          refNode = node.getPrevSibling();
          if (refNode) {
            node.moveTo(refNode, "child");
            refNode.setExpanded();
            node.setActive();
          }
          dosave("indent");
          break;
        case "outdent":
          if (!node.isTopLevel()) {
            node.moveTo(node.getParent(), "after");
            node.setActive();
          }
          dosave("outdent");
          break;
        case "rename":
          node.editStart();
          dosave("rename");
          break;
        case "remove":
          swal({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
          }).then(result => {
            if (result.value) {
              refNode =
                node.getNextSibling() ||
                node.getPrevSibling() ||
                node.getParent();
              node.remove();
              if (refNode) {
                refNode.setActive();
              }
              dosave("remove");
              swal("Deleted!", "That has been deleted.", "success");
            }
          });

          break;
        case "addChild":
          node.editCreateNode("child", "");
          dosave("addChild");
          break;
        case "addSibling":
          node.editCreateNode("after", "");
          dosave("addSibling");
          break;

        case "cut":
          CLIPBOARD = { mode: data.cmd, data: node };
          dosave("cut");
          break;
        case "copy":
          CLIPBOARD = {
            mode: data.cmd,
            data: node.toDict(function (n) {
              delete n.key;
            })
          };
          console.log(CLIPBOARD)
          // this is to deal with the NOTES duplication of the same object issue
          var newnotes=JSON.parse(JSON.stringify(CLIPBOARD.data.data.notes))
          CLIPBOARD.data.notes=newnotes;
          delete  CLIPBOARD.data.key  // remove the key
          dosave("copy");
          break;
        case "clear":
          CLIPBOARD = null;
          dosave("clear");
          break;
        case "paste":
          if (CLIPBOARD.mode === "cut") {
            // refNode = node.getPrevSibling();
            CLIPBOARD.data.moveTo(node, "child");
            CLIPBOARD.data.setActive();
          } else if (CLIPBOARD.mode === "copy") {
            node.addChildren(CLIPBOARD.data).setActive();
          }
          dosave("paste");
          break;
        default:
          alert("Unhandled command: " + data.cmd);
          return;
      }

      // save any changes

      // }).on("click dblclick", function(e){
      //   console.log( e, $.ui.fancytree.eventToString(e) );
    });

  /*
   * Context menu (https://github.com/mar10/jquery-ui-contextmenu)
   */

 

    $("#manuscript").contextmenu({
    delegate: "span.fancytree-node",
    menu: [
      {
        title: "<i class='fa fa-pencil fa-fw'></i> Edit",
        cmd: "rename",
        uiIcon: ""
      },
      {
        title: "<i class='fa fa-trash fa-fw'></i> Delete",
        cmd: "remove",
        uiIcon: ""
      },
      { title: "----" },
      {
        title: "<i class='fa fa-file fa-fw'></i> New Section",
        cmd: "addSibling",
        uiIcon: ""
      },
      {
        title:
          "<i class='fa fa-level-up fa-rotate-90 fa-fw'></i> New Sub Section",
        cmd: "addChild",
        uiIcon: ""
      },
      { title: "----" },
      {
        title: "<i class='fa fa-scissors fa-fw'></i> Cut",
        cmd: "cut",
        uiIcon: ""
      },
      {
        title: "<i class='fa fa-files-o fa-fw'></i> Copy",
        cmd: "copy",
        uiIcon: ""
      },
      {
        title: "<i class='fa fa-clipboard fa-fw'></i> Paste",
        cmd: "paste",
        uiIcon: "",
        disabled: true
      }
    ],
    beforeOpen: function (event, ui) {
      var node = $.ui.fancytree.getNode(ui.target);

      $("#manuscript").contextmenu("enableEntry", "paste", !!CLIPBOARD);
      $("#manuscript").contextmenu("enableEntry", "copy", !node.data.protect);
      $("#manuscript").contextmenu("enableEntry", "remove", !node.data.protect);
      $("#manuscript").contextmenu("enableEntry", "rename", !node.data.protect);
      $("#manuscript").contextmenu("enableEntry", "cut", !node.data.protect);
      $("#manuscript").contextmenu("enableEntry", "addSibling", !node.data.protect);

      node.setActive();
    },
    select: function (event, ui) {
      var that = this;
      // delay the event, so the menu can close and the click event does
      // not interfere with the edit control
      setTimeout(function () {
        $(that).trigger("nodeCommand", { cmd: ui.cmd });
      }, 100);
    }
  });


}


function drawNotes() {
    $("#notes").html('');
    $("#notes").append("<button id='AddNote'>Add Note</button>")
    $.each(CURRENTNODE.data.notes, function (k, i) {
      notecard = $("<div class='note-card' data-noteref='" + k + "'><textarea placeholder='Write Here' class='note-content'>" + i.content + "</textarea><button  class='note-delete'><i class='fa fa-trash fa-fw'></i></button></div>")
      $("#notes").append(notecard)
    })
    autosize($('.note-content'))
  
    // reset the update on keypress
    $(".note-content").on("keyup paste", function () {
      k = $(this).parent().data("noteref");
      CURRENTNODE.data.notes[k].content = $(this).val()
      dosave();
    })
  
  
    // reset the buttons
    $('.note-delete').unbind().click(function () {
      swal({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
      }).then(result => {
        if (result.value) {
          k = $(this).parent().data("noteref");
          CURRENTNODE.data.notes.splice(k, 1)
          drawNotes()
          dosave();
          swal("Deleted!", "That has been deleted.", "success");
        }
      });
    });
  }

function drawEditor() {
    if (!CURRENTNODE.data.content) {
      CURRENTNODE.data.content = "";
    }
    if (!CURRENTNODE.data.notes) {
      CURRENTNODE.data.notes = [];
    }
    if (!CURRENTNODE.icon) {
      CURRENTNODE.icon = "fa fa-fw fa-file-text-o";
    }
    $("#editor").html("");
    $("#notes").html("");
  
    
  
  
  
    if (CURRENTNODE.data.custom) {
      $("#editor").removeClass("manuscript")
      console.log(CURRENTNODE.data.custom)
      d=new Date();
      $("#editor").load("components/" + CURRENTNODE.data.custom + "-placeholder.html?v="+d.getTime(),function(){
        $.getScript("components/" + CURRENTNODE.data.custom + "-script.js?t=" + d.getTime(), function () {
      });
      });
      
    } else {
      $("#editor").addClass("manuscript")
  
  
  
  
  
  
      drawNotes(CURRENTNODE.data)
  
      nodetitle = $(
        "<div id='nodeNav' class='animated fadeInDown faster'><div id='editorbuttons'></div><div id='nodeTitle'><i class='" +
        CURRENTNODE.icon +
        "'></i><input id='nodeTitle_input' placeholder='Title Here' value='' /></div></div>"
      );
  
      
  
      // nodetext = $(
      //  "<textarea id='nodeText' class='texteditor' placeholder='Start writing here'></textarea>"
      //);
  
      nodetext = $(
        "<div id='nodeText' class='texteditor animated fadeIn' contenteditable=true placeholder='Start writing here'></div>"
      );
  
        if(!WMproject.data.writer[0].mStyle){
          WMproject.data.writer[0].mStyle=[];
        }
  
           mystyle = WMproject.data.writer[0].mStyle.join("; ");
        nodetext.attr("style", mystyle)
  
      nodetext.html(CURRENTNODE.data.content);
  
      $("#editor").append(nodetitle);
      $('#nodeTitle_input').val(CURRENTNODE.title)
      
  
      $("#editorbuttons").html(
        `
    <button class="wysywig-btn" id='bold' title='Bold'><i class='fa fa-fw fa-bold'></i></button>
    <button class="wysywig-btn" id='italic' title='Italic'><i class='fa fa-fw fa-italic'></i></button>
    <button class="wysywig-btn" id='h1'  title='Heading 1'><i class='fa fa-fw fa-header'></i></button>
    <button class="wysywig-btn" id='h2'  title='Heading 2'><i class='fa fa-fw fa-header' style="font-size:0.8em"></i></button>
    <button class="wysywig-btn" id='h3'  title='Heading 3'><i class='fa fa-fw fa-header' style="font-size:0.5em"></i></button>
    <button class="wysywig-btn" id='para'  title='Paragraph'><i class='fa fa-fw fa-paragraph'></i></button>
    `
      );
  
      /*
        <select id='changeIcon' class='iconlist form-control'>
    <option value='fa fa-fw  fa-coffee'>&#xf0f4; Coffee</option>
    <option value='fa fa-fw fa-address-card'>&#xf2bb; Profile</option>
    <option value='fa fa-fw fa-asterisk'>&#xf069; Feature</option>
    <option value='fa fa-fw fa-bell'>&#xf0f3; Reminder</option>
    <option value='fa fa-fw fa-bomb'>&#xf1e2; Explosive</option>
    <option value='fa fa-fw fa-book'>&#xf02d; Book</option>
    <option value='fa fa-fw fa-comment'>&#xf075; Talk</option>
    <option value='fa fa-fw fa-comments'>&#xf086; Chat</option>
    <option value='fa fa-fw fa-file-o'>&#xf016; Empty</option>
    <option value='fa fa-fw fa-file-text-o'>&#xf0f6; Text</option>
    <option value='fa fa-fw fa-file'>&#xf15b; Empty</option>
    <option value='fa fa-fw fa-file-text'>&#xf15c; Text</option>
    <option value='fa fa-fw fa-user'>&#xf007; Character</option>
    <option value='fa fa-fw fa-folder-o'>&#xf114; Folder</option>
    <option value='fa fa-fw fa-folder-open-o'>&#xf115; Folder Open</option>
    <option value='fa fa-fw fa-folder'>&#xf07b; Folder</option>
    <option value='fa fa-fw fa-folder-open'>&#xf07c; Folder Open</option>
    <option value='fa fa-fw fa-sticky-note'>&#xf249; Note</option>
    <option value='fa fa-fw fa-sticky-note-o'>&#xf24a; Note</option>
    <option value='fa fa-fw fa-heart'>&#xf004; Heart</option>
    <option value='fa fa-fw fa-location-arrow'>&#xf124; Location</option>
    <option value='fa fa-fw fa-map-marker'>&#xf041; Place</option>
    <option value='fa fa-fw fa-question-circle'>&#xf059; Question</option>
    <option value='fa fa-fw fa-exclamation-triangle'>&#xf071; Warning</option>
    <option value='fa fa-fw fa-exclamation-circle'>&#xf06a; Warning</option>
    </select>
      */
      $("#changeIcon").val(CURRENTNODE.icon)
  
      $("#editor").append(nodetext);
      // autosize($(".texteditor"));
  
      converter = new showdown.Converter();
      text = CURRENTNODE.data.content;
      html = converter.makeHtml(text);
  
      $("#nodeText").html(html);
  
         $("#nodeTitle_input")
        .unbind()
        .on("keyup", function () {
           var newval=$(this).val();
           CURRENTNODE.title=newval;
         
           $(CURRENTLI).find(".fancytree-title").first().text(newval);
    
          // save any changes
          dosave();
        });
  
      
      $("#nodeText")
        .unbind()
        .on("keyup", function () {
          // save any changes
          dosave();
        });
  

  
    }
  
  }

  function dosave() {
    if ($("#nodeText").length) {
      var turndownService = new TurndownService();
      var markdown = turndownService.turndown($("#nodeText").html());
      CURRENTNODE.data.content = markdown;
    }
    WMproject.data.writer = $("#manuscript")
      .fancytree("getTree")
      .toDict();
  
    if (!WMproject.data.writer) {
      WMproject.data.writer = [{
        title: "Your Story"
      }];
      $('#manuscript').fancytree("getTree").reload()
      //$("#manuscript").fancytree("getRootNode").editCreateNode("child", WMproject.data.writer);
    }
  
    db.projects.update(WMproject.id, WMproject).then(function () {
     // $("#manuscript").fancytree("getTree");
    });
  }



  
$(document).off("click", "#nodeText").on("click", "#nodeText", function () {
    $(this).attr("contenteditable", true);
  });
  
  $(document).off("change", "#changeIcon").on("change", "#changeIcon", function () {
    CURRENTNODE.icon = $(this).val();
    icontgt = $(CURRENTLI).find(".fancytree-custom-icon:first");
    if(icontgt.length===0){
      icontgt = $(CURRENTLI).find(".fancytree-icon:first");
    }
    icontgt.removeClass().addClass("fancytree-custom-icon " + CURRENTNODE.icon);
    $("#nodeTitle>i")
      .removeClass()
      .addClass(CURRENTNODE.icon);
    dosave();
  });
  
  $(document).off("click","#h1").on("click","#h1", function(){
    document.execCommand("formatBlock", false, "h1");
  })
  
  $(document).off("click", "#h2").on("click", "#h2", function () {
    document.execCommand("formatBlock", false, "<h2>");
    dosave();
  });
  
  $(document).off("click", "#h3").on("click", "#h3", function () {
    document.execCommand("formatBlock", false, "<h3>");
    dosave();
  });
  
  $(document).off("click", "#para").on("click", "#para", function () {
    document.execCommand("formatBlock", false, "<p>");
    dosave();
  });
  
  $(document).off("click", "#bold").on("click", "#bold", function () {
    document.execCommand("bold", false, null);
    dosave();
  });
  
  $(document).off("click", "#italic").on("click", "#italic", function () {
    document.execCommand("italic", false, null);
    dosave();
  });
  
  /*
  // NOT NEEDED as Markdown wont support
  //doing it a different (and I think better way int he MANUSCRIPT files)
  
  $(document).off("click","#justifyLeft").on("click","#justifyLeft", function(){
    document.execCommand("justifyLeft", false, "");
  })
  $(document).off("click","#justifyRight").on("click","#justifyRight", function(){
    document.execCommand("justifyRight", false, "");
  })
  $(document).off("click","#justifyCenter").on("click","#justifyCenter", function(){
    document.execCommand("justifyCenter", false, "");
  })
  $(document).off("click","#justifyFull").on("click","#justifyFull", function(){
    document.execCommand("justifyFull", false, "");
  })
  */
  
  $(document).off("click", "#nodeText").on("paste", "#nodeText", function (e) {
    e.preventDefault();
    var text = "";
    if (e.clipboardData || e.originalEvent.clipboardData) {
      text = (e.originalEvent || e).clipboardData.getData("text/plain");
    } else if (window.clipboardData) {
      text = window.clipboardData.getData("Text");
    }
    if (document.queryCommandSupported("insertText")) {
      document.execCommand("insertText", false, text);
    } else {
      document.execCommand("paste", false, text);
    }
    dosave();
  });
  
  $(document).off("click", "#addSubSection").on("click", "#addSubSection", function () {
    $("#tree").trigger("nodeCommand", { cmd: "addChild" });
  });
  