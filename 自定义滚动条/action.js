function getByClass(classname, parentNode){
	var childNodes = parentNode.getElementsByTagName('*')
	if(childNodes.length < 1) return false;
	var reg = new RegExp("(^| )"+classname+"( |$)", "g");
	var classNodes = new Array();
	for(var i =0 ; i < childNodes.length; i++){
		// console.log(1);
		if(reg.test(childNodes[i].className)) 
			classNodes.push(childNodes[i]); 
	}
	return classNodes.length > 0 ? classNodes : false;
}
function css(node, attr){
	return  node.currentStyle ?  node.currentStyle[attr] :　getComputedStyle(node, null)[attr];
}
window.onload = function(){
	var show = getByClass('show', document)[0];
	var olist = getByClass('list', document)[0];
	var aLi = getByClass('photoBox', olist);
	var scrollBar = getByClass('scrollBar', document)[0];	
	var slider = getByClass('barBlock', scrollBar)[0];
	var sliderBox = getByClass('barM', scrollBar)[0];
	var barL = getByClass('barL', scrollBar)[0];
	var barR = getByClass('barR', scrollBar)[0];
	var barM = getByClass('barM', scrollBar)[0];
	var maxL = sliderBox.offsetWidth - slider.offsetWidth;
	var scale = l =0 ;

	var listWidth = (aLi[0].offsetWidth + parseFloat(css(aLi[0], "marginRight"))) * aLi.length;
	olist.style.width = listWidth + "px";
	slider.onmousedown = function(event){
		event = event || window.event;
		var originalClientX = event.clientX;
		var posX = this.offsetLeft;
		document.onmousemove = function(event){
			event = event || window.event;
			var currentX = event.clientX;
			var l = currentX - originalClientX + posX ;
			(l < 0) && (l = 0);
			(l>maxL) && (l = maxL);
			scale = l / maxL;
			slider.style.left = l + "px";
			olist.style.left = (show.clientWidth - listWidth)  * scale + "px";
		} 

		document.onmouseup = function(event){
			isEnd();
			 document.onmousemove = null;
			 document.onmuseup = null;
			 // return false;
		}
		return false;
	};
	slider.onclick = function(event){
		event = event || window.event;
		event.stopPropagation ? event.stopPropagation() : event.cancelBubble = true;
	};
	
	barM.onclick = function(event){
		event = event || window.event;
		var x = event.clientX - scrollBar.offsetLeft - barM.offsetLeft - (slider.offsetWidth / 2);
		(x > maxL) && (x = maxL);
		(x < 0) && (x = 0);
		move(slider, x);
		move(olist, (show.offsetWidth - olist.offsetWidth) * x / maxL);
		
	}

	function move(obj, target, fn){
		obj.timer && clearInterval(obj.timer);
		target = parseInt(target);
		obj.timer = setInterval(function(){
			var iCurrent = parseInt(obj.offsetLeft) ;
			if(iCurrent == target){
				// alert("ok");
				fn && fn();
				clearInterval(obj.timer);
			}
			var speed = (target - iCurrent) / 5;
			speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);
			obj.style.left = iCurrent + speed + "px";
		}, 30);
	}
	document.onkeydown = function(event){
		event = event  || window.event;
		//←方向键被按下
		if(event.keyCode == 37){
			if(slider.offsetLeft <= 0){
				isEnd();
				return;
			}
			l = slider.offsetLeft - 4;
			(l <= 0) && (l = 0);
			slider.style.left = l + "px";
			scale = l / maxL;
			olist.style.left = (show.clientWidth - olist.offsetWidth) * scale + "px";
		}else if(event.keyCode == 39){
			if(slider.offsetLeft > maxL){
				isEnd();
				return;
			} 
			l = slider.offsetLeft + 4;
			(l >= maxL) && (l = maxL);
			slider.style.left = l + "px";
			scale = l / maxL;
			olist.style.left = (show.clientWidth - olist.offsetWidth) * scale + "px";
		}
	};
	document.onkeyup = function(event){
		isEnd();
		clearInterval(slider.timer);
	};

	function isEnd(){
		var reg = /(^|\s)stop(\s|$)/;
		barL.className =  barL.className.replace(reg, "");
		barR.className = barR.className.replace(reg, "");
		if(slider.offsetLeft == 0 ){
			reg.test(barL.className) || (barL.className += " stop");
		}else if(slider.offsetLeft == maxL){
			reg.test(barR.className) || (barR.className += " stop");
		}
	};
};

