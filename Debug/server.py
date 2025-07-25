# Write with Copilot
import asyncio
import rich
import websockets
import json

# 服务器监听端口
PORT = 8080
# 房间ID（仅用于调试标识）
ROOM_ID = "testroom"

# 保存所有已连接的客户端 WebSocket 对象
connected = set()

async def send(ws,type,content):
	await ws.send(json.dumps({
		"type":type,
		"param":content
	}))

# 处理每个客户端连接的协程
async def handler(websocket):
    # 新客户端加入集合
    connected.add(websocket)
    try:
        # 持续接收客户端消息
        async for message in websocket:
            rich.print(message)  # 打印收到的消息
            try:
                data = json.loads(message)  # 解析为字典
                # 如果收到 LoginToken 类型消息，回复一个调试用的 LoginToken
                if data.get("type") == "LoginToken":
                    await send(websocket,"LoginToken",{"roomToken": "debug-room-token"})
                elif data.get("type")=='PostChatMessage':
                    await send(websocket,"RecvChatMessage",data.get("param"))
                # 其他类型可在此扩展
            except Exception as e:
                print("Error handling message:", e)
    except websockets.ConnectionClosed:
        print("Connection closed.")
    finally:
        # 客户端断开时移除
        connected.discard(websocket)

# 控制台输入广播到所有客户端
async def broadcast_console():
    loop = asyncio.get_event_loop()
    while True:
        # 等待用户在控制台输入内容
        msg = await loop.run_in_executor(None, input, "Broadcast> ")
        if msg.strip():
            # 广播到所有连接的客户端
            to_remove = set()
            for ws in connected:
                try:
                    await send(ws,"Notify",{"notifyType":"error","message": msg,"code":114})
                except Exception:
                    # 如果发送失败，移除该连接
                    to_remove.add(ws)
            for ws in to_remove:
                connected.discard(ws)

# 主函数，启动服务器和广播协程
async def main():
    print(f"WebSocket debug server running on ws://localhost:{PORT}/api/ws/{ROOM_ID}")
    # 启动 WebSocket 服务器
    server = await websockets.serve(handler, "localhost", PORT, ssl=None)
    # 启动控制台广播
    await broadcast_console()

# 程序入口
if __name__ == "__main__":
    asyncio.run(main())
