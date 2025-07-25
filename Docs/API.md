# GooChess API Docs v1.0

对于一个房间，你要连接到 `wss://host-ip/api/ws/<room-id>` 的位置。

|消息|谁发出|`type`|`param`|
|:-:|:-:|:-|:-|
|登入房间|S|`LoginToken`|`{token}`|
|通知|S|`Notify`|`{notifyType,msg,code}`|
|收到消息|S|`RecvChatMessage`|`{msg,sender,time}`|
|发消息|C|`PostChatMessage`|`{msg,time}`|

### Login

你需要连接到 `wss://host-ip/api/ws/<room-id>/?uid=<user-id>&nonce=<nonce>&auth=<token-str>`。

其中 user-id 代表当前想要加入房间的用户，而 auth 则代表如下字符串：

`<token-str>=sha256(base64(<nonce>|<time>|<user-id>|<session-token>|<room-id>|<room-auth>))`

其中 `<time>=ms-since-epoch`，表示自 Unix 纪元即（1970 年 1 月 1 日 UTC）到现在的毫秒数。`<nonce>` 是本次操作的唯一标识符，如果该标识符已经存在，那么服务端将返回 HTTP 状态 `409 Conflict`，建议使用 `crypto.randomUUID()` 生成的值。

`<user-id>` 即用户的 id，`<session-token>` 即该用户登录时获取到的 `Session-Token`，`<room-id>` 为欲加入的房间号码，`<room-auth>` 为房间的密码，如果密码不存在，那么不填写，但是 `|` 还是要有。

将这些信息用 `|` 连接，然后用 `base64` 编码，然后再用 `sha256` 摘要，作为 `<token-str>` 发送。

#### Notification

如果你的信息中其他信息有误，或者时间在服务器时间的未来，亦或是比服务器时间早超过 5 分钟，都会被拒绝连接。如果游戏已经结束，或者你持有的 socket 连接数超过限制，那么连接也会被拒绝。你如果已经持有一个到这个房间的连接，一旦本连接被接受，那么你之前的连接会被断开。

一旦成功连接，服务器将立即发送仅一次以下信息，但这不一定是你收到的第一个信息，请注意：

- type:string = "LoginToken"

- token:string
  
  作为你在这个房间中活动的凭据。

收到之后，你可以使用 `GetBoard` 等其他 API。再次提醒，这不一定是你收到的第一个信息，只要成功进入房间，你就会收到聊天和落子的更新。

### ErrorReport

发生了错误。这是一条服务器主动发送的信息，没有 Request。

#### Notification

- msg:string
  
  错误信息，人类可读。

- code:string
  
  错误代码。代码定义 TODO。

### GetRoomInfo

#### Request

如果没有特殊说明，后文都会省略这三个参数。注意任何情况下 Response 也有 type 参数，在请求传递了标识符的情况下，会传回标识符。所以你要是不传标识符，那么 Response 里也不会有标识符，这不会引发错误，切记。

- type: string = "GetRoomInfo"
  
  操作类型

- id: string
  
  询问标识符，由于异步的原因，你需要传递一个标识符来区分询问的结果，你可以使用一个递增计数器来实现。

- token: string
  
  传递连接服务器时收到的 Token

#### Response

- players: array[player]
  
  - uid: string
    
    该玩家的用户 id
  
  - pos: int [0|1|2]
    
    该玩家在棋盘的哪个方向

- admin:string
  
  房主的用户 id

邀请制房间的房主即创建者，匹配制房间的 `admin` 字段是 0。

### GetBoard

#### Request

没有额外参数

#### Response

- board: array[choos]
  
  - type:string
    
    棋子的类型
  
  - owner:int [0|1|2]
    
    归属哪个玩家
  
  - pos:nar
    
    - x
    
    - y
    
    - z
    
    棋子的位置

### PostChatMessage

在聊天频道中发送一条消息。

#### Request

- msg:string

### RecvChatMessage

接收聊天频道中的消息。

#### Notification

- msg:string

- sender:string
  
  发送者的用户 id、

- time:string
  
  服务器接收到消息时的时间，用从 Unix 纪元开始的毫秒数表示。

