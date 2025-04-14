import {Grood,XY,NAR,Sleep} from "../Game.js";
const ROWS=12;
const InitGrood=`
[${ROWS}]
pawn(9,10,6)20
pawn(10,10,6)20
goobomb(10,10,5)210
pawn(9,11,6)20
bomb(9,11,5)20
bomb(10,11,5)20
pawn(10,9,6)20
pawn(10,11,4)20
pawn(12,1,12)20
pawn(11,10,5)20
pawn(11,11,4)20
pawn(11,9,5)20
pawn(11,10,4)20
bomb(9,12,5)20
bomb(6,9,10)20
rotator(7,10,9)210
pawn(8,9,8)210
pawn(10,4,11)210
portal(11,5,9)20
portal(11,8,6)20
`
var Wrap=document.getElementById('GroodMain');
var GroodMian=new Grood(InitGrood,Wrap,()=>{},true);
var ScaleButt=document.getElementById('ScaleButt');
ScaleButt.addEventListener('click',()=>{
	GroodMian.element.classList.toggle('Scaled');
})
//Debug
Debug.Grood=GroodMian;
Debug.XY=XY;
Debug.NAR=NAR;
var DebugIdInput=document.getElementById('DebugId');
var isDebugging=false;
var DebugButt=document.getElementById('DebugButt');
async function DebugFunc(){
	var Id=DebugIdInput.value;
	if(isDebugging)	return;
	isDebugging=true;
	DebugButt.classList.remove('error');
	DebugButt.classList.add('disable');
	try{
		if(Id=='Init')
			GroodMian.ParseFromText(Wrap,InitGrood);
		if(Id=='Move')
			await GroodMian.AnimMove(new NAR(10,4,11),new NAR(6,11,8));
		if(Id=='Shoot')
			await GroodMian.AnimMove(new NAR(8,9,8),new NAR(8,12,5),true);
		if(Id=='Teleport')
			await GroodMian.AnimTeleport(new NAR(12,1,12),new NAR(11,5,9),new NAR(11,8,6),new NAR(11,9,6));
		if(Id=='Explode')
			await GroodMian.AnimExplode(new NAR(8,12,5));
		if(Id=='GooExplode')
			await GroodMian.AnimExplode(new NAR(10,10,5));
		if(Id=='Rotate')
			await GroodMian.AnimRotate(new NAR(7,10,9),2);
		if(Id=='Promote')
			await GroodMian.AnimPromote(new NAR(11,10,4),'Queen');
		if(Id=='Error')
			throw new Error('Test Error');
		
	}catch(e){
		console.error(e);
		DebugButt.classList.add('error');
	}
	isDebugging=false;
	DebugButt.classList.remove('disable');
}
Debug.Func=DebugFunc;
Debug.Sleep=Sleep;