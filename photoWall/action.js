function getByClass(classname, parentNode){
	var subNodes = (parentNode||document).getElementsByTagName('*');
	var filter = [];
	for(var i = 0;i < subNodes.length; i++){
		var reg = new RegExp("(^|\\s*)" + classname + "($|\\s*)");
		if(reg.test(subNodes[i].className)) filter.push(subNodes[i]);
	}
	return filter;
}

//创建照片墙类
function PhotoWall(){
	this.initialize.apply(this, arguments);
}

PhotoWall.prototype = {
	initialize: function(obj, aData){
		var oThis = this;
		this.aData = aData;
		this.oParent = obj ;
		this.allPos = [];
		this.ul = obj.getElementsByTagName('ul')[0];
		this.create();
		// this.btnRandow = getByClass('random', obj)[0]; 
		this.btnRandow = this.oParent.getElementsByTagName("a")[0]; 
		this.btnRandow.onclick = function(){oThis.random()};
	},
	create: function(){
		var container = document.createDocumentFragment();
		for(var i = 0; i < this.aData.length; i++){
			var li = document.createElement('li');
			var img = document.createElement('img');
			img.src = this.aData[i];
			li.appendChild(img);
			container.appendChild(li);
		}
		this.ul.appendChild(container);
		this.aLi = this.ul.getElementsByTagName('li');
		this.layout(); 		
	},
	layout: function(){
		var i = 0;
		//重置为0这里很关键，要不然会一直往同一个allPos数组里面加数据
		this.allPos.length = 0;
		this.oParent.style.height = this.oParent.offsetHeight + "px";
		for(i = 0; i< this.aLi.length; i++){
			this.aLi[i].index = i;
			var left = this.aLi[i].offsetLeft;
			var top = this.aLi[i].offsetTop;
			this.allPos.push({left: left, top: top});
			this.aLi[i].style.left = left + "px";
			this.aLi[i].style.top = top + 'px';
		}
		for(i = 0; i< this.aLi.length; i++){
			this.aLi[i].style.position = "absolute";
			this.aLi[i].style.margin = 0;
			this.drag(this.aLi[i]);
		}
	},
	drag: function(node){
		var oThis = this;
		var maxX = this.ul.offsetWidth - node.offsetWidth;
		var maxY = this.ul.offsetHeight - node.offsetHeight;
		node.onmousedown = function(event){
			node.style["z-index"] = 3;
			event = event || window.event;
			var near = null;
			var disX = event.clientX - node.offsetLeft;
			var disY = event.clientY - node.offsetTop;
			document.onmousemove = function(event){
				event = event || window.event;
				var currentX = event.clientX - disX;
				var currentY = event.clientY -disY;
				(currentX >　maxX) && (currentX = maxX);
				(currentX <= 0) && (currentX  = 0);
				(currentY > maxY) && (currentY = maxY);
				(currentY <= 0) && (currentY = 0);
				node.style.left = currentX + "px";
				node.style.top = currentY + "px";
				near = oThis.getNear(node);
				// var hig = getByClass('hig', oThis.ul)[0];
				for(var i = 0; i < oThis.aLi.length; i++) oThis.aLi[i].className = "";
				near && (near.className += " hig");

				return false;
			};
			document.onmouseup = function(event){
				node.style["z-index"] = 0;
				document.onmousemove = null;
				document.onmouseup = null;
				if(near){
					var tmp = near.index;
 				near.index = node.index;
 				node.index = tmp;
					oThis.move(node, oThis.allPos[node.index].left, oThis.allPos[node.index].top);
 				oThis.move(near, oThis.allPos[near.index].left, oThis.allPos[near.index].top);
 				getByClass('hig', oThis.ul)[0].className = "";
				}else{
					 oThis.move(node, oThis.allPos[node.index].left, oThis.allPos[node.index].top);
					 node.releaseCapture && node.releaseCapture(false);
				}
				return false;
			}		
			//ie下千万不要加下面这句话
			// this.setCapture && this.setCapture();	
			return false;
		}
	},
	//计算两个元素之间的距离
	getDistance: function(a,b){
		var x = (a.offsetWidth/2 + a.offsetLeft) - (b.offsetWidth/2 + b.offsetLeft);
		var y = (a.offsetHeight/2 + a.offsetTop) - (b.offsetHeight/2 + b.offsetTop);
		var dis = Math.sqrt(x*x + y*y);
		return dis;
	},
	//碰撞检测
	isButt: function(a, b){
		var l1 = a.offsetLeft;
		var r1 = a.offsetLeft + a.offsetWidth;
		var t1 = a.offsetTop;
		var b1 = a.offsetTop + a.offsetHeight;

		var l2 = b.offsetLeft;
		var r2 = b.offsetLeft + b.offsetWidth;
		var t2 = b.offsetTop;
		var b2 = b.offsetTop + b.offsetHeight;

		return !(l1>r2 || r1 < l2 || t1 > b2 || b1 < t2);
	},
	//得到最近的元素
	getNear: function(obj){
		var oThis = this;
		var aDis = [];
		var near = null;
		for(var i = 0; i < oThis.aLi.length; i++){
			if(oThis.aLi[i] == obj){
				 // && oThis.isButt(oThis.aLi[i], obj)
				aDis[i] = Number.MAX_VALUE;
			}else{
				aDis[i] = this.getDistance(oThis.aLi[i], obj);
			}
		}
		var minValue = Number.MAX_VALUE;
		var minIndex = -1;
		for(var i = 0; i< aDis.length; i++){
			(aDis[i] < minValue) && (minValue = aDis[i],minIndex = i);
		}
		return this.isButt(oThis.aLi[minIndex], obj) ? oThis.aLi[minIndex] : null;
	},
	//移动函数
	move: function(obj, targetX, targetY, fn){
		var oThis = this;
		obj.timer && clearInterval(obj.timer);
		obj.timer = setInterval(function(){
			var currentX = parseInt(obj.offsetLeft); 
			var currentY = parseInt(obj.offsetTop);
			if(currentX == targetX && currentY == targetY){
				fn && fn();
				clearInterval(obj.timer);
			}else{
				var speedX = (targetX - currentX) / 5;
				var speedY = (targetY - currentY) / 5;
				speedX = speedX > 0 ? Math.ceil(speedX) : Math.floor(speedX);
				speedY = speedY > 0 ? Math.ceil(speedY) : Math.floor(speedY);
				obj.style.left = currentX + speedX + "px";
				obj.style.top = currentY + speedY + "px";
			}
		}, 30);
	},
	random: function(){
		this.allPos.sort(function(a,b){return Math.random() > 0.5 ? -1 : 1});
		for(var i = 0; i < this.allPos.length; i++){
			this.aLi[i].index = i ;
			this.move(this.aLi[i], this.allPos[i].left, this.allPos[i].top);
		}
	}
};

window.onload = function(){
	var box = getByClass('box');
	var walls = [];
	var srcData = [];
	for(var i = 0; i < 20; i++) srcData.push("./img/" + i + ".jpg");
	for(var i = 0; i<box.length; i++){

		var object = new PhotoWall(box[i], srcData);
		walls.push(object);
	}

}