var Main=document.getElementById('Main');
var Body=document.getElementById('Home');
var Input=document.getElementById('Input');
var Top=0,Speed=20;
Input.addEventListener('change',function(event)
{
	const files=event.target.files;
	if(files.length==0)
		return;
	const file=files[0];
	const reader=new FileReader();
	reader.onload=function(e)
	{
		temp=e.target.result;
		Main.innerHTML=marked.parse(temp);
		Main.style.top='0px';
		var h=Main.getBoundingClientRect().height;
		Main.style.transition=`${h/Speed}s linear`;
		setTimeout(()=>{
			Main.style.top=`-${h}px`;
			console.log(h);
		},500);
	}
	reader.onerror=function(e)
	{console.error("Fail reading file");};
	reader.readAsText(file);
});
var Angle=0;
setInterval(()=>{
	var t=document.createElement('span');
	t.classList.add('LineWarp');
	var q=document.createElement('span');
	q.classList.add('Line');
	Angle+=Math.random()*30+30;
	Angle%=180;
	q.style.rotate=`${Angle}deg`;
	q.style.top=`${Math.random()*150-25}vh`;
	q.style.backgroundColor=`hsl(${Math.random()*360} 80% 50%`;
	t.appendChild(q);
	Body.appendChild(t);
	setTimeout(() => {
		Body.removeChild(t);
	},3100);
},75);