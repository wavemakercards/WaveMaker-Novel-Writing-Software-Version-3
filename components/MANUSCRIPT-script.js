manuscriptData=wavemaker.data.writer[0];
var DocWordCount=0;


function wordcountManuscript(dta){
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




wordcountManuscript(manuscriptData)

$('#ManuscriptTitle').text(wavemaker.title)
$(document).off("click","#ManuscriptSetStyle").on("click","#ManuscriptSetStyle", function(){
    if(!wavemaker.data.settings.manuscript){
        wavemaker.data.settings.manuscript = {};
      }
       
      wavemaker.data.settings.manuscript.manuscriptAlign=$("#manuscriptAlign").val();
      wavemaker.data.settings.manuscript.manuscriptFontSize=$("#manuscriptFontSize").val();
      wavemaker.data.settings.manuscript.manuscriptLineHeight=$("#manuscriptLineHeight").val();
      wavemaker.data.settings.manuscript.manuscriptParaIndent=$("#manuscriptParaIndent").val();
      wavemaker.data.settings.manuscript.manuscriptMarginBottom=$("#manuscriptMarginBottom").val();
      setManuscript()
  })

  setManuscriptform();