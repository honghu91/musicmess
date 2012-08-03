;(function(ns){
	ns=ns.split('.');
	var packageContext=window,node;
	while(node=ns.shift()){
		packageContext=packageContext[node]=packageContext[node] || {};
	}
	packageContext.getMusicInfo=function(){
		return [{
			name:'beat1_boom_a',
			pos:'0 0'
		},{
			name:'beat2_kashi_a',
			pos:'-40px 0px'
		},{
			name:'beat3_paomeu_a',
			pos:'-80px 0px'
		},{
			name:'beat4_ptttpeu_a',
			pos:'-120px 0px'
		},{
			name:'beat5_slupttt_a',
			pos:'0px -35.6px'
		},{
			name:'coeur1_oaaah_a',
			pos:'-40px -35.6px'
		},{
			name:'coeur2_cougou_a',
			pos:'-80px -35.6px'
		},{
			name:'coeur3_porticoeur_a',
			pos:'-120px -35.6px'
		},{
			name:'effet1_poulll_a',
			pos:'0px -71.2px'
		},{
			name:'effet2_tucati_a',
			pos:'-40px -71.2px'
		},{
			name:'effet3_tuilopta_a',
			pos:'-80px -71.2px'
		},{
			name:'effet4_tululou_a',
			pos:'-120px -71.2px'
		},{
			name:'effet5_tumttt_a',
			pos:'0px -106.8px'
		},{
			name:'melo1_nananana_a',
			pos:'-40px -106.8px'
		},{
			name:'melo2_pelulu_a',
			pos:'-80px -106.8px'
		},{
			name:'melo3_siffle_a',
			pos:'-120px -106.8px'
		},{
			name:'melo4_tatouti_a',
			pos:'0px -142.4px'
		},{
			name:'melo5_tvutvutvu_a',
			pos:'-40px -142.4px'
		},{
			name:'voix1_isit_a',
			pos:'-80px -142.4px'
		},{
			name:'voix2_uare_a',
			pos:'-120px -142.4px'
		}];
	};
})('music.model');