define('wiki',['jquery'],function($){
    var wikistart = '<ul id=\'wikiresult\'></ul>';
    function searchWiki(para){
        clearDisplay();
        var wikiUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + para + '&format=json&list=geosearch&callback=wikiCallback';
        var wikiRequestTimeout = setTimeout(function(){
            alert('wiki not found');
        },8000);
        $.ajax({
            url : wikiUrl,
            dataType: "jsonp",
            success: function(response){
                var articleList = response[1];

                if(articleList.length>0){
                    display(articleList);
                }
                clearTimeout(wikiRequestTimeout);
            }
        });
    };

    function display(articleList){
        $('.wikirelevant').append(wikistart);
        for(var i=0;i<articleList.length;i++){
            articleStr = articleList[i];
            var url = "http://en.wikipedia.org/wiki/"+articleStr;
            $('#wikiresult').append('<li><a href="'+url+'">'+articleStr+'</a></li>');
        }
    };
    function clearDisplay(){
        $('.wikirelevant').html('');
    };
    return {
        searchWiki : searchWiki
    }
});
