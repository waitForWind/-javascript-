function css(node, attr){
	return node.currentStyle ? node.currentStyle[attr] : getComputedStyle(node, null)[attr] ;
}

function getByClass(classname, parentNode){
	var subNodes = parentNode.getElementsByTagName('*');
	if(subNodes.length == 0) return false;
	var len = subNodes.length;
	var reg = new RegExp("(^| )" + classname + "( |$)");
	var classNodes = new Array();
	for(var i = 0; i < len; i++ ){
 		if(reg.test(subNodes[i].className)){
 			classNodes.push(subNodes[i]);
 		}
	}
	return classNodes.length > 0 ? classNodes : false;
}


window.onload = function(){
	var big = getByClass('big', document)[0];
	var btnL = getByClass('btnL', document)[0];
	var btnR = getByClass('btnR', document)[0];
	var maskL = getByClass('maskL', document)[0];
	var maskR = getByClass('maskR', document)[0];
	var title = getByClass('titleBG', document)[0];
	var text = getByClass('titleText', document)[0];
	var img = big.getElementsByTagName('img')[0];
	var iNow = 0;
	var aData = [
		{"src" : "img/53706421.jpg", "title" : "10月08日，吊车将事故现场的车头残片吊至大型运输车辆上。"},
		{"src" : "img/53706420.jpg", "title" : "10月08日，一辆大卡车准备驶离事故现场。"},
		{"src" : "img/53706416.jpg", "title" : "10月08日，工人在给最后一节车厢盖上彩条布，准备运离现场。"},
		{"src" : "img/53706414.jpg", "title" : "10月08日，一名工人在事故现场最后一节车厢上作业。"},
		{"src" : "img/53706415.jpg", "title" : "10月08日，工人在给最后一节车厢盖上彩条布，准备运离现场。"}
	];

	maskL.onmouseover = btnL.onmouseover = function(){
		startAnimate(btnL, "opacity", 100);
	}
	maskL.onmouseout = btnL.onmouseout = function(){
		startAnimate(btnL, "opacity", 0);
	}
	maskR.onmouseover = btnR.onmouseover = function(){
		startAnimate(btnR, "opacity", 100);
	}
	maskR.onmouseout = btnR.onmouseout = function(){
		startAnimate(btnR, "opacity", 0);
	}
	
	btnL.onclick = function(){
		if(iNow <= 0){
			alert("这已经是第一张了");
			return;
		}
		iNow--;
		loadImg();
	};
	btnR.onclick = function(){
		if(iNow >= aData.length-1){
			alert("这已经是最后一张了");
			return;
		}
		iNow++;
		loadImg();
	};
	loadImg();
	function loadImg(){
		big.className += " loading";
		title.style.opacity = 0;
		title.style.filter = "alpha(opacity=0)";
		title.style.height = "0px";
		var img = document.getElementsByTagName('img')[0];
		// alert(img);
		// alert(big);
		big.removeChild(img);
		var image = new Image();
		var newImg = document.createElement('img');

		image.onload = function(){
			//移除loading类
			var reg = /(^|\s+)loading($|\s+)/g;
			big.className.match(reg, "");
			newImg.src = this.src;
			newImg.title = this.title;
			big.insertBefore(newImg, title);
			newImg.style.width = (newImg.offsetWdith > 800 ? 800 : newImg.offsetWidth) + "px";
			//一定要注意 offsetWidth 这些属性都是只读的，不能设置它们的值；用style所得到的属性的值是一个字符串，不能够直接参与计算的。
			big.style.height = newImg.style.height = newImg.offsetWidth * (newImg.offsetHeight / newImg.offsetWidth) + "px";
			startAnimate(title, "height" ,50, function(){
				startAnimate(title, "opacity", 70);
			});
			text.innerHTML = aData[iNow].title;
		}
		//！！！！千万千万要注意这里，用Image创建出来的对象, src属性一定要写在onload事件后面，否则在ie8中会无限加载，本人调了一天才知道
		image.src = aData[iNow].src;

	}

	/**
	 * [用来设置动画的函数]
	 * @param  {[node]}   obj         [一个节点类型的对象]
	 * @param  {[type]}   attr        [属性的名字]
	 * @param  {[type]}   targetValue [最终的属性值]
	 * @param  {Function} fn          [回调函数]
	 */
	function animate(obj, attr, targetValue, fn){
		var currentValue = parseFloat(css(obj, attr));
		if(attr == "opacity") {
			currentValue = parseInt(currentValue * 100);
		};
		if(currentValue == targetValue){
			clearInterval(obj.timer);
			fn && fn();
		}
		var differ = (targetValue - currentValue) / 5;
		// 0~1之间的数向上取整，也就是取1；-1~0之间的数取-1；这是为了避免无限减0
		var speed = differ > 0 ? Math.ceil(differ) : Math.floor(differ);
		switch(attr){
			case "opacity": 
				obj.style.filter = "alpha(opacity=" + (currentValue + speed) + ")";
				obj.style.opacity = (currentValue + speed) / 100;
				break;
			default: 
				obj.style[attr] = (currentValue + speed) + "px";
		}
	}
	
	function startAnimate(obj, attr, targetValue, fn){
		clearInterval(obj.timer);
		obj.timer = setInterval(function(){
			animate(obj, attr, targetValue,fn);
		}, 30);
	}

}
