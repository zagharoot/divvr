function stars( context )
{
	this.init( context );
}

stars.prototype =
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
		var sr=r*1/2;
		ctx.moveTo(x+sr*Math.cos((72*0-30+36)*Math.PI/180),y+r*Math.sin((72*0-30+36)*Math.PI/180));
		for(var i=1;i<6;i++){
			var dx=r*Math.cos((72*i-20)*Math.PI/180);
			var dy=r*Math.sin((72*i-20)*Math.PI/180);
			ctx.lineTo(x+dx,y+dy);

			var sdx=sr*Math.cos((72*i-20+36)*Math.PI/180);
			var sdy=sr*Math.sin((72*i-20+36)*Math.PI/180);
			ctx.lineTo(x+sdx,y+sdy);
		}
		ctx.fill();
		ctx.stroke();
	}
}
