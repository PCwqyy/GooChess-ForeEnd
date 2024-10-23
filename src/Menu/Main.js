var MainTri=document.getElementById('MainTriangle');
var now=0;
setInterval(()=>{
	now+=Math.random()*120-60;
	MainTri.style.transform=`rotate(${now}deg)`;
},300)