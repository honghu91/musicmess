;(function(ns){
	ns=ns.split('.');
	var packageContext=window,node;
	while(node=ns.shift()){
		packageContext=packageContext[node]=packageContext[node] || {};
	}

/**
 * @author: Bin Wang <Dorsywang@Tencent.com>
 * @description: msgbox    (from vbscript)
 * @example:
 * Msgbox.msg("系统繁忙，<br />请稍候再试");//提示信息
 * Msgbox.button("您确定要支付么",
 * {
 *      "确定": function(){
 *          this.close();
 *          //your code here
 *      },
 *      "取消": function(){
 *          this.close();
 *      }
 * });
 * */
    var Msgbox = {
        init: function(){
            var html = "<div class='msgbox'><img src='css/image/msgclose.png' class='close' /><div class='msg'></div></div>";
            $("#stateWrap").append(html);
            this.attachE();
            /*
            this.button("您确定要支付么",{
                "确定": function(){
                    this.close();
                    //你要执行的代码
                }
            });
            */
        },
        show: function(){
            $(".msgbox").show();
            $(".msgbox").height({height:'219px'});
        },
        open: function(){
            this.show();
        },
        close: function(){
            this.hide();
        },
        hide: function(){
            $(".msgbox").children().hide();
            $(".msgbox").css({"height":"0"});
        },
        button: function(msg,obj){// obj {"OK": function(){},"Cancel": function(){}}

            this.show();
            var html = "";
            if(obj){
                for(var i in obj){
                    html += "<div class='button'>" + i + "</div>";
                }
            }
            $(".msg").html(msg + "<br />" + html);

            _this = this;
            if(obj){//attachEvent
                var n = 0;
                for(var i in obj){
                    $(".msgbox .button:eq(" + n + ")").click(function(){
                        obj[i].call(_this);
                    });
                    n ++;
                }
            }

        },
        msg: function(msg){
            this.show();
            $(".msg").html("<img src='css/image/msgsorry.png' style='float:left;vertical-align:middle;margin-right:5px;' />" + msg);
        },
        attachE: function(){
            var _this = this;
            $(".close").click(function(){
                _this.hide();
            });
        }
    };
    packageContext.init = function(){
       Msgbox.init(); 
    };
    packageContext.button = function(msg,obj){
        Msgbox.button(msg,obj);
    };
    packageContext.msg = function(msg){  
        Msgbox.msg(msg);
    };
})('music.msgbox');

