function Menu()
{	
	this.init();
}

Menu.prototype = 
{	wrapper:null,
	container: null,
	
	foregroundColor: null,
	backgroundColor: null,
	
	selector: null,
	brushSelector:null,
	brushSelectorId:null,
	save: null,
	load: null,
	exportPic: null,
	clear: null,
	about: null,
	brushSize:null,
	bgPicMode:null,
	
	init: function()
	{
		var option, space, separator, color_width = 15, color_height = 15;
		//Wrapper
		this.wrapper = document.createElement("div");
		this.wrapper.id= 'menuWrapper';
		
		//header
		header = document.createElement("div");
		header.id= 'menuHeader';
		headerImg = document.createElement("img");
		headerImg.src = "images/logo.png";
		header.appendChild(headerImg);
		var downImg = document.createElement("img");
		downImg.id="arrow";
		downImg.src = "images/down.png";
		header.appendChild(downImg);
		this.wrapper.appendChild(header);
		
		//Content
		this.container = document.createElement("div");
		this.container.className = 'gui';
		this.container.id = 'menuContent';
		this.wrapper.appendChild(this.container);
		
		//Fore color selector
		menuItem = document.createElement("div");
		menuItem.appendChild(document.createTextNode("Color  "));
		this.foregroundColor = document.createElement("canvas");
		this.foregroundColor.style.marginBottom = '-3px';
		this.foregroundColor.style.cursor = 'pointer';
		this.foregroundColor.width = color_width;
		this.foregroundColor.height = color_height;
		menuItem.appendChild(this.foregroundColor);
		this.container.appendChild(menuItem);
		this.setForegroundColor( COLOR );
		
		//Background color selector
		menuItem = document.createElement("div");
		menuItem.appendChild(document.createTextNode("Background  "));
		this.backgroundColor = document.createElement("canvas");
		this.backgroundColor.style.marginBottom = '-3px';
		this.backgroundColor.style.cursor = 'pointer';
		this.backgroundColor.width = color_width;
		this.backgroundColor.height = color_height;
		menuItem.appendChild(this.backgroundColor);
		this.container.appendChild(menuItem);
		this.setBackgroundColor( BACKGROUND_COLOR );

		//Brush menu
		menuBrush = document.createElement("div");
		menuBrush.id = 'menuBrush';
		menuBrush.appendChild(document.createTextNode("Brush style"));
		this.container.appendChild(menuBrush);
		//Brush popup
		brushPop = document.createElement("div");
		brushPop.id = 'brushPopup';
		for (i = 0; i < BRUSHES.length; i++)
		{
			var s = BRUSHES[i].toUpperCase();
			s=s.replace("_"," ");
			if(s!=""){
				option = document.createElement("div");
				option.id = i;
				option.className=(s=="WEB"||s=="RIBBON"||s=="DIAMONDS")?"bottomBordered":"";
				option.innerHTML = s;
				brushPop.appendChild(option);
				option.addEventListener('click'
						, function(){
								//alert("pre: "+ menu.brushSelectorId);
								var brushId=this.id;
								if(brushId!=null){
									menu.brushSelectorId=brushId;
									if (BRUSHES[brushId] == "")return;
									brush.destroy();
									brush = eval("new " + BRUSHES[brushId] + "(context)");
									window.location.hash = BRUSHES[brushId];
								}
							}
						, false);
			}
		}
		this.container.appendChild(brushPop);

		//Brush size
		var menuItem = document.createElement("div");
		menuItem.appendChild(document.createTextNode("Brush size "));

		//decresize size
		var decreaseSize= document.createElement("div");
		decreaseSize.id="decreaseBrushSize";
		decreaseSize.className="adjustBrushSize";
		decreaseSize.appendChild(document.createTextNode("-"));
		decreaseSize.addEventListener('click'
				,function(evt){
					if(BRUSH_SIZE>1){
						BRUSH_SIZE-=1;
						menu.brushSize.value=BRUSH_SIZE;
					}
				}
				, false);
		decreaseSize.onselectstart = function(){ return false };
		decreaseSize.onmousedown = function(){ return false };
		menuItem.appendChild(decreaseSize);

		//increase size
		var increaseSize= document.createElement("div");
		increaseSize.id="increaseBrushSize";
		increaseSize.className="adjustBrushSize";
		increaseSize.appendChild(document.createTextNode("+"));
		increaseSize.addEventListener('click'
				,function(evt){
						  BRUSH_SIZE+=1;
						  menu.brushSize.value=BRUSH_SIZE;
				}
				, false);
		increaseSize.onselectstart = function(){ return false };
		increaseSize.onmousedown = function(){ return false };
		menuItem.appendChild(increaseSize);
		
		this.brushSize= document.createElement("input");
		this.brushSize.id="brushSize";
		this.brushSize.size=3;
		this.brushSize.disabled="disabled";
		//brushSize.maxlength="3"; 
		this.brushSize.value=BRUSH_SIZE;
		menuItem.appendChild(this.brushSize);
		this.brushSize.addEventListener('keydown',function(evt){
			  var theEvent = evt || window.event;
			  var key = theEvent.keyCode || theEvent.which;
			  key = String.fromCharCode( key );
			  
			  if(theEvent.keyCode==13){
				  s=(this.value);
				  if(s=="" ||s==undefined)s=1;
				  else s=parseInt(s);
				  //if(s==Number.NaN)s=1;
				  BRUSH_SIZE=s;
				  this.value=s;
				  if(this.value=="NaN"){this.value=1;BRUSH_SIZE=1; }
				  this.blur();
			  }
		} , false);
		this.container.appendChild(menuItem);

		
		//Draw text
		var drawTxtMenu = document.createElement("div");
		drawTxtMenu.id = "drawTxtMenu";
		drawTxtMenu.className = 'button';
		drawTxtMenu.innerHTML = 'Draw Text';
		this.container.appendChild(drawTxtMenu);

		var drawTxtDetail = document.createElement("div");
		drawTxtDetail.id="drawTxtDetail";
		this.container.appendChild(drawTxtDetail);
		
		var inputRow = document.createElement("div");
		inputRow.innerHTML="Text content: <input id='drawTxtDetailText' type='text' value=''/>";
		drawTxtDetail.appendChild(inputRow);

		var inputRow = document.createElement("div");
		inputRow.id="drawTxtDetailFont";
		inputRow.innerHTML="Font: <input id='drawTxtDetailFontInput' type='text' value='default'/>";
		drawTxtDetail.appendChild(inputRow);

		var detective = new Detector();
		fontArr= new Array("cursive","monospace","serif","sans-serif",
							"fantasy","default","Arial","Arial Black","Arial Narrow",
							"Arial Rounded MT Bold","Bookman Old Style","Bradley Hand ITC",
							"Century","Century Gothic","Comic Sans MS","Courier",
							"Courier New","Georgia","Gentium","Impact","King",
							"Lucida Console","Lalit","Modena","Monotype Corsiva",
							"Papyrus","Tahoma","TeX","Times","Times New Roman",
							"Trebuchet MS","Verdana","Verona");
		var font = document.createElement("div");
		font.id="fontLst";
		s = "";
		for(var i=0; i<fontArr.length;i++){
			if(detective.test(fontArr[i]))s=s+"<div style='font-family: "+fontArr[i]+";'>"+fontArr[i]+"</div>";
		} 
		font.innerHTML = s;
		this.container.appendChild(font);
		
		inputRow = document.createElement("div");
		inputRow.innerHTML="Font style: <select id='drawTxtDetailFontStyle'><option value='regular'> Regular</option><option value='bold'> Bold</option><option value='italic'> Italic</option></select>";
		drawTxtDetail.appendChild(inputRow);

		inputRow = document.createElement("div");
		inputRow.innerHTML="Font size: <input id='drawTxtDetailFontSize'  class='small' type='text' value='12'/>";
		drawTxtDetail.appendChild(inputRow);

		inputRow = document.createElement("div");
		inputRow.innerHTML="Rotation angle: <input id='drawTxtDetailAngle'  class='small' type='text' value='0'/>";
		drawTxtDetail.appendChild(inputRow);
		
		//inputRow = document.createElement("div");
		//inputRow.innerHTML="Position x: <input class='small' id='drawTxtDetailX' type='text' value='12'/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Position y: <input id='drawTxtDetailY'  class='small' type='text' value='12'/>";
		//drawTxtDetail.appendChild(inputRow);
		
		inputRow = document.createElement("div");
		inputRow.id = "drawTxtDetailOkDiv";
		inputRow.innerHTML="<input id='drawTxtDetailOk' type='submit' value='OK'/>";
		drawTxtDetail.appendChild(inputRow);
		

		
		
		
		
		//Load image MODE
		var loadBgImgDiv= document.createElement("div");
		loadBgImgDiv.id= "loadBgImgMenu";
		this.container.appendChild(loadBgImgDiv);
		var loadBgImg= document.createElement("span");
		loadBgImg.id= ("loadBgImg");
		loadBgImg.innerHTML = 'Load image';
		loadBgImgDiv.appendChild(loadBgImg);
		
		this.bgPicMode = document.createElement("select");
		this.bgPicMode.id="bgPicMode";
		option = document.createElement("option");
		option.id = 0;
		option.innerHTML = "Stretch";
		this.bgPicMode.appendChild(option);
		option = document.createElement("option");
		option.id = 1;
		option.innerHTML = "Center";
		this.bgPicMode.appendChild(option);
		option = document.createElement("option");
		option.id = 2;
		option.innerHTML = "Tile";
		this.bgPicMode.appendChild(option);
		loadBgImgDiv.appendChild(this.bgPicMode);
		
		
		
		//Undo
		var undo = document.createElement("div");
		undo.className = 'button';
		undo.id = 'undo';
		undo.innerHTML = 'undo';
		this.container.appendChild(undo);
		
		//Redo
		var redo = document.createElement("div");
		redo.className = 'button';
		redo.id= 'redo';
		redo.innerHTML = 'Redo';
		this.container.appendChild(redo);
		
		//Save
		this.save = document.createElement("div");
		this.save.id = "saveMenu";
		this.save.className = 'button';
		this.container.appendChild(this.save);
		
		var s= document.createElement("span");
		s.id= ("save");
		s.innerHTML = 'Save';
		this.save.appendChild(s);
		
		this.fileName= document.createElement("input");
		this.fileName.id="fileName";
		this.fileName.size=20;
		this.fileName.value="New File";
		this.save.appendChild(this.fileName);
		
		
		//Load saved files
		this.load = document.createElement("div");
		this.load.id = "loadMenu";
		this.load.className = 'button';
		this.load.innerHTML = 'Load';
		this.container.appendChild(this.load);

		var savedFiles = document.createElement("div");
		savedFiles.id="savedFiles";
		
		for (var i=0; i<=localStorage.length-1; i++){  
			var key = localStorage.key(i);
			if(key.indexOf('divvr_')==0){
				var so = key.substr(6);
				option = document.createElement("div");
				option.className="fileItem";
				option.innerHTML = so+"<span title='delete' class='deleteSaveFiles'>x</span>";
				savedFiles.appendChild(option);
			}
		}  
		this.container.appendChild(savedFiles);
		
		
		//Export
		this.exportPic = document.createElement("div");
		this.exportPic.className = 'button';
		this.exportPic.id= 'exportMenu';
		this.exportPic.innerHTML = 'Export';
		this.container.appendChild(this.exportPic);
		
		//Clear
		this.clear = document.createElement("div");
		this.clear.id = 'clearMenu';
		this.clear.className = 'button';
		this.clear.innerHTML = 'Clear';
		this.container.appendChild(this.clear);

		//About
		this.about = document.createElement("div");
		this.about.id="about";
		this.about.className = 'button lastItem';
		this.about.innerHTML = 'About';
		this.container.appendChild(this.about);
		

	},
	
	setForegroundColor: function( color )
	{
		var context = this.foregroundColor.getContext("2d");
		context.fillStyle = 'rgb(' + color[0] + ', ' + color[1] +', ' + color[2] + ')';
		context.fillRect(0, 0, this.foregroundColor.width, this.foregroundColor.height);
		context.fillStyle = 'rgba(0, 0, 0, 0.1)';
		context.fillRect(0, 0, this.foregroundColor.width, 1);
	},
	
	setBackgroundColor: function( color )
	{
		var context = this.backgroundColor.getContext("2d");
		context.fillStyle = 'rgb(' + color[0] + ', ' + color[1] +', ' + color[2] + ')';
		context.fillRect(0, 0, this.backgroundColor.width, this.backgroundColor.height);
		context.fillStyle = 'rgba(0, 0, 0, 0.1)';
		context.fillRect(0, 0, this.backgroundColor.width, 1);		
	}
}

function validate(evt) {
	  var theEvent = evt || window.event;
	  var key = theEvent.keyCode || theEvent.which;
	  key = String.fromCharCode( key );
	  var regex = /[0-9]|\./;
	  if( !regex.test(key) ) {
	    theEvent.returnValue = false;
	    theEvent.preventDefault();
	  }
	}
