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
	var angleStep;					//amount of angle to increment on each loop (derived from Points/Curve)
	var angle;						//current angle	
	var currentPointID;				//keeps track of the number of points drawn	
	var loopID		=	-1;			//keeps track of the ID of the Loop. It will be -1, if curve drawing is not happening
	var oldPoint	=	{x:0, y:0}; //previous point of the spirograph
	var penColorRGB	=	{r:0, g:0, b:0};	//color of the spirograph
	
	var aMinusb;					//=(R - r), pre-calculated to optimize performance
	var aMinusbOverb;				//=(R - r) / r, pre-calculated to optimize performance
	var aPlusb;						//=(R + r), pre-calculated to optimize performance
	var aPlusbOverb;				//=(R + r) / r, pre-calculated to optimize performance
	
	
	//This Hypotrochoid function will be invoked repeatedly at a rate set by the user.
	//Parametric equation of Hypotrochoid is given by
	//	x(t) = (R-r)*cos(t) + p*cos(((R-r)/r)t)
	//	y(t) = (R-r)*sin(t) - p*cos(((R-r)/r)t)
	my.drawH 		=	function (ct, R, r, p, maxPoints, originPoint)
	{
		var newPoint=	{x:0, y:0};		
		angle 		+=	angleStep;
		
		//calculates the point using updated angle and Hypotrochoid formula
		newPoint.x 	=	originPoint.x + aMinusb * Math.cos(angle) + p * Math.cos(angle * aMinusbOverb);
		newPoint.y 	=	originPoint.y + aMinusb * Math.sin(angle) - p * Math.sin(angle * aMinusbOverb);
		
		//draw the "drawing circles"
		my.drawCircles(originPoint, newPoint, R, r, true);

		//draw a shadow behind the spirograph line
		ct.save();
		ct.strokeStyle	=	'rgba(125, 125, 125, 0.2)';
		ct.lineWidth	=	5;
		ct.beginPath();
		ct.moveTo(oldPoint.x, oldPoint.y);
		ct.lineTo(newPoint.x, newPoint.y);
		ct.stroke();
		ct.closePath();
		ct.restore();
		
		//plot a line to the new point
		ct.beginPath();
		ct.moveTo(oldPoint.x, oldPoint.y);
		ct.lineTo(Math.floor(newPoint.x), Math.floor(newPoint.y));
		ct.stroke();
		ct.closePath();
		
		//check if all the points are drawn. if yes, it clears the loop.
		currentPointID++;
		if(currentPointID >= maxPoints)
		{
			ct.closePath();
			self.clearInterval(loopID);
			loopID 	=	-1;
		}
		
		oldPoint	=	newPoint;
	};
	
	//This Epitrochoid function will be invoked repeatedly at a rate set by the user.
	//Parametric equation of Hypotrochoid is given by
	//	x(t) = (R+r)*cos(t) - p*cos(((R+r)/r)t)
	//	y(t) = (R+r)*sin(t) - p*cos(((R+r)/r)t)
	my.drawE 		=	function (ct, R, r, p, maxPoints, originPoint)
	{
		var newPoint=	{x:0, y:0};
		angle += angleStep;
		
		//calculates the point using updated angle and Hypotrochoid formula
		newPoint.x	=	originPoint.x + aPlusb * Math.cos(angle) - p * Math.cos(angle * aPlusbOverb);
		newPoint.y	=	originPoint.y + aPlusb * Math.sin(angle) - p * Math.sin(angle * aPlusbOverb);
		
		//draw the "drawing circles"
		my.drawCircles(originPoint, newPoint, R, r, false);
		
		//draw a shadow behind the spirograph line
		ct.save();
		ct.strokeStyle		=	'rgba(125, 125, 125, 0.2)';
		ct.lineWidth	=	5;
		ct.beginPath();
		ct.moveTo(oldPoint.x, oldPoint.y);
		ct.lineTo(newPoint.x, newPoint.y);
		ct.stroke();
		ct.closePath();
		ct.restore();
		
		
		//plot a line to the new point
		ct.beginPath();
		ct.moveTo(oldPoint.x, oldPoint.y);
		ct.lineTo(Math.floor(newPoint.x), Math.floor(newPoint.y));
		ct.stroke();
		ct.closePath();
		
		//check if all the points are drawn. if yes, it clears the loop.
		currentPointID++;
		if(currentPointID >= maxPoints)
		{
			ct.closePath();
			self.clearInterval(loopID);
			loopID 	=	-1;
		}
		
		oldPoint	=	newPoint;
	};

	//This function is invoked when the Redraw button is pressed
	my.drawSpiro 	=	function (canvasSpiroID, canvasBGID, speed, R, r, p, foreColorHSV, bgColorHSV, res)	
	{
		//if a curve is being drawn, stop it
		if(loopID != -1)
		{
			self.clearInterval(loopID);
			loopID			=	-1;
		}
		
		//declare and reset all the variables
		angle				=	0;
		currentPointID		=	0;
		var NumRevolutions	=	0;
		var NumPoints		=	0;
		var PointsPerCurve	=	res;
		var centerPoint		=	{x:0, y:0};
		var curveType		=	"";
		canvasBase			=	document.getElementById(canvasSpiroID);
		ct					=	canvasBase.getContext('2d');
		
		//if r is negative, set curveType as hypotrochoid
		//otherwise, make it as epitrochoid.
		if ( r < 0 )
		{
			r				*=	-1;
			curveType		=	"hypotrochoid";
		}
		else
		{
			curveType		=	"epitrochoid";
		}
		
		//calculates the necessary variable to draw the curve
		angleStep			=	(Math.PI * 2) / PointsPerCurve;
		NumRevolutions		=	r / MMath.HCF (R, r);
		NumPoints			=	PointsPerCurve * NumRevolutions;
		centerPoint.x		=	canvasBase.width / 2;
		centerPoint.y		=	canvasBase.height / 2;
		
		//pre-calculation of frequently required terms
		aMinusb				=	R - r;
		aMinusbOverb		=	aMinusb / r;
		aPlusb				=	R + r;
		aPlusbOverb			=	aPlusb / r;
		
		//sets the context colors
		var bgRGB			=	$.jPicker.ColorMethods.hsvToRgb(bgColorHSV);
		var bgHEX			=	RGBtoHex(bgRGB.r, bgRGB.g, bgRGB.b);
		var foreRGB1		=	$.jPicker.ColorMethods.hsvToRgb(foreColorHSV);
		var foreRGB2		=	$.jPicker.ColorMethods.hsvToRgb( { h:foreColorHSV.h - 20, s:foreColorHSV.s - 20, v:foreColorHSV.v + 20} );
		var foreHEX1		=	"#" + RGBtoHex(foreRGB1.r, foreRGB1.g, foreRGB1.b);
		var foreHEX2		=	"#" + RGBtoHex(foreRGB2.r, foreRGB2.g, foreRGB2.b);
		penColorRGB			=	foreRGB1;
		var lingrad 		=	ct.createLinearGradient(0,0,300,600);
			lingrad.addColorStop(0,		foreHEX1);
			lingrad.addColorStop(0.6,	foreHEX2);
		ct.fillStyle		=	"#" + bgHEX;
		ct.strokeStyle		=	lingrad;
		
		//based on the curveType, call corresponding functions repeatedly
		if (curveType == "hypotrochoid")
		{
			oldPoint.x		=	centerPoint.x + R - r + p;
			oldPoint.y		=	centerPoint.y;
			loopID			=	self.setInterval( function() { my.drawH(ct, R, r, p, NumPoints, centerPoint); }, 1 + (25 - speed) * 5);
		}
		else if(curveType == "epitrochoid")
		{
			oldPoint.x		=	centerPoint.x + R + r - p;
			oldPoint.y		=	centerPoint.y;
			loopID			=	self.setInterval( function() { my.drawE(ct, R, r, p, NumPoints, centerPoint); }, 1 + (25 - speed) * 5);
		}
	};
	
	//clear the spirograph
	my.clearSpiro	=	function (canvasSpiroID)
	{
		//if a curve is being drawn, stop it
		if(loopID != -1)
		{
			self.clearInterval(loopID);
			loopID			=	-1;
		}
		
		canvasBase			=	document.getElementById(canvasSpiroID);
		ct					=	canvasBase.getContext('2d');
		
		ct.clearRect(0, 0, 800, 600);
	};
	
	//draw the drawing circles
	my.drawCircles 	=	function(centerPoint, newPoint, R, r, inOrOut)
	{
		var canvasBG		=	document.getElementById('canvasCircle');
		var ct				=	canvasBG.getContext('2d');
		var c2Point			=	{x:0, y:0}; 
		ct.fillStyle		=	"#666666";
		ct.strokeStyle		=	"#888888";
		ct.clearRect(0, 0, 800, 600);
		
		//draws the fixed circle
		ct.beginPath();
		ct.arc(centerPoint.x, centerPoint.y, R, 0, 6.28, 0);
		ct.stroke();
		ct.closePath();
		
		//finds the co-ordinate to draw the moving circle
		if (inOrOut)
		{
			c2Point.x			=	centerPoint.x + (R - r) * Math.cos(angle);
			c2Point.y			=	centerPoint.y + (R - r) * Math.sin(angle);
		}
		else
		{
			c2Point.x			=	centerPoint.x + (R + r) * Math.cos(angle);
			c2Point.y			=	centerPoint.y + (R + r) * Math.sin(angle);
		}
		//draws the moving circle
		ct.beginPath();
		ct.arc(c2Point.x, c2Point.y, r, 0, 6.28, 0);
		ct.stroke();
		ct.closePath();

		//draw the drawing line
		ct.beginPath();
		ct.moveTo(c2Point.x, c2Point.y);
		ct.lineTo(newPoint.x, newPoint.y);
		ct.stroke();
		ct.closePath();
	};
	
	//function to fill the background with shades of selected color
	my.drawBG		=	function(canvasBGID, hsv)
	{
		var canvasBG		=	document.getElementById(canvasBGID);
		var ct				=	canvasBG.getContext('2d');
		
		var bgRGB1			=	$.jPicker.ColorMethods.hsvToRgb(hsv);
		var bgRGB2			=	$.jPicker.ColorMethods.hsvToRgb( { h:hsv.h, s:hsv.s - 10, v:hsv.v + 10} );
		var bgHex1			=	"#" + RGBtoHex(bgRGB1.r, bgRGB1.g, bgRGB1.b);
		var bgHex2			=	"#" + RGBtoHex(bgRGB2.r, bgRGB2.g, bgRGB2.b);
		var lingrad 		=	ct.createLinearGradient(0,0,300,600);
			lingrad.addColorStop(0,		bgHex1);
			lingrad.addColorStop(0.7,	bgHex2);
			lingrad.addColorStop(1,		bgHex1);
		ct.fillStyle		=	lingrad;
		ct.clearRect(0, 0, canvasBG.width, canvasBG.height);
		ct.fillRect(0, 0, canvasBG.width, canvasBG.height);
	}
	
	function RGBtoHex(R,G,B)
	{
		return toHex(R)+toHex(G)+toHex(B)
	}
	
	function toHex(N)
	{
		if (N==null)
			return "00";
		N=parseInt(N);
		if (N==0 || isNaN(N))
			return "00";
		N=Math.max(0,N);
		N=Math.min(N,255);
		N=Math.round(N);
		return "0123456789ABCDEF".charAt((N-N%16)/16) + "0123456789ABCDEF".charAt(N%16);
	}
	
	return my;
}());