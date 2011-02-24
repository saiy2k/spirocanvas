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
This class does the magic of converting plain divs to jqueryui controls
and thus setting up the application UI. One and only function in this class
is initUI and it will be called, when the body is loaded
*/

SpiroCanvas.spiroCanvasUI = (function()
{
	var my 			=	{};
	var tmpCore;
	var layerCount			=	0;
	var currentLayerID		=	-1;
	
	var spiroMain			=	new SpiroCanvas.spiroCanvasCore();
	var spiroInstant		=	new SpiroCanvas.spiroCanvasCore();
	
	my.initUI 		=	function ()
	{
		jQuery(function()
		{
			$( "#drawButton" ).mouseover
			(
				function(e)
				{
					//creating a new Spirograph object
					var tmpSpiro	=	new SpiroCanvas.spiroGraph();
					
					//initiating the new object with vales from the controls
					//all the pixels values are divided by 4 to make the preview
					//4 times smaller. Also, the resolution is divided by 4 to speed
					//up the process ( this will result in inaccurate, but quick preview )
					tmpSpiro.R		=	$('#circle1RadiusSlider').slider('value') / 4;
					tmpSpiro.r 		=	$('#circle2RadiusSlider').slider('value') / 4;
					tmpSpiro.p 		=	$('#pointDistanceSlider').slider('value') / 4;
					tmpSpiro.color	=	$.jPicker.List[0].color.active.val('hsv');
					tmpSpiro.speed	=	$('#speedSlider').slider('value');
					tmpSpiro.res	=	$('#resolutionSlider').slider('value') / 4;
					
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
					$('#previewCanvas').css( 'top',  (e.pageY - 240) + "px");
					$('#previewCanvas').css( 'left', (e.pageX + 5) + "px");
					
					//show the canvas
					$('#previewCanvas').fadeIn();
					
					//clear the canvas first
					spiroInstant.clearSpiro('previewCanvas');
					
					//invoke the instant draw function to draw the graph
					spiroInstant.drawInstantSpiro('previewCanvas', tmpSpiro);
				}
			);
			
			$( "#drawButton" ).mouseout
			(
				function()
				{
					$('#previewCanvas').fadeOut();
				}
			);
			
			//click handler for reDraw Button. Calls the the drawSpiro function in spiroCanvasCore
			//to draw a new spirograph with appropriate parameters
			$( "#drawButton" ).click
			(
				function()
				{
					//creating a new Spirograph object
					var tmpSpiro	=	new SpiroCanvas.spiroGraph();
					
					//initiating the new object with vales from the controls
					tmpSpiro.R		=	$('#circle1RadiusSlider').slider('value');
					tmpSpiro.r 		=	$('#circle2RadiusSlider').slider('value');
					tmpSpiro.p 		=	$('#pointDistanceSlider').slider('value');
					tmpSpiro.color	=	$.jPicker.List[0].color.active.val('hsv');
					tmpSpiro.speed	=	$('#speedSlider').slider('value');
					tmpSpiro.res	=	$('#resolutionSlider').slider('value');
					
					var bgColor		=	$.jPicker.List[1].color.active.val('hsv');
					
					layerCount		=	layerCount + 1;
					currentLayerID	=	layerCount - 1;
					
					//creates a new Canvas
					$("#canvasContainer").append('<canvas id="canvasSpiro' + layerCount + '" '
						+ 'width="800" height="600" '
						+ 'style="position:absolute; left:0px; top:0px; z-index:' + (layerCount + 1) + ';"></canvas>'
					);
					
					//make an entry to the layers panel
					$("#layersPanelSelectable").append(
						'<li class="ui-widget-content" id="layerWidget' + layerCount + '">' + 
						'Layer ' +  layerCount + ' ' +
						'<a href="#" id="removeLayerWidget" border="2">X</a>' +
						'</li>'
					);
					
					spiroMain.drawSpiro('canvasSpiro' + layerCount, 'canvasBG', tmpSpiro);
				}
			);
			
			//will get invoked, if the close button on any of the layers is pressed
			$('#removeLayerWidget').live('click', function()
			{
				var itemID		=	$(this).parent()[0].id;			//gets the id of <li> element
				var no			=	itemID.substring(11, 13);		//retrieves the number at the end
				var canvasid	=	"#canvasSpiro" + no;			//append the id to 'canvasSpriro' to refer to the canvas
				$(canvasid).remove();								//remove the canvas
				$(this).parent().remove();							//remove the <li> element
				return false;
			});
			
			//moves the canvasContainer (inside which our canvas tag resides) to the center of the screen
			$("#canvasContainer").center();
			
			//makes the <UL> in layersPanel selectable
			$("#layersPanelSelectable").selectable
			({
				cancel: 'a',
				selected: function(event, ui)
				{ 
					//console.log(ui.selected.id);
				}
			});
			
			//position the layers bar to the right of the canvas Container
			$("#layersPanel").offset
			({
				top: $("#canvasContainer").offset().top + 50,
				left: $("#canvasContainer").offset().left + $("#canvasContainer").width() + 4
			});
			
			//moves the floating toolbox (which includes all the sliders) to the left center of the screen
			$("#toolBox").leftCenter();
			
			//transforms the foregroundColorDiv to a colorpicker
			$('#foregroundColorDiv').jPicker
			(
				{
					window:
					{
						expandable: true
					},
					color:
					{
						alphaSupport: true,
						active: new $.jPicker.Color({ ahex: 'ffffffff' })
					}
				}
			);
			
			//transforms the backgroundColorDiv to a colorpicker
			$('#backgroundColorDiv').jPicker
			(
				{
					window:
					{
						expandable: true
					},
					color:
					{
						alphaSupport: true,
						active: new $.jPicker.Color({ ahex: '00000000' })
					}
				},
				function(color, context) {},
				function(color, context) { drawBG('canvasBG', color.val('hsv')); },
				function(color, context) {}
			);
			
			//hides the preview layer. This will be shown during mouse over on Draw button
			$('#previewCanvas').hide();
					
			//transforms the circle1RadiusSlider into a slider with a specific min and
			//max values. Also, the label is updated as and when the slider value is changed
			//This slider is used to adjust the radius of the fixed circle
			$( "#circle1RadiusSlider" ).slider
			({
				orientation		:	"horizontal",
				range			:	"min",
				min				:	1,
				max				:	200,
				value			:	60,
				slide			:	function( event, ui )
									{
										//updates the label with slider value
										$( "#circle1RadiusLabel" ).html( ui.value );
										
										//updates the drawing circle
										updateDrawingCircle();
									}
			});
			
			//transforms the circle2RadiusSlider into a slider with a specific min and
			//max values. Also, the label is updated as and when the slider value is changed
			//This slider is used to adjust the radius of the moving circle.
			//If the slider value is negative, moving circle moves inside the fixed circle
			//and draws a Hypotrochoid
			//If the slider value is positive, moving circle moves outside the fixed circle
			//and draws a Epitrochoid
			$( "#circle2RadiusSlider" ).slider
			({
				orientation		:	"horizontal",
				range			:	"min",
				min				:	-100,
				max				:	100,
				value			:	50,
				slide			:	function( event, ui )
									{
										//returns false, if the slide value goes less than the slide value
										//of circle1radius slide. This is to ensure that if the moving
										//circle is inside fixed circle, then its radius should never go
										//beyond the radius of fixed circle.
										if(ui.value <= -($('#circle1RadiusSlider').slider('value')))
											return false;
										$( "#circle2RadiusLabel" ).html( ui.value );
										
										//updates the drawing circle
										updateDrawingCircle();
									}
			});
			
			//transforms the pointDistanceSlider into a slider with a specific min and
			//max values. Also, the label is updated as and when the slider value is changed
			//This slider defines the distance of drawing point from the center of moving circle
			$( "#pointDistanceSlider" ).slider
			({
				orientation		:	"horizontal",
				range			:	"min",
				min				:	1,
				max				:	100,
				value			:	60,
				slide			:	function( event, ui )
									{
										$( "#pointDistanceLabel" ).html( ui.value );
										
										//updates the drawing circle
										updateDrawingCircle();
									}
			});
			
			//transforms the speedSlider into a slider with a specific min and
			//max values. Also, the label is updated as and when the slider value is changed
			//This slider determines the rate at which the draw loop is called using setInterval
			$( "#speedSlider" ).slider
			({
				orientation		:	"horizontal",
				range			:	"min",
				min				:	1,
				max				:	25,
				value			:	20,
				slide			:	function( event, ui )
									{
										$( "#speedLabel" ).html( ui.value );
									}
			});
			
			//transforms the resolutionSlider into a slider with a specific min and
			//max values. Also, the label is updated as and when the slider value is changed
			//This slider determines the number of points drawn in one revolution of the
			//curve. The more the value is, the smoother the curve is.
			$( "#resolutionSlider" ).slider
			({
				orientation		:	"horizontal",
				range			:	"min",
				min				:	2,
				max				:	128,
				value			:	64,
				slide			:	function( event, ui )
									{
										$( "#resolutionLabel" ).html( ui.value );
									}
			});
			
			//updateDrawingCircle();
		});
	};
	
	function updateDrawingCircle()
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
	
	//function to fill the background with shades of selected color
	function drawBG(canvasBGID, hsv)
	{
		var canvasBG		=	document.getElementById(canvasBGID);
		var ct				=	canvasBG.getContext('2d');
		
		//get the RGB value of the given HSV color
		var bgRGB1			=	$.jPicker.ColorMethods.hsvToRgb(hsv);
		//get the RGB value of the given HSV color, after altering its Saturation and value a little
		var bgRGB2			=	$.jPicker.ColorMethods.hsvToRgb( { h:hsv.h, s:hsv.s - 10, v:hsv.v + 10} );
		
		//convert the RGB to Hex('#ff0000') format for both the colors
		var bgHex1			=	"#" + RGBtoHex(bgRGB1.r, bgRGB1.g, bgRGB1.b);
		var bgHex2			=	"#" + RGBtoHex(bgRGB2.r, bgRGB2.g, bgRGB2.b);
		
		//construct a gradient effect and apply it to the canvas's fill style
		var lingrad 		=	ct.createLinearGradient(0,0,300,600);
			lingrad.addColorStop(0,		bgHex1);
			lingrad.addColorStop(0.7,	bgHex2);
			lingrad.addColorStop(1,		bgHex1);
		ct.fillStyle		=	lingrad;
		
		//clear and fill the canvas
		ct.clearRect(0, 0, canvasBG.width, canvasBG.height);
		ct.fillRect(0, 0, canvasBG.width, canvasBG.height);
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
	
	return my;
}());