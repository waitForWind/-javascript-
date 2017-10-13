window.onload = function(){
	var container = document.getElementById('container');
	var scoreText = document.getElementById('score');
	var panel = document.getElementById('panel');
	var stars = document.getElementById('stars');
	var aLi = stars.getElementsByTagName('li'); 
	console.log(aLi.length);
	var score = 0;

	var msg = [
				"很不满意|差得太离谱，与卖家描述的严重不符，非常不满",
				"不满意|部分有破损，与卖家描述的不符，不满意",
				"一般|质量一般，没有卖家描述的那么好",
				"满意|质量不错，与卖家描述的基本一致，还是挺满意的",
				"非常满意|质量非常好，与卖家描述的完全一致，非常满意"
				];	
	// alert(aLi.length);
	for(var i=0;i<aLi.length; i++){
		aLi[i].index = i;
		aLi[i].onmouseover = function(){
			//鼠标移动到星星上时,给该元素之前的所有兄弟节点都加上"on"类
			fnPoint(this.index);
			panel.style.display = "block";
			panel.style.left = stars.offsetLeft + this.index * this.offsetWidth - 80 + "px"; 
			// alert(this.index);
			panel.innerHTML = "<b style='color:red;'>" + (this.index + 1) + "星&nbsp;" + msg[this.index].match(/(.+)\|/)[1] + "</b>" +"<br/>" + msg[this.index].match(/\|(.+)/)[1];
		}

		//鼠标离开
		aLi[i].onmouseout = function(){
			panel.style.display = "none";
			fnPoint();
		}

		aLi[i].onclick =function(){
			score = this.index;
			fnPoint();
			scoreText.innerHTML = "<strong style='color:red;'>" + (this.index+1) + "分</strong>" +"&nbsp;(" + msg[this.index].match(/\|(.+)/)[1] + ")";
		}
	}

	function fnPoint(arg){
		var rank = arg || score;
		for(var i=0; i<aLi.length; i++){
			aLi[i].className = (i <= rank) ? "on" : "";
		}
	}


}






