;(function(ns){
	ns = ns.split('.');
	var packageContext = window,node;
	while(node = ns.shift()){
		packageContext = packageContext[node] = packageContext[node] || {};
	}

    packageContext.params = {
        appid:GetQueryString("app_id"),
        openid:GetQueryString("app_openid"),
        openkey:GetQueryString("app_openkey"),
        pf:GetQueryString("pf"),
        pfkey:GetQueryString("pfkey")
    }

	packageContext.musicList =
        [{
            name:'beat4_ptttpeu_a',
            pos:'-120px 0px',
            pay_state:2
        },{
            name:'effet3_tuilopta_a',
            pos:'-80px -71.2px',
            pay_state:2
        },{
            name:'beat5_slupttt_a',
            pos:'0px -35.6px',
            pay_state:2
        },{
            name:'effet4_tululou_a',
            pos:'-120px -71.2px',
            pay_state:2
        },{
            name:'melo5_tvutvutvu_a',
            pos:'-40px -142.4px',
            pay_state:2
        },{
			name:'beat1_boom_a',
			pos:'0 0',
            pay_state:0
		},{
			name:'beat2_kashi_a',
			pos:'-40px 0px',
            pay_state:0
		},{
			name:'beat3_paomeu_a',
			pos:'-80px 0px',
            pay_state:0
		},{
			name:'coeur1_oaaah_a',
			pos:'-40px -35.6px',
            pay_state:0
		},{
			name:'coeur2_cougou_a',
			pos:'-80px -35.6px',
            pay_state:0
		},{
			name:'coeur3_porticoeur_a',
			pos:'-120px -35.6px',
            pay_state:0
		},{
			name:'effet1_poulll_a',
			pos:'0px -71.2px',
            pay_state:0
		},{
			name:'effet2_tucati_a',
			pos:'-40px -71.2px',
            pay_state:0
		},{
			name:'effet5_tumttt_a',
			pos:'0px -106.8px',
            pay_state:0
		},{
			name:'melo1_nananana_a',
			pos:'-40px -106.8px',
            pay_state:0
		},{
			name:'melo2_pelulu_a',
			pos:'-80px -106.8px',
            pay_state:0
		},{
			name:'melo3_siffle_a',
			pos:'-120px -106.8px',
            pay_state:0
		},{
			name:'melo4_tatouti_a',
			pos:'0px -142.4px',
            pay_state:0
		},{
			name:'voix1_isit_a',
			pos:'-80px -142.4px',
            pay_state:0
		},{
			name:'voix2_uare_a',
			pos:'-120px -142.4px',
            pay_state:0
		}];

    packageContext.imgList =
        ['bg.jpg',
        'loading_wrap.png',
        'loading.png',
        'bird_01.png',
        'bird_02.png',
        'bird_03.png',
        'bird_04.png',
        'bird_05.png',
        'bird_06.png',
        'bird_07.png',
        'bird_08.png',
        'bird_disabled.png',
        'shadow.png',
        'grass.png',
        'icons.png',
        'paybar_wrap.png',
        'unfold_btn.png',
        'item_border.png',
        'money_icon.png',
        'note.png',
        'mute.png',
        'mute2.png',
        'solo.png',
        'solo2.png',
        'remove.png',
        'share.png',
        'msgboxbg.png',
        'msgsorry.png',
        'msgclose.png',
        'all_payed.png'];

    packageContext.payedList = [];

    //获取url中参数的value
    function GetQueryString(name)
    {
        var reg=new RegExp("(^|&)"+name+"=([^&]*)(&|$)");
        var r=window.location.search.substr(1).match(reg);
        if(r!=null){
            return decodeURIComponent(r[2]);
        }
        return null;
    }
})('music.model');