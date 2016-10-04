window.onload=function() {
	var canvas=document.querySelector("canvas");
	var cobj=canvas.getContext("2d")

	window.onresize=function(){
		var cw=document.documentElement.clientWidth;
		var ch=document.documentElement.clientHeight;
		canvas.width=cw;
		canvas.height=ch;
	}
	window.onresize()

	var runsImg=document.getElementsByClassName("run")
	var jumpImg=document.getElementsByClassName("jump")
	var blockImg=document.getElementsByClassName("car")	

	var gameObj=new game(canvas,cobj,runsImg,jumpImg,blockImg);
	gameObj.play();
}