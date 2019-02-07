$('#navigation-toggle').hide();
hideNavBar()


if(!WMproject.state){
  WMproject.state={}
}
WMproject.state.tool = "exporting"


savedata()
function savedata() {
  db.projects.update(WMproject.id, WMproject).then(function () {
    saveWavemaker();
  });
}

var markDownOutput ="";
function getMarkDown(dta){
  //console.log(dta)
  if(dta.data){
  markDownOutput=markDownOutput+dta.data.content;
    if(dta.children !== undefined){
      $.each(dta.children, function(k,v){
        getMarkDown(v)
      });
    }
  }
}
$(document).off("click", "#ExportMarkdown").on("click", "#ExportMarkdown", function () {
  $.each(WMproject.data.writer, function(k,v){
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


var HTMLOutput ="";
function getHtmlOutput(dta,lev){
  //console.log(dta)
  if(dta.data){
  html = markdown2html(dta.data.content);
  if(lev == 1){
   // HTMLOutput=HTMLOutput+"<div class='chaptername'>"+dta.title+"</div><div class='chapter'>";
    HTMLOutput=HTMLOutput+"<div class='chapter'>";
  }
      HTMLOutput=HTMLOutput+html;
    if(dta.children !== undefined){
      $.each(dta.children, function(k,v){
        getHtmlOutput(v,0)
      });
    }
    if(lev == 1){
    HTMLOutput=HTMLOutput+"</div>";
    }
  }
}
$(document).off("click", "#ExportHTML").on("click", "#ExportHTML", function () {
  $.each(WMproject.data.writer, function(k,v){
    getHtmlOutput(v,1);
  })


  HTMLOutput=  `<style>
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
  page-break:after;
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
  
  .chapter>p:first-of-type{
      text-indent:0px;
  }
  </style>`+HTMLOutput;

  myfilename = WMproject.title.replace(/[^a-z0-9]/gi, '_').toLowerCase() + ".html";
  var element = document.createElement('a');
  element.setAttribute('href', 'data:html/plain;charset=utf-8,' + encodeURIComponent(HTMLOutput));
  element.setAttribute('download', myfilename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
})