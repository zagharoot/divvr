historyArr=null;
curHisInd=-1;
const HISTORY_SIZE=3;

/*DOCUMENT LOADED*/
$(document).ready(function(){
	
	//localStorage.clear();
	
	//------Numeric only for input entry------
	jQuery.fn.ForceNumericOnly =
	function()
	{
	    return this.each(function()
	    {
	        $(this).keydown(function(e)
	        {   
	            var key = e.charCode || e.keyCode || 0;
	            // allow backspace, tab, delete, arrows, numbers and keypad numbers ONLY
	            return (
	                key == 189 ||  //for minus degree
	                key == 8 || 
	                key == 9 ||
	                key == 46 ||
	                (key >= 37 && key <= 40) ||
	                (key >= 48 && key <= 57) ||
	                (key >= 96 && key <= 105));
	        })
	    })
	};
	$("#drawTxtDetailFontSize").ForceNumericOnly();
	$("#drawTxtDetailAngle").ForceNumericOnly();

	
	//------Cursor image for drawing text------
	$("body").append("<div id='drawingTxt' style='position:absolute; z-index:1000;'><img src='images/write.ico' /></div>");

	
	//------Enable to drag menu------
	$("#menuWrapper").draggable(
			{
				drag:function(event,el){
					//Control el.postion.left/top when drag
				}
				,stop: function(event, ui) {}
				,handle:"#menuHeader"
				,scroll:false
			}
	);
	
	//------Show/hide list of burushes------
	sggBox = $("#brushPopup"); sggBox.hide();
	var qBox = $("#menuBrush");
	sggBoxSlideUpAction=null;
	qBox.mouseenter(function(){
						if(sggBoxSlideUpAction!=null){
							clearTimeout(sggBoxSlideUpAction);
							sggBoxSlideUpAction=null;
						}
						sggBox.slideDown();
					});
	qBox.click(function(){
		if(sggBoxSlideUpAction!=null){
			clearTimeout(sggBoxSlideUpAction);
			sggBoxSlideUpAction=null;
		}
		sggBox.slideDown();
	});
	sggBox.mouseleave(function(){sggBoxSlideUpAction=setTimeout("sggBox.slideUp()",100)});
	sggBox.mouseenter(function(){
			if(sggBoxSlideUpAction!=null){
				clearTimeout(sggBoxSlideUpAction);
				sggBoxSlideUpAction=null;
			}
		});
	qBox.mouseleave(function(){sggBoxSlideUpAction=setTimeout("sggBox.slideUp()",100)});

	
	//------Show/hide draw text detail------
	drawTxtDetail = $("#drawTxtDetail"); drawTxtDetail.hide();
	var drawTxtMenu = $("#drawTxtMenu");
	drawTxtDetailSlideUpAction=null;
	drawTxtMenu.mouseenter(function(){
		if(drawTxtDetailSlideUpAction!=null){
			clearTimeout(drawTxtDetailSlideUpAction);
			drawTxtDetailSlideUpAction=null;
		}
		drawTxtDetail.slideDown();
	});
	drawTxtMenu.click(function(){
		if(drawTxtDetailSlideUpAction!=null){
			clearTimeout(drawTxtDetailSlideUpAction);
			drawTxtDetailSlideUpAction=null;
		}
		drawTxtDetail.slideDown();
	});
	drawTxtDetail.mouseleave(function(){drawTxtDetailSlideUpAction=setTimeout("drawTxtDetail.slideUp()",100)});
	$("#drawTxtDetail,#drawTxtDetail input ").mouseenter(function(){
		if(drawTxtDetailSlideUpAction!=null){
			clearTimeout(drawTxtDetailSlideUpAction);
			drawTxtDetailSlideUpAction=null;
		}
	});
	drawTxtMenu.mouseleave(function(){drawTxtDetailSlideUpAction=setTimeout("drawTxtDetail.slideUp()",100)});
	
	
	//------Show/hide list of font inside drawTextDetail------
	fontLst = $("#fontLst"); fontLst.hide();
	var drawTxtDetailFont = $("#drawTxtDetailFont,#drawTxtDetailFontInput");
	fontLstSlideUpAction=null;
	drawTxtDetailFont.mouseenter(function(){
		if(fontLstSlideUpAction!=null){
			clearTimeout(fontLstSlideUpAction);
			fontLstSlideUpAction=null;
		}
		fontLst.slideDown();
	});
	drawTxtDetailFont.click(function(){
		if(fontLstSlideUpAction!=null){
			clearTimeout(fontLstSlideUpAction);
			fontLstSlideUpAction=null;
		}
		fontLst.slideDown();
	});
	fontLst.mouseleave(function(){fontLstSlideUpAction=setTimeout("fontLst.slideUp()",100)});
	fontLst.mouseenter(function(){
		if(fontLstSlideUpAction!=null){
			clearTimeout(fontLstSlideUpAction);
			fontLstSlideUpAction=null;
		}
		if(drawTxtDetailSlideUpAction!=null){
			clearTimeout(drawTxtDetailSlideUpAction);
			drawTxtDetailSlideUpAction=null;
		}
	});
	drawTxtDetailFont.mouseleave(function(){fontLstSlideUpAction=setTimeout("fontLst.slideUp()",100)});
	
	
	//------Show/hide list of saved files------
	createToggleSavedFilesAction();
	
	createUploadAction();
	
	resetHisArr();

	$("#mainCanvas").mouseup(function(){
		recordHisToArr();
	});
	$("#undo").click(function(){
		preHis();
	});
	$("#redo").click(function(){
		nextHis();
	});
	
	//------Patch for menu hover action------
	$("#loadBgImgMenu,  #saveMenu,   #loadMenu").hover(
		function(){	$(this).find("span").css("color","#333");}
		,function(){$(this).find("span").css("color","#ccc");}
	);
	
	//------Save to local storage------
	$("#save").click(function(){
		try{
			var s=$(this).next().val();
			if(s==""){s="no name";$(this).next().val(s);}
			var sKey="divvr_"+s

			localStorage.removeItem(sKey);
			localStorage.setItem(sKey,canvas.toDataURL('image/jpg'));
			showInfoDialog("Save","Drawing saved successfully.");
			
			//Recreate the list of saved files
			$("#savedFiles").remove();
			var savedFiles = document.createElement("div");
			savedFiles.id="savedFiles";
			
			//Upldate list of saved files (use to open file)
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
			$("#menuContent").append(savedFiles);
			
			$("#loadMenu").show();
			$("#savedFiles").hide();
			createDeleteAction();
			createToggleSavedFilesAction();
			createLoadAction();
		
		}catch(e){
			showInfoDialog("Save","Could not save, local storage quota exceeded.");
		}
	});
	
	
	//------Load from local storage------
	createLoadAction();

	
	//------Delete------
	createDeleteAction();
	
	//if no file available -> disable load
	if($(".deleteSaveFiles").size()==0){
		$("#savedFiles").hide();
		$("#loadMenu").hide();
	}
	
	//------Patch conflict drag and extend menu------
	$("#menuHeader").mousedown(function(){
		gTime = new Date();
	});
	$("#menuHeader").mouseup(function(){
		if(new Date()-gTime<130){
			var menu=$("#menuContent");
			if(menu.is(":hidden")) {
				menu.slideDown();
				$("#arrow").attr("src","images/up.png");
			}else{ 
				menu.slideUp();
				$("#arrow").attr("src","images/down.png");
			}
		}
	});
	
	
	//------Initiate------
	$("#menuContent").hide();
	recordHisToArr();
	initInfoDialogBox();
	initConfirmDialogBox();
	
	//------Clear action------
	$("#clearMenu").click(function(){
		confirmDailog="clear";
		showconfirmDialog("Clear","Are you sure that you want to clear?");
		//brush.destroy();
		//brush = eval("new " + BRUSHES[menu.selector.selectedIndex] + "(context)");
	});

	
	//------Export action------
	$("#exportMenu").click(function(){
		flatten();
		window.open(flattenCanvas.toDataURL('image/jpg'),'mywindow');		
		showInfoDialog("Export","Exported image is open in a new window/tab. Right click, select \"Save As\" to save the image to file.");
		window.focus();
	});
	
	
	//------About box action------
	$("#about").click(function(){
			cleanPopUps();
			isAboutVisible = true;
			//showInfoDialog("About","About content");
			aboutDialogBox();
	});
	
	
	//------Draw text------
	$("#drawingTxt").hide();
	gIsDrawingText=false;
	
	$("#drawTxtDetailOk").click(function(){
		var s=$("#drawTxtDetailText").val();
		if(s.trim()!=""){
			gIsDrawingText=true;
			$("#drawTxtDetail").slideUp();
			$("#drawingTxt").show();
		}
	});
	
	$("#mainCanvas").click(function(){
		if(gIsDrawingText==true){
			drawText();
			gIsDrawingText=false;
			$("#drawingTxt").hide();
		}
	});
	
	$(document).mousemove(function(e){
		gY=e.pageY;
		gX=e.pageX;
		$("#drawingTxt").css("top",gY-20+"px").css("left",gX-20+"px");
	}); 

	//Select font
	$("#fontLst div").click(function(){
		var s=$(this).text();
		$("#drawTxtDetailFontInput").val(s);
		$("#fontLst").slideUp();
	});
	
});



