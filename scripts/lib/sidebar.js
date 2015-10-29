define('sidebar',['jquery'],function($){
    var SideBar = function SideBar(arg1){
        var menu = null;
        var sidebar = null;
        var icon = null;
        var isOpened = false;

        function onShow(){
            if(sidebar)
                display(sidebar);
        }

        function onHide(){
            if(sidebar)
                hide(sidebar);
        }

        function show(elem){
            $(elem).css('display', 'block');
        }

        function hide(elem){
            $(elem).css('display', 'none');
        }

        function animate(elem){
            $(elem).animate({opacity:'show'}, 1500);
        }

        function setMenu(pmenu){
            menu = pmenu;
        }

        function setSideBar(psidebar){
            sidebar = psidebar;
        }

        function setIcon(picon){
            icon = picon;
        }

        function build(){
            hide(sidebar);
            $(document).ready(function(){
                $(menu).click(function(){
                    if(isOpened){
                        hide(sidebar);
                        isOpened = false;
                    }else{
                        show(sidebar);
                        isOpened = true;
                    }
                });
            });
        }

        return {
           menu: setMenu,
           sidebar: setSideBar,
           build: build
        };
    }
    return SideBar;
});
