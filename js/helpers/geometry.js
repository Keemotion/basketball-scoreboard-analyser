define([], function(){
	var Geometry = function(){

	};
	Geometry.determinant = function(a, b, c, d){
		return a * d - b * c;
	};
	//returns whether the line segment [pq] intersects with the line segment [line1, line2]
	Geometry.intersects = function(line1x, line1y, line2x, line2y, px, py, qx, qy){
		var d = Geometry.determinant(qx - px, line1x - line2x, qy - py, line1y - line2y);
		var dk = Geometry.determinant(line1x - px, line1x - line2x, line1y - py, line1y - line2y);
		var dl = Geometry.determinant(qx - px, line1x - px, qy - py, line1y - py);
		var k = dk * 1.0 / d;
		var l = dl * 1.0 / d;
		return 0 <= k && k <= 1.0 && 0 <= l && l <= 1.0;
	};
	Geometry.insidePolygon = function(points, cx, cy){
		var intersection_amount = 0;
		var px = Math.random() * 10000.0 + 10000.0;
		var py = Math.random() * 10000.0 + 10000.0;
		for(var i = 0; i < points.length; ++i){
			if(Geometry.intersects(points[i].x, points[i].y, points[(i + points.length - 1) % points.length].x, points[(i + points.length - 1) % points.length].y, cx, cy, px, py)){
				intersection_amount++;
			}
		}
		return intersection_amount % 2 == 1;
	};
	Geometry.crossProduct = function(c1, c2){
		return c1.getX()*c2.getY()-c1.getY()*c2.getX();
	};
	return Geometry;
});