/*Delete action to delete save file*/
function createDeleteAction(){
	$(".deleteSaveFiles").click(function(){
		confirmDailog="delete";
		deletingItem=$(this);
		showconfirmDialog("Delete","Are you sure?");
	});
}


/*Show/hide list of save file*/
function createToggleSavedFilesAction(){
	savedFileLst = $("#savedFiles"); savedFileLst.hide();
	loadMenu = $("#loadMenu");
	savedFileLstSlideUpAction=null;
	loadMenu.mouseenter(function(){
		if(savedFileLstSlideUpAction!=null){
			clearTimeout(savedFileLstSlideUpAction);
			savedFileLstSlideUpAction=null;
		}
		savedFileLst.slideDown();
		//savedFileLst.animate({width: 100,height:200}, 500);
	});
	loadMenu.click(function(){
		if(savedFileLstSlideUpAction!=null){
			clearTimeout(savedFileLstSlideUpAction);
			savedFileLstSlideUpAction=null;
		}
		savedFileLst.slideDown();
		//savedFileLst.show();
	});
	savedFileLst.mouseleave(function(){savedFileLstSlideUpAction=setTimeout("savedFileLst.slideUp()",100)});
	savedFileLst.mouseenter(function(){
		if(savedFileLstSlideUpAction!=null){
			clearTimeout(savedFileLstSlideUpAction);
			savedFileLstSlideUpAction=null;
		}
		setTimeout("$('#savedFiles').slideDown()",50);
	});
	loadMenu.mouseleave(function(){
		savedFileLstSlideUpAction=setTimeout("savedFileLst.slideUp()",50);
	});
}


