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
This class acts as a intermediate layer between spiroCanvasUI and
spiroCanvasCore.
*/

SpiroCanvas.spiroCanvasUIHelper = function()
{
	var tmpCore;
	var layerCount			=	0;
	var currentLayerID		=	-1;
	var layersArray			=	{};
	var orderArray;
	
	var spiroMain			=	new SpiroCanvas.spiroCanvasCore();
	var spiroInstant		=	new SpiroCanvas.spiroCanvasCore();
	
	this.init				=	function()
	{
		//disable the scroll bars
		$( "body" ).css("overflow", "hidden");
			
		//moves the canvasContainer (inside which our canvas tag resides) to the center of the screen
		$("#canvasContainer").center();
		
		//hides the preview layer. This will be shown during mouse over on Draw button
		$('#previewCanvas').hide();
		
		//position the slider panel (toolbox)
		$("#sliderPanel").css("top", 20);
		
		//positions the color box
		$("#colorPanel").css("top", ($("#sliderPanel").offset().top + $("#sliderPanel").height() + 10) );
		
		//layouts the progress bar and hides it
		$( "#progressBar" ).center();
		$( "#progressBar" ).css("top", ($("#canvasContainer").offset().top + $("#canvasContainer").height() - 40) );
		$( "#progressBar" ).hide();
		
		//layouts the play box and hides it
		$( "#playBox" ).css("position", "absolute" );
		$( "#playBox" ).css("left", ( ($("#canvasContainer").width() - $("#playBox").width()) / 2 ) );
		$( "#playBox" ).css("top", ($("#canvasContainer").height() - 20) );
		$( "#playBox" ).hide();
		
		//position the x value of all the '.toolPanel' objects
		$(".toolPanel").css("left", "-" + ($(".toolPanel").width() - 15) + "px" );
		$(".toolPanelRight").offset({ top: 10, left: ($(document).width() - $(".toolPanelRight").width()) });
		
		//draws the black background
		this.drawBG('canvasBG', { r:0, g:0, b:0});
	}
	
	this.reset				=	function()
	{
		for ( var i = 0; i < layerCount; i++)
		{
			var ele;
			var no			=	orderArray[i];
			var canvasid	=	"canvasSpiro" + no;
			var layerid		=	"layerWidget" + no;
			
			ele				=	document.getElementById(canvasid);
			ele.parentNode.removeChild(ele);
			ele				=	document.getElementById(layerid);
			ele.parentNode.removeChild(ele);
		}
	
		layerCount			=	0;
		currentLayerID		=	-1;
		layersArray			=	{};
		orderArray;
	}

	this.saveAsPNG			=	function()
	{
		var resultCanvas	=	document.getElementById("canvasResult");
		var bgCanvas		=	document.getElementById("canvasBG");
		var ctx				=	resultCanvas.getContext('2d');
		var cty				=	bgCanvas.getContext('2d');
		
		var bgImg 			= 	Canvas2Image.saveAsPNG(bgCanvas, true);
		ctx.drawImage(cty.canvas, 0, 0);
		
		//for ( var key in layersArray )
		for ( var i = 0; i < layerCount; i++)
		{
			var no			=	orderArray[i];
			var canvasid	=	"canvasSpiro" + no;
			var canvasele	=	document.getElementById(canvasid);
			if(canvasele && canvasele.style.display != "none")
			{
				var ctz			=	canvasele.getContext('2d');
				ctx.drawImage(ctz.canvas, 0, 0);
				//console.log("canvas ID: " + canvasid);
			}
		}
		
		//window.location.href     = resultCanvas.toDataURL("image/png");
		//window.open(resultCanvas.toDataURL("image/png"));
		//Canvas2Image.saveAsPNG(resultCanvas);
		return resultCanvas.toDataURL("image/png");
	};
	
	this.saveAsJPG			=	function()
	{
		var resultCanvas	=	document.getElementById("canvasResult");
		var bgCanvas		=	document.getElementById("canvasBG");
		var ctx				=	resultCanvas.getContext('2d');
		var cty				=	bgCanvas.getContext('2d');
		
		var bgImg 			= 	Canvas2Image.saveAsPNG(bgCanvas, true);
		ctx.drawImage(cty.canvas, 0, 0);
		
		//for ( var key in layersArray )
		for ( var i = 0; i < layerCount; i++)
		{
			var no			=	orderArray[i];
			var canvasid	=	"canvasSpiro" + no;
			var canvasele	=	document.getElementById(canvasid);
			if(canvasele && canvasele.style.display != "none")
			{
				var ctz			=	canvasele.getContext('2d');
				ctx.drawImage(ctz.canvas, 0, 0);
				//console.log("canvas ID: " + canvasid);
			}
		}
		
		//window.location.href     = resultCanvas.toDataURL("image/png");
		//window.open(resultCanvas.toDataURL("image/png"));
		//Canvas2Image.saveAsPNG(resultCanvas);
		return resultCanvas.toDataURL("image/jpeg");
	};
	
	this.showPreview		=	function(e)
	{
		//creating a new Spirograph object
		var tmpSpiro	=	new SpiroCanvas.spiroGraph();
		var cc			=	new SpiroCanvas.colorConversion();
		
		//initiating the new object with vales from the controls
		//all the pixels values are divided by 4 to make the preview
		//4 times smaller. Also, the resolution is divided by 4 to speed
		//up the process ( this will result in inaccurate, but quick preview )
		tmpSpiro.R		=	$('#circle1RadiusSlider').slider('value') / 4;
		tmpSpiro.r 		=	$('#circle2RadiusSlider').slider('value') / 4;
		tmpSpiro.p 		=	$('#pointDistanceSlider').slider('value') / 4;
		var hexCol		= 	$('#foregroundColorDiv').css('background-color');
		hexCol			=	cc.colorToHex(hexCol);
		var rgbCol		=	cc.HexToRGB(hexCol);
		tmpSpiro.color	=	cc.rgbToHsv(rgbCol.r, rgbCol.g, rgbCol.b);
		
		hexCol			= 	$('#backgroundColorDiv').css('background-color');
		hexCol			=	cc.colorToHex(hexCol);
		rgbCol			=	cc.HexToRGB(hexCol);
		var bgColor		=	cc.rgbToHsv(rgbCol.r, rgbCol.g, rgbCol.b);
		
		tmpSpiro.speed	=	$('#speedSlider').slider('value');
		tmpSpiro.res	=	$('#resolutionSlider').slider('value') / 4;
		
		if(tmpSpiro.res < 8)
		{
			tmpSpiro.res*=	2;
		}
		
		if(tmpSpiro.r < 0)
		{
			tmpSpiro.r	=	-tmpSpiro.r;
			tmpSpiro.isEpi	=	false;
		}
		else
		{
			tmpSpiro.isEpi	=	true;
		}
		
		//set the position of the preview canvas
		$('#previewCanvas').css( 'top',  (e.pageY - 250) + "px");
		$('#previewCanvas').css( 'left', (e.pageX + 10) + "px");
		
		//show the canvas
		$('#previewCanvas').fadeIn();
		
		//clear the canvas first
		spiroInstant.clearSpiro('previewCanvas', bgColor);
		
		//invoke the instant draw function to draw the graph
		spiroInstant.drawInstantSpiro('previewCanvas', tmpSpiro);
	};
	
	this.drawSpirograph		=	function()
	{
		//creating a new Spirograph object
		var tmpSpiro	=	new SpiroCanvas.spiroGraph();
		var cc			=	new SpiroCanvas.colorConversion();
		
		$( "#progressBar" ).show();
		
		//initiating the new object with vales from the controls
		tmpSpiro.R		=	$('#circle1RadiusSlider').slider('value');
		tmpSpiro.r 		=	$('#circle2RadiusSlider').slider('value');
		tmpSpiro.p 		=	$('#pointDistanceSlider').slider('value');
		var hexCol		= 	$('#foregroundColorDiv').css('background-color');
		hexCol			=	cc.colorToHex(hexCol);
		var rgbCol		=	cc.HexToRGB(hexCol);
		tmpSpiro.color	=	cc.rgbToHsv(rgbCol.r, rgbCol.g, rgbCol.b);
		tmpSpiro.speed	=	$('#speedSlider').slider('value');
		tmpSpiro.res	=	$('#resolutionSlider').slider('value');
		
		hexCol			= 	$('#backgroundColorDiv').css('background-color');
		hexCol			=	cc.colorToHex(hexCol);
		rgbCol		=	cc.HexToRGB(hexCol);
		this.drawBG('canvasBG', rgbCol);
		
		/*
		var hexCol		= 	$('#foregroundColorDiv').css('background-color');
		hexCol			=	colorToHex(hexCol);
		var rgbCol		=	HexToRGB(hexCol);
		var bgColor		=	rgbToHsv(rgbCol.r, rgbCol.g, rgbCol.b);
		*/
		
		layerCount		=	layerCount + 1;
		currentLayerID	=	layerCount - 1;
		
		//creates a new Canvas
		$("#canvasContainer").append('<canvas id="canvasSpiro' + layerCount + '" '
			+ 'width="800" height="600" '
			+ 'style="position:absolute; left:0px; top:0px; z-index:' + (layerCount + 1) + ';"></canvas>'
		);
		
		//make an entry to the layers panel
		$("#layersPanelSelectable").append(
			'<li class="ui-widget-content" style="background: #000000; border: none; color: #aaaaaa" id="layerWidget' + layerCount + '">' + 
			'Layer ' +  layerCount + ' ' +
			'<a href="#" id="removeLayerWidget" border="2"><img src="images/closeIcon.png"></a> &nbsp;' +
			'<a href="#" id="hideLayerWidget" border="2"><img src="images/eyeIcon.gif"></a>' +
			'</li>'
		);
		
		tmpSpiro.id							=	"canvasSpiro" + layerCount;
		layersArray["canvasSpiro" + layerCount]	=	tmpSpiro;
		
		console.log(layersArray);
		
		spiroMain.drawSpiro('canvasSpiro' + layerCount, 'canvasBG', tmpSpiro);
	};
	
	this.stopSpiroDrawing		=	function()
	{
		//if any cruve is being drawn, stop it
		if ( spiroMain.loopID != -1 )
		{
			clearInterval(spiroMain.loopID);
			spiroMain.loopID	=	-1;
			spiroMain.angle	=	0.0;
			
			$( "#progressBar" ).hide();
			$("#drawButton").html("Draw");
		}
	}
	
	this.updateDrawingCircle	=	function()
	{
		//if any cruve is being drawn, stop it
		if ( spiroMain.loopID != -1 )
		{
			clearInterval(spiroMain.loopID);
			spiroMain.loopID	=	-1;
			spiroMain.angle	=	0.0;
		}
		
		//retrieve the details required to draw the drawing circles
		//and ask spiroCanvasCore to draw them
		var canvasCircle=	document.getElementById('canvasCircle');
		var centerPoint	=	{x:0, y:0};
		var newPoint	=	{x:0, y:0};
		var R			=	$("#circle1RadiusSlider").slider("value");
		var r			=	$("#circle2RadiusSlider").slider("value");
		var p			=	$("#pointDistanceSlider").slider("value");
		centerPoint.x	=	canvasCircle.width  / 2;
		centerPoint.y	=	canvasCircle.height / 2;
		
		if ( r < 0 )
		{
			newPoint.x	=	centerPoint.x + R - r + p;
			newPoint.y	=	centerPoint.y;
			
			spiroMain.drawCircles(centerPoint, newPoint, R, -r, true);
		}
		else
		{
			newPoint.x	=	centerPoint.x + R + r - p;
			newPoint.y	=	centerPoint.y;
			
			spiroMain.drawCircles(centerPoint, newPoint, R, r, false);
		}
	}
	
	this.randomize			=	function()
	{
		var cc			=	new SpiroCanvas.colorConversion();
		
		$('#circle1RadiusSlider').slider('value', Math.random() * 195 + 1);
		$('#circle2RadiusSlider').slider('value', Math.random() * 98 + 1);
		$('#pointDistanceSlider').slider('value', Math.random() * 98 + 1);
		$('#speedSlider').slider('value', 25);
		$('#resolutionSlider').slider('value', Math.random() *  $('#circle1RadiusSlider').slider('value') / 2);
		
		var rh		=	cc.toHex(Math.random() * 255);
		var gh		=	cc.toHex(Math.random() * 255);
		var bh		=	cc.toHex(Math.random() * 255);
		var hex		=	'#' + rh + gh + bh;
		$('#foregroundColorDiv').css('background-color', hex);
		
		rh		=	cc.toHex(Math.random() * 255);
		gh		=	cc.toHex(Math.random() * 255);
		bh		=	cc.toHex(Math.random() * 255);
		hex		=	'#' + rh + gh + bh;
		//$('#backgroundColorDiv').css('background-color', hex);
		
		$( "#circle1RadiusLabel" ).html( $('#circle1RadiusSlider').slider('value') );
		$( "#circle2RadiusLabel" ).html( $('#circle2RadiusSlider').slider('value') );
		$( "#pointDistanceLabel" ).html( $('#pointDistanceSlider').slider('value') );
		$( "#speedLabel" ).html( $('#speedSlider').slider('value') );
		$( "#resolutionLabel" ).html( $('#resolutionSlider').slider('value') );
	};
	
	this.removeLayer		=	function(ele)
	{
		var itemID		=	$(ele).parent()[0].id;			//gets the id of <li> element
		var no			=	itemID.substring(11, 13);		//retrieves the number at the end
		var canvasid	=	"#canvasSpiro" + no;			//append the id to 'canvasSpriro' to refer to the canvas
		$(canvasid).remove();								//remove the canvas
		$(ele).parent().remove();							//remove the <li> element
		
		removeByElement(layersArray, "canvasSpiro" + no);
		
		console.log(layersArray);

		//stop the drawing if the current drawing layer is being removed
		if((currentLayerID+1) == no)
		{
			this.stopSpiroDrawing();
		}
		
		return false;
	}
	
	//function to fill the background with shades of selected color
	this.drawBG				=	function(canvasBGID, rgb)
	{
		var cc				=	new SpiroCanvas.colorConversion();
		
		var canvasBG		=	document.getElementById(canvasBGID);
		var ct				=	canvasBG.getContext('2d');
		var hsv				=	cc.rgbToHsv(rgb.r, rgb.g, rgb.b);
		//get the RGB value of the given HSV color
		var bgRGB1			=	cc.hsvToRgb(hsv.h, hsv.s, hsv. v);
		var bgRGB2;
		//get the RGB value of the given HSV color, after altering its Saturation and value a little
		if (hsv.v - 0.1 < 0)
		{
			 bgRGB2			=	cc.hsvToRgb(hsv.h, hsv.s, hsv.v + 0.1);
		}
		else
		{
			 bgRGB2			=	cc.hsvToRgb(hsv.h, hsv.s, hsv.v - 0.1);
		}
		
		//convert the RGB to Hex('#ff0000') format for both the colors
		var bgHex1			=	"#" + cc.RGBtoHex(bgRGB1.r, bgRGB1.g, bgRGB1.b);
		var bgHex2			=	"#" + cc.RGBtoHex(bgRGB2.r, bgRGB2.g, bgRGB2.b);
		
		//construct a gradient effect and apply it to the canvas's fill style
		var lingrad 		=	ct.createLinearGradient(0,0,300,600);
			lingrad.addColorStop(0,		bgHex1);
			lingrad.addColorStop(0.7,	bgHex2);
			lingrad.addColorStop(1,		bgHex1);
		ct.fillStyle		=	lingrad;
		
		ct.fillStyle		=	hsv;
		//clear and fill the canvas
		ct.fillRect(0, 0, canvasBG.width, canvasBG.height);
	}
	
	this.moveObject			=	function(canvasid, newPos)
	{
		var ele		=	layersArray[canvasid];
		delete	layersArray[canvasid];
		layersArray.splice(newPos, 0, ele);
	}
	
	this.calcObjectOrder		=	function()
	{
		var arr = $("#layersPanelSelectable").sortable("toArray");
		
		orderArray = new Array();
		for (i = 0 ; i < arr.length; i++)
		{
			orderArray[i] = arr[i].substring(11,13);
		}
	}
	
	this.arrangeLayers			=	function(arr)
	{
		for ( var i = 0; i < arr.length; i++)
		{
			var itemID		=	arr[i];
			var no			=	itemID.substring(11, 13);		//retrieves the number at the end
			var canvasid	=	"#canvasSpiro" + no;			//append the id to 'canvasSpriro' to refer to the canvas
			
			$(canvasid).css('z-index' , i + 2);
		}

	}
	
	this.layerToggleVisibility	=	function(e)
	{
		var itemID		=	$(e).parent()[0].id;			//gets the id of <li> element
		var no			=	itemID.substring(11, 13);		//retrieves the number at the end
		var canvasid	=	"#canvasSpiro" + no;			//append the id to 'canvasSpriro' to refer to the canvas
		if($(canvasid).css('display') == 'none')
			$(canvasid).css('display', 'block');			//hide the canvas
		else
			$(canvasid).css('display', 'none');
		return false;
	}
	
	function removeByElement(arrayName,arrayElement)
	{
		delete arrayName[arrayElement];
	};
};