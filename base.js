/**
 * @author frank
 */
function $id(id) {
	if(id == undefined)
		return;
	if( typeof id == 'string') {
		return document.getElementById(id);
	} else {
		if( typeof id == 'Object')
			return id;
	}
}

function getMouseX(ev) {
	var evt = ev || window.event;
	if(evt.PageX) {
		return evt.PageX;
	} else {
		return evt.clientX + document.body.scrollLeft - document.body.clientLeft;
	}
}

function getMouseY(ev) {
	var evt = ev || window.event;
	if(evt.PageY) {
		return evt.PageY;
	} else {
		return evt.clientY + document.body.scrollTop - document.body.clientTop;
	}
}

function getElementX(elem) {
	elementX = elem.offsetLeft;
	obj = elem;
	while( obj = obj.offsetParent) {
		elementX += obj.offsetLeft;
	}
	return elementX;
}

function getElementY(elem) {
	elementY = elem.offsetTop;
	obj = elem;
	while( obj = obj.offsetParent) {
		elementY += obj.offsetTop;
	}
	return elementY;
}

function draggable(elem) {
	elem.style.left = getElementX(elem) + 'px';
	elem.style.top = getElementY(elem) + 'px';
	elem.style.position = 'absolute';
	elem.onmousedown = function(e) {
		this.moving = true;
		this.gapX = getMouseX(e) - getElementX(this);
		this.gapY = getMouseY(e) - getElementY(this);
	};
	elem.onmouseup = function(e) {
		this.moving = false;
	};
	elem.onmousemove = function(e) {
		if(this.moving) {
			this.style.left = (getMouseX(e) - this.gapX) + 'px';
			this.style.top = (getMouseY(e) - this.gapY) + 'px';
		}
	};
}

function $extend(destination, source) {
	for(var name in source) {
		destination[name] = source[name];
	}
}

function $Sys() {
	var Sys = {};
	var ua = navigator.userAgent.toLowerCase();
	var s; ( s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1] : ( s = ua.match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1] : ( s = ua.match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1] : ( s = ua.match(/opera.([\d.]+)/)) ? Sys.opera = s[1] : ( s = ua.match(/version\/([\d.]+).*safari/)) ? Sys.safari = s[1] : 0;
	return Sys;
}

function bind(fn, context) {
	if(arguments.length < 2 && context === undefined)
		return fn;
	var method = fn, slice = Array.prototype.slice, args = slice.call(arguments, 2);
	return function() {//这里传入原fn的参数
		var array = slice.call(arguments, 0);
		method.apply(context, args.concat(array))
	}
}

function LightBox(options) {
	this.options = {};
	$extend(this.options, options);
	this.Lay = $id(this.options.Lay) || document.body.insertBefore(document.createElement("div"), document.body.childNodes[0]);
	this.Lay.style.background = '#ccc';
	this.Lay.style.opacity = "0.5";
	this.Lay.innerHTML = '<iframe style="position:absolute;top:0;left:0;width:100%;height:100%;filter:alpha(opacity=0);"></iframe>';
	this.zIndex = 1000;
	this._resize = bind(function() {
		this.Lay.style.width = Math.max(document.documentElement.clientWidth, document.documentElement.scrollWidth) + 'px';
		this.Lay.style.height = Math.max(document.documentElement.clientHeight, document.documentElement.scrollHeight) + 'px';
	}, this);
	if($Sys().ie == '6.0') {
		this.Lay.style.position = 'absolute';
		this._resize();
		window.attachEvent("onresize", this._resize);
	} else {
		with(this.Lay.style) {
			//display = "none";
			zIndex = this.zIndex;
			left = top = 0;
			position = "fixed";
			width = height = "100%";
		}
	}
	this.Box = $id(this.options.Box) || document.body.insertBefore(document.createElement("div"), document.body.childNodes[0]);
	with(this.Box.style) {
		position = "fixed";
		background = '#fff';
		zIndex = this.zIndex + 1;
		width = height = "200px";
		left = (document.documentElement.clientWidth - this.Box.offsetWidth) / 2 + document.documentElement.scrollLeft - document.documentElement.clientLeft + 'px';
		top = (document.documentElement.clientHeight - this.Box.offsetHeight) / 2 + document.documentElement.scrollTop - document.documentElement.clientTop + 'px';
	}

}

function towerDisplay(id, n) {
	this.count = n;
	this.name = id;
	this.tower = $id(id);
	this.topNode = null;
	width = $id('towerA').offsetWidth;

	for( i = n; i > 0; i--) {
		temp = document.createElement('div');
		width -= 40;
		temp.style.width = width + 'px';
		temp.style.height = 100 + 'px';
		temp.style.border = '1px #ccc solid';
		temp.style.margin = '0 auto';
		if(!this.topNode) {
			this.tower.appendChild(temp);
			this.topNode = temp;
		} else {
			this.tower.insertBefore(temp, this.topNode);
			this.topNode = temp;
		}
	}
};

