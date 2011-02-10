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
	my.initUI 		=	function ()
	{
		jQuery(function()
		{
			//moves the canvasDiv (inside which our canvas tag resides) to the center of the screen
			$("#canvasDiv").center();
			
			//moves the floating toolbox (which includes all the sliders) to the left center of the screen
			$("#toolBox").leftCenter();
			
			//click handler for reDraw Button. Calls the the drawSpiro function in spiroCanvasCore
			//to draw a new spirograph
			$( "#reDrawButton" ).click
			(
				function()
				{
					var R 			=	$('#circle1RadiusSlider').slider('value');
					var r 			=	$('#circle2RadiusSlider').slider('value');
					var p 			=	$('#pointDistanceSlider').slider('value');
					var foreColor	=	$.jPicker.List[0].color.active.val('hex');
					var bgColor		=	$.jPicker.List[1].color.active.val('hex');
					var speed		=	$('#speedSlider').slider('value');
					
					spiroCanvasCore.drawSpiro('canvasBase', 1, speed, R, r, p, foreColor, bgColor);
				}
			);
			
			//transforms the foregroundColorDiv to a colorpicker
			$('#foregroundColorDiv').jPicker
			({
				window:
				{
					expandable: true
				},
				color:
				{
					alphaSupport: true,
					active: new $.jPicker.Color({ ahex: '000000ff' })
				}
			});
			
			//transforms the backgroundColorDiv to a colorpicker
			$('#backgroundColorDiv').jPicker
			({
				window:
				{
					expandable: true
				},
				color:
				{
					alphaSupport: true,
					active: new $.jPicker.Color({ ahex: 'ffffffff' })
				}
			});

			//transforms the canvasDiv to a resizable panel with a fixed aspect ratio
			$( "#canvasDiv" ).resizable
			({
				aspectRatio		:	4 / 3,
				minWidth		:	400,
				minHeight		:	300
			});
			
			//moves the canvasDiv to the center of the screen, whenever it's resized
			//and also adjusts the size of canvasBase (the real canvas) to match the
			//size of canvasDiv
			$( "#canvasDiv" ).bind
			(
				"resize",	function(event, ui)
							{
								$("#canvasDiv").center();
								$("#canvasBase").width($("#canvasDiv").width());
								$("#canvasBase").height($("#canvasDiv").height());
							}
			);
		
			//transforms the circle1RadiusSlider into a slider with a specific min and
			//max values. Also, the label is updated as and when the slider value is changed
			$( "#circle1RadiusSlider" ).slider
			({
				orientation		:	"vertical",
				range			:	"min",
				min				:	1,
				max				:	100,
				value			:	60,
				slide			:	function( event, ui )
									{
										$( "#circle1RadiusLabel" ).html( ui.value );
									}
			});
			
			//transforms the circle2RadiusSlider into a slider with a specific min and
			//max values. Also, the label is updated as and when the slider value is changed
			$( "#circle2RadiusSlider" ).slider
			({
				orientation		:	"vertical",
				range			:	"min",
				min				:	1,
				max				:	100,
				value			:	60,
				slide			:	function( event, ui )
									{
										$( "#circle2RadiusLabel" ).html( ui.value );
									}
			});
			
			//transforms the pointDistanceSlider into a slider with a specific min and
			//max values. Also, the label is updated as and when the slider value is changed
			$( "#pointDistanceSlider" ).slider
			({
				orientation		:	"vertical",
				range			:	"min",
				min				:	1,
				max				:	100,
				value			:	60,
				slide			:	function( event, ui )
									{
										$( "#pointDistanceLabel" ).html( ui.value );
									}
			});
			
			//transforms the speedSlider into a slider with a specific min and
			//max values. Also, the label is updated as and when the slider value is changed
			$( "#speedSlider" ).slider
			({
				orientation		:	"vertical",
				range			:	"min",
				min				:	1,
				max				:	10,
				value			:	5,
				slide			:	function( event, ui )
									{
										$( "#speedLabel" ).html( ui.value );
									}
			});
		});
	};
	
	return my;
}());