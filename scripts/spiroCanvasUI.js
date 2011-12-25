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
 * @class This class does the magic of converting plain divs to jqueryui controls and thus setting up the application UI. One and only function in this class is initUI and it will be called, when the body is loaded. <br> <br>
	This class also holds the event handlers for the controls <br> <br>
 */
SpiroCanvas.spiroCanvasUI 	= function() {
	var staticMembers		=	{};
	var spiroHelper			=	new SpiroCanvas.spiroCanvasUIHelper();
	var fbWrapper			=	new SpiroCanvas.FBWrapper(spiroHelper);
	var flickrWrapper		=	new SpiroCanvas.FlickrWrapper(spiroHelper);
	
	var isDrawingByMouse	=	false;
	
	staticMembers.initUI 	=	function ()	{
		//initialize spiro helper
		spiroHelper.init();
		
		//on save, get the PNG base64 encoded data and show it in new tab
		$( "#saveButton" ).click(function()	{
			window.open(spiroHelper.saveAsPNG());
		});
		
		//make the shareDialog div, a jquery modal dialog
		$( "#shareDialog" ).dialog ({
			autoOpen: false,
			modal:	true,
			resizable: false
		});
		
		//make the creditsDialog div, a jquery modal dialog
		$( "#creditsDialog" ).dialog ({
			autoOpen: false,
			modal:	true,
			resizable: false
		});
		
		//open the share dialog and reset controls in it
		$( "#shareButton" ).click(function()
		{
			$( "#shareDialog" ).dialog("open");
			$( "#shareFacebook" ).html("Upload");
			$( "#shareFlickr" ).html("Upload");
		});
		
		//open the credits dialog
		$( "#creditsButton" ).click(function()
		{
			$( "#creditsDialog" ).dialog("open");
		});
		
		//share to facebook
		$( "#shareFacebook" ).click(function()
		{
			//if the user is not logged into FB, return back
			if(FB.getSession() == null)
			{
				$( "#shareFacebook" ).html("Login First");
				return;
			}
		
			//check if the previous fb share is done. here the text can
			//have values "Upload|Uploading|Uploaded" that denotes the status
			//of current sharing.
			if ( $( "#shareFacebook" ).html() == "Upload" )
			{
			
				//update status and start sharing
				$( "#shareFacebook" ).html("Uploading...");
				fbWrapper.sharePhoto();
			}
		});
		
		//share to flickr
		$( "#shareFlickr" ).click(function()
		{
			//if the session is invalid, return back
			if(flickrWrapper.isValid()	==	false)
			{
				$( "#shareFlickr" ).html("Login First");
				return;
			}
			
			//check if the previous share is done. here the text can
			//have values "Upload|Uploading|Uploaded" that denotes the status
			//of current sharing.
			if ( $( "#shareFlickr" ).html() == "Upload" )
			{
				//update status and start sharing
				$( "#shareFlickr" ).html("Uploading...");
				flickrWrapper.sharePhoto();
			}
		});
		
		//login to flickr
		$( "#flickrLogin" ).click(function()
		{
			//if the user is not logged in, then log him in
			//or else logout
			if( $( "#flickrLogin" ).html() == "Flickr Login" )
			{
				flickrWrapper.authenticate();
			}
			else
			{
				flickrWrapper.logout();
			}
		});
		
		//handler for Random Button
		$( "#randomButton" ).click(function()
		{
			//console.log('RANDOM: updating center');
			spiroHelper.updateCenter(400, 300);
			//console.log('RANDOM: randomizing');
			spiroHelper.randomize();			//randomize the slider values
			//console.log('RANDOM: drawing');
			spiroHelper.drawSpirograph(false);	//draw a spirograph based on currect slider values
			//console.log('RANDOM: obj ordering');
			spiroHelper.calcObjectOrder();		//update the order array
			//console.log('RANDOM: over');
		});
		
		//will get invoked, if the close button on any of the layers is pressed
		$('#removeLayerWidget').live('click', function() {
			return spiroHelper.removeLayer(this);
		});
		
		//will get invoked, if the hide button on any of the layers is pressed
		$('#hideLayerWidget').live('click', function() {
			spiroHelper.layerToggleVisibility(this);
		});
		
		//updates the sliders with the currently selected spirograph
		$('.layerBox').live('click', function() {
			spiroHelper.selectSpiroFromLayer(this);
		});
		
		//shows the hide and delete button of the currently hovered layer
		$('.layerBox').live('mouseenter', function() {
			$('a',this).fadeTo("fast", 1.0);
		});
		
		//hides the hide and delete button of the currently hovered out layer
		$('.layerBox').live('mouseleave', function() {
			$('a',this).fadeTo("slow", 0.4);
		});
		
		//makes the <UL> in layersPanel selectable
		$("#layersPanelSelectable").sortable ({
			containment: '#layersBox', 
			update: function(event, ui)
			{
				var arr	=	$(this).sortable('toArray');
				spiroHelper.arrangeLayers(arr);				//arrange the layers in order
				spiroHelper.calcObjectOrder();				//update the order array
			}
		});
		
		//cancels current drawing if clicked on the progress bar
		$("#progressBar").click(function()
		{
			spiroHelper.stopSpiroDrawing();
		});
		
		//shows / hides the visibility of all layers
		$("#layerHideAllButton").click(function()
		{			
			if ( $("#layerHideAllButton").html() == "Hide All" ) {
				$("#layerHideAllButton").html("Show All");
				spiroHelper.hideAllLayers();
			}
			else if ( $("#layerHideAllButton").html() == "Show All" ) {
				$("#layerHideAllButton").html("Hide All");
				spiroHelper.showAllLayers();
			}
			
		});
		
		//deletes all the layers clearing the canvas
		$("#layerDeleteAllButton").click(function()
		{
			spiroHelper.stopSpiroDrawing();
			spiroHelper.reset();
		});
		
		//on clicking the left tool box header,
		//slide the panel inside/outside the document
		$(".toolBoxHeader").click(function()
		{
			var ele		=	$(this).parent();
			if (ele.css("left") == "-5px")
			{
				ele.animate( {left: "-" + (ele.width() - 50) + "px"}, 250);
			}
			else
			{
				ele.animate( {left: "-5px"}, 250);
			}
		});
		
		//on clicking the right tool box header,
		//slide the panel inside/outside the document
		$(".toolBoxHeaderRight").click(function()
		{
			var ele		=	$(this).parent();
			var pos		=	$(window).width() - ele.width();
			
			if (ele.offset().left == pos)
			{
				ele.animate( {left: ($(window).width() - 46) + "px"}, 250);
			}
			else
			{
				ele.animate( {left: (pos) + "px"}, 250);
			}
		});
				
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
		
		//make the 'foregroundColorDiv' a eyeCon color picker
		//with some basic event handlers
		$( "#foregroundColorDiv" ).ColorPicker
		({
			eventName: 'click',
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
		
		//make the 'backgroundColorDiv' a eyeCon color picker
		//with some basic event handlers
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
		
		//creates a progress bar out of 'progressBar' div
		$( "#progressBar" ).progressbar
		({
			value: 0
		});
		
		$( "#canvasContainer" ).mousedown(function(event) {
			if(event.which != 1) {
				return;
			}
		
			if(event.pageY - parseInt($("#canvasContainer").css("top")) - parseInt($("#canvasContainer").css("height")) > -30) {
				return;
			}
		
			spiroHelper.updateCenter(event.pageX - parseInt($("#canvasContainer").css("left")), event.pageY - parseInt($("#canvasContainer").css("top")));
			spiroHelper.drawSpirograph(true);		//draw a spirograph based on currect slider values
			spiroHelper.calcObjectOrder();			//update the order array
			
			isDrawingByMouse	=	true;
		});
		
		$( "#canvasContainer" ).mouseup(function(event)	{
			if(event.pageY - parseInt($("#canvasContainer").css("top")) - parseInt($("#canvasContainer").css("height")) > -30) {
				return;
			}
			
			isDrawingByMouse	=	false;
		});
		
		$('#canvasContainer').mousemove(function(event)	{
			if(event.pageY - parseInt($("#canvasContainer").css("top")) - parseInt($("#canvasContainer").css("height")) > -30) {
				return;
			}
		});
		
		$('#preLoader').hide();
	};

	return staticMembers;
}();