import {Text} from "./Lang.js";
import "./Background.js";
export var userId,userName,sessionToken;
export function InitGlobal(id,name,token)
{
	userId=id;
	userName=name;
	sessionToken=token;
}