### JoinGame

申请加入游戏。这一请求在随机制房间中表示是否准备好了。通过发送这一消息，在邀请制房间中，房主会在候选人列表中看见你。

#### Request

- apply: string ["true"|"false"]
  
  是否申请，可以撤回。但是在随机制房间中，一旦所有人都准备好了，就不能撤回。

### StartGame

通过此消息，房主选择玩家并开始游戏。同时，其他人将收到开始的通知，无论是否被选择参与游戏。在随机制房间中，一旦所有人都准备好了，此消息会由系统自动发送。此时游戏的实例会被创建并加入活跃区。

#### Request

- players:array[player]
  
  结构同上，要求必须恰好有 3 个，pos 字段不能重复。

### TerminateGame

只有房主能在邀请制房间中调用这个函数，将结束游戏并删除对局，不会留下记录。

#### Request

没有额外参数

### Surrender

投降，只有玩家能调用。

#### Request

没有额外参数

### Step

更新下一步。

#### Notification

- step: node
  
  本消息将是树状的，具体来讲，每个 node 有如下结构：
  
  - type:string ["move"|"death"|"skill"]
  
  如果 type 是 move 型的，那么有以下额外参数：
  
  - from: pos
  
  - to: pos
  
  如果 type 是 death 型的，那么有以下额外参数：
  
  - pos: pos
  
  如果 type 是 skill 型的，那么有以下额外参数：
  
  - pos: pos
  
  - skill: string
  
  - 以及与技能绑定的参数
  
  还会有一个标记儿子节点的数组：
  
  - son: array[node]
  
  注意你必须按照深度优先的顺序，按照 son 的顺序遍历儿子并处理，否则奇怪的事情有可能会发生。

### GetHistory

#### Request

没有额外参数

#### Response

- steps:array[step]
  
  形如 Step 通知中的结构。

### GetTimer

#### Request

- player: int[0|1|2]
  
  要获取谁的计时器剩余时间

#### Response

- time: int
  
  精确到秒。注意可能有些许偏差，这是网络延迟导致的。

### GetGameInfo

#### Request

没有额外参数

#### Response

- timing
  
  - initial: int
    
    初始时间，如果为通讯棋，该参数为 -1
  
  - add: int
    
    每一步加时，如果为通讯棋，该参数为 -1

- turn: int[0|1|2]
  
  轮到谁了

### GetReachable

必须由玩家，查询属于自己的棋子。

#### Request

- pos: pos

#### Response

- pos: array[pos]

### CanUseSkill

#### Request

- pos: pos

- 根据使用的技能，需要传入其他参数

#### Response

- available: ["true"|"false"]

### TakeAction

#### Request

- pos: pos

- type: ["move"|"skill"]

如果是 move

- to: pos

如果是 skill，传入特定参数。

#### Response

前面好多返回我都没写，这个比较重要，写下。

- success: ["true"|"false"]

- error
  
  可能是以下值之一 "can_not_move" "not_your_turn" "skill_unavailable" "invalid_call" ”success“
  
  invaild_call 代表你传入的参数有问题，或者你不是玩家，或者你已经输掉了。

### GameStatusUpdate

#### Notification

- type: ["terminated"|"ended"|"mate"|"surrender"]
  
  分别表示，游戏被中止，游戏正常结束，和有杀王事件发生。

如果类型是 ended，还有如下参数：

- score: int[3]

- killer: int[3]
  
  如果该玩家投降，则 killer 要么是场上剩余的一名玩家的 id，要么是 -1，代表此时还有两个玩家。如果在某人的一步之内导致了自己王的死亡，那么该参数是他自己。如果某人没有被杀，则该值是 -2。

如果类型是 mate，还有如下参数：

- who: int[0|1|2]

- killer: int[0|1|2]

即使 mate 事件导致了游戏结束，也会发送 mate 事件。

如果类型是 surrender，还有如下参数：

- who: int[0|1|2]

### HurryUp

玩家可以调用它，催促正在走棋者。

#### Request

没有额外参数。

#### Notification

- who: int[0|1|2]
  
  谁发起了催促。