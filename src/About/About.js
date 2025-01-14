var Main=document.getElementById('Main');
var Input=document.getElementById('Input');
var Top=0,Speed=2,Stop=true;
setInterval(()=>{
	if(Stop)	return;
	Main.style.top=`${Top}vh`;
	Top-=Speed;
},500);
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
		Top=0,Stop=false;
	}
	reader.onerror=function(e)
	{console.error("Fail reading file");};
	reader.readAsText(file);
});