var spiroCanvasUI = (function()
{
	var my 			=	{};
	my.initUI 		=	function ()
	{
		jQuery(function()
		{
			$("#canvasDiv").center();
			$("#toolBox").leftCenter();
			
			$( "#canvasDiv" ).resizable
			({
				aspectRatio		:	4 / 3,
				minWidth		:	400,
				minHeight		:	300
			});
			
			$( "#canvasDiv" ).bind
			(
				"resize",	function(event, ui)
							{
								$("#canvasDiv").center();
								$("#canvasBase").width($("#canvasDiv").width());
								$("#canvasBase").height($("#canvasDiv").height());
							}
			);
		
			$( "#circle1RadiusSlider" ).slider
			({
				orientation		:	"vertical",
				range			:	"min",
				min				:	0,
				max				:	100,
				value			:	60,
				slide			:	function( event, ui )
									{
										$( "#circle1RadiusLabel" ).html( ui.value );
									}
			});
			
			$( "#circle2RadiusSlider" ).slider
			({
				orientation		:	"vertical",
				range			:	"min",
				min				:	0,
				max				:	100,
				value			:	60,
				slide			:	function( event, ui )
									{
										$( "#circle2RadiusLabel" ).html( ui.value );
									}
			});
			
			$( "#circle3RadiusSlider" ).slider
			({
				orientation		:	"vertical",
				range			:	"min",
				min				:	0,
				max				:	100,
				value			:	60,
				slide			:	function( event, ui )
									{
										$( "#circle3RadiusLabel" ).html( ui.value );
									}
			});
		});
	};
	
	return my;
}());