/*Init/reset history array of data for canvas*/
function resetHisArr(){
	for(var i=0; i<HISTORY_SIZE+20; i++){
		localStorage.removeItem("h"+i);
	}
	for(var i=0; i<HISTORY_SIZE; i++){
		localStorage.setItem("h"+i,"");
	}
	curHisInd=0;
	localStorage.setItem("h"+curHisInd,canvas.toDataURL('image/jpg'));
}


/*Save current canvas to history array*/
function recordHisToArr(){
	var preHisInd = curHisInd;
	try{
		//Record to next position
		curHisInd +=1;	curHisInd = (curHisInd==HISTORY_SIZE)?0:curHisInd;
		localStorage.removeItem("h"+curHisInd);
		localStorage.setItem("h"+curHisInd,canvas.toDataURL('image/jpg'));
		
		//Empty the next position
		var nextInd = curHisInd+1;	nextInd = (nextInd==HISTORY_SIZE)?0:nextInd;
		localStorage.setItem("h"+nextInd,"");
	}catch(e){
		showInfoDialog("History","History recording action fail, local storage quota exceeded.");
		curHisInd=preHisInd;
	}
}


/*Restore canvas from history*/
function nextHis(){
	var nextInd = curHisInd+1;	nextInd = (nextInd==HISTORY_SIZE)?0:nextInd;
	var canvasData=localStorage.getItem("h"+nextInd);
	if(canvasData!=""){
		localStorageImage = new Image();
		localStorageImage.addEventListener("load"
			, function(event){
				localStorageImage.removeEventListener(event.type, arguments.callee, false);
				context.clearRect(0, 0, canvas.width, canvas.height);
				context.drawImage(localStorageImage,0,0);}
			, false);
		localStorageImage.src = canvasData;
		curHisInd=nextInd;
	}
}


