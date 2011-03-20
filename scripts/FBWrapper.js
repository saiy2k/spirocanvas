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
This class holds all the facebook related functionalities
*/

SpiroCanvas.FBWrapper				=	function()
{
	var		albumName				=	"Spiro Gallery";

	this.sharePhoto					=	function()
	{
		//create an album, if it doesnt exists
		createAlbumIfNotExists();
	}
	
	function createAlbumIfNotExists()
	{
		FB.api('/me', function(resp)
		{
			var qString		=	'select aid,name from album where owner=' + resp.id + ' AND name="' + albumName + '"';
			var query		=	FB.Data.query(qString);
			
			query.wait(function(rows)
			{
				if($.isEmptyObject(rows))
				{
					createAlbum();
				}
				else
				{
					console.log('do photo upload');
				}
			});
		});
		
		return true;
	}

	function createAlbum()
	{
		console.log("creating album");
		var albumDetails	=	{message:'desc', name:albumName};
		FB.api
		(
			'/me/albums',
			'post',
			albumDetails
		);
	}
	
	return this;
}