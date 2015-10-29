define('sidebar2',['jquery'],function($){
    var SideBar = function SideBar(arg1, arg2){
        var isOpened = false;
        var self = this;
        self.menu = null;
        self.icon = null;
        self.bar = null;


       processArguments(arg1, arg2);

        function sidebar(arg1,arg2){
            processArguments(arg1, arg2);
            return this;
        }

        function processArguments(arg1, arg2){
            console.log('called'+arg1+'/'+arg2);
            if(arg1 && arg2){
                if(arg1 === 'menu'){
                    self.menu = arg2;
                    return;
                }
                if(arg1 === 'icon'){
                    self.icon = arg2;
                    $(self.menu).empty();
                    $(self.menu).append($(self.icon));
                    return;
                }
                if(arg1 === 'bar'){
                    self.bar = arg2;
                    $(self.bar).css('display', 'none');
                    return;
                }
            }
        }
        function getMenu(){
            return self.menu;
        }
        function getSideBar(){
            return self.bar;
        }
        function getIcon(){
            return self.icon;
        }


        $(self.menu).on('searchlist_align',function(){
            var width = $(window).width();
            var height = $(window).height();
            $(this).offset({top: height * 0.02, left: width * 0.9});
        });

          $(self.menu).click(function(){
                if(isOpened){
                    $(self.bar).css('display' , 'none');
                    isOpened = false;
                }else{
                    $(self.bar).css('display' , 'block');
                    $(window).resize();
                    isOpened = true;
                }
            });

        return {
            sidebar: sidebar,
            getMenu: getMenu,
            getSideBar: getSideBar,
            getIcon: getIcon
        };
    }
    return SideBar;
});
