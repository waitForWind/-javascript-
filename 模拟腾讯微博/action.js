//定义常量
var MAX_WORDS = 140;

//定义全局变量和对象
var cForm = get.byId("cForm");
var conBox = get.byId('conBox');
var limitNum = get.byClass('limitNum', cForm)[0];
var limitText = get.byClass('limitText', cForm)[0];
var bSend = false;
var username = get.byId('username');
var list = get.byClass('commentList', document)[0];
var faceBox = get.byId('faces');
var aImg = get.byTag('img', faceBox);
var btnSend = get.byTag('input', cForm)[1];
// var item = get.byClass('item', list);

//调用自定义加载函数
EventUtil.addLoadEvent(init);

//定义初始化函数
function init(){
	limitNum.innerHTML = MAX_WORDS;
	//为图片添加处理事件
	preImg();
	//为文本框添加处理事件
	textboxFocus();
	confine();
	//添加键盘响应事件
	keyEvent();

	//阻止表单提交
	EventUtil.addEventListener(get.byId('cForm'), 'submit', function(event){
		event = EventUtil.getEvent();
		EventUtil.preventDefault(event);
	});
	//添加li划过事件
	liHover();

	//添加点击删除事件
	delLi();
	EventUtil.addEventListener(get.byTag('input', cForm)[1], "click", fnSend);

	//ctrl + Entry 发送消息
	EventUtil.addEventListener(document, "keyup", function(evnet){
		event = EventUtil.getEvent(event);
		event.ctrlKey && event.keyCode == 13 && fnSend(); 

	})

	
	btnSend.onmouseover = function(){
		this.className += ' hover';
	}
	btnSend.onmouseout = function(){
		EventUtil.removeClass(this,'hover');
	}
	
};


/*++++++++++++++功能函数区+++++++++++++++++++++*/

//文本输入框获得焦点时改变样式
function textboxFocus(){
	var input = get.byId('username');
	var textarea= get.byId('conBox');
	EventUtil.addEventListener(input, "focus", function(event){
		this.className += " focus";
	});
	EventUtil.addEventListener(input, "blur", function(){
		EventUtil.removeClass(this, "focus");
	})
	var textarea= get.byId('conBox');
	EventUtil.addEventListener(textarea, "focus", function(event){
		this.className += " focus";
	});
	EventUtil.addEventListener(textarea, "blur", function(){
		EventUtil.removeClass(this, "focus");
	})
}

//统计文字字数是否超过限制
function confine(){
	
	var len = 0;
	//计算评论框当中的字符个数,半角状态下的因为字母和字符等于半个字，一个汉字等于一个字
	for(var i=0; i< conBox.value.length; i++){
		len += /[^\x00-\xff]/g.test(conBox.value.charAt(i)) ? 1 : 0.5;
	}
	var differ = MAX_WORDS - Math.floor(len)
	limitNum.innerHTML = Math.abs(differ); 
	if(differ < 0){
		limitText.innerHTML = "已超出";
		limitNum.style.color = "#f30";
		bSend = false;
	}else{
		limitNum.style.color = "";
		bSend = true;
	}
}

//为所有的图片添加事件
function preImg(){
	var faceCollection = get.byTag("img", faceBox);
	for(var i=0 ; i < faceCollection.length; i++){
		
		faceCollection[i].onmouseover =function(){
			this.className += " hover";
			// alert(this.className);
		}
		faceCollection[i].onmouseout =function(){
			this.className = this.className.replace(/\s?hover/,"");
			// alert(this.className);
		}
		faceCollection[i].onclick =function(){
			for(var i=0; i<faceCollection.length; i++){
				EventUtil.removeClass(faceCollection[i], 'current');
			}
			this.className += " current";
		}
	}
}

function keyEvent(){
	EventUtil.addEventListener(conBox, "keyup", confine);
	EventUtil.addEventListener(conBox, "change", confine);
	EventUtil.addEventListener(conBox, "focus", confine);
}