/*Restore canvas from history*/
function preHis(){
	var preInd = curHisInd-1;	preInd = (preInd==-1)?HISTORY_SIZE-1:preInd;
	var canvasData=localStorage.getItem("h"+preInd);
	if(canvasData!=""){
		localStorageImage = new Image();
		localStorageImage.addEventListener("load"
				, function(event){
					localStorageImage.removeEventListener(event.type, arguments.callee, false);
					context.clearRect(0, 0, canvas.width, canvas.height);
					context.drawImage(localStorageImage,0,0);}
				, false);
		localStorageImage.src = canvasData;
		curHisInd=preInd;
	}
}

/*Upload action*/
function createUploadAction(){
	var btnUpload=$('#loadBgImg');
	var status=$('#status');
	new AjaxUpload(btnUpload, {
		action: 'php/upload-file.php',
		name: 'uploadfile',
		onSubmit: function(file, ext){
		if (! (ext && /^(jpg|png|jpeg|gif)$/.test(ext))){ 
			// extension is not allowed 
			//status.text('Only JPG, PNG or GIF files are allowed');
			return false;
		}
		//status.text('Uploading...');
	},
	onComplete: function(file, response){
		//On completion clear the status
		//status.text('');
		//Add uploaded file to list
		if(response==="success"){

			var img = new Image();
			img.onload = function(){
				var bgPicMode=menu.bgPicMode.selectedIndex;
				//full canvas
				if(bgPicMode==0){
					var W=$("#mainCanvas").width();
					var H=$("#mainCanvas").height();
					context.drawImage(img,0,0,W,H);
					//canvas centered 
				}else if(bgPicMode==1){
					var W=$("#mainCanvas").width();
					var H=$("#mainCanvas").height();
					var w = img.width;
					var h = img.height;
					context.drawImage(img,(W-w)/2,(H-h)/2,w,h);
					//tile on canvas
				}else{
					var W=$("#mainCanvas").width();
					var H=$("#mainCanvas").height();
					var w = img.width;
					var h = img.height;
					var m=H/h;
					var n=W/w;
					for(var i=0;i<m;i++){
						for(var j=0;j<n;j++){
							context.drawImage(img,j*w,i*h,w,h);
						}
					}
				} 
				//Record history
				recordHisToArr();
			}
			img.src = 'php/uploads/'+file;
		} else if(response==="toobig"){
			showInfoDialog("Upload","Failed to upload. The image should not be larger than 200KB. Please select a different image");
		}
	}
	});
	
}


/*get List of save schema name*/
function getLstSavedSchema(userName){
	ret = new Array();
	for (var i=0; i<=localStorage.length-1; i++){  
		var key = localStorage.key(i);
		if(key.indexOf('flowNx_'>-1))ret.push(key.substr(7));
	}  
	return ret;
}


/*Show infomation dailog*/
function showInfoDialog(title,msg){
	g_infoDialogTitle.text(title);
	g_infoDialogMsg.text(msg);
	g_infoDialog.show();
	g_dialogBg.fadeIn("slow");
}


/*Close infomation dailog*/
function closeInfoDialog(){
	g_infoDialog.hide();
	g_dialogBg.fadeOut("slow");
}


