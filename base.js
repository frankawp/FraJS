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

function getMouseX(ev){
	var evt = ev||window.event;
	if(evt.PageX){
		return evt.PageX;
	}else{
		return evt.clientX + document.body.scrollLeft - document.body.clientLeft;
	}
}

function getMouseY(ev){
	var evt = ev||window.event;
	if(evt.PageY){
		return evt.PageY;
	}else{
		return evt.clientY + document.body.scrollTop - document.body.clientTop;
	}
}

function getElementX(elem){
	elementX=elem.offsetLeft;
	obj = elem;
	while(obj = obj.offsetParent){
		elementX+=obj.offsetLeft;
	}
	return elementX;
}

function getElementY(elem){
	elementY = elem.offsetTop;
	obj = elem;
	while(obj = obj.offsetParent){
		elementY += obj.offsetTop;
	}
	return elementY;
}

function draggable(elem){	
	elem.style.left = getElementX(elem)+'px';
	elem.style.top = getElementY(elem)+'px';
	elem.style.position='absolute';
	elem.onmousedown = function(e){
		this.moving = true;
		this.gapX = getMouseX(e) - getElementX(this);
		this.gapY = getMouseY(e) - getElementY(this);
	};
	elem.onmouseup = function(e){
		this.moving = false;
	};
	elem.onmousemove = function(e){
		if(this.moving){
			this.style.left = (getMouseX(e)-this.gapX) + 'px';
			this.style.top = (getMouseY(e)-this.gapY) + 'px';
		}
	};	
}
