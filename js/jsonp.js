/**
 * Created with JetBrains WebStorm.
 * User: yussicahe
 * Date: 12-8-13
 * Time: 上午9:33
 * To change this template use File | Settings | File Templates.
 */
;(function(ns){
    ns = ns.split('.');
    var packageContext = window, node;
    while (node = ns.shift()){
        packageContext = packageContext[node] = packageContext[node] || {};
    }
    var count = 0;

    packageContext.getJSONP = function(url, callback){
        var cbnum = "cb" + (count++);
        var cbname = "music.jsonp.getJSONP." + cbnum;
        if(url.indexOf('?') == -1){
            url += "?callback=" +cbname;
        }else {
            url += "&callback=" +cbname;
        }
        var script = document.createElement("script");
        packageContext.getJSONP[cbnum] = function(response){
            try{
                callback(response);
            }
            finally{
                delete packageContext.getJSONP[cbnum];
                script.parentNode.removeChild(script);
            }
        }
        script.src = url;
        document.body.appendChild(script);
    }

})("music.jsonp")