/*Initiate dialog box*/
function initInfoDialogBox(){
	$("body").append(""+
		"<div id='infoDialog' title=''  class='hide'>" +
			"<div class='infoDialogTitle'>No item found</div>" +
				"<p class='infoDialogMsg'>There are no matching records for <span id='noItemFoundDate'></span>. Select other date.</p>" +
				"<p class='infoDialogCloseBtn'>Close</p>" +
			"</div>" +
			"<div id='dialogBg' class='hide'>"+
		"</div>"
	);

	g_infoDialogTitle=$(".infoDialogTitle");
	g_infoDialogMsg=$(".infoDialogMsg");
	g_infoDialog=$("#infoDialog");
	g_dialogBg=$("#dialogBg");
	
	$(".infoDialogCloseBtn").click(function(){
		closeInfoDialog();
	});
}


/*Show infomation dailog*/
function showconfirmDialog(title,msg){
	confirmDaialogResult="";
	g_confirmDialogTitle.text(title);
	g_confirmDialogMsg.text(msg);
	g_confirmDialog.show();
	g_dialogBg.fadeIn("slow");
}


/*Initiate dialog box*/
function initConfirmDialogBox(){
	$("body").append(""+
		"<div id='confirmDialog' title=''  class='hide'>" +
			"<div class='confirmDialogTitle'>Confirm Title</div>" +
				"<p class='confirmDialogMsg'>Confirm message</p>" +
				"<p class='confirmDialogOkBtn'>OK</p>" +
				"<p class='confirmDialogCancelBtn'>CANCEL</p>" +
			"</div>" +
			"<div id='dialogBg' class='hide'>"+
		"</div>"
	);

	g_confirmDialogTitle=$(".confirmDialogTitle");
	g_confirmDialogMsg=$(".confirmDialogMsg");
	g_confirmDialog=$("#confirmDialog");
	g_dialogBg=$("#dialogBg");
	
	$(".confirmDialogCancelBtn").click(function(){
		g_confirmDialog.hide();
		g_dialogBg.fadeOut("slow");
		confirmDaialogResult="CANCEL";
	});
	$(".confirmDialogOkBtn").click(function(){
		g_confirmDialog.hide();
		g_dialogBg.fadeOut("slow");
		confirmDaialogResult="OK";
		processConfirmOk();
	});
}


/*Initiate dialog box*/
function aboutDialogBox(){
	if($("#aboutDialog").size()==0){
		$("body").append(""+
				"<div id='aboutDialog' title=''  class=''>" +
				"<div class='infoDialogTitle'>About</div>" +
				"<div id='aboutContent'>"+
				"<div id='githubLogo'><a href=''><img title='' src='images/github-logo.png' /></a></div>" +
				"<p style='text-align: center;'><br/ >" +
				"Brush: <span class='key'>d</span>	<span class='key'>f</span> 	size, <span class='key'>r</span> 	reset	<br>" +
				"Color: <span class='key'>shift</span>	 wheel, <span class='key'>alt</span> picker <br>" +
				"</p>" +
				"<div style='clear:both;'></div>" +
				
				"<p>Divvr is based on <a href='http://twitter.com/mrdoob'>Mr. Doob's</a>  <a href='http://mrdoob.com/blog/post/689'> Harmony project </a></p>" +
				"<p>Sketchy, Shaded, Chrome, Fur, Longfur and Web are all variations of the Neighbor points connection concept. First implemented in <a href='http://www.zefrank.com/scribbler/'> The Scribbler </a></p>" +
				"<p>The original source is located <a href='http://github.com/mrdoob/harmony'> here</a> and is licensed under: GNU GPL v3 </p>" +
				"<p>7Touch Group extended the Harmony solution with the following additions:</p>" +
				"<ul>" +
				"<li> Add new brushes" +
				"<li> Upload and insert image into drawing" +
				"<li> Undo and redo action</li>" +
				"<li> New user interface, more attractive and easy to use</li>" +
				"<li> Save and load drawings</li>" +
				"<li> Delete saved drawings</li>" +
				"</ul>" +
				"<p>Source code is available <a href='http://github.com/7TouchGroup/divvr'> here</a> and is licensed under: GNU GPL v3</p>" +
				"<p id='contactPrivacy'>"+
				"<a href='http://www.7touchgroup.com'>7Touch Group</a><span> | </span>" +
				"<a href='http://www.7touchgroup.com/contact'>Contact</a><span> | </span>" +
				"<a href='http://www.7touchgroup.com/privacy'>Privacy</a>" +
				"</p>" +
				"</div>" +
				"<p class='infoDialogCloseBtn'>Close</p>" +
				"</div>"
		);
		$("#aboutDialog").show();
		g_dialogBg.fadeIn("slow");
		
		$(".infoDialogCloseBtn").click(function(){
			$("#aboutDialog").hide();
			g_dialogBg.fadeOut("slow");
		});
	}else{
		$("#aboutDialog").show();
		g_dialogBg.fadeIn("slow");
	}
}

