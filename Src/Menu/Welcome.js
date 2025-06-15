var Body=document.getElementById('Home');
var BigT=document.getElementById('MainTriangle');
var StSh=document.getElementById('MenuSt');
var WelTxt=document.getElementsByClassName('welcome');

document.addEventListener('keydown',(event)=>{
	// BigT.style.animation
	StSh.setAttribute('href','Menu.css');
	setTimeout(()=>{
		for(var i=0;i<WelTxt.length;i++)
			WelTxt[i].style.display='none';
	},2000);
},{once:true});