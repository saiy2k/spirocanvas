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
	var perms		=	'write';
	var token;
	
	this.authenticate				=	function()
	{
		var _url	=	auth_url;
		var sig;
		
		_url		+=	"api_key=" + key + "&perms=" + perms + "&api_sig=" + getSig(perms);		
				
		var win = window.open(_url, "thePop", "");
		var pollTimer = window.setInterval(function()
		{
			if (win.closed) {
				window.clearInterval(pollTimer);
				var frb	=	gup(win.document.URL, 'frob');
				console.log(win.document.URL);
				console.log(frb);
				
				var	api_sig	= hex_md5(shared_secret + 'api_key' + key + 'formatjson' + 'frob' + frb + 'jsoncallbackgotToken' + 'methodflickr.auth.getToken');
				_url	=	'http://flickr.com/services/rest/?' + '&api_key=' + key + '&format=json' + '&frob=' + frb + '&method=flickr.auth.getToken' + '&api_sig=' + api_sig;
				
				getToken(_url);
			}
		}, 100);
	}
	
	function getToken(_url)
	{
		console.log('url:');
		console.log(_url);
		
		//$.getJSON(_url, gotToken);
		
		
		jQuery.ajax({
			dataType: 'jsonp',
			url: _url,
			cache: true,
			jsonp:'jsoncallback',
			jsonpCallback: 'gotToken',
			success: function(data)
			{
				gotToken(data);
			}
		});
	}
	
	function gotToken(data)
	{
		console.log(data);
		token = data.auth.token._content;
		
		$.ajax({
			url: "http://localhost.com/spirocanvas/services/flickrUpload.php",
			type: "POST",
			data: "data=" + spiroHelper.saveAsPNG() + "&token=" + token,
			success: function(data, textStatus, jqXHR)
			{
				console.log(data);
			}
		});
	}

	function getSig(perms)
	{
		var sig = shared_secret + "api_key" + key +  "perms" + perms;
		var	hex = hex_md5(sig);
		return hex;
	}
	
	//taken from http://www.netlobo.com/url_query_string_javascript.html
	function gup(url, name)
	{
		name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
		var regexS = "[\\?&]"+name+"=([^&#]*)";
		var regex = new RegExp( regexS );
		var results = regex.exec( url );
		if( results == null )
			return "";
		else
			return results[1];
	}

	
	return this;
}