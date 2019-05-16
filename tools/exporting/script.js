$('#navigation-toggle').hide();
hideNavBar()


if (!WMproject.state) {
  WMproject.state = {}
}
WMproject.state.tool = "exporting"


savedata()
function savedata() {
  db.projects.update(WMproject.id, WMproject).then(function () {
    saveWavemaker();
  });
}

var markDownOutput = "";
function getMarkDown(dta) {
  //console.log(dta)
  if (dta.data) {
    markDownOutput = markDownOutput + dta.data.content;
    if (dta.children !== undefined) {
      $.each(dta.children, function (k, v) {
        getMarkDown(v)
      });
    }
  }
}
$(document).off("click", "#ExportMarkdown").on("click", "#ExportMarkdown", function () {
  $.each(WMproject.data.writer, function (k, v) {
    getMarkDown(v);
  })

  myfilename = WMproject.title.replace(/[^a-z0-9]/gi, '_').toLowerCase() + ".md";
  var element = document.createElement('a');
  element.setAttribute('href', 'data:md/plain;charset=utf-8,' + encodeURIComponent(markDownOutput));
  element.setAttribute('download', myfilename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
})


var HTMLOutput = "";
function getHtmlOutput(dta, lev) {
  var htmlSceneDivider ="<p class='scene'>#</p>"
  //console.log(dta)
  if (dta.data) {
    html = markdown2html(dta.data.content);
    if (lev == 1) {
      // HTMLOutput=HTMLOutput+"<div class='chaptername'>"+dta.title+"</div><div class='chapter'>";
      HTMLOutput = HTMLOutput + "<div class='chapter'>";
    }
    HTMLOutput = HTMLOutput + html  ;
    if(html!=""){
      HTMLOutput = HTMLOutput  +htmlSceneDivider
    }   
    
    if (dta.children !== undefined) {
      $.each(dta.children, function (k, v) {
        getHtmlOutput(v, 0)
      });
    }
    if (lev == 1) {
      HTMLOutput = HTMLOutput + "</div>";
    }
  }
}

$(document).off("click", "#ExportHTML").on("click", "#ExportHTML", function () {
  $.each(WMproject.data.writer, function (k, v) {
    getHtmlOutput(v, 1);
  })


  HTMLOutput = `<style>
  body{
    background-color: #ccc;
    padding:10%;
    padding-top:20px;
    font-family: TimesNewRoman,Times New Roman,Times,Baskerville,Georgia,serif; 
    font-size:14pt;
    color:#424242;
  }
  .chapter{
    background-color: #fff;
    padding:5%;
    max-width:650px;
    margin:0 auto;
    -ms-filter: "progid:DXImageTransform.Microsoft.Shadow(Strength=25, Direction=0, Color=#000000)";/*IE 8*/
  -moz-box-shadow: 0 0 25px -7px #000000;/*FF 3.5+*/
  -webkit-box-shadow: 0 0 25px -7px #000000;/*Saf3-4, Chrome, iOS 4.0.2-4.2, Android 2.3+*/
  box-shadow: 0 0 25px -7px #000000;/* FF3.5+, Opera 9+, Saf1+, Chrome, IE10 */
  filter: progid:DXImageTransform.Microsoft.Shadow(Strength=25, Direction=135, Color=#000000); /*IE 5.5-7*/
  page-break-after: always
  margin-bottom:50px;
  }
  
.chaptername{
  text-align:center;
}

  p{
    text-indent:40px;
    line-height:2.5rem;
    margin:0;
    margin-bottom:2rem
  }
  .scene{
    text-indent:0px;
    text-align:center;
    line-height:2.5rem;
    margin:0;
    margin-bottom:2rem
  }
  .chapter>p:first-of-type{
      text-indent:0px;
  }
  </style>`+ HTMLOutput;

  myfilename = WMproject.title.replace(/[^a-z0-9]/gi, '_').toLowerCase() + ".html";
  var element = document.createElement('a');
  element.setAttribute('href', 'data:html/plain;charset=utf-8,' + encodeURIComponent(HTMLOutput));
  element.setAttribute('download', myfilename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
});

$(document).off("click", "#ExportWord").on("click", "#ExportWord", function () {
  $.each(WMproject.data.writer, function (k, v) {
    getHtmlOutput(v, 1);
  })

  HTMLOutput = `<style>
  body{

  }
  .chapter{
   page-break-after: always
  margin-bottom:50px;
  }
  
.chaptername{
  text-align:center;
}

  p{
    text-indent:40px;
    line-height:2.5rem;
    margin:0;
    margin-bottom:2rem
  }
  .scene{
    text-indent:0px;
    text-align:center;
    line-height:2.5rem;
    margin:0;
    margin-bottom:2rem
  }
  .chapter>p:first-of-type{
      text-indent:0px;
  }
  </style>`+ HTMLOutput;


  $.post("https://pandoc-mayasky76377487.codeanyapp.com/createDocx.php", {HTMLINPUT: HTMLOutput}, function(result){
    console.log(result);

    myfilename = WMproject.title.replace(/[^a-z0-9]/gi, '_').toLowerCase() + ".docx";
    var element = document.createElement('a');
    element.setAttribute('href', result);
    element.setAttribute('download', myfilename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);


  });
})


ExportEpub


$(document).off("click", "#ExportEpub").on("click", "#ExportEpub", function () {
  $.each(WMproject.data.writer, function (k, v) {
    getHtmlOutput(v, 1);
  })

  HTMLOutput = `<style>
  body{

  }
  .chapter{
   page-break-after: always
  margin-bottom:50px;
  }
  
.chaptername{
  text-align:center;
}

  p{
    text-indent:40px;
    line-height:2.5rem;
    margin:0;
    margin-bottom:2rem
  }
  .scene{
    text-indent:0px;
    text-align:center;
    line-height:2.5rem;
    margin:0;
    margin-bottom:2rem
  }
  .chapter>p:first-of-type{
      text-indent:0px;
  }
  </style>`+ HTMLOutput;


  $.post("https://pandoc-mayasky76377487.codeanyapp.com/createEpub.php", {HTMLINPUT: HTMLOutput}, function(result){
    console.log(result);

    myfilename = WMproject.title.replace(/[^a-z0-9]/gi, '_').toLowerCase() + ".epub3";
    var element = document.createElement('a');
    element.setAttribute('href', result);
    element.setAttribute('download', myfilename);
    element.setAttribute('target', "_blank");
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);


  });
})

$(document).off("click", "#ExportProjectFile").on("click", "#ExportProjectFile", function () {
  myfilename = WMproject.title.replace(/[^a-z0-9]/gi, '_').toLowerCase() + ".wmProx";
  var element = document.createElement('a');
  element.setAttribute('href', 'data:wmProx/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(WMproject)));
  element.setAttribute('download', myfilename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
});



var RTFOutput = "";
function getRTFOutput(dta, lev) {
  //console.log(dta)
  if (dta.data) {
    var html = markdown2html(dta.data.content);
    var headhtml = "";
    if (lev == 1) {
      // HTMLOutput=HTMLOutput+"<div class='chaptername'>"+dta.title+"</div><div class='chapter'>";
      if (RTFOutput !== "") { headhtml = headhtml + "<hr>"; }
      headhtml = headhtml + "<h1>" + dta.title + "</h1>";
    }

    html = headhtml + html;
    if(html!=""){
      html = html  + "<h4>#</h4>"
    }   
    RTFOutput = RTFOutput + convertHtmlToRtf(html);
    if (dta.children !== undefined) {
      $.each(dta.children, function (k, v) {
        getRTFOutput(v, 0);
      });
    }
  }
}



$(document).off("click", "#ExportRTF").on("click", "#ExportRTF", function () {
  $.each(WMproject.data.writer, function (k, v) {
    getRTFOutput(v, 1);
  });

  RTFOutput = convertHtmlToRtf(RTFOutput)
  RTFOutput = "{\\rtf1\\ansi\n" + RTFOutput + "\n}";

  myfilename = WMproject.title.replace(/[^a-z0-9]/gi, '_').toLowerCase() + ".rtf";
  var element = document.createElement('a');
  element.setAttribute('href', 'data:rtf/plain;charset=utf-8,' + encodeURIComponent(RTFOutput));
  element.setAttribute('download', myfilename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
});


function convertHtmlToRtf(html) {
  if (!(typeof html === "string" && html)) {
    return null;
  }

  var tmpRichText, hasHyperlinks;
  var richText = html;

  // Singleton tags

  //  richText = richText.replace(/<(?:hr)(?:\s+[^>]*)?\s*[\/]?>/ig, "{\\pard \\brdrb \\brdrs \\brdrw10 \\brsp20 \\par}\n{\\pard\\par}\n");

  richText = richText.replace(/<(?:hr)(?:\s+[^>]*)?\s*[\/]?>/ig, "{\\par \\page }\n");


  richText = richText.replace(/<(?:br)(?:\s+[^>]*)?\s*[\/]?>/ig, "{\\pard\\par}\n");

  // Empty tags
  richText = richText.replace(/<(?:p|div|section|article)(?:\s+[^>]*)?\s*[\/]>/ig, "{\\pard\\par}\n");
  richText = richText.replace(/<(?:[^>]+)\/>/g, "");

  // Hyperlinks
  richText = richText.replace(
    /<a(?:\s+[^>]*)?(?:\s+href=(["'])(?:javascript:void\(0?\);?|#|return false;?|void\(0?\);?|)\1)(?:\s+[^>]*)?>/ig,
    "{{{\n");
  tmpRichText = richText;
  richText = richText.replace(
    /<a(?:\s+[^>]*)?(?:\s+href=(["'])(.+)\1)(?:\s+[^>]*)?>/ig,
    "{\\field{\\*\\fldinst{HYPERLINK\n \"$2\"\n}}{\\fldrslt{\\ul\\cf1\n");
  hasHyperlinks = richText !== tmpRichText;
  richText = richText.replace(/<a(?:\s+[^>]*)?>/ig, "{{{\n");
  richText = richText.replace(/<\/a(?:\s+[^>]*)?>/ig, "\n}}}");

  // Start tags
  richText = richText.replace(/<(?:h1)(?:\s+[^>]*)?>/ig, "{\\fs36\\sl480\\slmult1\\qc\n");
  richText = richText.replace(/<(?:h4)(?:\s+[^>]*)?>/ig, "{\\fs14\\sl480\\slmult1\\qc\n"); // for scene dividers
  richText = richText.replace(/<(?:h2)(?:\s+[^>]*)?>/ig, "{\\fs30\\sl480\\slmult1\n");
  richText = richText.replace(/<(?:h3)(?:\s+[^>]*)?>/ig, "{\\fs28\\sl480\\slmult1\n");
  richText = richText.replace(/<(?:b|strong)(?:\s+[^>]*)?>/ig, "{\\b\n");
  richText = richText.replace(/<(?:i|em)(?:\s+[^>]*)?>/ig, "{\\i\n");
  richText = richText.replace(/<(?:u|ins)(?:\s+[^>]*)?>/ig, "{\\ul\n");
  richText = richText.replace(/<(?:strike|del)(?:\s+[^>]*)?>/ig, "{\\strike\n");
  richText = richText.replace(/<sup(?:\s+[^>]*)?>/ig, "{\\super\n");
  richText = richText.replace(/<sub(?:\s+[^>]*)?>/ig, "{\\sub\n");

  /* notes  double spacing :\\sl480\\slmult1
  Indentation :  \\fi480
  space after : \\sa480
  */
  richText = richText.replace("<p>", "{\\pard\\sl480\\slmult1\\sa480\n"); // noindent first one!!
  richText = richText.replace(/<(?:p|div|section|article)(?:\s+[^>]*)?>/ig, "{\\pard\\sl480\\slmult1\\fi480\\sa480\n");

  // End tags
  richText = richText.replace(/<\/(?:p|div|section|article)(?:\s+[^>]*)?>/ig, "\n\\par}\n");
  //deal with enditng of headings reset font
  richText = richText.replace(/<\/(?:h1|h2|h3|h4)(?:\s+[^>]*)?>/ig, "\\fs22\\par}");
  richText = richText.replace(/<\/(?:b|strong|i|em|u|ins|strike|del|sup|sub)(?:\s+[^>]*)?>/ig, "\n}");

  // Strip any other remaining HTML tags [but leave their contents]
  richText = richText.replace(/<(?:[^>]+)>/g, "");

  // Prefix and suffix the rich text with the necessary syntax
  // do this at the END on mine as we are doing chunk by chunk
  /* richText =
     "{\\rtf1\\ansi\n" + (hasHyperlinks ? "{\\colortbl\n;\n\\red0\\green0\\blue255;\n}\n" : "") + richText +
     "\n}";
 */
  return richText;
}


