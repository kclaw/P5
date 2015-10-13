define('wiki', ['jquery'], function ($) {
  var wikistart = '<ul id=\'wikiresult\'></ul>';
  /**
     * this function would send a searcch request to wikipedia
     * @param {String} para data need search
     */
  function searchWiki(para) {
    clearDisplay();
    var wikiUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + para + '&format=json&list=geosearch';
    var wikiRequestTimeout = setTimeout(function () {
      alert('wiki not found');
    }, 8000);
    $.ajax({
      url: wikiUrl,
      dataType: 'jsonp',
      success: function (response) {
        var articleList = response[1];
        if (articleList.length > 0) {
          display(articleList.filter(function (item) {
            return item.search('/' + para + '/') != -1;
          }));
        }
        clearTimeout(wikiRequestTimeout);
      }
    });
  }
  /**
    This function would send search request to wikipedia and get back brief content
     * @param {String} para data need to search
     */
  function searchWikiExtract(para, handler) {
    var wikiUrl = 'https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=&titles=' + para;
    var wikiRequestTimeout = setTimeout(function () {
      alert('wiki not found');
    }, 8000);
    $.ajax({
      url: wikiUrl,
      dataType: 'jsonp',
      success: function (response) {
        clearTimeout(wikiRequestTimeout);
        for (var prop in response.query.pages)
          // return only first extract
          handler(response.query.pages[prop].extract);
      }
    });
  }
  /**
     * This function display wikipedia search result
     * @param {Array} articleList searched result
     */
  function display(articleList) {
    $('.wikirelevant').append(wikistart);
    for (var i = 0; i < articleList.length; i++) {
      articleStr = articleList[i];
      var url = 'http://en.wikipedia.org/wiki/' + articleStr;
      $('#wikiresult').append('<li><a href="' + url + '">' + articleStr + '</a></li>');
    }
  }
  /**
     * Clear diaplay
     */
  function clearDisplay() {
    $('.wikirelevant').html('');
  }
  return {
    searchWiki: searchWiki,
    searchWikiExtract: searchWikiExtract
  };
});
