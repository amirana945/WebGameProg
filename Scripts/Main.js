// JavaScript Document
var canvas;
var stage;

var loader;

var hSpeed = 3;
var eSpeed =1;
var trackTime;
var mcHero;

var maxDist = 400;
var level=1;
var mLeft,mRight;
var startCont,gameCont,enemyCont;
var sec =0;
var TOTALQ =10;
var currentQ =0;

var score =0;

var scoreT;

var startBt;

var soundBt;
var sOn = true;

var isPause=true;

var isGravity = true;
var onGround = false;
var isJump = false;
var isDead = false;
var isFound = false;
var mcFeet;
var heroCont;

var jumpSeq = new Array(5,4,2,2,1,-1,-2,-2,-4,-5);

var xyPlaces = new Array();

var quesT,lifeT;

var jStep = 0;
var fStep = 0;
var mcBack;
var explo;

function Main(){
	
	canvas = document.getElementById("gamew");
	stage = new createjs.Stage(canvas);
	optimizeForTouchAndScreens ();
	document.getElementById("gamew").style.display="none";
	stage.enableMouseOver(10);
	loadManifestg();
}

//pre load assets
function loadManifestg(mArray){
	
	manifest = new Array(
		
		{src: "images/startbt.png", id: "BtStart"},
		{src: "images/rect.png", id: "Grect"},
		{src: "images/backgroundb.png", id: "GBack"},
		{src: "images/prun.png", id: "Prun"},
		{src: "sounds/right.ogg", id: "Sright"}
	
	);
	
	
	
	loader = new createjs.LoadQueue(false);
	loader.installPlugin(createjs.Sound);
	createjs.Sound.initializeDefaultPlugins();
	createjs.Sound.alternateExtensions = ["mp3","ogg"];
	loader.addEventListener("progress", handleProgress);
	loader.addEventListener("complete", handleComplete);
	loader.loadManifest(manifest,true);
	
}
function handleProgress(e){
	var progresPrecentage = Math.round(loader.progress*100);
	var tStr = String("Loaded: "+progresPrecentage+" %.");
	document.getElementById('ploader').innerHTML =  String(tStr);
	if(progresPrecentage >= 100){
		e.target.removeEventListener("progress", handleProgress);
	}
	
	
}
function optimizeForTouchAndScreens () {
	if (createjs.Touch.isSupported()) {
		createjs.Touch.enable(stage,false,true);
		stage.preventSelection = false;
	}
}
function handleComplete(e){
	e.target.removeEventListener("complete", handleComplete);
	var element = document.getElementById("ploader");
	element.parentNode.removeChild(element);
	//make base screen for start
	document.getElementById("gamew").style.display="block";
	
	makeBgraphics();
	
	makeGameGraphics();
	addSprite();
	mLeft = false;
	mRight = false;
	isPause=true;
	
	startGame();
	
	
	stage.setChildIndex(startCont,stage.numChildren-1);
	stage.update();
	xyPlaces = new Array(
	{X:0,Y:560,W:900},
	{X:0,Y:450,W:230},
	{X:335,Y:334,W:230},
	{X:670,Y:450,W:230},
	{X:0,Y:218,W:230},
	{X:670,Y:218,W:230},
	{X:335,Y:102,W:230}
	);
	
}
function placeVir(){
	for(var i=0;i<xyPlaces.length;i++){
		var xcol = xyPlaces[i];
		var tx =xcol.X;
		var ty =xcol.Y;
		var tWd =xcol.W;
		var box = boxMakerb(tWd,10,"#000");
		
		box.x = tx;
		box.y = ty;
		box.alpha = 0.1;
		
		gameCont.addChild(box);
	}
	
}
function toggleSound(e){
	if(!ruleClick){
		ruleClick = true;
		ruleTrack = setInterval(ruleTime,300);
	if(sOn == true){
		sOn = false;
		BtSelect(e.target);
		return;
	}
	if(sOn == false){
		sOn = true;
		BtNor(e.target);
		return;
	}
	
	}
	
}
function BtSelect(bCont){
	
	var bmp = bCont.getChildByName("mover");
	bmp.visible = true;
	bmp = bCont.getChildByName("mout");
	bmp.visible = false;
	
	
}
function BtNor(bCont){
	
	var bmp = bCont.getChildByName("mover");
	bmp.visible = false;
	bmp = bCont.getChildByName("mout");
	bmp.visible = true;
	
}
function makeBgraphics(){
	mcBack = addBmp("GBack",0,0,false);
	stage.addChild(mcBack);
	
	
}
// make start screen and loads welcome texts from xml
function makeGameGraphics(){
	startCont = new createjs.Container();
	
	startBt= addBmp("BtStart",500,350,true);
	startCont.addChild(startBt);
	startBt.x = 450;							
	startBt.y = 450;
	startBt.cursor ="pointer";
	startBt.addEventListener("click",prepareGameScr);
	
	
	stage.addChild(startCont);
	
}


