function shaded_polygons( context )
{
	this.init( context );
}

shaded_polygons.prototype =
{
	context: null,

	prevMouseX: null, prevMouseY: null,

	count: null,

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
		var i, dx, dy, d, cx, cy, steps, step_delta;

		this.context.lineWidth = BRUSH_SIZE;
		this.context.strokeStyle = "rgba(" + COLOR[0] + ", " + COLOR[1] + ", " + COLOR[2] + ", " + 0.1 * BRUSH_PRESSURE + ")";	

		dx = mouseX - this.prevMouseX;
		dy = mouseY - this.prevMouseY;
		d = Math.sqrt(dx * dx + dy * dy) * 2;
		
		cx = Math.floor(mouseX / 100) * 100 + 50;
		cy = Math.floor(mouseY / 100) * 100 + 50;
		
		steps = Math.floor( Math.random() * 10 );
		step_delta = d / steps;

		for (i = 0; i < steps; i++)
		{
			this.context.beginPath();
			//this.context.arc( cx, cy, (steps - i) * step_delta, 0, Math.PI*2, true);
			this.drawSquare(this.context,cx,cy,(steps - i) * step_delta);
			this.context.stroke();
		}

		this.prevMouseX = mouseX;
		this.prevMouseY = mouseY;
	},

	strokeEnd: function()
	{
		
	},

	drawSquare: function(ctx,x,y,r)//polygon
	{
		
		//x=x-r*Math.cos(Math.PI/4);
		//y=y-r*Math.sin(Math.PI/4);
		//r=r*1.4142;
		ctx.moveTo(x+r*Math.cos((72*0-20)*Math.PI/180),y+r*Math.sin((72*0-20)*Math.PI/180));
		for(var i=1;i<6;i++){
			var dx=r*Math.cos((72*i-20)*Math.PI/180);
			var dy=r*Math.sin((72*i-20)*Math.PI/180);
			ctx.lineTo(x+dx,y+dy);
		}
		ctx.stroke();
	}

}
