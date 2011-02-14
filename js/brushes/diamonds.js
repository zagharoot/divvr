function diamonds( context )
{
	this.init( context );
}

diamonds.prototype =
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
		ctx.moveTo(x-r, y);
		ctx.arc( x-r, y-r, r, Math.PI/2,0, true);
		ctx.arc( x+r, y-r, r, Math.PI,Math.PI/2, true);
		ctx.arc( x+r, y+r, r, Math.PI/2*3,Math.PI, true);
		ctx.arc( x-r, y+r, r, Math.PI*2,Math.PI/2*3, true);
		ctx.stroke();
	}
}
