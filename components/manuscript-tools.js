manuscriptData=WMproject.data.writer;
var DocWordCount=0;


function wordcountManuscript(dta){
    //console.log(dta)
 if(dta.data){
    DocWordCount=DocWordCount+countWords(dta.data.content);
    if(dta.children !== undefined){
        $.each(dta.children, function(k,v){
        wordcountManuscript(v)
        });
    }
    $("#ManuscriptWordCount").text(DocWordCount)
}
}



$.each(manuscriptData, function(k,v){
    wordcountManuscript(v)
});




$(document).off("click","#ManuscriptSetStyle").on("click","#ManuscriptSetStyle", function(){
    if(!WMproject.data.settings.manuscript){
        WMproject.data.settings.manuscript = {};
        WMproject.data.settings.manuscript.manuscriptFont="Halant";
      WMproject.data.settings.manuscript.manuscriptAlign="left";
      WMproject.data.settings.manuscript.manuscriptFontSize="1.3rem";
      WMproject.data.settings.manuscript.manuscriptLineHeight="1.7rem";
      WMproject.data.settings.manuscript.manuscriptParaIndent="20px";
      WMproject.data.settings.manuscript.manuscriptMarginBottom="20px";
      WMproject.data.settings.manuscript.manuscriptPaperStyle="800px";
      }
      WMproject.data.settings.manuscript.manuscriptFont=$("#manuscriptFont").val();  
      WMproject.data.settings.manuscript.manuscriptAlign=$("#manuscriptAlign").val();
      WMproject.data.settings.manuscript.manuscriptFontSize=$("#manuscriptFontSize").val();
      WMproject.data.settings.manuscript.manuscriptLineHeight=$("#manuscriptLineHeight").val();
      WMproject.data.settings.manuscript.manuscriptParaIndent=$("#manuscriptParaIndent").val();
      WMproject.data.settings.manuscript.manuscriptMarginBottom=$("#manuscriptMarginBottom").val();
      WMproject.data.settings.manuscript.manuscriptPaperStyle=$("#manuscriptPaperStyle").val();
      
        console.log("Loading Font", WMproject.data.settings.manuscript.manuscriptFont)
      WebFont.load({
        google: { 
               families: [WMproject.data.settings.manuscript.manuscriptFont] 
         } 
      }); 


      swal("Changed!", "Settings Changed", "success")
      dosave();
      setManuscript()
  })

  setManuscriptform();


  $("#settings_title").val(WMproject.title);

$(document).off("click", "#settings_title_save").on("click", "#settings_title_save", function () {
  if ($("#settings_title").val() != "" && $("#settings_title").val() != WMproject.title) {
    WMproject.title = $("#settings_title").val();
    swal("Changed!", "The title change has been saved", "success")
    dosave();
  }

});
