var get = {
	byId : function(id){
		// alert("aaaa");
		return document.getElementById(id);
	},
	byClass: function(className, parentNode){
		var subNodes = [];
		var allNodes = parentNode.getElementsByTagName('*');
		var reg = new RegExp("(^| )" + className + "( |$)");
		for(var i=0; i<allNodes.length; i++){
			if(reg.test(allNodes[i].className)){
				subNodes.push(allNodes[i]);
			}
		}
		return subNodes;
	},

	byTag: function(tagName,parentNode){
		return (parentNode || document).getElementsByTagName(tagName);
	}

};

var EventUtil = {
	/*addEventListener: function(element, type, handle){
		if(element.addEventListener){
			element.addEventListener(type, handle);
		}else if(element.attachEvent){
			element.attachEvent("on"+type, handle);
		}else{
			element["on"+type] = handle;
		}
	},*/
	//兼容写法
	addEventListener: function (oElement, sEvent, fnHandler) {
		oElement.addEventListener ? oElement.addEventListener(sEvent, fnHandler, false) : (oElement["_" + sEvent + fnHandler] = fnHandler, oElement[sEvent + fnHandler] = function () {oElement["_" + sEvent + fnHandler]()}, oElement.attachEvent("on" + sEvent, oElement[sEvent + fnHandler]))
	},

	removeEventListener: function(element, type, handle){
		if(element.removeEventListener){
			element.removeEventListener(type, handle, false);
		}else if(element.detachEvent){
			element.detachEvent("on"+type, handle);
		}else{
			element["on"+type] = null;
		}
	},
	addLoadEvent: function(func){
		if(window.onload){
			var oldfunctoin = window.onload ;
			window.onload = function(){
				oldfunctoin();
				func();
			};
		}else{
			// alert("hello");
			window.onload =func;
		}
	},
	getEvent: function(event){
		return  event ? event : window.event; 
	},
	preventDefault: function(event){
		if(event.preventDefault){
			event.preventDefault();
		}else{
			event.returnValue = false;
		}
	},
	removeClass: function(node, classname){
		// alert(node.className);
		//记录位置
		var pos = -1;
		var arr = node.className.split(/\s+/);
		// alert(arr);
		// alert(arr.length);
		for(var i=0; i < arr.length; i++){
			if(arr[i] == classname){
				pos = i;
				break;
			}
		}
		if(pos != -1){
			arr.splice(i, 1);
			node.className = arr.join(" ");
		}
	}

};



function css(node, attr, value){
	switch(arguments.length){
		case 2:
			if(typeof arguments[1] == "string"){
				return node.currentStyle ? node.currentStyle[attr] :getComputedStyle(node, null)[attr];
			}else if(typeof arguments[1] == "object"){
				for(var key in attr){
					//如果是设置透明度的话单独处理
					if(key == "opacity"){
						//除ie之外的浏览器能识别opacity
						node.style.opacity = attr[key] / 100;
						//ie浏览器就使用 ie发布的滤镜
						node.style.filter = "alpha(opacity=" + attr[key] + ")";
					}else{
						node.style[key] = attr[key]; 
					}
				}
			}
			break;
		case 3:
			if(attr == "opacity"){
				node.style.opacity = value/100;
				node.style.filter = "alpha(opacity=" + value + ")";
			}else{
				// console.log('aaaa');
				node.style[attr] = value;
			}
	}
}