// when the start or jour button is presses, prepares the game window
function prepareGameScr(e){
	
	e.target.removeEventListener("click",prepareGameScr);
	
	startBt.removeEventListener("click",prepareGameScr);
	
	stage.removeChild(startCont);
	makeMainGame();
}

// load and makes game assets
function makeMainGame(){
	isPause=false;
	isFound = false;
	onGround = true;
	gameCont = new createjs.Container();
	stage.addChild(gameCont);
	
	heroCont = new createjs.Container();
	heroCont.regX = 40;
	heroCont.x = 100;
	heroCont.y = 462;
	heroCont.dir = 1;
	heroCont.addChild(mcHero);
	mcHero.gotoAndPlay("idle");
	heroCont.isFire = false;
	heroCont.sLife =  10;
	mcFeet = addBmp("Grect",10,93,true);
	mcFeet.x = 40;
	heroCont.addChild(mcFeet);
	mcFeet.alpha = 0.01;
	gameCont.addChild(heroCont);
	
	
	
	isGravity = true;
	
	trackTime = setInterval(keepTime,1000);
	
	//life
	lifeT = new createjs.Text("Life:","22px Arial");
	gameCont.addChild(lifeT);
	lifeT.textAlign = "left";
	lifeT.lineHeight = 32 ; // espace entre les lignes de texte pour la question
	lifeT.x = 1050;
	lifeT.y = 50;
	//question display
	quesT = new createjs.Text("","22px Arial");
	gameCont.addChild(quesT);
	quesT.textAlign = "left";
	quesT.lineHeight = 32 ; // espace entre les lignes de texte pour la question
	quesT.x = 50;
	quesT.y = 50;
	window.addEventListener("keydown",getKeyDown);
	window.addEventListener("keyup",getKeyUp);
	placeVir();
	
}
function getKeyDown(e){
	e.preventDefault();
	switch(e.keyCode){
		case 32:
		
		break;
		case 65:
		mLeft = true;
		if(heroCont.sFrame !== "run"){
			mcHero.gotoAndPlay("run");
			heroCont.sFrame = "run";
		}
		heroCont.scaleX = -1;
		heroCont.dir = -1;
		
		
		break;
		case 83:
		
		if(onGround && !isJump){
				isJump = true;
				onGround = false;
				mcHero.gotoAndPlay("jump");
				heroCont.sFrame = "jump";
			
			}
	
		break;
		case 68:
		mRight = true;
		
		if(heroCont.sFrame !== "run"){
			mcHero.gotoAndPlay("run");
			heroCont.sFrame = "run";
		}
		heroCont.scaleX = 1;
		heroCont.dir = 1;
		
		
		break;
		case 40:
	//	downk = true;
	
		break;
		
		
		
	}
	
}
function getKeyUp(e){
	e.preventDefault();
	switch(e.keyCode){
		case 32:
		
		break;
		case 65:
		mLeft = false;
	
	
		
		break;
		case 83:
		isJump = false;
	
		break;
		case 68:
		mRight = false;
		
	
		
		break;
		case 40:
	//	downk = true;
	
		break;
		
		
		
	}
	if(!mLeft && !mRight && !isJump){
		if(heroCont.sFrame !== "idle"){
			heroCont.sFrame = "idle";
			mcHero.gotoAndPlay("idle");
		}
		
	}
	
}

