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

/**
	@class This class contains the core logic for drawing the spirographs. As of now, there are two types of curves supported: <br>
		1. Epitrochoid <br>
		2. Hypotrochoid <br>
	To draw a curve, drawSpiro() need to be invoked with all the required parameters. Then, based on the curveType, drawSpiro() calls either this.drawH() or this.drawE() in a loop to draw the curve. <br>
*/
SpiroCanvas.spiroCanvasCore = function()
{
	/**	keeps track of the ID of the Loop. It will be -1, if curve drawing is not happening
		@type Number
    */
	this.loopID		=	-1;
	
	/**	current drawing angle
		@type Number
    */
	this.angle		=	0.0;
	
	/**	should use rainbow colors
		@type Boolean
    */
	this.isRainbow	=	false;
	
	/**	should use line gradient
		@type Boolean
    */
	this.isGradient	=	false;
	
	var rainbowDel	=	0.01;
	
	var angleStep;					//amount of angle to increment on each loop (derived from Points/Curve)
	var currentPointID;				//keeps track of the number of points drawn	
	var oldPoint	=	{x:0, y:0}; //previous point of the spirograph
	var centerPoint = 	{x:0, y:0};	//point around which the graph is drawn
	
	var strokeColor;
	var shadowColor;
	var hsvColor;
		
	var aMinusb;					//=(R - r), pre-calculated to optimize performance
	var aMinusbOverb;				//=(R - r) / r, pre-calculated to optimize performance
	var aPlusb;						//=(R + r), pre-calculated to optimize performance
	var aPlusbOverb;				//=(R + r) / r, pre-calculated to optimize performance
	
	var parent;
	
	/**
		This Hypotrochoid function will be invoked repeatedly at a rate set by the user.<br>
		Parametric equation of Hypotrochoid is given by<br>
		x(t) = (R-r)*cos(t) + p*cos(((R-r)/r)t)<br>
		y(t) = (R-r)*sin(t) - p*cos(((R-r)/r)t)<br>
	 * @param {context}		ct		drawing 2D context of the canvas object
	 * @param {number}		R		Radius of fixed circle
	 * @param {number}		r		Radius of moving circle
	 * @param {number}		p		distance of drawing point from moving circle
	 * @param {number} 		maxPoints	the total number of points in this curve
	*/
	this.drawH 		=	function (ct, R, r, p, maxPoints)
	{
		var newPoint=	{x:0, y:0};		
		this.angle 		+=	angleStep;
		
		this.updateColors();
		
		//calculates the point using updated angle and Hypotrochoid formula
		newPoint.x 	=	centerPoint.x + aMinusb * Math.cos(this.angle) + p * Math.cos(this.angle * aMinusbOverb);
		newPoint.y 	=	centerPoint.y + aMinusb * Math.sin(this.angle) - p * Math.sin(this.angle * aMinusbOverb);
		
		this.drawCircles(centerPoint, newPoint, R, r, true);
		
		//draw a shadow behind the spirograph line
		this.drawShadowLine(ct, oldPoint, newPoint);
		
		//plot a line to the new point
		drawLine(ct, oldPoint, newPoint);
		
		//check if all the points are drawn. if yes, it clears the loop.
		currentPointID++;
		if(currentPointID >= maxPoints)	{
			this.stopDrawing();
		}
		
		$( "#progressBar" ).progressbar("value", currentPointID/maxPoints * 100.0);
		
		oldPoint	=	newPoint;
	};
	
	/**
		This Epitrochoid function will be invoked repeatedly at a rate set by the user.
		Parametric equation of Epitrochoid is given by<br>
		x(t) = (R+r)*cos(t) - p*cos(((R+r)/r)t)<br>
		y(t) = (R+r)*sin(t) - p*cos(((R+r)/r)t)<br><br>
	 * @param {context}		ct		drawing 2D context of the canvas object
	 * @param {number}		R		Radius of fixed circle
	 * @param {number}		r		Radius of moving circle
	 * @param {number}		p		distance of drawing point from moving circle
	 * @param {number} 		maxPoints	the total number of points in this curve
	*/
	this.drawE 		=	function (ct, R, r, p, maxPoints)
	{
		var newPoint=	{x:0, y:0};
		this.angle += angleStep;
		
		this.updateColors();
		
		//calculates the point using updated angle and Epitrochoid formula
		newPoint.x	=	centerPoint.x + aPlusb * Math.cos(this.angle) - p * Math.cos(this.angle * aPlusbOverb);
		newPoint.y	=	centerPoint.y + aPlusb * Math.sin(this.angle) - p * Math.sin(this.angle * aPlusbOverb);
	
		this.drawCircles(centerPoint, newPoint, R, r, false);
		
		//draw a shadow behind the spirograph line
		this.drawShadowLine(ct, oldPoint, newPoint);
		
		//plot a line to the new point
		drawLine(ct, oldPoint, newPoint);
		
		//check if all the points are drawn. if yes, it clears the loop.
		currentPointID++;
		if(currentPointID >= maxPoints)
		{
			this.stopDrawing();
		}
		
		$( "#progressBar" ).progressbar("value", currentPointID/maxPoints * 100.0);
		
		oldPoint	=	newPoint;
	};

	/**
		This function is invoked when a curve need to be drawn
	 * @param {id}			canvasSpiroID		id of the canvas to draw to
	 * @param {id}			canvasBGID			id of canvas to fill the Background color
	 * @param {spiroGraph}	curveData			the curve to draw
	*/
	this.drawSpiro 	=	function (canvasSpiroID, canvasBGID, curveData)	
	{
		//if a curve is being drawn, stop it
		if(this.loopID != -1) {
			this.stopDrawing();
		}
		
		var R				=	curveData.R;
		var r				=	curveData.r;
		var p				=	curveData.p;
		var cc				=	new SpiroCanvas.colorConversion();
		
		//declare and reset all the variables
		this.angle			=	0;
		currentPointID		=	0;
		var NumRevolutions	=	0;
		var NumPoints		=	0;
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
		NumRevolutions		=	r / MMath.HCF(R, r);
		NumPoints			=	curveData.res * NumRevolutions;
		
		//pre-calculation of frequently required terms
		aMinusb				=	R - r;
		aMinusbOverb		=	aMinusb / r;
		aPlusb				=	R + r;
		aPlusbOverb			=	aPlusb / r;
		
		//sets the context colors
		if(this.isRainbow)
		{
			hsvColor		=	cc.rgbToHsv(255, 255, 255);
			strokeColor		=	'#' + cc.HSVToHex(hsvColor);
			rainbowDel		=	(1.0 / curveData.res);
		}
		else if(this.isGradient)
		{
			hsvColor		=	curveData.color;
			strokeColor		=	cc.HSVToHex(curveData.color);
			//rainbowDel		=	(1.0 / curveData.res) * 4.0;
			rainbowDel		=	1.0/NumRevolutions;
		}
		else
		{
			strokeColor		=	prepareLinearGradient(ct, curveData.color);
			var rgbColor	=	cc.hsvToRgb(curveData.color.h, curveData.color.s, curveData.color.v);
			shadowColor		=	'rgba(' + (255 - rgbColor.r) + ', ' + (255 - rgbColor.g) + ', ' + (255 - rgbColor.b) + ', ' + 0.2 + ')';
		}
		
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
	
	/**
		This function is to draw the spirograph instantly, without the animation.
	 * @param {id}			canvasID			id of the canvas to draw to
	 * @param {id}			canvasBGID			id of canvas to fill the Background color
	 * @param {spiroGraph}	curveData			the curve to draw
	*/
	this.drawInstantSpiro 	=	function (canvasID, canvasBGID, curveData)	
	{
		var R				=	curveData.R;
		var r				=	curveData.r;
		var p				=	curveData.p;
		var cc				=	new SpiroCanvas.colorConversion();
		
		//declare and reset all the variables
		this.angle			=	0;
		var NumRevolutions	=	0;
		var NumPoints		=	0;
		var canvasBase		=	document.getElementById(canvasID);
		var ct				=	canvasBase.getContext('2d');
		
		//calculates the necessary variable to draw the curve
		angleStep			=	(Math.PI * 2) / curveData.res;
		NumRevolutions		=	r / MMath.HCF (R, r);
		NumPoints			=	curveData.res * NumRevolutions;
		centerPoint.x		=	canvasBase.width / 2;
		centerPoint.y		=	canvasBase.height / 2;
		ct.strokeStyle		=	"#" + cc.HSVToHex(curveData.color);
		
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
	
	/**
		clears the given canvas
	 * @param {id}			canvasID			id of the canvas to draw to
	 * @param {color}		color				the color to fill with
	*/
	this.clearSpiro	=	function (canvasID, color)
	{
		//if a curve is being drawn, stop it
		if(this.loopID != -1)
		{
			this.stopDrawing();
		}
		
		var	ctx				=	document.getElementById(canvasID).getContext('2d');
		var cc				=	new SpiroCanvas.colorConversion();
		
		var rgb				=	hsvToRgb(color.h, color.s, color.v);
		ctx.fillStyle		=	'#' + cc.RGBtoHex(rgb.r, rgb.g, rgb.b);
		ctx.fillRect(0, 0, 800, 600);
	};
	
	/**
		draw the drawing circles
	 * @param {point}		centerPoint			the point around which the curve is drawn
	 * @param {point}		newPoint			current point of the curve
	 * @param {number}		R					Radius of fixed circle
	 * @param {number}		r					Raduys of moving circle
	 * @param {Boolean}		inOrOut				Epi or Hypo
	*/
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
	

	/**	stops the current drawing, if any */
	this.stopDrawing		=	function()
	{
		if(this.loopID != -1)
		{
			ct.closePath();
			self.clearInterval(this.loopID);
			this.loopID 	=	-1;
			this.angle		=	0.0;
			parent.onDrawStop();
		}
	}
	
	/**
		updated the center point to given point
	 * @param {point}		pt				the new center point
	*/
	this.updateCenterPoint	=	function(pt)
	{
		centerPoint			=	pt;
	};
	
	/**
		sets the parent(container) object
	 * @param {Object}		obj				the container object of this
	*/
	this.setDelegate		=	function(obj)
	{
		parent				=	obj;
	};

	/**
		draws a transparent thick line between 2 given points
	 * @param {context}		ct				drawing 2D context of the canvas object
	 * @param {point}		point1			First point of line
	 * @param {point}		point2			Second point of line
	*/
	this.drawShadowLine		=	function(ct, point1, point2)
	{	
		if(this.isRainbow || this.isGradient)
		{
			return;
		}
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
	
	/**
		draws a line between 2 given points
	 * @param {context}		ct				drawing 2D context of the canvas object
	 * @param {point}		point1			First point of line
	 * @param {point}		point2			Second point of line
	*/
	function drawLine(ct, point1, point2)
	{			
		ct.strokeStyle		=	strokeColor;
		ct.beginPath();
		ct.moveTo(point1.x, point1.y);
		ct.lineTo(point2.x, point2.y);
		ct.stroke();
		ct.closePath();
	}
	
	/**
		creates and returns a line gradient based on the given color
		@param		{context}	ct				drawing 2D context of the canvas object
		@param		{color}		color			the base color to create the gradient from
		@returns	{gradient}					returns linear gradient of 2 close shades of the given color
	*/
	function prepareLinearGradient(ct, color)
	{
		var cc				=	new SpiroCanvas.colorConversion();
		var foreRGB1		=	cc.hsvToRgb(color.h, color.s, color.v);
		var foreRGB2;
		if (color.v - 0.2 < 0)
		{
			foreRGB2		=	cc.hsvToRgb(color.h, color.s, color.v + 0.2);
		}
		else
		{
			foreRGB2		=	cc.hsvToRgb(color.h, color.s, color.v - 0.2);
		}
		
		var foreHEX1		=	"#" + cc.RGBtoHex(foreRGB1.r, foreRGB1.g, foreRGB1.b);
		var foreHEX2		=	"#" + cc.RGBtoHex(foreRGB2.r, foreRGB2.g, foreRGB2.b);
		var lingrad 		=	ct.createLinearGradient(0,0,300,600);
			lingrad.addColorStop(0,		foreHEX1);
			lingrad.addColorStop(0.7,	foreHEX2);
		
		return lingrad;
	}
	
	this.updateColors		=	function()
	{
		var cc				=	new SpiroCanvas.colorConversion();
		if(this.isRainbow)
		{
			//var rgb			=	cc.HexToRGB(strokeColor);
			var hsv			=	hsvColor;//cc.rgbToHsv(rgb.r, rgb.g, rgb.b);
			
			hsv.h			=	hsv.h + rainbowDel;
			hsv.s			=	0.5;
			hsv.v			=	1.0;
			strokeColor		=	'#' + cc.HSVToHex(hsv);
			hsvColor		=	hsv;
		}
		else if(this.isGradient)
		{
			//var rgb			=	cc.HexToRGB(strokeColor);
			var hsv			=	hsvColor;//cc.rgbToHsv(rgb.r, rgb.g, rgb.b);
			
			hsv.s			=	1.0;
			
			if(hsv.v + rainbowDel >= 0.9 || hsv.v + rainbowDel <= 0.1)
			{
				rainbowDel	*=	-1;
				hsv.v		=	hsv.v + rainbowDel;
			}
			else
			{
				hsv.v		=	hsv.v + rainbowDel;
			}
			strokeColor		=	'#' + cc.HSVToHex(hsv);
			hsvColor		=	hsv;
		}
	}
};