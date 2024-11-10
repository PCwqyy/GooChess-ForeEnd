var Body=document.getElementById('Home')
setInterval(()=>{
	var t=document.createElement('span');
	t.classList.add('SmallT');
	t.style.top=`${Math.random()*100}vh`;
	var size=Math.random()*6+5;
	console.log(size);
	t.style.width=`${size*1}vh`;
	t.style.height=`${size/2*Math.sqrt(3)}vh`;
	t.style.backgroundColor=`hsl(${Math.random()*360} 80% 50% / 0.8)`;
	var speed=Math.random()*5+3;
	Body.appendChild(t);
	t.style.transition=`${speed}s`;
	setTimeout(() => {
		t.style.left='110vw';
		t.style.rotate='1800deg'
	},10);
	setTimeout(() => {
		Body.removeChild(t);
	},speed*1000+200);
},300)