/*Process as user confirm the dialog*/
function processConfirmOk(){
	if(confirmDailog=="delete"){
		context.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
		//saveToLocalStorage();
		//brush.destroy();
		//brush = eval("new " + BRUSHES[menu.selector.selectedIndex] + "(context)");
		
		//delete file on local storage
		s=deletingItem.parent().text();
		s="divvr_"+s.substr(0,s.length-1);
		localStorage.removeItem(s);
		
		//delete menu item
		deletingItem.parent().remove();
		$("#fileName").val("");

		//if no file available -> disable load
		if($(".deleteSaveFiles").size()==0){
			$("#savedFiles").hide();
			$("#loadMenu").hide();
		}else{
			setTimeout("$('#savedFiles').slideUp()",500);
		}		
	}else if(confirmDailog=="clear"){
		context.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
		//saveToLocalStorage();
		resetHisArr();
	}
}

/*Load from local storage action*/
function createLoadAction(){
	$(".fileItem").click(function(){
		var fileName=$(this).text();
		fileName=fileName.substr(0,fileName.length-1);
		var sKey="divvr_"+fileName
		var canvasData=localStorage.getItem(sKey);
		localStorageImage = new Image();
		localStorageImage.addEventListener("load"
				, function(event){
					localStorageImage.removeEventListener(event.type, arguments.callee, false);
					context.clearRect(0, 0, canvas.width, canvas.height);
					context.drawImage(localStorageImage,0,0);}
				, false);
		localStorageImage.src = canvasData;
		$("#fileName").val(fileName);
	});
}


/*Draw text on canvas*/
function drawText(){
		var s=$("#drawTxtDetailText").val();
		if(s.trim()!=""){
			var f="Unknown Font, sans-serif";
			f=$("#drawTxtDetailFontInput").val() + "," + f;
			
			var fSize=12;
			try{
				fSize=parseInt($("#drawTxtDetailFontSize").val());
			}catch(e){
				fSize=12;
			}
			f =fSize+ "px "+f;
			
			var fStyle =$("#drawTxtDetailFontStyle").val();
			fStyle =(fStyle =="regular")?"":fStyle;
			f= fStyle+ " "+f;
			context.font = f;
			//context.font = 'bold italic 400 30px/2 Unknown Font, sans-serif';
			var color  = "rgb("+COLOR[0]+","+COLOR[1]+","+COLOR[2]+")";
			context.fillStyle = color;
			context.textAlign=$("#drawTxtDetailAlign").val();
			context.textBaseline="center";
			
			try{x=parseInt($("#drawTxtDetailX").val());}catch(e){x=0;}
			try{y=parseInt($("#drawTxtDetailY").val());}catch(e){y=0;}
			try{rotateAngle=parseInt($("#drawTxtDetailAngle").val());}catch(e){rotateAngle=0;}
			x=gX;
			y=gY;
			context.save();
			context.translate(x, y);
			context.rotate(rotateAngle * Math.PI/180);
			context.fillText(s, 0, 0);
            context.restore();
		}
		$("#drawTxtDetail").slideUp();
		recordHisToArr();
}
