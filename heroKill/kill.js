function getByClass(classname, parent){
	var subNodes = parent.getElementsByTagName('*');
	var filter = []; 
	var reg = new RegExp("(^|\s*)" + classname + "($|\s*)");
	for (var i = 0; i < subNodes.length; i++) {
		if( reg.test(subNodes[i].className)) filter.push(subNodes[i]);  
	}
	return filter;
}
var timer = null;
function ZoomPic(){
	this.init.apply(this, arguments);
}

ZoomPic.prototype = {
 	init: function(obj){
		//使用一个_this来始终代表ZoomPic这个对象的实例，this代表的是它所在的执行环境，所以在不同的函数当中，this代表的值可能不同
		var _this = this;
		//注意obj和this不是同一个东西
		this.oParent = obj;
		this.ul = obj.getElementsByTagName('ul')[0];
		this.aLi = this.ul.getElementsByTagName('li');
		//把aLi转化为数组,因为aLi是一个Nodelist对象，并不是数组，所以不能用数组当中的方法
		this.arrLi = [];
		for(var i = 0; i < this.aLi.length; i++) this.arrLi[i] = this.aLi[i];
		this.btnPre = getByClass('pre', this.oParent)[0];
		this.btnNext = getByClass('next', this.oParent)[0];
		this.center = 3;
		var pre = getByClass('pre', obj);
		var next = getByClass('next', obj);

		//这里使用闭包的原因是想把执行此语句时的运行环境保存下来
		this._prev = function () {return _this.pre.apply(_this)};
		this._next = function () {return _this.next.apply(_this)};

		this.options = [
			{width:120, height:150, top:71, left:134, zIndex:1},
			{width:130, height:170, top:61, left:0, zIndex:2},
			{width:170, height:218, top:37, left:110, zIndex:3},
			{width:224, height:288, top:0, left:262, zIndex:4},
			{width:170, height:218, top:37, left:468, zIndex:3},
			{width:130, height:170, top:61, left:620, zIndex:2},
			{width:120, height:150, top:71, left:496, zIndex:1}
		];
		this.btnNext.onclick = this._next ;
		this.btnPre.onclick = this._prev;
		this.setUp();
		this.autoPlay();
	},
	autoPlay: function(){
		var _this = this;
		_this.timer = setInterval(function (){ _this.next()},  3000);
	},
	stop: function(){
		var _this = this;
		clearInterval(_this.timer);
	},
	setUp: function(){
		var _this = this;
		for(var i = 0 ; i < _this.arrLi.length; i++){
			this.arrLi[i].index = i;
			if(i < 7){
				this.arrLi[i].style.zIndex = this.options[i].zIndex;
				this.arrLi[i].style.display = "block";
				this.move(_this.arrLi[i], _this.options[i]);
				this.arrLi[i].onclick = function(){
					clearInterval(_this.timer);
					var offset = this.index - _this.center;
					if(offset > 0){
						for(var i = 0; i < Math.abs(offset); i++){
							_this.next();
						}
					}else if(offset < 0){
						for(var i = 0; i< Math.abs(offset); i++){
							_this.pre();
						}
					}
				}
			}else{
				this.arrLi[i].style.display = "none";
				this.arrLi[i].style.width = "0px";
				this.arrLi[i].style.height = "0px";
				this.arrLi[i].style.left = this.ul.offsetWidth / 2 + "px";
				this.arrLi[i].style.top = 30 + "px";
			}
			if(i <　_this.center || i > _this.center){
				_this.css(_this.arrLi[i].getElementsByTagName("img")[0], "opacity", 30)

				_this.arrLi[i].onmouseover = function(){
					_this.move(this.getElementsByTagName('img')[0], {opacity: 100});
				}
				_this.arrLi[i].onmouseout = function(){
					_this.move(this.getElementsByTagName('img')[0], {opacity: 30});
				}
				_this.arrLi[i].onmouseout();
			}
		}
		//注意啊，这里有一个很有意思的现象。我想让中间图片的图片透明度变为100，但是却误打成了让图片所在的li容器的透明度变为100。
		//本来我预想的效果应该是宽高不变，只改变透明度，但是li元素的宽度和高度却直接变为了0。起初非常不解，后来才知道是我在初始化的
		//时候已经调用了一次move,而move里面有一个obj.timer,这个参数里面保存这正在延时调用的线程号，每次新执行一次move，原有的线程号就会被清空
		//换句话说，就是这个元素之前设置好的要执行的动画会被停止，开始执行新动画。因为所有的li元素的宽高初始值都是0，所以停止动画后宽高度也为0
		// _this.move(this.arrLi[this.center], {opacity: 100});
		_this.move(this.arrLi[this.center].getElementsByTagName('img')[0], {opacity: 100});
		this.arrLi[this.center].onmouseout = function(){
			_this.move(this.getElementsByTagName('div')[0], {bottom: -100});
			_this.autoPlay();
		}
		this.arrLi[this.center].onmouseover  = function(){
			clearInterval(_this.timer);
			_this.move(this.getElementsByTagName('div')[0], {bottom: 0});
		}
		
	},

	pre: function(){

		this.arrLi.unshift(this.arrLi.pop());
		this.setUp();
		// this.autoPlay();
	
	},
	next: function(){
		this.arrLi.push(this.arrLi.shift());
		this.setUp();
	},
	move: function(obj, target, callback){
		if(!obj) return;
		var _this = this;
		obj.timer && clearInterval(obj.timer);
		obj.timer = setInterval(function(){
			var complete = true;
			for(var key in target){
				var current = parseFloat(_this.css(obj, key)) ;
				current = (key == "opacity") ? current.toFixed(2) * 100 : parseInt(_this.css(obj, key));
				if(current != target[key]){
					complete = false;
					var speed = (target[key] - current) / 5 ;
					speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);
					_this.css(obj, key, current + speed);
				} 
			}
			if(complete){
				clearInterval(obj.timer);
				callback && callback();
			}
		},30);
	},
	css : function (oElement, attr, value)
	{
		if (arguments.length == 2)
		{
			return oElement.currentStyle ? oElement.currentStyle[attr] : getComputedStyle(oElement, null)[attr]
		}
		else if (arguments.length == 3)
		{
			switch (attr)
			{
				case "width":
				case "height":
				case "top":
				case "left":
				case "bottom":
					oElement.style[attr] = value + "px";
					break;
				case "opacity" :
					oElement.style.filter = "alpha(opacity=" + value + ")";
					oElement.style.opacity = value / 100;
					break;
				default :
					oElement.style[attr] = value;
					break;
			}	
		}
	},
};


window.onload = function(){
	var main = document.getElementById('main');
	var obj1 = new ZoomPic(main);

}