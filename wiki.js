define('wiki',['jquery'],function($){
    var wikiRequestTimeout = setTimeout(function(){},8000);

    $.ajax({
        url : wikiUrl,
        dataType: "jsonp",

        success: function(response){
            var articleList = response[1];

            for(var i=0;i<articleList.length;i++){
                articleStr = articleList[i];

            }
            clearTimeout(wikiRequestTimeout);
        }
    });
});
