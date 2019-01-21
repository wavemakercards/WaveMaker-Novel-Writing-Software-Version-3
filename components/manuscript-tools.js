manuscriptData=WMproject.data.writer;
var DocWordCount=0;


function wordcountManuscript(dta){
    console.log(dta)
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


$('#ManuscriptTitle').text(WMproject.title)
$(document).off("click","#ManuscriptSetStyle").on("click","#ManuscriptSetStyle", function(){
    if(!WMproject.data.settings.manuscript){
        WMproject.data.settings.manuscript = {};
      }
       
      WMproject.data.settings.manuscript.manuscriptAlign=$("#manuscriptAlign").val();
      WMproject.data.settings.manuscript.manuscriptFontSize=$("#manuscriptFontSize").val();
      WMproject.data.settings.manuscript.manuscriptLineHeight=$("#manuscriptLineHeight").val();
      WMproject.data.settings.manuscript.manuscriptParaIndent=$("#manuscriptParaIndent").val();
      WMproject.data.settings.manuscript.manuscriptMarginBottom=$("#manuscriptMarginBottom").val();
      setManuscript()
  })

  setManuscriptform();