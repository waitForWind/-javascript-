function getByClass(classname, parrentNode){
	var subNodes = (document || parentNode).getElementsByTagName('*');
	var filter = [];
	for(var i = 0;i < subNodes.length; i++){
		var reg = new RegExp("(^|\\s*)" + classname + "($|\\s*)");
		if(reg.test(subNodes[i].className)) filter.push(subNodes[i]);
	}
	return filter;
 }

 function PhotoWall(){
 	this.initialize.apply(this, arguments);
 }

 PhotoWall.prototype = {
 	initialize: function(obj, aData){
 		this.photos = getByClass('photos', obj);
 		this.aData = aData;
 		this.oParent = obj ;
 		this.create();
 	},
 	create: function(){
 		var container = document.createDocumentFragment();
 		for(var i = 0; i < this.li.length; i++){
 			var li = document.createElement('li');
 			var img = document.createElement('img');
 			img.src = this.aData[i];
 			li.appendChild(img);
 			container.appendChild(li);
 		}
 		oParent.appendChild(container);
		this.aLi = oParent.getElementsByTagName('li'); 		

 	}
 }

 window.onload = function(){
 	var box = getByClass('box');
 	var walls = [];
 	var srcData = [];
 	for(var i = 0; i < 20; i++) srcData.push("./img/" + i + ".jpg");
 	for(var i = 0; i<box.lenght; i++){
 		var object = new PhotoWall(box[i], srcData);
 		walls.push(object);
 	}
 }