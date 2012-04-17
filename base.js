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

function $extend(destination,source){
	for(var name in source){
		destination[name] = source[name];
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
			this.moveTower(start, target);
		} else {
			this.move(count - 1, start, temp, target);
			this.move(1, start, target, temp);
			this.move(count - 1, temp, target, start);
		}
	};
	this.start = function() {
		this.move(this.towerA.count, this.towerA, this.towerB, this.towerC);
	}
}