var MMath = (function ()
{
	var my 			=	{};
	my.HCF			=	function HCF(a, b)
						{
							var i = 0;
							var j = 0;
							var hcf = 0;

							if (a < b)
							{
								hcf = a;
								i = b;
							}
							else
							{
								hcf = b;
								i = a;
							}
							do
							{
								j = i % hcf;
								if (j != 0)
								{
									i = hcf;
									hcf = j;
								}
							} while (j != 0);
							
							return hcf;
						};
						
	return my;
}());