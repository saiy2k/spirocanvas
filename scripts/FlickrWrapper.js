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
This class holds all the Flickr related functionalities
*/

SpiroCanvas.FlickrWrapper			=	function(sH)
{
	var		spiroHelper				=	sH;

	var auth_url 	=	'http://flickr.com/services/auth/?';
	var key			=	'c6c3f471e99860ba35dae1dea6389faa';
	var shared_secret	=	'47ccedfd3e857f83';
	var perms		=	'read';
	
	this.authenticate				=	function()
	{
		var _url	=	auth_url;
		var sig;
		
		_url		+=	"api_key=" + key + "&perms=" + perms + "&api_sig=" + getSig(perms);		
		_url = 'http://flickr.com/services/auth/?api_key=c6c3f471e99860ba35dae1dea6389faa&perms=read&api_sig=c22f97c8085aecb363e32782b61a4f52';
				
		var win = window.open(_url, "thePop", "");
		var pollTimer = window.setInterval(function()
		{
			if (win.closed) {
				window.clearInterval(pollTimer);
				console.log(win.document.URL);
			}
		}, 100);
	}

	function getSig(perms)
	{
		var sig = shared_secret + "api_key" + key +  "perms" + perms;
		var	hex = hex_md5(sig);
		return hex;
	}
	
	return this;
}