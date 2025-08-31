import {Grood,XY,NAR} from "../Global/Game.js";
import {userId,userName,InitGlobal} from "../Global/Global.js";
import {DebugScreen} from "../Global/Debug.js";
import * as GUI from "./GamingGUI.js";
import * as UIlib from "../Global/UI.js";
import "./WebSocket.js";
const Sleep=(ms)=>new Promise(resolve=>setTimeout(resolve,ms));

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
DebugScreen.AddButton('Init',()=>{
	GroodMain.ParseFromText(Wrap,InitGrood),
	GUI.InitTimers(300);
});
DebugScreen.AddButton('NewMsg',()=>{GUI.NewMsg('Test Message','PC');});
DebugScreen.AddButton('NewStep',()=>{
	GUI.SwitchTimers();
	GUI.AddRecord('Pe1i');
});
DebugScreen.AddButton('PopUp',()=>{
	UIlib.PopUp('Hello','Are you suck?',[
		new UIlib.PopUpOp('Yes','Button.Yes',()=>{UIlib.Notify('debug','yes!')}),
		new UIlib.PopUpOp('No','Button.No',()=>{UIlib.Notify('debug','no!')}),
		new UIlib.PopUpOp('close','',()=>{UIlib.Notify('debug','cancel!')})
	],'Yes',false);
});
DebugScreen.AddButton('HurryUp',GUI.HurryUp);
DebugScreen.AddButton('Move', async ()=>{
	await GroodMain.AnimMove(new NAR(10,4,11),new NAR(6,11,8));
});
DebugScreen.AddButton('Shoot', async ()=>{
	await GroodMain.AnimMove(new NAR(8,9,8),new NAR(8,12,5),true);
});
DebugScreen.AddButton('Teleport', async ()=>{
	await GroodMain.AnimTeleport(new NAR(12,1,12),new NAR(11,5,9),new NAR(11,8,6),new NAR(11,9,6));
});
DebugScreen.AddButton('Bounce', async ()=>{
	await GroodMain.AnimBounce(new NAR(9,6,11),new NAR(10,3,12),new NAR(12,2,11));
});
DebugScreen.AddButton('Explode', async ()=>{
	await GroodMain.AnimExplode(new NAR(8,12,5));
});
DebugScreen.AddButton('GooExplode', async ()=>{
	await GroodMain.AnimExplode(new NAR(10,10,5));
});
DebugScreen.AddButton('Rotate', async ()=>{
	await GroodMain.AnimRotate(new NAR(7,10,9),2);
});
DebugScreen.AddButton('Ascend', async ()=>{
	await GroodMain.AnimAscend(new NAR(11,10,4),'Queen');
});
DebugScreen.AddButton('Control', async ()=>{
	await GroodMain.AnimToggleControl(new NAR(8,6,11));
});
DebugScreen.AddButton('Check', async ()=>{
	await GroodMain.AnimToggleCheck(new NAR(1,12,12));
});
DebugScreen.AddButton('Produce', async ()=>{
	await GroodMain.AnimProduce(new NAR(7,7,11),new NAR(8,7,11));
});
DebugScreen.AddButton('Revolt', async ()=>{
	await GroodMain.AnimToggleRevolt(new NAR(10,9,6),210);
});
DebugScreen.AddButton('Error', ()=>{
	throw new Error('Test Error');
});
Debug.Sleep=Sleep;