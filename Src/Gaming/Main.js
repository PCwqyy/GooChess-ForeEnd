import {Grood,XY,NAR,Sleep} from "../Game.js";
import {userId,userName,InitGlobal} from "../Global.js";
import * as GUI from "./GUI.js";
import "./WebSocket.js";

const ROWS=12;
const InitGrood=`
[${ROWS}]
pawn(9,10,6)20
pawn(10,10,6)20
goobomb(10,10,5)210
pawn(9,11,6)20
bomb(9,11,5)20
bomb(10,11,5)20
employee(10,9,6)20
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
pawn(8,6,12)20
pawn(8,7,11)20
gooshop(9,6,11)20
diplomat(8,6,11)210
king(1,12,12)210
pawn(6,11,8)20
bomb(8,12,6)20
factory(7,7,11)210
`
var Wrap=document.getElementById('GroodMain');
var GroodMain=new Grood(InitGrood,Wrap,()=>{},true);

//Debug
InitGlobal(114514,'PCDebug','PCDebugToken');

Debug.Grood=GroodMain;
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
			GroodMain.ParseFromText(Wrap,InitGrood),
			GUI.InitTimers(300);
		if(Id=='SwitchTimers')
			GUI.SwitchTimers();
		if(Id=='NewMsg')
			GUI.NewMsg('Test Message','PC');
		if(Id=='NewRecord')
			GUI.AddRecord('Pe1i');
		if(Id=='Move')
			await GroodMain.AnimMove(new NAR(10,4,11),new NAR(6,11,8));
		if(Id=='Shoot')
			await GroodMain.AnimMove(new NAR(8,9,8),new NAR(8,12,5),true);
		if(Id=='Teleport')
			await GroodMain.AnimTeleport(new NAR(12,1,12),new NAR(11,5,9),new NAR(11,8,6),new NAR(11,9,6));
		if(Id=='Bounce')
			await GroodMain.AnimBounce(new NAR(9,6,11),new NAR(10,3,12),new NAR(12,2,11));
		if(Id=='Explode')
			await GroodMain.AnimExplode(new NAR(8,12,5));
		if(Id=='GooExplode')
			await GroodMain.AnimExplode(new NAR(10,10,5));
		if(Id=='Rotate')
			await GroodMain.AnimRotate(new NAR(7,10,9),2);
		if(Id=='Promote')
			await GroodMain.AnimPromote(new NAR(11,10,4),'Queen');
		if(Id=='Control')
			await GroodMain.AnimToggleControl(new NAR(8,6,11));
		if(Id=='Check')
			await GroodMain.AnimToggleCheck(new NAR(1,12,12));
		if(Id=='Produce')
			await GroodMain.AnimProduce(new NAR(7,7,11),new NAR(8,7,11));
		if(Id=='Revolt')
			await GroodMain.AnimToggleRevolt(new NAR(10,9,6),210);
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