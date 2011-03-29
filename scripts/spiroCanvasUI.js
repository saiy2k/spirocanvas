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
	var spiroHelper			=	new SpiroCanvas.spiroCanvasUIHelper();
	var fbWrapper			=	new SpiroCanvas.FBWrapper(spiroHelper);
	var flickrWrapper		=	new SpiroCanvas.FlickrWrapper(spiroHelper);
	var twitterWrapper		=	new SpiroCanvas.TwitterWrapper(spiroHelper);
	
	my.initUI 		=	function ()
	{
		jQuery(function()
		{		
		
			$( "body" ).css("overflow", "hidden");
			$( "#saveButton" ).click
			(
				function()
				{
					window.open(spiroHelper.saveAsPNG());
				}
			);
		
			$( "#drawButton" ).mouseover
			(
				function(e)
				{
					spiroHelper.showPreview(e);
				}
			);
			
			$( "#drawButton" ).mouseout
			(
				function()
				{
					$('#previewCanvas').fadeOut();
				}
			);

			$( "#shareDialog" ).dialog
			({
				autoOpen: false,
				modal:	true
			});
			$( "#shareButton" ).click
			(
				function()
				{
					$( "#shareDialog" ).dialog("open");
					$( "#shareFacebook" ).html("Upload");
				}
			);
			
			$( "#shareFacebook" ).click
			(
				function()
				{
					if ( $( "#shareFacebook" ).html() == "Upload" )
					{
						$( "#shareFacebook" ).html("Uploading...");
						fbWrapper.sharePhoto();
					}
				}
			);
			
			$( "#shareFlickr" ).click
			(
				function()
				{
					flickrWrapper.authenticate();
				}
			);
			
			$( "#shareTwitter" ).click
			(
				function()
				{
					twitterWrapper.authenticate();
				}
			);
			
			spiroHelper.drawBG('canvasBG', { r:0, g:0, b:0 });
			
			//click handler for reDraw Button. Calls the the drawSpiro function in spiroCanvasCore
			//to draw a new spirograph with appropriate parameters
			$( "#drawButton" ).click
			(
				function()
				{
					spiroHelper.drawSpirograph();
					
					var arr = $("#layersPanelSelectable").sortable("toArray");
					
					var orderArray = new Array();
					for (i = 0 ; i < arr.length; i++)
					{
						orderArray[i] = arr[i].substring(11,13);
					}
					
					spiroHelper.setObjectOrder(orderArray);
				}
			);
			
			$( "#stopButton" ).click
			(
				function()
				{
					spiroHelper.stopSpiroDrawing();
				}
			);
			
			//handler for Random Button
			$( "#randomButton" ).click
			(
				function()
				{
					spiroHelper.randomize();
					spiroHelper.drawSpirograph();
					
					var arr = $("#layersPanelSelectable").sortable("toArray");
					
					var orderArray = new Array();
					for (i = 0 ; i < arr.length; i++)
					{
						orderArray[i] = arr[i].substring(11,13);
					}
					
					spiroHelper.setObjectOrder(orderArray);
				}
			);
			
			//will get invoked, if the close button on any of the layers is pressed
			$('#removeLayerWidget').live('click', function()
			{
				return spiroHelper.removeLayer(this);
			});
			
			//will get invoked, if the hide button on any of the layers is pressed
			$('#hideLayerWidget').live('click', function()
			{
				var itemID		=	$(this).parent()[0].id;			//gets the id of <li> element
				var no			=	itemID.substring(11, 13);		//retrieves the number at the end
				var canvasid	=	"#canvasSpiro" + no;			//append the id to 'canvasSpriro' to refer to the canvas
				if($(canvasid).css('display') == 'none')
					$(canvasid).css('display', 'block');					//hide the canvas
				else
					$(canvasid).css('display', 'none');
				return false;
			});
			
			$("#backgroundFrame").center();
			
			//moves the canvasContainer (inside which our canvas tag resides) to the center of the screen
			$("#canvasContainer").center();
			
			//makes the <UL> in layersPanel selectable
			$("#layersPanelSelectable").sortable
			({
				containment: 'document', 
				update: function(event, ui)
				{
					var arr	=	$(this).sortable('toArray');
					
					for ( var i = 0; i < arr.length; i++)
					{
						var itemID	=	arr[i];
						var no			=	itemID.substring(11, 13);		//retrieves the number at the end
						var canvasid	=	"#canvasSpiro" + no;			//append the id to 'canvasSpriro' to refer to the canvas
						
						$(canvasid).css('z-index' , i + 2);
					}
					
					var orderArray = new Array();
					for (i = 0 ; i < arr.length; i++)
					{
						orderArray[i] = arr[i].substring(11,13);
					}
					
					spiroHelper.setObjectOrder(orderArray);
				}
			});	
			
			//hides the preview layer. This will be shown during mouse over on Draw button
			$('#previewCanvas').hide();
	
			$("#sliderPanel").css("top", 20);
			
			$(".toolPanel").css("left", "-" + ($(".toolPanel").width() - 15) + "px" );
			$(".toolPanelRight").offset({ top: 10, left: ($(document).width() - $(".toolPanelRight").width() + 10) });

			$(".toolBoxHeader").click
			(
				function()
				{
					var ele		=	$(this).parent();
					if (ele.css("left") == "-5px")
					{
						ele.animate( {left: "-" + (ele.width() - 15) + "px"}, 250);
					}
					else
					{
						ele.animate( {left: "-5px"}, 250);
					}
				}
			);
			$(".toolBoxHeaderRight").click
			(
				function()
				{
					var ele		=	$(this).parent();
					var pos		=	$(window).width() - ele.width() + 10;
					
					if (ele.offset().left == pos)
					{
						ele.animate( {left: ($(window).width() - 16) + "px"}, 250);
					}
					else
					{
						ele.animate( {left: (pos) + "px"}, 250);
					}
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
										spiroHelper.updateDrawingCircle();
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
										spiroHelper.updateDrawingCircle();
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
										spiroHelper.updateDrawingCircle();
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
			
			$("#colorPanel").css("top", ($("#sliderPanel").offset().top + $("#sliderPanel").height() + 10) );
			
			$( "#foregroundColorDiv" ).ColorPicker
			({
				color: '#ffffff',
				onShow: function (colpkr) {
					$(colpkr).fadeIn(500);
					return false;
				},
				onHide: function (colpkr) {
					$(colpkr).fadeOut(500);
					return false;
				},
				onChange: function (hsb, hex, rgb) {
					$( "#foregroundColorDiv" ).css('backgroundColor', '#' + hex);
				}
			});
			
			$( "#backgroundColorDiv" ).ColorPicker
			({
				color: '#000000',
				onShow: function (colpkr) {
					$(colpkr).fadeIn(500);
					return false;
				},
				onHide: function (colpkr) {
					$(colpkr).fadeOut(500);
					return false;
				},
				onChange: function (hsb, hex, rgb) {
					$( "#backgroundColorDiv" ).css('backgroundColor', '#' + hex);
					spiroHelper.drawBG('canvasBG', rgb);
				}
			});
			
			$("#playPanel").css("top", ($("#colorPanel").offset().top + $("#colorPanel").height() + 10) );
			
			$( "#progressBar" ).progressbar
			({
				value: 0
			});
			$( "#progressBar" ).center();
			$( "#progressBar" ).css("top", ($("#canvasContainer").offset().top + $("#canvasContainer").height() - 40) );
			$( "#progressBar" ).hide();
			
			
			$('#colorBox').hover
			(
				function()
				{  
					 $("#colorBox", this).stop().animate({top:'200px'},{queue:false,duration:160});  
				},
				function()
				{  
					 $("#colorBox", this).stop().animate({top:'295px'},{queue:false,duration:160});  
				}
			);

		});
	};

	return my;
}());