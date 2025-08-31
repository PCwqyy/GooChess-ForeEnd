import {sessionToken,userId,userName} from '../Global/Global.js';
import * as GUI from './GamingGUI.js';
import * as UIlib from '../Global/UI.js';
const hostIp='localhost:8080';
var ws,roomToken=null;
async function sha256(str) 
{
	const encoder=new TextEncoder();
	const data=encoder.encode(str);
	const hashBuffer=await crypto.subtle.digest('SHA-256',data);
	const hashArray=Array.from(new Uint8Array(hashBuffer));
	return hashArray.map(b=>b.toString(16).padStart(2,'0')).join('');
}
export async function InitWS(roomId,password='')
{
	var nonce=crypto.randomUUID();
	var sessionStr=await sha256(btoa(`${nonce}|${Date.now()}|${userId}|${sessionToken}|${roomId}|${password}`));
	ws=new WebSocket(`ws://${hostIp}/api/ws/${roomId}?uid=${userId}&nonce=${nonce}&auth=${sessionStr}`);// 暂时不加密
	ws.onopen=()=>{UIlib.Notify('info','^{Notify.Server.Connected}');};
	ws.onmessage=(event)=>{
		var data=JSON.parse(event.data);
		HandleMessage(data);
	}
	ws.onclose=()=>{UIlib.Notify('error','^{Notify.Server.Disconnected}');};
}
class Message
{
	constructor(type,param)
	{
		this.type=type;
		this.time=Date.now();
		this.userId=userId;
		this.sessionToken=sessionToken;
		this.roomToken=roomToken;
		this.param=param;
	}
}
const HandlingMap={
	'LoginToken': HandleLoginToken,
	'Notify': HandleNotify,
	'RecvChatMessage': HandleRecvChatMessage,
	'Resign': HandleResign,
	'Tie': HandleTie
}
function HandleMessage(data)
{
	console.log(`[WebSocket]\n%c <<< [%c${data.type}%c] %o`,
		'color: limegreen;',
		'color: deepskyblue;',
		'color: limegreen;',
		data.param);
	if(HandlingMap[data.type])
		HandlingMap[data.type](data.param);
}
function HandleNotify(data){
	UIlib.Notify(data.notifyType,data.message,data.code);
}
function HandleRecvChatMessage(data){
	GUI.NewMsg(data.msg,data.sender,data.time);
}
// [TODO] 之后 who 得是用户名
function HandleResign(data){
	if(data.who===0)
		UIlib.Notify('info','^{Notify.Game.Resign.You}');
	else
		UIlib.Notify('info',`{LONG}^{Notify.Game.Resign.Opponent,${data.who}}`);
}
function HandleTie(data){
	if(data.who===0)
		UIlib.Notify('info','^{Notify.Game.Tie.You}');
	else
		UIlib.Notify('info',`{LONG}^{Notify.Game.Tie.Opponent,${data.who}}`);
}

function HandleLoginToken(param){roomToken=param.roomToken;}

export function SendMessage(type,param)
{
	console.log(`[WebSocket]\n%c >>> [%c${type}%c] %o`,
		'color: limegreen;',
		'color: deepskyblue;',
		'color: limegreen;',
		param);
	if(ws && ws.readyState===WebSocket.OPEN)
		ws.send(JSON.stringify(new Message(type,param)));
	else
		UIlib.Notify('error','^{Notify.Server.NotConnected}');
}

GUI.InputEle.addEventListener('keydown',function(e){
	if(e.key==='Enter')
		SendMessage('PostChatMessage',{
				msg:GUI.InputEle.value,
				sender:userName,
				time:Date.now()
			}),
		GUI.InputEle.value='';
});

InitWS();