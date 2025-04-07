var Body=document.getElementById('Home');
var BigT=document.getElementById('MainTriangle');
var StSh=document.getElementById('MenuSt');
var WelTxt=document.getElementsByClassName('welcome');

var thr=setInterval(()=>{
	var t=document.createElement('span');
	t.classList.add('SmallT');
	t.style.top=`${Math.random()*100}vh`;
	var size=Math.random()*6+5;
	t.style.width=`${size*1}vh`;
	t.style.height=`${size/2*Math.sqrt(3)}vh`;
	t.style.backgroundColor=`hsl(${Math.random()*360} 80% 50%`;
	var speed=Math.random()*5+5;
	Body.appendChild(t);
	t.style.transition=`${speed}s`;
	setTimeout(() => {
		t.style.left='110vw';
		t.style.rotate='1800deg'
	},20);
	setTimeout(() => {
		Body.removeChild(t);
	},speed*1000);
},200);

document.addEventListener('keydown',(event)=>{
	clearInterval(thr);
	BigT.style.animation
	StSh.setAttribute('href','Menu.css');
	setTimeout(()=>{
		for(var i=0;i<WelTxt.length;i++)
			WelTxt[i].style.display='none';
	},2000);
},{once:true});