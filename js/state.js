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
		queue = [];

    var CGI_GET_PARAMS = "http://cgi.appx.qq.com/easypay/change_auth_info",
        CGI_IS_PAYED = "http://cgi.appx.qq.com/easypay/is_payed",
        goods_id;

	function tryAddBird(){
		if(queue.length == 0 || queue.length < MAX_PERSON && queue[queue.length - 1]._sound){
			var bird = new Element();
            bird._domElement.css('bottom', Math.ceil(Math.random() * 20) + 'px');
            bird._className = bird._domElement.children().eq(1).attr('class');

            bird._domElement.get(0).addEventListener('dragover', onDragOver, false);
            bird._domElement.get(0).addEventListener('drop', onDrop, false);

			queue.push(bird);

            setTimeout(function(){
                bird._domElement.css('left', (queue.length * 190 - 180) + 'px');
            }, 0);

			stateEl.append(bird._domElement);
			return true;
		}
		return false;
	};

    function moveLeft(){
        $.each(queue, function(index, bird){
            bird._domElement.css('left', (index * 190 + 10)+'px');
        });
    }

	function removeBird(sound){
        $.each(queue, function(index, bird){
			if(bird._sound == sound){
                bird._domElement.bind('webkitAnimationEnd',function(){
                    $('#' + bird._sound).attr({
                        'title': '试听',
                        'draggable': true
                    }).css({
                        'opacity': 1,
                        'cursor': 'pointer'
                    }).hover(hoverPlaying, unHoverPlaying);
                    queue.splice(index, 1);
                    moveLeft();
                    music.audioControl.delPlayingSound(bird._sound);
                    bird._domElement.remove();
                    checkSolo();
                    tryAddBird();
                });
                bird._domElement.addClass('remove');
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
            targetBird;

        icon = $("#" + e.dataTransfer.getData('Text'));

		if(!icon || !icon.attr('sound')){
			return;
		}

        icon.attr({
            'title': '',
            'draggable': false
        }).css({
            'opacity': 0.5,
            'cursor': 'default'
        }).unbind('hover');

        iconClone = icon.clone();
        iconClone.attr('id', '').css('opacity', 1);

        $.each(queue, function(index, bird){
            if(bird._sound && !bird._isMute){
                music.audioControl.setVolume(bird._sound, 1);
            }
            if(bird._className == e.target.className){
                targetBird = bird;
            }
        });

		if(!targetBird._sound){
            targetBird._domElement.children('.bubble').append(iconClone);
            targetBird.setSound(iconClone.attr('sound'));
            music.audioControl.addPlayingSound(iconClone.attr('sound'));
            targetBird.play();
            checkSolo();
            tryAddBird();
		}else{
            music.audioControl.stop(targetBird._sound);
            $('#' + targetBird._sound).attr({
                'title': '试听',
                'draggable': true
            }).css({
                'opacity': 1,
                'cursor': 'pointer'
            }).hover(hoverPlaying, unHoverPlaying);

            music.audioControl.delPlayingSound(icon.attr('sound'));
            music.audioControl.addPlayingSound(iconClone.attr('sound'));

            targetBird._domElement.find('.icon').replaceWith(iconClone);
            targetBird.setSound(icon.attr('id'));
            targetBird.play();
        }
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
                        music.model.payedList.push(goods_id);

                        $('#'+ goods_id).parents('.item').css('-webkit-animation','fadeOutUp 1s ease-in-out both');
                        var el = $('#'+ goods_id).clone();
                        el.attr({
                            'title': '试听',
                            'draggable': true
                        })
                        el.get(0).addEventListener('dragstart',onDragStart,false);
                        el.get(0).addEventListener('dragend',onDragEnd,false);
                        el.bind('webkitAnimationEnd', function(e){
                            $(this).css('-webkit-animation', 'none');
                        })
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

    function checkAllpayed(){
        if(music.model.payedList.length == 5){
            $('#allpay').css('display', 'block');
        }
    }

    function tryAddNote(){
		if(stateWrapEl.find('.note').length > 20){
			return;
		}

        $.each(queue, function(index, bird){
			if(bird._sound && !bird._isMute && Math.random()<.5){
				var note = $('<div/>');

                note.attr('class', 'note note' + Math.floor(Math.random() * 5 + 1));
				note.css({
                    '-webkit-animation': 'roll 1s infinite, fly' + Math.floor(Math.random() * 2 + 1) +
                        ' ' + Math.floor(Math.random() * 5 + 5) + 's 1',
                    'left': (index * 190 + Math.floor(Math.random() * 100) + 55) + 'px'
                });
				note.bind('webkitAnimationEnd',function(e){
                    $(e.currentTarget).remove();
                });
				stateWrapEl.append(note);
			}
		});
	}

    var timeoutId;
    function hoverPlaying(e){
        clearTimeout(timeoutId);
        timeoutId = setTimeout(function(){
            music.audioControl.play(e.target.id);
            music.audioControl.setVolumes(0);
        }, 1000);
    }

    function unHoverPlaying(e){
        clearTimeout(timeoutId);
        music.audioControl.stop(e.target.id);
        $.each(queue, function(index, bird){
            if(bird._sound && !bird._isMute){
                music.audioControl.setVolume(bird._sound, 1);
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
        el_item.attr('class', 'item').bind('webkitAnimationEnd', function(e){
            checkAllpayed();
            $(e.currentTarget).parents('#paybarWrap').css('right','-126px');
            $(e.currentTarget).remove();
        });

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

    function checkSolo(){
        var count = 0,
            target = null;
        $.each(queue, function(index, bird){
            if(bird._sound && !bird._isMute){
                count++;
                target = bird;
            }
        });

        if(count == 1){
            target._isSolo = true;
            target._domElement.addClass('solo');
        }else if(count > 1){
            $.each(queue, function(index, bird){
                if(bird._isSolo){
                    bird._isSolo = false;
                    bird._domElement.removeClass('solo');
                }
            });
        }
    }

	packageContext.init = function(){
		stateWrapEl = $('#stateWrap');
		stateEl = $('#state');
		soundbarEl = $('#soundbar');
        paybarEl = $('#paybar');

		var musicInfo = music.model.musicList;

        $.each(musicInfo, function(index,value){
            if(value.pay_state == 0 || $.inArray(value.name, music.model.payedList) != -1){
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

        checkAllpayed();

        notifyPay();

        tryAddBird();
        setInterval(tryAddNote, 2000);
	};

	packageContext.notify = function(event, data){
		switch(event){
			case 'remove':
				removeBird(data);
				break;

            case 'solo':
                $.each(queue, function(index,bird){
                    if(bird._sound && bird._sound != data){
                        if(bird._isSolo){
                            bird._isMute = true;
                            music.audioControl.mute(bird._sound);
                            bird._isSolo = false;
                            bird._domElement.removeClass('solo');
                            bird._domElement.addClass('mute');
                        }else if(!bird._isMute){
                            bird._isMute = true;
                            music.audioControl.mute(bird._sound);
                            bird._domElement.addClass('mute');
                        }
                    }
                });
                break;

            case 'unSolo':
                $.each(queue, function(index, bird){
                    if(bird._sound){
                        bird._isMute = false;
                        music.audioControl.unMute(bird._sound);
                        bird._domElement.removeClass('mute');
                    }
                });
                break;

            case 'checkSolo':
                checkSolo();
                break;

			default:
				console.log('不知道的命令');
				break;
		}
	};

	packageContext.reset = function(){
        $.each(queue, function(index, bird){
            bird._domElement.addClass('remove');
            if(bird._sound){
                $('#' + bird._sound).attr({
                    'title': '试听',
                    'draggable': true
                }).css({
                    'opacity': 1,
                    'cursor': 'pointer'
                }).hover(hoverPlaying, unHoverPlaying);
                music.audioControl.stop(bird._sound);
                music.audioControl.delPlayingSound(bird._sound);
            }
        });

        setTimeout(function(){
            $.each(queue, function(index, bird){
                bird._domElement.remove();
            });
            queue = [];
            tryAddBird();
        }, 500);
	};

	packageContext.collect=function(){
		var list = [];
        $.each(queue, function(index, bird){
            if(bird._sound){
                list.push(bird._sound);
            }
        });
		return list;
	};
})('music.state');
