window.onload = function(){
	var obox = getByClass('box', document)[0];
	var ul = getByClass('images', document)[0];
	var img = getByClass('img', document)[0];
	var aLi = document.getElementsByTagName('li');
	var current = 0;
	var btn = document.getElementById('boot');
	var counts = [];
	var thumbnail = img.getElementsByTagName('img');
	var allPos = [];
	var startTime = endTime = 0;

	for(i =0; i < 15; i++) counts.push(i+1);
	btn.onclick = function(){
		startTime = + new Date();
		ul.innerHTML = "";
		game(true);
		this.value = "重新开始";

	}
	function createMask(){
		var div = document.createElement('div');
		div.className ="mask";
		ul.appendChild(div);
	}
	createMask();
	//为缩略图添加事件
	for(var i = 0; i < thumbnail.length; i++){
		thumbnail[i].index = i ;
		thumbnail[i].onmouseover = function(){
			this.className += " hover";
		}
		thumbnail[i].onmouseout = function(){
			this.className = this.className.replace(/(^|\s*)hover($|\s*)/, "");
		}
		thumbnail[i].onclick = function(){
			for(var j=0; j < thumbnail.length; j++) thumbnail[j].className = "";
			btn.value = "开始游戏";
			this.className = "selected";
			counts.sort(function(a,b){return a - b});
			current = this.index;
			ul.innerHTML= "";
			createMask();
			game(false);
		}
	}	
	

	
	//游戏函数
	function game(start){
		start && counts.sort(function(){ return Math.random() > 0.5 ? 1 : -1;})
		//加载图像
		var tmp = document.createDocumentFragment();
		for(i = 0; i < counts.length; i++){
			var li = document.createElement('li');
			var img = document.createElement('img');
			img.src = "img/girl" + current + "/" + counts[i] + ".png";
			li.appendChild(img);
			tmp.appendChild(li); 
		}
		ul.appendChild(tmp);
		ul.style.background = "url(img/bg"+current+".png)  no-repeat";
		for(i=0; i < aLi.length; i++){
			aLi[i].index = i;
			aLi[i].style.left = aLi[i].offsetLeft + "px";
			aLi[i].style.top = aLi[i].offsetTop + "px";
		}
		for(i= 0; i < aLi.length; i++){
			aLi[i].style.position = "absolute";
			drag(aLi[i]);
			allPos.push({left: aLi[i].offsetLeft,top: aLi[i].offsetTop});
		}
	}
	game(); 

	//定义拖拽事件
	function drag(obj){
		obj.onmousedown = function(event){
			event = event || window.event;
			var disX = event.clientX - obj.offsetLeft;
			var disY = event.clientY - obj.offsetTop;
			obj.style["z-index"] = 99;
			var near = null;
			document.onmousemove = function(event){
				event = event || window.event;
				var x = event.clientX - disX;
				var y = event.clientY -disY;
				
				x < 0 && (x = 0);
				(x > ul.offsetWidth*4/5) && (x = ul.offsetWidth * 4 / 5);
				y < 0 && (y = 0);
				(y > ul.offsetHeight*2/3) && (y = ul.offsetHeight * 2 / 3);
				obj.style.left = x + "px";
				obj.style.top = y + "px";
				near = getNear(obj);
				for(var i=0; i<aLi.length; i++) aLi[i].className = aLi[i].className.replace(/(^|\s*)change($|\s*)/, "");
				near.className += " change";
				return false;

			}
			document.onmouseup = function(event){
				obj.style["z-index"] = 0;
				document.onmousemove = null;
				document.onmouseup = null;
				if(near != null){
					
					near.className = near.className.replace(/(^|\s*)change($|\s*)/, "");
					swap(obj, near); 
					if(isFinish()){
						endTime = + new Date();
						var totalSec = (endTime - startTime) / 1000;
						var Hour = parseInt(totalSec / 3600);
						var min = parseInt(totalSec / 60);
						var sec = parseInt(totalSec % 60); 
						var hint = "完成！总共耗时：" + Hour + "小时" + min + "分" + sec + "秒";
						btn.value = "开始游戏";
						createMask();
						setTimeout(function(){
							alert(hint);
						}, 1000);

					}
				}else{
					move(obj, allPos[obj.index]);
				}
				
				return false;
			}
			//阻止默认行为
			return false;
		}
	}
	//交换位置
	function swap(obj1, obj2){
		var x1 = allPos[obj1.index].left ;
		var y1 = allPos[obj1.index].top;
		var y2 = allPos[obj2.index].top;
		var x2 = allPos[obj2.index].left;
		var tmp = obj1.index;
		obj1.index = obj2.index;
		obj2.index = tmp;
		move(obj1, x2, y2);
		move(obj2, x1, y1);

	}
	/**
	 * 位置移动函数
	 * @param  {[Node]}   obj     [需要移动的节点]
	 * @param  {[num]}   targetX [最终位置的x坐标]
	 * @param  {[num]}   targetY [最终位置的y坐标]
	 * @param  {Function} fn      [回调函数]
	 */
	function move(obj, targetX,targetY, fn){
		clearInterval(obj.timer);
		obj.timer = setInterval(function(){
			var currentX = parseInt(obj.offsetLeft);
			var currentY = parseInt(obj.offsetTop);
			if(currentX == targetX && currentY == targetY){
				fn && fn();
				clearInterval(obj.timer);
			}
			speedX = (targetX - currentX) / 5 ;
			speedY = (targetY- currentY) / 5 ;
			speedX = speedX > 0 ? Math.ceil(speedX) : Math.floor(speedX);
			speedY = speedY > 0 ? Math.ceil(speedY) : Math.floor(speedY);
			obj.style.left = currentX + speedX + 'px' ;
			obj.style.top = currentY + speedY + 'px' ;
			
		}, 30);
	}
	//判断是否完成
	function isFinish(){
		var result = true;
		var imgNum = []
		for(var i = 0; i < aLi.length; i++){
			for(var j=0; j< aLi.length; j++)
				i == aLi[j].index && imgNum.push(aLi[j].getElementsByTagName('img')[0].src.match(/(\d*)\./)[1]);
		}
		
		for(i = 1; i<= imgNum.length; i++){
			if(imgNum[i-1] != i){
				result = false;
				break;
			}
		}
		return result;
	} 	
	//检测与目标对象发生碰撞且距离最小的元素
	function getNear(obj){
		var max = Number.MAX_VALUE;
		var arr = [];
		var near = null;
		for(var i = 0; i<aLi.length; i++){
			if(aLi[i] != obj && isButt(obj, aLi[i])){
				arr.push(aLi[i]);
			}
		}

		for(var i= 0; i<arr.length;i++ ){
			var distance = getDistance(obj, arr[i]);
			if(distance < max){
				max = distance;
				near = arr[i];
			}
		}
		return near;
	}

	//计算距离
	function getDistance(obj1, obj2){
		var a = (obj1.offsetLeft + obj1.offsetWidth / 2) - (obj2.offsetLeft + obj2.offsetWidth / 2);
		var b = (obj1.offsetTop + obj1.offsetHeight / 2) - (obj2.offsetTop + obj2.offsetHeight / 2);
		return  Math.sqrt(a*a + b*b);
	}
	

	//碰撞检测
	function isButt(obj1, obj2){
		var l1 = obj1.offsetLeft;
		var t1 = obj1.offsetTop;
		var r1 = obj1.offsetLeft + obj1.offsetWidth;
		var b1 = obj1.offsetTop + obj1.offsetHeight;

		var l2 = obj2.offsetLeft;
		var t2 = obj2.offsetTop;
		var r2 = obj2.offsetLeft + obj2.offsetWidth;
		var b2 = obj2.offsetTop + obj2.offsetHeight;
		return !(b1 < t2 || b2 < t1 || r1 < l2 || l1 > r2);
		
	}

};

/**
 * 根据类名获取元素
 * @param  {[string]} classname  [目标元素的类名]
 * @param  {[Node]} parentNode [目标元素的父节点]
 * @return {[Node]}            [node类型的节点]
 */
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