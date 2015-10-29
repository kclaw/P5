define('test',['container','infowindow','map','searchbar','pager'],function(c,win){
    var map = c.getInstance('map');
    map.test(c.getInstance('infowindow'));
});
