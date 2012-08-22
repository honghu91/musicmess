;(function(ns){
	ns = ns.split('.');
	var packageContext = window,node;
	while(node = ns.shift()){
		packageContext = packageContext[node] = packageContext[node] || {};
	}
	var MAX_PERSON = 5;

	var stateWrapEl,
		stateEl,
		soundbarEl,
        paybarEl,
		queue = [],
        birdId = 0;

    var CGI_GET_PARAMS = "http://cgi.appx.qq.com/easypay/change_auth_info",
        CGI_IS_PAYED = "http://cgi.appx.qq.com/easypay/is_payed",
        goods_id;

	function tryAddBird(){
		if(queue.length == 0 || queue.length < MAX_PERSON && queue[queue.length - 1]._sound){
			var bird = new Element(++birdId);
            var birdUIElement = bird.getElement();
            birdUIElement.css('bottom', Math.ceil(Math.random() * 20) + 'px');
            bird._className = birdUIElement.children().eq(1).attr('class');

            birdUIElement.get(0).addEventListener('dragover', onDragOver, false);
            birdUIElement.get(0).addEventListener('drop', onDrop, false);

			queue.push(bird);

            setTimeout(function(){
                birdUIElement.css('left', (queue.length * 190 - 180) + 'px');
            }, 0);

			stateEl.append(birdUIElement);
			return true;
		}
		return false;
	};

    function moveLeft(){
        $.each(queue, function(index, value){
            value.getElement().css('left', (index * 190 + 10)+'px');
        });
    }

	function removeBird(id){
        $.each(queue, function(index,value){
			if(value._id == id){
                value.getElement().bind('webkitAnimationEnd',function(){
                    $('#' + value._sound).attr({
                        'title': '试听',
                        'draggable': true
                    }).css({
                        'opacity': 1,
                        'cursor': 'pointer'
                    }).hover(hoverPlaying, unHoverPlaying);
                    queue.splice(index, 1);
                    moveLeft();
                    music.audioControl.stop(value._sound);
                    music.audioControl.delPlayingSound(value._sound);
//                    if(value._isSolo){
//                        music.audioControl.setVolumes(1);
//                    }
                    value.getElement().remove();
                    tryAddBird();
                });
				value.getElement().addClass('remove');
                return false;
			}
		});
	};


	function onDragStart(e){
		e.dataTransfer.setData('Text', e.target.id);
	}

	function onDragOver(e){
		e.preventDefault();
	}

    function onDragEnd(e){
        e.preventDefault();
    }
    
	function onDrop(e){
		e.preventDefault();

		var icon,
            iconClone,
            bird;

        icon = $("#" + e.dataTransfer.getData('Text'));

		if(!icon || !icon.attr('sound')){
			return;
		}

        icon.attr({
            'title': '',
            'draggable': false
        }).css({
            'opacity': 0.5,
            'cursor': 'default',
            '-webkit-animation': ''
        }).unbind('hover');

        iconClone = icon.clone();
        iconClone.attr('id', '').css('opacity', 1);

        $.each(queue, function(index, value){
            if(value._className == e.target.className){
                bird = value;
                return false;
            }
        });

		if(!bird._sound){
			bird.getElement().children('.bubble').append(iconClone);
            bird.setSound(icon.attr('id'));
            music.audioControl.addPlayingSound(icon.attr('id'));
            bird.play();
			tryAddBird();
		}else{
            music.audioControl.stop(bird._sound);
            $('#' + bird._sound).attr({
                'title': '试听',
                'draggable': true
            }).css({
                'opacity': 1,
                'cursor': 'pointer'
            }).hover(hoverPlaying, unHoverPlaying);

            bird.getElement().find('.icon').replaceWith(iconClone);
            bird.setSound(icon.attr('id'));
            bird.play();
        }

        $.each(music.audioControl.playingSounds, function(index){
            if(music.audioControl.getVolume(index).toFixed(1) == 0.1){
                music.audioControl.setVolume(index, 1);
            }
        });
        icon.attr('draggable', false).css('opacity', 0.5);
	}

    function onPay(e){
        $(e.currentTarget).parents('#paybarWrap').css('right','-1px');
        goods_id =  $(e.currentTarget).find('.icon').attr('id');
        buy();
    }

    function buy(){
        var goodslist = [{
            'goods_id': goods_id,
            'buy_count': 1
        }];

        var params = music.model.params;

        var url = CGI_GET_PARAMS+"?appid="+params.appid+"&openid="+params.openid+"&openkey="+params.openkey+"&pf="+params.pf
            +"&pfkey="+params.pfkey+"&goodslist="+JSON.stringify(goodslist)+"&float_flag=0"+"&retype=2";

        music.jsonp.getJSONP(url,function(response){
            if(!response || response.retcode != 0 || !response.result || !response.result.url_params){
                console.log("支付功能暂不可用，请稍后再试");
                $('#'+ goods_id).parents('#paybarWrap').css('right','-126px')
                return;
            }
            qplus.payment.trade({
                platform: "unipay",
                sandbox: 1,
                url_params: response.result.url_params
            });
        });
    }

    function notifyPay(){
        qplus.on( "payment.stateChange", function(json){
            var state = json.state;
            if ("change" === state) {
                var params = music.model.params;
                var url = CGI_IS_PAYED+"?appid="+params.appid+"&openid="+params.openid+"&openkey="+params.openkey+"&goods_id="+ goods_id;
                music.jsonp.getJSONP(url,function(response){
                    if(!response || response.retcode != 0 || !response.result || !response.result.have_buy){
                        console.log("查询功能暂不可用，请稍后再试");
                        $('#'+ goods_id).parents('#paybarWrap').css('right','-126px');
                        return;
                    }
                    if(response.result.have_buy == 1){
                        $('#'+ goods_id).parents('.item').css('-webkit-animation','fadeOutUp 1s ease-in-out both');
                        var el = $('#'+ goods_id).clone();
                        el.attr({
                            'title': '试听',
                            'draggable': true
                        })
                        el.get(0).addEventListener('dragstart',onDragStart,false);
                        el.get(0).addEventListener('dragend',onDragEnd,false);
                        el.css('-webkit-animation','fadeInUp 1s ease-in-out both').prependTo($('#soundbar'));
                    }else if(response.result.have_buy == 0){
                        console.log("支付失败");
                        $('#'+ goods_id).parents('#paybarWrap').css('right','-126px');
                    }
                });
            } else if ("retry" === state) {
                buy();
            }
        });
    }

    function onAnimationEnd(e){
        $(e.currentTarget).remove();
    }

    function onPayAnimationEnd(e){
        $(e.currentTarget).parents('#paybarWrap').css('right','-126px');
        $(e.currentTarget).remove();
    }

    function tryAddNote(){
		if(stateWrapEl.children('.note').length > 20){
			return;
		}

        $.each(queue, function(index, value){
			if(value._sound && !value.isMute() && Math.random()<.5){
				var note = $('<div/>');

                note.attr('class', 'note note' + Math.floor(Math.random() * 6 + 1))
				note.css({
                    '-webkit-transition': 'roll 1s infinite, fly' + Math.floor(Math.random() * 2 + 1) +
                        ' ' + Math.floor(Math.random() * 5 + 5) + 's 1',
                    'left': (index * 190 + Math.floor(Math.random() * 100) + 55) + 'px'
                });
				note.bind('webkitAnimationEnd',onAnimationEnd);

				stateWrapEl.append(note);
			}
		});
	}

    function hoverPlaying(e){
        music.audioControl.play(e.target.id);
        music.audioControl.setVolumes(0.1);
    }
    function unHoverPlaying(e){
        music.audioControl.stop(e.target.id);
        $.each(music.audioControl.playingSounds, function(index){
            if(music.audioControl.getVolume(index).toFixed(1) == 0.1){
                music.audioControl.setVolume(index, 1);
            }
        });
    }

    function createSbarEl(data){
        var el = $('<div>');

        el.attr({
            'id': data.name,
            'class': 'icon',
            'title': '试听',
            'draggable': true,
            'sound': data.name
        }).css({
            'background-position': data.pos
        }).hover(hoverPlaying,unHoverPlaying);

        el.get(0).addEventListener('dragstart',onDragStart,false);
        el.get(0).addEventListener('dragend',onDragEnd,false);
        return el;
    }

    function createPbarEl(data){
        var el_item =  $('<div>');
        el_item.attr('class', 'item').bind('webkitAnimationEnd', onPayAnimationEnd);

        var el_out =  $('<div>');
        el_out.attr({
            'class': 'iconWrap',
            'title': '购买'
        }).bind('click', onPay);

        var el_in =  $('<div>');
        el_in.attr({
            'id': data.name,
            'class': 'icon',
            'sound': data.name
        }).css({
            'background-position': data.pos
        }).hover(hoverPlaying,unHoverPlaying);

        var el_money =  $('<div>');
        el_money.attr('class', 'money');

        el_out.append(el_in);
        el_out.append(el_money);
        el_item.append(el_out);

        return el_item;
    }

	packageContext.init = function(){
		stateWrapEl = $('#stateWrap');
		stateEl = $('#state');
		soundbarEl = $('#soundbar');
        paybarEl = $('#paybar');

		var musicInfo = music.model.musicList;

        $.each(musicInfo, function(index,value){
            if(value.pay_state != 2){
                soundbarEl.append(createSbarEl(value));
            }else {
                paybarEl.append(createPbarEl(value));
            }
        });

        setTimeout(function(){
            $('.icon').each(function(){
                $(this).css('opacity', 1);
            });
        });

        notifyPay();

        tryAddBird();
        setInterval(tryAddNote,2000);
	};

	packageContext.notify=function(event,data){
		switch(event){
			case 'remove':
				removeBird(data);
				break;

            case 'solo':
                $.each(queue, function(index,value){
                    if(!value._isSolo){
                        value._pannel.addClass('mute');
                    }else if(value._id != data){
                        value._isSolo = false;
                        value._pannel.removeClass('solo');
                        value._pannel.addClass('mute');
                    }
                });
                break;

            case 'chorus':
                $.each(queue, function(index,value){
                    if(!value._isSolo){
                        value._pannel.removeClass('mute');
                    }
                });
                break;
			default:
				console.log('unknown command');
				break;
		}
	};

	packageContext.reset = function(){
        $.each(queue, function(index, value){
            value.getElement().addClass('remove');
            if(value._sound){
                $('#' + value._sound).attr({
                    'title': '试听',
                    'draggable': true
                }).css({
                        'opacity': 1,
                        'cursor': 'pointer'
                }).hover(hoverPlaying, unHoverPlaying);
                music.audioControl.stop(value._sound);
                music.audioControl.delPlayingSound(value._sound);
            }
        });

        setTimeout(function(){
            $.each(queue, function(index, value){
                value.getElement().remove();
            });
            queue = [];
            tryAddBird();
        }, 500);
	};

	packageContext.collect=function(){
		var list = [];
        $.each(queue, function(index, value){
            if(value._sound){
                list.push(value._sound);
            }
        });
		return list;
	};
})('music.state');
