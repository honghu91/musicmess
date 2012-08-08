;(function(ns){
	ns=ns.split('.');
	var packageContext=window,node;
	while(node=ns.shift()){
		packageContext=packageContext[node]=packageContext[node] || {};
	}
	var MAX_PERSON=5;
	var stateWrapEl,
		stateEl,
		soundBarEl,
		_event={},
		queue=[];
	var initData,
		notLoadCount;
	
	var getQueueId = function(){
		var id=0;
		return function(){
			return id++;
		};
	}();
	function tryAddPerson(noAnimate){
		if(queue.length==0 || queue.length<MAX_PERSON && queue[queue.length-1].isPlaying()){
			var person=new Element(getQueueId());
			var el=person.getElement().get(0);
			el.style.bottom=Math.ceil(Math.random()*20)+'px';
			queue.push(person);
			if(noAnimate){
				el.style.left=(queue.length*190-180)+'px';
			}else{
				setTimeout(function(){
					el.style.left=(queue.length*190-180)+'px';
				},0);
			}
			stateEl.appendChild(el);
			return true;
		}
		return false;
	};
	function removePerson(id){
		for(var i=0,len=queue.length;i<len;i++){
			var person=queue[i];
			if(person._id==id){
				var el=person.getElement().get(0);
				el.classList.add('remove');
				setTimeout(function(){
					stateEl.removeChild(el);
					var icon=document.getElementById(person._sound);
					icon.setAttribute('draggable',true);
					icon.style.opacity=1;
					queue.splice(i,1);
					for(var j=0,len=queue.length;j<len;j++){
						queue[j].getElement().get(0).style.left=(j*190+10)+'px';
					}
					tryAddPerson();
				},1000);
				break;
			}
		}
	};
	
	function onDrag(e){
		e.dataTransfer.setData('Text',e.target.id);
        $("#" + e.target.id).unbind("hover");
		//console.info('drag');
	}
	function onDragOver(e){
		if((notLoadCount===0 || !initData) && !queue[queue.length-1].isPlaying()){
			e.preventDefault();
			//console.info('dragover prevent')
		}
		//console.info('dragover')
	}
	function onDrop(e){
		e.preventDefault();
		var data=e.dataTransfer.getData("Text");
		var el=document.getElementById(data);
		if(!el || !el.getAttribute('sound')){
			return;
		}
		var person=queue[queue.length-1];
		if(!person.isPlaying()){
			person.setSound(data);
			person.play();
			person.getElement().find('.bubble').append(el.cloneNode());
			tryAddPerson();
			el.setAttribute('draggable',false);
			el.style.opacity='.3';
		}
		//console.info('drop');
	}
    function onDragEnd(e){
        audioService.context.chorus();
    }
	function soundLoaded(id){
		var icon=document.getElementById(id);
		if(icon){
			icon.setAttribute('draggable',true);
			icon.style.opacity=1;
			notLoadCount--;
			if(notLoadCount===0 && initData){
				for(var i=0,len=initData.length;i<len;i++){
					var person=queue[queue.length-1],
						el=document.getElementById(initData[i]);
					if(el && !person.isPlaying()){
						person.setSound(initData[i]);
						person.play();
						person.getElement().find('.bubble').append(el.cloneNode());
						tryAddPerson(true);
						el.setAttribute('draggable',false);
						el.style.opacity='.3';
					}
				}
				document.getElementById('stateMask').style.display='none';
				initData=null;
			}
		}
	}
	
	function tryAddNote(){
		if(stateWrapEl.querySelectorAll('.note').length>20){
			return;
		}
		for(var i=0,len=queue.length;i<len;i++){
			var person=queue[i];
			if(person.isPlaying() && Math.random()<.5){
				var el=document.createElement('div');
				el.className='note note'+Math.floor(Math.random()*6+1);
				el.style.WebkitAnimation='roll 1s infinite, fly'+Math.floor(Math.random()*2+1)+' '+Math.floor(Math.random()*5+5)+'s 1';
				el.style.left=(i*190+Math.floor(Math.random()*100)+55)+'px';
				el.addEventListener('webkitAnimationEnd',onAnimationEnd,false);
				stateWrapEl.appendChild(el);
			}
		}
	}
	function onAnimationEnd(e){
		//console.info('animation end');
		var el=e.currentTarget;
		stateWrap.removeChild(el);
	}
    
    var hoverTimer;
    function hoverPlaying(e){//hover playsound
       clearTimeout(hoverTimer);
       hoverTimer = setTimeout(function(){
            var sound = e.target.id;
            audioService.context.weekSolo(sound);
       },1000);
    }
    function unHoverPlaying(e){
        clearTimeout(hoverTimer);
        var sound = e.target.id;
        audioService.stop(sound);
        audioService.context.chorus();
    }
	
	packageContext.init=function(data){
		if(data){
			initData=data;
			document.getElementById('stateMask').style.display='block';
		}
		stateWrapEl=document.getElementById('stateWrap');
		stateEl=document.getElementById('state');
		stateWrapEl.addEventListener('dragover',onDragOver,false);
		stateWrapEl.addEventListener('drop',onDrop,false);
		soundBarEl=document.getElementById('soundbar');
		var info=music.model.getMusicInfo();
		notLoadCount=info.length;
		for(var i=0,len=info.length;i<len;i++){
			var el=document.createElement('div');
			el.id=info[i].name;
			el.className='icon';
            el.title = "试听";
			el.style.backgroundPosition=info[i].pos;
			el.setAttribute('sound',info[i].name);
			//el.setAttribute('draggable',true);
			el.addEventListener('dragstart',onDrag,false);
            el.addEventListener('dragend',onDragEnd,false);
			soundBarEl.appendChild(el);
			audioService.loadSound(info[i].name,soundLoaded);
		}
        //hover试听

        $(".icon").each(function(i){
            $(this).hover(hoverPlaying,unHoverPlaying);
        });

		tryAddPerson();
		setInterval(tryAddNote,2000);
	};
	// packageContext.reg=function(event,callback){
		// if(!_event[event]){
			// _event[event]=[];
		// }
		// _event[event].push(callback);
	// };
	// packageContext.unreg=function(event,callback){
		// if(!_event[event]){
			// return;
		// }
		// if(!callback){
			// delete _event[event];
		// }else{
			// var index=_event[event].indexOf(callback);
			// if(~index){
				// _event[event].splice(index,1);
			// }
		// }
	// };
	packageContext.notify=function(event,data){
		// if(!_event[event]){
			// return;
		// }
		// for(var i=0,len=_event[event].length;i<len;i++){
			// try{
				// _event[event][i](data);
			// }catch(e){
				// console.info('notify '+event+' error');
			// }
		// }
		switch(event){
			case 'remove':
				removePerson(data);
				break;
			default:
				console.info('unknown command');
				break;
		}
	};
    packageContext.addHoverEvent = function(sound){
        $(".icon").each(function(){
            $(this).hover(hoverPlaying,unHoverPlaying);
        });
    };
	packageContext.reset=function(){
		for(var i=0,len=queue.length;i<len;i++){
			var person=queue[i],
				el=person.getElement().get(0);
			if(person.isPlaying()){
				person.stop();
			}
			el.classList.add('remove');
		}
		setTimeout(function(){
			for(var j=0,len=queue.length;j<len;j++){
				var person=queue[j],
					el=person.getElement().get(0);
				stateEl.removeChild(el);
				var icon=document.getElementById(person._sound);
				if(icon){
					icon.setAttribute('draggable',true);
					icon.style.opacity=1;
				}
			}
			queue=[];
			tryAddPerson();
		},1000);
	};
	packageContext.collect=function(){
		var list=[];
		for(var i=0,len=queue.length;i<len;i++){
			var person=queue[i];
			if(person.isPlaying()){
				list.push(person._sound);
			}
		}
		list.sort();
		return list;
	};
})('music.state');
