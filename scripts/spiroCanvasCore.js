var spiroCanvasCore = (function()
{
	var my 			=	{};
	var angleStep;		
	var angle;
	var aMinusb;
	var aMinusbOverb;
	var aPlusb;
	var aPlusbOverb;
	var count;
	var loopID;
	
	my.drawH 		=	function (ct, R, r, p, maxPoints, originPoint)
	{
	console.log("Draw H");
		var newPoint=	{x:0, y:0};		
		angle 		+=	angleStep;
		newPoint.x 	=	originPoint.x + aMinusb * Math.cos(angle) + p * Math.cos(angle * aMinusbOverb);
		newPoint.y 	=	originPoint.y + aMinusb * Math.sin(angle) - p * Math.sin(angle * aMinusbOverb);

		ct.lineTo(newPoint.x, newPoint.y);
		ct.stroke();
		
		count++;
		if(count > maxPoints)
			self.clearInterval(loopID);
	};
	
	my.drawE 		=	function (ct, R, r, p, maxPoints, originPoint)
	{
		var newPoint	=	{x:0, y:0};
		angle += angleStep;
		newPoint.x = originPoint.x + aPlusb * Math.cos(angle) - p * Math.cos(angle * aPlusbOverb);
		newPoint.y = originPoint.y + aPlusb * Math.sin(angle) - p * Math.sin(angle * aPlusbOverb);
		
		ct.lineTo(newPoint.x, newPoint.y);
		ct.stroke();
		
		count++;
		if(count > maxPoints)
			self.clearInterval(loopID);
	};
	
	my.drawSpiro 		=	function (canvasEle)	
	{
		console.log("Draw Spiro");
		var isHypo = false;	
		var R = 60.0;
		var r = 50.0;
		var p = 60.0;
		angle = 0;
		var NumRevolutions;
		var NumPoints;
		var PointsPerCurve = 16;
		var oldPoint	=	{x:0, y:0};
		var ptOrigin	=	{x:0, y:0};
		
		var canvasBase		=	document.getElementById(canvasEle);
		ptOrigin.x = canvasBase.width / 2;
		ptOrigin.y = canvasBase.height / 2;
		
		angleStep = Math.PI * 2 / PointsPerCurve;

		// Compute number of revolutions.
		NumRevolutions = r/MMath.HCF (R, r);

		// Total number of points to generate
		NumPoints = PointsPerCurve * NumRevolutions;
		
		aMinusb = R - r;
		aMinusbOverb = aMinusb / r;
		aPlusb = R + r;
		aPlusbOverb = aPlusb / r;
		
		count = 0;
		var	ct				=	canvasBase.getContext('2d');
		if (isHypo)
		{
			oldPoint.x = ptOrigin.x + R - r + p;
			oldPoint.y = ptOrigin.y;
			ct.clearRect(0, 0, canvasBase.width, canvasBase.height);
			ct.beginPath();
			ct.moveTo(oldPoint.x, oldPoint.y);
			loopID = self.setInterval( function() { drawH(ct, R, r, p, NumPoints, ptOrigin); }, 50);
		}
		else
		{
			oldPoint.x = ptOrigin.x + R + r - p;
			oldPoint.y = ptOrigin.y;
			ct.clearRect(0, 0, canvasBase.width, canvasBase.height);
			ct.beginPath();
			ct.moveTo(oldPoint.x, oldPoint.y);
			loopID = self.setInterval( function() { my.drawE(ct, R, r, p, NumPoints, ptOrigin); }, 50);
		}
	};
	
	return my;
}());