function lizi(cobj) {
    this.cobj = cobj
    this.x = 0;
    this.y = 0;
    this.x1 = 20 * Math.random() - 10;
    this.y1 = 20 * Math.random() - 10;
    this.x2 = 20 * Math.random() - 10;
    this.y2 = 20 * Math.random() - 10;
    this.speedy = -2 - Math.random() - 2;
    this.speedx = (16 * Math.random() - 8)
    this.life = 4;
    this.r = 1;
    this.color = "#fef";
}
lizi.prototype = {
    draw: function () {
        var cobj = this.cobj;
        cobj.save();
        cobj.beginPath();
        cobj.fillStyle = this.color;
        cobj.translate(this.x, this.y);
        cobj.scale(this.r, this.r)
        cobj.moveTo(0, 0);
        cobj.bezierCurveTo(this.x1,this.y1,this.x2,this.y2,0,0);
        cobj.fill();
        cobj.restore();
    },
    update: function () {
        this.x += this.speedx;
        this.y += this.speedy;
        this.life -= 0.2;
        this.r -= 0.06;
    }
}

function stone(cobj, x, y,color) {
    var color=color||"#ccc";
    var stoneArr = [];
    for (var i = 0; i < 5; i++) {
        var obj = new lizi(cobj);
        obj.x = x;
        obj.y = y;
        obj.color=color;
        stoneArr.push(obj);
    }
    console.log(stoneArr.length);
    var t = setInterval(function () {
        for (var i = 0; i < stoneArr.length; i++) {
            stoneArr[i].draw();
            stoneArr[i].update();
            if (stoneArr[i].r < 0 || stoneArr[i].life < 0) {
                stoneArr.splice(i, 1);
            }
        }
        if (stoneArr.length == 0) {
            clearInterval(t);
        }
    }, 50)
}


function person(canvas,cobj,runsImg,jumpImg){
	this.canvas=canvas;
	this.canvasH=this.canvas.height;
	this.cobj=cobj;
	this.runsImg=runsImg;
	this.jumpImg=jumpImg;
	this.x=0;
	this.y=0;
	this.width=80;
	this.height=120;
	this.endy=this.canvasH-this.height;
	this.action = "runsImg";
	this.state = 0;
	this.speedy = 5;
	this.gravity=3
}
person.prototype={
	draw:function(){
		this.cobj.save();
		this.cobj.translate(this.x,this.y);
        if(this.action=="jumpImg"){
            this.cobj.drawImage(this[this.action][0],0,0,800,1200,0,0,this.width,this.height)
        }else{
        	this.cobj.drawImage(this[this.action][this.state],0,0,800,1200,0,0,this.width,this.height)
        }
		this.cobj.restore()		
	},
	update:function(){
		if (this.y>=this.endy) {
            this.y= this.endy
            stone(this.cobj,this.x+this.width/2,this.y+this.height)
        }else if(this.y<this.endy){
            this.speedy+=this.gravity;
            this.y+=this.speedy;
        }
	}
}

function block(canvas,cobj,blockImg){
   this.canvas=canvas;
   this.cobj=cobj;
   this.blockImg=blockImg;
   this.width=145;
   this.height=85;
   this.x = canvas.width;
   this.y=  canvas.height-this.height;
   this.state=0;  
}
block.prototype={
   draw:function(){
      this.cobj.save()
      this.cobj.translate(this.x,this.y)
      this.cobj.drawImage(this.blockImg[this.state],0,0,1451,848,0,0,this.width,this.height)
      this.cobj.restore()
   }
}

function game(canvas,cobj,runsImg,jumpImg,blockImg){
	this.canvas=canvas;
	this.canvasW=this.canvas.width;
	this.canvasH=this.canvas.height;
	this.cobj=cobj;
	this.runsImg=runsImg;
	this.jumpImg=jumpImg;
	this.blockImg = blockImg;
	this.blockArr=[];
	this.speed=5;
	this.person=new person(canvas,cobj,runsImg,jumpImg)
	this.score=0;
	this.life=4;
  this.guanka=1;
}
game.prototype={
	play:function(){
		var that=this;
		that.jump();
		var num=0;
		var back=0;
		var second=0;
		var step=5000+parseInt(5*Math.random())*1000;
		setInterval(function(){
			num++;
			that.person.state=num%7;
			that.cobj.clearRect(0,0,that.canvasW,that.canvasH);
			that.person.draw();
            that.person.update();
			that.person.x+=that.speed;
			if(that.person.x>=that.canvasW/3){
            	that.person.x=that.canvasW/3;
         	}

			back-=that.speed;
			that.canvas.style.backgroundPosition=back+"px";    //支持火狐
			that.canvas.style.backgroundPositionX=back+"px";     //支持谷歌			
            if(second%step==0){
                second=0;
                step=5000+parseInt(5*Math.random())*1000;
                var blockobj=new block(that.canvas,that.cobj,that.blockImg);
                blockobj.state=Math.floor(that.blockImg.length*Math.random());
                that.blockArr.push(blockobj);
                if(that.blockArr.length>5){
                    that.blockArr.shift();
                }
            }
            second+=50;

            for(var i=0;i<that.blockArr.length;i++){
                var lifes=document.getElementById('life')
                var guankas=document.getElementById('guanka')
                var fenshus=document.getElementById('fenshu')
                that.blockArr[i].x-=that.speed;
                that.blockArr[i].draw();
                if(hitPix(that.canvas,that.cobj,that.person,that.blockArr[i])){
                    if(!that.blockArr[i].flag) {
                        that.life--;
                        lifes.innerHTML=that.life;
                    }
                    that.blockArr[i].flag=true;
                    stone(that.cobj,that.person.x+that.person.width/2,that.person.y+that.person.height/2,"red")
                    if(that.life<0){
                        alert("game over");
                        location.reload();
                    }
                }else if(that.blockArr[i].x+that.blockArr[i].width<that.person.x){
                    if(!that.blockArr[i].flag&&!that.blockArr[i].flag1){
                        that.score++;
                        fenshus.innerHTML=that.score;
                        if(that.score%3==0){
                            that.speed++;
                            that.guanka++;
                            guankas.innerHTML=that.guanka;
                        }
                    }
                    that.blockArr[i].flag1=true;
                }
            }
		},60)
	},
	jump:function(){
      var that=this;
      var flag=true;
      document.onkeydown=function(e){
         var e=e||window.event;
         var code=e.keyCode;
         if (code==32) {
         	that.person.action="jumpImg";
    			var ang=0;
    			var inty=that.person.y;
    			var r=100;
    			that.speed=8;
            if (!flag) {
               return;
            }else{
               flag=false;
               var t=setInterval(function(){
                  ang+=5;
                  if(ang>180){
                     clearInterval(t)
                     that.person.action="runsImg";
                     that.person.y=inty;
                     flag=true;
                  }else{
                     var len=Math.sin(ang*Math.PI/180)*r;
                     that.person.y=inty-len;
                  }
               },60)
            }
        }	
      } 	
	}
}