function keepTime(){
	if(!isPause){
		sec++;
		
			
		
		
	}
}

// Page de score
function showEndScreen(){	

	var bmp = addBmp("Keeper",80,180,false);
	gameCont.addChild(bmp);
	mesCont.visible = true;
	mesCont.x = 200;
	var sText = mesCont.getChildByName("messT"); 
	//message de l'athlète à la fin
	
	
	if(score <= 1){
		str =String(getMessStr("end2a"));
	}else{
		str = String(getMessStr("end2b"));
	}
		sText.text = String(getMessStr("end1")+ score+str+".");
	
	
	
	
	sec=0;
	
	var sc1 = String(colorObj.jourNorLine);
	var sc2 = String(colorObj.jourNorFill);
	var stext = String(colorObj.RejourText);
	startBt= makeButtonMain(stext,150,50,sc1,sc2,colorObj.jourTextColor);
	gameCont.addChild(startBt);
	startBt.x = 1070;
	startBt.y = 460;
	startBt.addEventListener("click",playAgain);
	
	

	
	
}

function startGame(){
	createjs.Ticker.setFPS(60);
	createjs.Ticker.addEventListener("tick",updateGame);
	
}
function updateGame(e){
	if(!isPause && !isDead){
		lifeT.text = String("Life Left: "+heroCont.sLife);
		moveHero();
		
	}
	
	stage.update();
	
}

function endDead(e){
	var sFrame = (parseInt(e.target.currentFrame));
	if(sFrame >= 29){
		mcHero.removeEventListener("change",endDead);
		setTimeout(heroDeadDone,1000);
			
			
	}
		
	
	
}
function heroDeadDone(){
	endGame();
	
}

function moveHero(){
	if(mRight){
		
		if(heroCont.x < 1160){
			heroCont.x += hSpeed;
		}
	
	
	}else if(mLeft){
	
			if(heroCont.x > 60){
				heroCont.x -= hSpeed;
			}
			
		
		
	}
	
	var intersection = collisionMethod();
	
	if(!intersection){
		
			onGround = false;
		
	}else{
		
			onGround = true;
		
	}
	

	if(!onGround && isGravity == true && !isJump){
		heroCont.y += 4;
		
		
	}
	if(isJump){
			
		 fStep++;
		heroCont.y -= jumpSeq[jStep];
		
		if(fStep >=10){
			jStep++;
			fStep = 0;
		}
		
		if(jStep >= jumpSeq.length){
			isJump = false;
			jStep = 0;
		}
		if(jStep >= 1 && onGround == true){
			isJump = false;
			jStep = 0;
			
		}
		
	}
	// console.log(intersection);
}
function collisionMethod(){
	var point = mcFeet.localToGlobal(15,2);
	for(var i=0;i<xyPlaces.length;i++){
		var xcol = xyPlaces[i];
		var tx =xcol.X;
		var ty =xcol.Y;
		var tWd =xcol.W;
		var distancex = (parseInt(point.x-tx));
		var distancey = Math.abs(parseInt(ty-point.y));
		//console.log(distancex);
		if(distancey <= 5){
			if(point.x > tx){
				if(distancex <= tWd){
					return true;
				}
			}
			if(point.x < tx){
				if(distancex >0){
					return true;
				}
			}
			
		}
	}
	
	
	
return false;
	
	
}
function playAgain(e){
	
	startBt.removeEventListener("click",playAgain);
	//quitterBt.removeEventListener("click",playAgain);
	
	stage.removeChild(gameCont);
	score =0;
	
	
	makeGameGraphics();
	readRuleData();
	stage.update();
}

