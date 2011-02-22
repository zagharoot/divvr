function squares( context )
{
	this.init( context );
}

squares.prototype =
{
	context: null,

	prevMouseX: null, prevMouseY: null,

	init: function( context )
	{
		this.context = context;
		this.context.globalCompositeOperation = 'source-over';
	},

	destroy: function()
	{
	},

	strokeStart: function( mouseX, mouseY )
	{
		this.prevMouseX = mouseX;
		this.prevMouseY = mouseY;
	},

	stroke: function( mouseX, mouseY )
	{
		var dx, dy, angle, px, py;
		
		dx = mouseX - this.prevMouseX;
		dy = mouseY - this.prevMouseY;
		angle = 1.57079633;
		px = Math.cos(angle) * dx - Math.sin(angle) * dy;
		py = Math.sin(angle) * dx + Math.cos(angle) * dy;

		this.context.lineWidth = BRUSH_SIZE;
		this.context.fillStyle = "rgba(" + BACKGROUND_COLOR[0] + ", " + BACKGROUND_COLOR[1] + ", " + BACKGROUND_COLOR[2] + ", " + BRUSH_PRESSURE + ")";
		this.context.strokeStyle = "rgba(" + COLOR[0] + ", " + COLOR[1] + ", " + COLOR[2] + ", " + BRUSH_PRESSURE + ")";
		
		var xx=mouseX;
		var yy=mouseY;
		this.drawSquare(this.context,xx,yy,Math.abs(py));

		this.prevMouseX = mouseX;
		this.prevMouseY = mouseY;
	},

	strokeEnd: function()
	{
		
	},
	
	drawSquare: function(ctx,x,y,r)//star
	{
		ctx.beginPath();
		//x=x-r*Math.cos(Math.PI/4);
		//y=y-r*Math.sin(Math.PI/4);
		//r=r*1.4142;
		//ctx.moveTo(x,y);
		//ctx.lineTo(x+r,y);
		//ctx.lineTo(x+r,y+r);
		//ctx.lineTo(x,y+r);
		//ctx.lineTo(x,y);
		ctx.moveTo(x,y-r);
		ctx.lineTo(x+r,y);
		ctx.lineTo(x,y+r);
		ctx.lineTo(x-r,y);
		ctx.lineTo(x,y-r);
		ctx.fill();
		ctx.stroke();
	}
}
