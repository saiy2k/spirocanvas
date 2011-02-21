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

var spiroCanvasUI = (function()
{
	var my 			=	{};
	
	var layerCount			=	0;
	var currentLayerID		=	-1;
	
	my.initUI 		=	function ()
	{
		jQuery(function()
		{
			$('#previewCanvas').hide();
			
			//moves the canvasContainer (inside which our canvas tag resides) to the center of the screen
			$("#canvasContainer").center();
			
			//makes the <UL> in layersPanel selectable
			$("#layersPanelSelectable").selectable
			({
				cancel: 'a',
				selected: function(event, ui)
				{ 
					console.log(ui.selected.id);
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
			
			$( "#drawButton" ).mouseover
			(
				function()
				{
					if(spiroCanvasCore.isDrawingInstant)
					{
						console.log('returning');
						return;
					}
						
					var R 			=	$('#circle1RadiusSlider').slider('value') / 4;
					var r 			=	$('#circle2RadiusSlider').slider('value') / 4;
					var p 			=	$('#pointDistanceSlider').slider('value') / 4;
					var foreColor	=	$.jPicker.List[0].color.active.val('hsv');
					var bgColor		=	$.jPicker.List[1].color.active.val('hsv');
					var speed		=	$('#speedSlider').slider('value');
					var res			=	$('#resolutionSlider').slider('value') / 4;
					
					$('#previewCanvas').show();
					spiroCanvasCore.clearSpiro('previewCanvas');
					spiroCanvasCore.drawInstantSpiro('previewCanvas', 'previewCanvas', speed, R, r, p, foreColor, bgColor, res, 1);
				}
			);
			
			$( "#drawButton" ).mouseout
			(
				function()
				{
					$('#previewCanvas').hide();
				}
			);
			
			//click handler for reDraw Button. Calls the the drawSpiro function in spiroCanvasCore
			//to draw a new spirograph with appropriate parameters
			$( "#drawButton" ).click
			(
				function()
				{
					var R 			=	$('#circle1RadiusSlider').slider('value');
					var r 			=	$('#circle2RadiusSlider').slider('value');
					var p 			=	$('#pointDistanceSlider').slider('value');
					var foreColor	=	$.jPicker.List[0].color.active.val('hsv');
					var bgColor		=	$.jPicker.List[1].color.active.val('hsv');
					var speed		=	$('#speedSlider').slider('value');
					var res			=	$('#resolutionSlider').slider('value');
					
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
					
					spiroCanvasCore.drawSpiro('canvasSpiro' + layerCount, 'canvasBG', speed, R, r, p, foreColor, bgColor, res, 1);
					//spiroCanvasCore.drawInstantSpiro('canvasSpiro', 'canvasBG', speed, R, r, p, foreColor, bgColor, res, 1);
				}
			);
			
			$('#removeLayerWidget').live('click', function()
			{
				var obj = $(this).parent()[0];
				var text = obj.id;
				var id	=	text.substring(11, 13);
				var canvasid = "#canvasSpiro" + id;
				$(canvasid).remove();
				console.log(canvasid);
				$(this).parent().remove();
				return false;
			});
			
			//click handler for clear Button. clears the spirocanvas
			$( "#clearButton" ).click
			(
				function()
				{
					spiroCanvasCore.clearSpiro('canvasSpiro');
				}
			);
			
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
						active: new $.jPicker.Color({ ahex: '000000ff' })
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
						active: new $.jPicker.Color({ ahex: 'ffffffff' })
					}
				},
				function(color, context)
				{
				},
				function(color, context)
				{
					spiroCanvasCore.drawBG('canvasBG', color.val('hsv'));
				},
				function(color, context)
				{
				}
			);

			//transforms the canvasContainer to a resizable panel with a fixed aspect ratio
			$( "#canvasContainer" ).resizable
			({
				aspectRatio		:	4 / 3,
				minWidth		:	800,
				minHeight		:	600
			});
			
			//moves the canvasContainer to the center of the screen, whenever it's resized
			//and also adjusts the size of canvasSpiro (the real canvas) to match the
			//size of canvasContainer
			$( "#canvasContainer" ).bind
			(
				"resize",	function(event, ui)
							{
								$("#canvasContainer").center();
								$("#canvasSpiro").width($("#canvasContainer").width());
								$("#canvasSpiro").height($("#canvasContaine").height());
								$("#canvasBG").width($("#canvasContainer").width());
								$("#canvasBG").height($("#canvasContaine").height());
								$("#canvasCircle").width($("#canvasContainer").width());
								$("#canvasCircle").height($("#canvasContaine").height());
							}
			);
		
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
			
			updateDrawingCircle();
		});
	};
	
	function updateDrawingCircle()
	{
		//if any cruve is being drawn, stop it
		if ( spiroCanvasCore.loopID != -1 )
		{
			clearInterval(spiroCanvasCore.loopID);
			spiroCanvasCore.loopID	=	-1;
			spiroCanvasCore.angle	=	0.0;
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
			
			spiroCanvasCore.drawCircles(centerPoint, newPoint, R, -r, true);
		}
		else
		{
			newPoint.x	=	centerPoint.x + R + r - p;
			newPoint.y	=	centerPoint.y;
			
			spiroCanvasCore.drawCircles(centerPoint, newPoint, R, r, false);
		}
	}
	
	return my;
}());