function liHover(){
	var item = get.byClass('item', list);
	// alert(item);
	for(var i = 0; i < item.length; i++){
		item[i].onmouseover = function(){
			this.className += " hover";
		}
		item[i].onmouseout = function(){
			this.className = this.className.replace(/\s?hover/,"");
		}
		
	}
}


//点击发送函数
function fnSend(){
	var reg = /^\s*$/; 
	if(reg.test(username.value)){
		alert("用户名不能为空");
		username.focus();
	}else if(!/^[u4e00-\u9fa5\w]{2,8}$/g.test(username.value)){
		alert("用户名由2-8位数字、字母、下划线组成！");
		username.focus();
	}else if(reg.test(conBox.value)){
		alert("输入内容不能为空哦!");
		conBox.focus();
	}else if(!bSend){
		alert("随便说点什么吧!");
	}else{
		var date = new Date();
		var li = document.createElement('li');
		li.className = "item";
		li.innerHTML = "<img class=\"userImg\" src=\"" + get.byClass('current', get.byId('faces'))[0].src + "\"/>"
		+"<div class=\"userContent\"><a href=\"javascript:;\" class=\"nickname\">" + username.value +"</a>"
						+ "<span class=\"info\">" + conBox.value + "</span>" + "<div class=\"time\"><span>" + 
						dateFormat(date.getMonth()+1) + "月" + dateFormat(date.getDate()) + "日 " + dateFormat(date.getHours()) + ":" + dateFormat(date.getMinutes()) + "</span>"
						+ "<a href=\"javascript:;\" class=\"del\"> 删除</a></div>";
		var item = get.byClass('item', list);
		item.length  ? list.insertBefore(li, item[0]) : list.appendChild(li);

		//重置
		cForm.reset();
		limitNum.innerHTML = MAX_WORDS;
		for(var i = 0; i < aImg.length; i++)
			aImg[i].className = "";
		aImg[0].className = "current";


		//记录元素的高度
		var eHeight = li.clientHeight - parseFloat(css(li, 'paddingTop')) - parseFloat(css(li, 'paddingBottom'));
		css(li,{opacity: 0,height: 0});
		var height = opacity = 0;

		//设置定时动画
		timer = setInterval(function(){
			if(height < eHeight){
				height += 8;
				css(li, {height: height + 'px',display: "block"});
			}else if(height >= eHeight){
				css(li, {height: eHeight + 'px',display: "block"});
				clearInterval(timer);
				timer = setInterval(function(){
					if(opacity < 100){
						opacity += 10;
						css(li,{opacity: opacity})
					}else if(opacity >= 100){
						css(li,{"opacity": 100});
						clearInterval(timer);
					}
					
				},30);
			}
		},25);

		//为新元素激活事件
		liHover();
		delLi();

	}
}
function delLi(){
	// var item = get.byClass('item', list);
	var delLinks = get.byClass('del', list);
	var len = delLinks.length;
	for(var i = 0; i < len; i++){
		delLinks[i].onclick = function(){
			// alert("hello");
			var parentNode = this.parentNode.parentNode.parentNode;
			var originalH = parentNode.offsetHeight;
			// var originalH = parseFloat(css(parentNode, "height"));
			var opacity =  100;
			// alert(css(parentNode, "opacity"));
			if(originalH <= 0) return ;
			if(!opacity) return;
			timer = setInterval(function(){

					css(parentNode, 'opacity', (opacity -= 8));
					if(opacity <= 0){
						// css(parentNode, 'opacity', 0);
						clearInterval(timer);
						timer = setInterval(function(){
							originalH -= 10;
							originalH < 0 && (originalH = 0);
							css(parentNode, "height", originalH + "px");
							if(originalH <= 0){
								clearInterval(timer);
								list.removeChild(parentNode);
							}	
						}, 30);
					}
			}, 20);	
			this.onclick = null;
		}
	}
}

function dateFormat(time){
	return time.toString().replace(/^(\d)$/, "0$1");
}