function alphaTween(target,t,wts){
	createjs.Tween.get(target).wait(wts).to({alpha:t},1000,createjs.Ease.backOut);
}



function yTweenEl(target,ty){
	createjs.Tween.get(target).to({y:ty},2000,createjs.Ease.elasticOut);
}
function xTween(target,tx){
	createjs.Tween.get(target).to({x:tx},500,createjs.Ease.QuadIn);
	
}

function yTween(target,ty,wts){
createjs.Tween.get(target).wait(wts).to({y:ty},500,createjs.Ease.None);
	
}

function addBmp(bname,tx,ty,isR){
	var bmp = new createjs.Bitmap(loader.getResult(bname));
	if(isR){
		bmp.regX =bmp.image.width/2;
		bmp.regY = bmp.image.height/2;
	}
	bmp.y = ty;
	bmp.x = tx;
	return bmp;
	
}



function makeButtonMain(yt,wd,h,color1,color2,tcolor){
	var tCont = new createjs.Container();
	
	var ctd = new createjs.Text(yt,"40px Arial",tcolor);		// Taille de la police des boutons Jouer,Quitter, Règles...
	
	ctd.textAlign = "center";
	ctd.x = Math.round(wd/2);
	ctd.y = h/2-20;
	ctd.name = "btext";
	
	var shape = makeRoundBtS(color1,color2,wd,h,10);
	
 	tCont.addChild(shape);
	tCont.addChild(ctd);
	tCont.mouseChildren = false;
	tCont.cursor = "pointer";
	return tCont;
	
	
}
function makeRoundGrad(sc1,sc2){
	
	var gradient = new createjs.Shape();
    gradient.graphics.beginLinearGradientFill([sc1,sc2], [0, 1], 0, 50, 0,   130).drawRoundRect(0,0,150,90,10);
	return gradient;	
}
function makeRoundBt(sc1,wd,ht,corner){
	
	var shape = new createjs.Shape();
 	shape.graphics.beginFill(sc1).drawRoundRect(0,0,wd,ht,corner);
	return shape;
}
function makeRoundBtS(sc1,sc2,wd,ht,corner){
	
	var shape = new createjs.Shape();
	shape.graphics.beginStroke(sc1);
	shape.graphics.setStrokeStyle(2);
 	shape.graphics.beginFill(sc2).drawRoundRect(0,0,wd,ht,corner);
	return shape;
}

function boxMakerb(wdt,h,color){
	var shape = new createjs.Shape();
 	shape.graphics.beginFill(color).drawRect(0,0,wdt,h);
	return shape;
	
}



function alphaTweenT(target,t,wts){
	createjs.Tween.get(target).wait(wts).to({alpha:t},500,createjs.Ease.None).call(alphaDone);
}
function alphaDone(){
	
	
	
}

function endGame(){
	isPause = true;
	isDead = true;
	
	stage.removeEventListener("mousedown",movekey);
	
		
		gameCont.removeChild(heroCont);
		gameCont.removeChild(mcPlatform);
		
		//btNext.visible = false;
		clearInterval(trackTime);
		showEndScreen();
	
}
function btnMouseover(e){
	var bCont = e.target;
	var bmp = bCont.getChildByName("mover");
	bmp.visible = true;
	bmp = bCont.getChildByName("mout");
	bmp.visible = false;
	
	
}
function btnMouseout(e){
	var bCont = e.target;
	var bmp = bCont.getChildByName("mover");
	bmp.visible = false;
	bmp = bCont.getChildByName("mout");
	bmp.visible = true;
	
}
function mouseOverT(e){
	var bCont = e.target;
	var ttext = bCont.getChildByName("htext");
	ttext.color = "#ff0000";
	
}
function mouseOutT(e){
	var bCont = e.target;
	var ttext = bCont.getChildByName("htext");
	ttext.color = "#000000";
	
}
function showmouseover(e){
	
	widthHeightT(e.target,1);
	
	
}
function showmouseout(e){
	
	widthHeightT(e.target,.9);
	
	
}
function widthHeightT(bmp,t){
	
createjs.Tween.get(bmp).to({scaleX:t,scaleY:t},300,createjs.Ease.backOut);
	
}

