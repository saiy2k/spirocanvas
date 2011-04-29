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
This class represents a spirograph curve. It stores all the data,
that is required to reproduce a spirograph, from the Circle Radius,
Resolution to the color of the spirograph.

For each and every layer drawn, an instance of this class will be created
and saved in an array
*/

/**
	returns an instance of spiroGraph object.
	@class This class holds all the data necessary to draw a spiro curve.	
*/
SpiroCanvas.spiroGraph = function() {
	/**	Unique ID of the SpiroGraph
		@type Number
    */
	this.id			=	"";
	
	/**	Radius of the fixed Circle
		@type Number
    */
	this.R			=	0;
	
	/**	Radius of the mobile Circle
		@type Number
    */
	this.r			=	0;
	
	/**	Distance of drawing point from the center of mobile Circle
		@type Number
    */
	this.p			=	0;
	
	/**	Number of points per curve
		@type Number
    */
	this.res		=	0;
	
	/**	Speed of drawing the curve
		@type Number
    */
	this.speed		=	0;
	
	/**	line color of the spirograph in HSV
		@type HSV
    */
	this.color		=	{	
							h:0,
							s:0,
							v:0
						};
						
	/**	is epitrochoid and not hypotrochoid
		@type Boolean
    */
	this.isEpi		=	true;
	
	/**	placement of the curve in z-axis
		@type Number
    */
	this.zIndex		=	0;
};