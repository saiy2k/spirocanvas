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

SpiroCanvas.spiroGraph = function()
{
	this.R			=	0;				//Radius of the fixed Circle
	this.r			=	0;				//Radius of the mobile Circle
	this.p			=	0;				//Distance of drawing point from the center of mobile Circle
	this.res		=	0;				//Number of points per curve
	this.speed		=	0;				//Speed of drawing the curve
	this.color		=	{	
							h:0,
							s:0,
							v:0
						};				//line color of the spirograph in hsv format
	this.isEpi		=	true;			//is epitrochoid and not hypotrochoid
};