towerDisplay.prototype.moveViewIn = function(elem) {
	if(this.topNode) {
		this.tower.insertBefore(elem, this.topNode);
	} else {
		this.tower.appendChild(elem);
	}
	this.count++;
	this.topNode = elem;
}
towerDisplay.prototype.moveViewOut = function() {

	if(this.topNode == null) {
		return false;
	} else {
		this.count--;
		temp = this.topNode;
		x = this.topNode.nextSibling;
		while(x && x.nodeType != 1) {
			x = x.nextSibling;
		}
		this.topNode = x;
		this.tower.removeChild(temp);
		return temp;
	}
}
var time = 200;
function delay(obj, func, args, t) {
	setTimeout(function() {
		func.apply(obj, args);
	}, time);
	time = time + t;
}

function hanoi(num) {
	this.towerA = new towerDisplay('towerA', num);
	this.towerB = new towerDisplay('towerB', 0);
	this.towerC = new towerDisplay('towerC', 0);
	this.moveTower = function(towerStart, towerTarget) {
		towerTarget.moveViewIn(towerStart.moveViewOut());
		console.log(towerStart.name + ' move to ' + towerTarget.name);
	};
	this.move = function(count, start, target, temp) {
		if(count == 1) {
			delay(this, this.moveTower, [start, target], 200);
			//this.moveTower(start, target);
		} else {
			this.move(count - 1, start, temp, target);
			this.move(1, start, target, temp);
			this.move(count - 1, temp, target, start);
		}
	};
	this.start = function() {
		this.move(this.towerA.count, this.towerA, this.towerC, this.towerB);
	}
}

function caculate(exp) {
	if( typeof exp != "string") {
		return;
	}
	var str = new String(exp);
	var nums = str.match(/\d+/g);
	var operator = str.match(/[\+\-\*\/\(\)]/g);
	var stack = [];
	while( temp = nums.shift()) {
		if(stack.length == 0 || stack[stack.length - 1] == "+" || stack[stack.length - 1] == "-" || stack[stack.length - 1] == "(") {
			stack.push(temp);
		} else {
			var op = stack.pop();
			if(op == '*') {
				stack.push(stack.pop() * temp);
			} else {
				stack.push(stack.pop() / temp);
			}
		}
		var op = operator.shift();
		if(op != ")" && typeof op != "undefined") {
			stack.push(op);
		} else {
			//unfinished
		}
	}
}

function slider(container, sources, count, option) {
	this._container = $id(container);
	this._sources = sources;
	this._count = this._sources.length;
	this._target = 0;
	this.index = 0;
	this._b = this._c = this._t = 0;
	this._d = 100;
	this._timer = null;
	this.setOption(option);
	var p = this._container.style.position; p == "relative" || p == "absolute" || (this._container.style.position = "relative");
	this._container.style.overflow = "hidden";
	this._slider = document.createElement("div");
	if(this.option.vertical) {
		this._slider.style.height = this._container.clientHeight * sources.length+ "px";
	} else {
		this._slider.style.width = this._container.clientWidth * sources.length+ "px";
	}
	for(var imgIdx in sources) {
		var img = document.createElement("img");
		img.src = sources[imgIdx];
		img.width = this._container.clientWidth;
		img.height = this._container.clientHeight;
		this._slider.appendChild(img);
	}
	this._slider.style.position = "absolute";
	this._container.appendChild(this._slider);
};

slider.prototype = {
	setOption : function(option) {
		this.option = {
			start : 0,
			vertical : false,
			auto : true,
			change : 0,
			duration : 50,
			time : 10,
			pause : 2000,
			onStart : function() {
			},
			onFinish : function() {
			},
			Tween : Tween.Bounce.easeOut
		}
		$extend(this.option, option);
	},
	run : function(index) {
		index = this.index%this._count; 
		
		index < 0 && ( index = this._count - 1) ;
		this._t = 0;
		this._b = this.option.start * (this.option.vertical ? this._container.clientHeight : this._container.clientWidth); 
		this._c = (index - this.option.start) * (this.option.vertical ? this._container.clientHeight : this._container.clientWidth);

		this.option.onStart();
		this.move();
		this.option.start=index;
	},
	moveTo : function(pos) {
		if(this.option.vertical)
			this._slider.style.top = -pos + "px";
		else
			this._slider.style.left = -pos + "px";
	},
	move : function() {
		clearTimeout(this._timer);
		//未到达目标继续移动否则进行下一次滑动
		if(this._c && this._t < this._d) {
			this.moveTo(Math.round(this.option.Tween(this._t++, this._b, this._c, this._d)));
			this._timer = setTimeout(bind(this.move,this), this.option.time);
		} else {
			this.moveTo(this._b+this._c);
			this.option.auto && (this._timer = setTimeout(bind(this.Next,this), this.option.pause));
		}
	},
	Next : function() {
		this.run(++this.index);
	},
	//上一个
	Previous : function() {
		this.run(--this.index);
	},
	//停止
	Stop : function() {
		clearTimeout(this._timer);
		this.moveTo(this._b+this._c);
	}
}