define([], function(){
	var BoundingRectangle = function(){
		this.left = null;
		this.top = null;
		this.right = null;
		this.bottom = null;
	};
	BoundingRectangle.prototype.updateX = function(x){
		this.updateLeft(x);
		this.updateRight(x);
	};
	BoundingRectangle.prototype.updateY = function(y){
		this.updateTop(y);
		this.updateBottom(y);
	};
	BoundingRectangle.prototype.updateCoordinate = function(coordinate){
		this.updateX(coordinate.getX());
		this.updateY(coordinate.getY());
	};
	BoundingRectangle.prototype.updateLeft = function(new_left){
		if(this.left == null){
			this.left = new_left;
		}else{
			this.left = Math.min(this.left, new_left);
		}
	};
	BoundingRectangle.prototype.updateTop = function(new_top){
		if(this.top == null){
			this.top = new_top;
		}else{
			this.top = Math.min(this.top, new_top);
		}
	};
	BoundingRectangle.prototype.updateRight = function(new_right){
		if(this.right == null){
			this.right = new_right;
		}else{
			this.right = Math.max(this.right, new_right);
		}
	};
	BoundingRectangle.prototype.updateBottom = function(new_bottom){
		if(this.bottom == null){
			this.bottom = new_bottom;
		}else{
			this.bottom = Math.max(this.bottom, new_bottom);
		}
	};
	BoundingRectangle.prototype.getLeft = function(){
		return this.left;
	};
	BoundingRectangle.prototype.getRight = function(){
		return this.right;
	};
	BoundingRectangle.prototype.getBottom = function(){
		return this.bottom;
	};
	BoundingRectangle.prototype.getTop = function(){
		return this.top;
	};
	return BoundingRectangle;
});