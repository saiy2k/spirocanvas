/*
Copyright 2011 Saiyasodharan (http://saiy2k.blogspot.com/)

This file is part of SpiroCanvas (http://code.google.com/p/spirocanvas/)

SpiroCanvas is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

SpiroCanvas is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with SpiroCanvas.  If not, see <http://www.gnu.org/licenses/>.
*/

/*
This class contains the core logic for drawing the spirographs.
As of now, there are two types of curves supported:
1. Epitrochoid
2. Hypotrochoid
There is a function named drawSpiro(), which will be invoked when
the Redraw button is clicked, with all the required parameters.
Then, based on the curveType, drawSpiro() calls either drawH() or
drawE() in a loop to draw the curve.
*/

var spiroCanvasCore = (function()
{
	var my 			=	{};
	var angleStep;		
	var angle;
	var aMinusb;
	var aMinusbOverb;
	var aPlusb;
	var aPlusbOverb;
	var count;
	var loopID		=	-1;
	
	//This function draws the Hypotrochoid
	my.drawH 		=	function (ct, R, r, p, maxPoints, originPoint)
	{
		var newPoint=	{x:0, y:0};		
		angle 		+=	angleStep;
		newPoint.x 	=	originPoint.x + aMinusb * Math.cos(angle) + p * Math.cos(angle * aMinusbOverb);
		newPoint.y 	=	originPoint.y + aMinusb * Math.sin(angle) - p * Math.sin(angle * aMinusbOverb);

		ct.lineTo(newPoint.x, newPoint.y);
		ct.stroke();
		
		count++;
			
		if(count >= maxPoints)
		{
			ct.closePath();
			self.clearInterval(loopID);
			loopID 	=	-1;
		}
	};
	
	//This function draws the Epitrochoid
	my.drawE 		=	function (ct, R, r, p, maxPoints, originPoint)
	{
		var newPoint=	{x:0, y:0};
		angle += angleStep;
		newPoint.x	=	originPoint.x + aPlusb * Math.cos(angle) - p * Math.cos(angle * aPlusbOverb);
		newPoint.y	=	originPoint.y + aPlusb * Math.sin(angle) - p * Math.sin(angle * aPlusbOverb);
		
		ct.lineTo(Math.floor(newPoint.x), Math.floor(newPoint.y));
		ct.stroke();
		
		count++;

		if(count >= maxPoints)
		{
			ct.closePath();
			self.clearInterval(loopID);
			loopID 	=	-1;
		}
	};

	//This function is invoked when the Redraw button is pressed
	my.drawSpiro 	=	function (canvasEle, curveType, speed, R, r, p, foreColor, bgColor)	
	{
		if(loopID != -1)
		{
			self.clearInterval(loopID);
		}
	
		angle				=	0;
		var NumRevolutions	=	0;
		var NumPoints		=	0;
		var PointsPerCurve	=	2;
		var oldPoint		=	{x:0, y:0};
		var ptOrigin		=	{x:0, y:0};
		
		var canvasBase		=	document.getElementById(canvasEle);
		ptOrigin.x 			=	canvasBase.width / 2;
		ptOrigin.y			=	canvasBase.height / 2;
		angleStep			=	(Math.PI * 2) / PointsPerCurve;
		NumRevolutions		=	r / MMath.HCF (R, r);
		NumPoints			=	PointsPerCurve * NumRevolutions;
		
		aMinusb				=	R - r;
		aMinusbOverb		=	aMinusb / r;
		aPlusb				=	R + r;
		aPlusbOverb			=	aPlusb / r;
		count				=	0;
		var	ct				=	canvasBase.getContext('2d');
		ct.fillStyle		=	"#" + bgColor;
		ct.strokeStyle		=	"#" + foreColor;
		if (curveType == 0)
		{
			oldPoint.x		=	ptOrigin.x + R - r + p;
			oldPoint.y		=	ptOrigin.y;
			ct.clearRect(0, 0, canvasBase.width, canvasBase.height);
			ct.fillRect(0, 0, canvasBase.width, canvasBase.height);
			ct.beginPath();
			ct.moveTo(oldPoint.x, oldPoint.y);
			loopID			=	self.setInterval( function() { my.drawH(ct, R, r, p, NumPoints, ptOrigin); }, 1 + (10 - speed) * 5);
		}
		else if(curveType == 1)
		{
			oldPoint.x		=	ptOrigin.x + R + r - p;
			oldPoint.y		=	ptOrigin.y;
			ct.clearRect(0, 0, canvasBase.width, canvasBase.height);
			ct.fillRect(0, 0, canvasBase.width, canvasBase.height);
			ct.beginPath();
			ct.moveTo(oldPoint.x, oldPoint.y);
			loopID			=	self.setInterval( function() { my.drawE(ct, R, r, p, NumPoints, ptOrigin); }, 1 + (10 - speed) * 5);
		}
	};
	
	return my;
}());