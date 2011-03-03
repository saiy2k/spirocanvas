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
Then, based on the curveType, drawSpiro() calls either this.drawH() or
this.drawE() in a loop to draw the curve.
*/

SpiroCanvas.spiroCanvasCore = function()
{
	this.loopID		=	-1;			//keeps track of the ID of the Loop. It will be -1, if curve drawing is not happening
	this.angle		=	0.0;		//current angle	
	var angleStep;					//amount of angle to increment on each loop (derived from Points/Curve)
	var currentPointID;				//keeps track of the number of points drawn	
	var oldPoint	=	{x:0, y:0}; //previous point of the spirograph
	
	var strokeColor;
	var shadowColor;
		
	var aMinusb;					//=(R - r), pre-calculated to optimize performance
	var aMinusbOverb;				//=(R - r) / r, pre-calculated to optimize performance
	var aPlusb;						//=(R + r), pre-calculated to optimize performance
	var aPlusbOverb;				//=(R + r) / r, pre-calculated to optimize performance
	
	
	//This Hypotrochoid function will be invoked repeatedly at a rate set by the user.
	//Parametric equation of Hypotrochoid is given by
	//	x(t) = (R-r)*cos(t) + p*cos(((R-r)/r)t)
	//	y(t) = (R-r)*sin(t) - p*cos(((R-r)/r)t)
	this.drawH 		=	function (ct, R, r, p, maxPoints, originPoint)
	{
		var newPoint=	{x:0, y:0};		
		this.angle 		+=	angleStep;
		
		//calculates the point using updated angle and Hypotrochoid formula
		newPoint.x 	=	originPoint.x + aMinusb * Math.cos(this.angle) + p * Math.cos(this.angle * aMinusbOverb);
		newPoint.y 	=	originPoint.y + aMinusb * Math.sin(this.angle) - p * Math.sin(this.angle * aMinusbOverb);
		
		this.drawCircles(originPoint, newPoint, R, r, true);
		
		//draw a shadow behind the spirograph line
		drawShadowLine(ct, oldPoint, newPoint);
		
		//plot a line to the new point
		drawLine(ct, oldPoint, newPoint);
		
		//check if all the points are drawn. if yes, it clears the loop.
		currentPointID++;
		if(currentPointID >= maxPoints)
		{
			ct.closePath();
			self.clearInterval(this.loopID);
			this.loopID 	=	-1;
		}
		
		oldPoint	=	newPoint;
	};
	
	//This Epitrochoid function will be invoked repeatedly at a rate set by the user.
	//Parametric equation of Hypotrochoid is given by
	//	x(t) = (R+r)*cos(t) - p*cos(((R+r)/r)t)
	//	y(t) = (R+r)*sin(t) - p*cos(((R+r)/r)t)
	this.drawE 		=	function (ct, R, r, p, maxPoints, originPoint)
	{
		var newPoint=	{x:0, y:0};
		this.angle += angleStep;
		
		//calculates the point using updated angle and Epitrochoid formula
		newPoint.x	=	originPoint.x + aPlusb * Math.cos(this.angle) - p * Math.cos(this.angle * aPlusbOverb);
		newPoint.y	=	originPoint.y + aPlusb * Math.sin(this.angle) - p * Math.sin(this.angle * aPlusbOverb);
	
		this.drawCircles(originPoint, newPoint, R, r, false);
		
		//draw a shadow behind the spirograph line
		drawShadowLine(ct, oldPoint, newPoint);
		
		//plot a line to the new point
		drawLine(ct, oldPoint, newPoint);
		
		//check if all the points are drawn. if yes, it clears the loop.
		currentPointID++;
		if(currentPointID >= maxPoints)
		{
			ct.closePath();
			self.clearInterval(this.loopID);
			this.loopID 	=	-1;
		}
		
		oldPoint	=	newPoint;
	};

	//This function is invoked when the Redraw button is pressed
	this.drawSpiro 	=	function (canvasSpiroID, canvasBGID, curveData)	
	{
		//if a curve is being drawn, stop it
		if(this.loopID != -1)
		{
			self.clearInterval(this.loopID);
			this.loopID			=	-1;
		}
		
		var R				=	curveData.R;
		var r				=	curveData.r;
		var p				=	curveData.p;
		
		//declare and reset all the variables
		this.angle			=	0;
		currentPointID		=	0;
		var NumRevolutions	=	0;
		var NumPoints		=	0;
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
		angleStep			=	(Math.PI * 2) / curveData.res;
		NumRevolutions		=	r / MMath.HCF (R, r);
		NumPoints			=	curveData.res * NumRevolutions;
		centerPoint.x		=	canvasBase.width / 2;
		centerPoint.y		=	canvasBase.height / 2;
		
		//pre-calculation of frequently required terms
		aMinusb				=	R - r;
		aMinusbOverb		=	aMinusb / r;
		aPlusb				=	R + r;
		aPlusbOverb			=	aPlusb / r;
		
		//sets the context colors
		ct.strokeStyle		=	prepareLinearGradient(ct, curveData.color);
		var rgbColor		=	hsvToRgb(curveData.color.h, curveData.color.s, curveData.color.v);
		shadowColor			=	'rgba(' + (255 - rgbColor.r) + ', ' + (255 - rgbColor.g) + ', ' + (255 - rgbColor.b) + ', ' + 0.2 + ')';
		
		//based on the curveType, call corresponding functions repeatedly
		if (curveType == "hypotrochoid")
		{
			oldPoint.x		=	centerPoint.x + R - r + p;
			oldPoint.y		=	centerPoint.y;
			var obj			=	this;
			this.loopID		=	self.setInterval( function() { obj.drawH(ct, R, r, p, NumPoints, centerPoint); }, 1 + (25 - curveData.speed) * 5);
		}
		else if(curveType == "epitrochoid")
		{
			oldPoint.x		=	centerPoint.x + R + r - p;
			oldPoint.y		=	centerPoint.y;
			var obj			=	this;
			this.loopID		=	self.setInterval( function() { obj.drawE(ct, R, r, p, NumPoints, centerPoint); }, 1 + (25 - curveData.speed) * 5);
		}
	};
	
	//This function is to draw the spirograph instantly, without the animation (for preview purposes)
	this.drawInstantSpiro 	=	function (canvasID, curveData)	
	{
		var R				=	curveData.R;
		var r				=	curveData.r;
		var p				=	curveData.p;
		
		//declare and reset all the variables
		this.angle			=	0;
		var NumRevolutions	=	0;
		var NumPoints		=	0;
		var centerPoint		=	{x:0, y:0};
		var canvasBase		=	document.getElementById(canvasID);
		var ct				=	canvasBase.getContext('2d');
		
		//calculates the necessary variable to draw the curve
		angleStep			=	(Math.PI * 2) / curveData.res;
		NumRevolutions		=	r / MMath.HCF (R, r);
		NumPoints			=	curveData.res * NumRevolutions;
		centerPoint.x		=	canvasBase.width / 2;
		centerPoint.y		=	canvasBase.height / 2;
		ct.strokeStyle		=	"#" + HSVToHex(curveData.color);
		
		if (!curveData.isEpi)
		{
			oldPoint.x		=	centerPoint.x + R - r + p;
			oldPoint.y		=	centerPoint.y;
			
			aMinusb			=	R - r;
			aMinusbOverb	=	aMinusb / r;
			
			ct.beginPath();
			ct.moveTo(oldPoint.x, oldPoint.y);
			
			for (i = 0; i < NumPoints; i++)
			{
				var newPoint=	{x:0, y:0};		
				this.angle 		+=	angleStep;
		
				//calculates the point using updated angle and Hypotrochoid formula
				newPoint.x 	=	centerPoint.x + aMinusb * Math.cos(this.angle) + p * Math.cos(this.angle * aMinusbOverb);
				newPoint.y 	=	centerPoint.y + aMinusb * Math.sin(this.angle) - p * Math.sin(this.angle * aMinusbOverb);

				ct.lineTo(newPoint.x, newPoint.y);
			}
			
			ct.stroke();
			ct.closePath();
		}
		else if(curveData.isEpi)
		{
			oldPoint.x		=	centerPoint.x + R + r - p;
			oldPoint.y		=	centerPoint.y;
			
			aPlusb			=	R + r;
			aPlusbOverb		=	aPlusb / r;
			
			ct.beginPath();
			ct.moveTo(oldPoint.x, oldPoint.y);
			
			for (i = 0; i < NumPoints; i++)
			{
				var newPoint=	{x:0, y:0};		
				this.angle 		+=	angleStep;
		
				//calculates the point using updated angle and Epitrochoid formula
				newPoint.x	=	centerPoint.x + aPlusb * Math.cos(this.angle) - p * Math.cos(this.angle * aPlusbOverb);
				newPoint.y	=	centerPoint.y + aPlusb * Math.sin(this.angle) - p * Math.sin(this.angle * aPlusbOverb);
				
				ct.lineTo(newPoint.x, newPoint.y);
			}
			
			ct.stroke();
			ct.closePath();
		}
	};
	
	//clear the spirograph
	this.clearSpiro	=	function (canvasID, color)
	{
		//if a curve is being drawn, stop it
		if(this.loopID != -1)
		{
			self.clearInterval(this.loopID);
			this.loopID			=	-1;
		}
		
		var	ctx				=	document.getElementById(canvasID).getContext('2d');
		
		var rgb				=	hsvToRgb(color.h, color.s, color.v);
		ctx.fillStyle		=	'#' + RGBtoHex(rgb.r, rgb.g, rgb.b);
		ctx.fillRect(0, 0, 800, 600);
	};
	
	//draw the drawing circles
	this.drawCircles 	=	function(centerPoint, newPoint, R, r, inOrOut)
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
			c2Point.x			=	centerPoint.x + (R - r) * Math.cos(this.angle);
			c2Point.y			=	centerPoint.y + (R - r) * Math.sin(this.angle);
		}
		else
		{
			c2Point.x			=	centerPoint.x + (R + r) * Math.cos(this.angle);
			c2Point.y			=	centerPoint.y + (R + r) * Math.sin(this.angle);
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
	
	function drawShadowLine(ct, point1, point2)
	{	
		ct.save();
		ct.strokeStyle		=	shadowColor;
		ct.lineWidth		=	3;
		ct.beginPath();
		ct.moveTo(point1.x, point1.y);
		ct.lineTo(point2.x, point2.y);
		ct.stroke();
		ct.closePath();
		ct.restore();
	}
	
	function drawLine(ct, point1, point2)
	{			
		ct.beginPath();
		ct.moveTo(point1.x, point1.y);
		ct.lineTo(point2.x, point2.y);
		ct.stroke();
		ct.closePath();
	}
		
	function prepareLinearGradient(ct, color)
	{
		var foreRGB1		=	hsvToRgb(color.h, color.s, color.v);
		var foreRGB2;
		if (color.v - 0.2 < 0)
		{
			foreRGB2		=	hsvToRgb(color.h, color.s, color.v + 0.2);
		}
		else
		{
			foreRGB2		=	hsvToRgb(color.h, color.s, color.v - 0.2);
		}
		
		var foreHEX1		=	"#" + RGBtoHex(foreRGB1.r, foreRGB1.g, foreRGB1.b);
		var foreHEX2		=	"#" + RGBtoHex(foreRGB2.r, foreRGB2.g, foreRGB2.b);
		var lingrad 		=	ct.createLinearGradient(0,0,300,600);
			lingrad.addColorStop(0,		foreHEX1);
			lingrad.addColorStop(0.7,	foreHEX2);
		
		return lingrad;
	}
	
	function HSVToHex(hsv)
	{
		var rgb		=	hsvToRgb(hsv.h, hsv.s, hsv.v);
		var hex		=	RGBtoHex(rgb.r, rgb.g, rgb.b);
		
		return			hex;
	}
	
	function hsvToRgb(h, s, v)
	{
		var r, g, b;

		var i = Math.floor(h * 6);
		var f = h * 6 - i;
		var p = v * (1 - s);
		var q = v * (1 - f * s);
		var t = v * (1 - (1 - f) * s);

		switch(i % 6){
			case 0: r = v, g = t, b = p; break;
			case 1: r = q, g = v, b = p; break;
			case 2: r = p, g = v, b = t; break;
			case 3: r = p, g = q, b = v; break;
			case 4: r = t, g = p, b = v; break;
			case 5: r = v, g = p, b = q; break;
		}

		return { r:r * 255, g:g * 255, b:b * 255 };
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
};