function makeButton(yt,wd,h,color){
	var tCont = new createjs.Container();
	
	var ctd = new createjs.Text(yt,"20px Arial","#000");
	
	ctd.textAlign = "center";
	ctd.x = Math.round(wd/2);
	ctd.y = 5;
	ctd.name = "btext";
	
	var shape = boxMaker(wd,h,color);
	
 	tCont.addChild(shape);
	tCont.addChild(ctd);
	return tCont;
	
	
}


function getDistance(newX,newY,targetX,targetY){
	var dx =newX-targetX;
	var dy =newY-targetY;
	var dist = Math.sqrt(dx * dx +dy * dy);
	return parseInt(dist);
			
}


function addSprite(){
	var data ={
"framerate":24,
"images":[loader.getResult("Prun")],
"frames":[
    [2, 2, 252, 124, 0, 0, 0],
    [262, 2, 252, 124, 0, 0, 0],
    [522, 2, 252, 124, 0, 0, 0],
    [782, 2, 252, 124, 0, 0, 0],
    [1042, 2, 252, 124, 0, 0, 0],
    [1302, 2, 252, 124, 0, 0, 0],
    [1562, 2, 252, 124, 0, 0, 0],
    [2, 134, 252, 124, 0, 0, 0],
    [262, 134, 252, 124, 0, 0, 0],
    [522, 134, 252, 124, 0, 0, 0],
    [782, 134, 252, 124, 0, 0, 0],
    [1042, 134, 252, 124, 0, 0, 0],
    [1302, 134, 252, 124, 0, 0, 0],
    [1562, 134, 252, 124, 0, 0, 0],
    [2, 266, 252, 124, 0, 0, 0],
    [262, 266, 252, 124, 0, 0, 0],
    [522, 266, 252, 124, 0, 0, 0],
    [782, 266, 252, 124, 0, 0, 0],
    [1042, 266, 252, 124, 0, 0, 0],
    [1302, 266, 252, 124, 0, 0, 0],
    [1562, 266, 252, 124, 0, 0, 0],
    [2, 398, 252, 124, 0, 0, 0],
    [262, 398, 252, 124, 0, 0, 0],
    [522, 398, 252, 124, 0, 0, 0],
    [782, 398, 252, 124, 0, 0, 0],
    [1042, 398, 252, 124, 0, 0, 0],
    [1302, 398, 252, 124, 0, 0, 0],
    [1562, 398, 252, 124, 0, 0, 0],
    [2, 530, 252, 124, 0, 0, 0],
    [262, 530, 252, 124, 0, 0, 0]
],
"animations":{
    "idle": {"frames": [0, 1, 2, 3, 4, 5, 4, 3, 2, 1, 1], "speed": .25},
    "dead": {
        "next": "sdead",
        "frames": [23, 24, 25, 26, 27, 28, 29, 29, 29, 29],
        "speed": .25
    },
    "sdead": {"frames": [29], "speed": 1},
    "run": {
        "frames": [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 15],
        "speed": .25
    },
    "jump": {
       
        "frames": [16, 17, 18, 19, 19, 19, 20, 21, 22, 22, 22],
        "speed": .10
    }
}
};
var spritesheet = new createjs.SpriteSheet(data);
mcHero = new createjs.Sprite(spritesheet,'idle');

}
