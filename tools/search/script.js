$('#navigation-toggle').hide();
hideNavBar()
autoSyncCall();
// this needs to be updated so that each tool can be reset - the only required entry is TOOL
if (!WMproject.state) {
  WMproject.state = {}
}
WMproject.state.tool = "search"
if (!WMproject.data) {
  WMproject.data = {};
}
if (!WMproject.data.search) {
  WMproject.data.search = [];
}
var editObject = {};

dosave();

var searchArray=[];

function dosave() {
  db.projects.update(WMproject.id, WMproject).then(function () {});
}

$(document).off("click", "#search_button").on("click", "#search_button", function(){
  console.log("searching")
/*
This search works by looking for the first term, then subsequent terms are searched for in the results
*/
if($("#search_terms").val()!==""){
  var searchterms=$("#search_terms").val() //.split(",") // not doing multiple terms yet!!
  Perform_Search(searchterms, WMproject.data.writer,WMproject.data)
  
  if(searchArray.length === 0){
    $("#search_results").html("<h2>Sorry nor results found</h2>")
  }else{
    $("#search_results").html("")
  $.each(searchArray, function(i,v){
   var result=$("<div class='result'></div>") 

if(v.data.data){
  result.append("<div class='result_location'>Found In Title</div>")
  result.append(v.data.title)
}else{
  if(v.data.title){
  result.append("<div class='result_location'>Found In Note</div>")
  result.append(v.data.title)
  result.append(v.data.content)
  }else{
    result.append("<div class='result_location'>Found In Content</div>")
    result.append(v.data.content)
  }
}



    $("#search_results").append(result)



    quicklink=$("<button class='quicklink'>Jump To Section <i class='fa fa-fw fa-chevron-right'></i></button>");
    quicklink.data("target", v.target)
    $("#search_results").append(quicklink)
    })
}
  }else{
    swal("What??", "I can't search for nothing.", "warning");
  }

})



function Perform_Search(searchterms, searchobj, targetObj){

  if(searchobj.data){
    console.log("has a data subset so it's a node!!")
    targetObj=searchobj
  }

  $.each(searchobj, function(i,v){
      if(isArray(v) || isObject(v)){
        Perform_Search(searchterms, v, targetObj) 
      }else{
        if(isString(v)){
         if(v.toLowerCase().includes(searchterms.toLowerCase()) !== false){
           searchArray.push({ data : searchobj, target : targetObj})
         }
        }
      }   

  })
}


$(document).off("click", ".quicklink").on("click", ".quicklink", function(){
  console.log($(this).data())
  WriterKey = $(this).data("target").key
  console.log("Search selected item ",WriterKey)
  loadtool("writer")
})


isArray = function(a) {
  return (!!a) && (a.constructor === Array);
};

isObject = function(a) {
  return (!!a) && (a.constructor === Object);
};

isString = function(a) {
  return Object.prototype.toString.call(a) === "[object String]"
};

