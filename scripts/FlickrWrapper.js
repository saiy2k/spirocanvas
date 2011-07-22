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

/**
 * @class
 */
SpiroCanvas.FlickrWrapper			=	function(sH)
{
	var		spiroHelper				=	sH;

	var auth_url 		=	FLICKR_AUTH_URL;
	var key				=	FLICKR_KEY;
	var shared_secret	=	FLICKR_SHARED_SECRET;
	var perms			=	'write';
	var token			=	null;
	
	this.authenticate				=	function()
	{
		var _url		=	auth_url;
		var sig;
		
		_url			+=	"api_key=" + key + "&perms=" + perms + "&api_sig=" + getSig(perms);		
				
		var win 		=	window.open(_url, "windowname1", 'width=200, height=77'); 
		
		var pollTimer	=	window.setInterval(function()
		{			
			if (win.document.URL.indexOf("http://www.gethugames.in") != -1)
			{
				window.clearInterval(pollTimer);
				var frb	=	gup(win.document.URL, 'frob');			
				var	api_sig	= hex_md5(shared_secret + 'api_key' + key + 'formatjson' + 'frob' + frb + 'jsoncallbackgotToken' + 'methodflickr.auth.getToken');
				_url	=	'http://flickr.com/services/rest/?' + '&api_key=' + key + '&format=json' + '&frob=' + frb + '&method=flickr.auth.getToken' + '&api_sig=' + api_sig;
				
				getToken(_url);
				
				win.close();
			}
		}, 100);
	}
	
	this.logout						=	function()
	{
		token						=	null;
		//need to do real logout here
		$("#flickrLogin").html("Flickr Login");
	}
	
	this.sharePhoto					=	function()
	{
		var _url = FLICKR_UPLOAD_SERVICE;
		$.ajax({
			url: _url,
			type: "POST",
			data: "data=" + spiroHelper.saveAsPNG() + "&token=" + token,
			success: function(data, textStatus, jqXHR)
			{
				console.log(data);
				$( "#shareFlickr" ).html("Uploaded");
			}
		});
	}
	
	this.isValid					=	function()
	{
		if(token ==	null)
			return false;
		else
			return true;
	}
	
	function getToken(_url)
	{		
		jQuery.ajax({
			dataType: 'jsonp',
			url: _url,
			cache: true,
			jsonp:'jsoncallback',
			jsonpCallback: 'gotToken',
			success: function(data)
			{
				token = data.auth.token._content;
				$("#flickrLogin").html("Flickr Logout");
				$( "#shareFlickr" ).html("Upload");
			}
		});
	}

	function getSig(perms)
	{
		var sig = shared_secret + "api_key" + key +  "perms" + perms;
		var	hex = hex_md5(sig);
		return hex;
	}
	
	//credits: http://www.netlobo.com/url_query_string_javascript.html
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