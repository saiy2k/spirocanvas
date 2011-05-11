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
 * @class
 */
SpiroCanvas.colorConversion			=	function()
{
	this.colorToHex					=	function(color)
	{
		if (color.substring(0, 1) === '#')
		{
			return color;
		}
		var digits = /(.*?)rgb\((\d+), (\d+), (\d+)\)/.exec(color);
		
		var red = parseInt(digits[2]);
		var green = parseInt(digits[3]);
		var blue = parseInt(digits[4]);
		
		var rgb = blue | (green << 8) | (red << 16);
		return digits[1] + '#' + rgb.toString(16);
	};
	
	this.HSVToHex					=	function(hsv)
	{
		var rgb		=	this.hsvToRgb(hsv.h, hsv.s, hsv.v);
		var hex		=	this.RGBtoHex(rgb.r, rgb.g, rgb.b);
		
		return			hex;
	}
	
	this.rgbToHsv					=	function(r, g, b)
	{
		r = r/255, g = g/255, b = b/255;
		var max = Math.max(r, g, b), min = Math.min(r, g, b);
		var h, s, v = max;

		var d = max - min;
		s = max == 0 ? 0 : d / max;

		if(max == min){
			h = 0; // achromatic
		}else{
			switch(max){
				case r: h = (g - b) / d + (g < b ? 6 : 0); break;
				case g: h = (b - r) / d + 2; break;
				case b: h = (r - g) / d + 4; break;
			}
			h /= 6;
		}
		return { h:h, s:s, v:v };
	}
	
	this.toHex						=	function(N)
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
	
	this.hsvToRgb					=	function(h, s, v)
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
	
	this.RGBtoHex					=	function (R,G,B)
	{
		return this.toHex(R)+this.toHex(G)+this.toHex(B)
	}
	
	this.HexToRGB					=	function(hex)
	{
		var		_r, _g, _b;
		_r		=	HexToR(hex);
		_g		=	HexToG(hex);
		_b		=	HexToB(hex);
		
		if( !(_r >= 0 && _r <= 255) )
		{
			_r = 0;
		}
		if( !(_g >= 0 && _g <= 255) )
		{
			_g = 0;
		}
		if( !(_b >= 0 && _b <= 255) )
		{
			_b = 0;
		}
		
		return	{	r: _r,
					g: _g,
					b: _b
				};
	}
	
	function HexToR(h) {return parseInt((cutHex(h)).substring(0,2),16)}
	function HexToG(h) {return parseInt((cutHex(h)).substring(2,4),16)}
	function HexToB(h) {return parseInt((cutHex(h)).substring(4,6),16)}
	function cutHex(h) {return (h.charAt(0)=="#") ? h.substring(1,7):h}
}