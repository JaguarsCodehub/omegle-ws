### UserManager.ts 🥶 + RoomManager.ts 🥵

**: User Manager**

- We define / declare users array and a queue array for our users to get pushed in the queue.
- Next we define a constructor where we initialize everything with an empty array.
- we add the user with (name, socket) which they will be carryying as params when they connect to socket server.
- After we add the user to users array, we also push these users to the **queue with ther socket.id**
- We clear the queue and then initialize the handlers where we create a room with 2 users(user1, user2).
- These room is created with "offer" connection and with onAnswer and onOffer functions coming from the Room Manager.

**: Room Manager**

- We first define a GLOBAL_ROOM_ID which we need to increment++ when a room is created so that every room has a different RoomID.
- We define a room Interface consisting of 2 users with the User Type defined in UserManager.ts
- Now we create a room with 2 users and set the room with 2 users, passing the same roomId to the room created.
- Now we create 2 functions onOffer and onAnswer.

```typescript
// User Manager
export interface User {
  socket: Socket;
  name: string;
}

export class UserManager {
  private users: User[];
  private queue: string[];

  private roomManager: RoomManager;

  constructor() {
    this.users = [];
    this.queue = [];
    this.roomManager = new RoomManager();
  }

  addUser(name: string, socket: Socket) {
    this.users.push({
      name,
      socket,
    });
    this.queue.push(socket.id);
    this.clearQueue();
    this.initHandlers(socket);
  }

  removeUser(socketId: string) {
    this.users = this.users.filter((x) => x.socket.id === socketId);
    this.queue = this.queue.filter((x) => x === socketId);
  }

  clearQueue() {
    if (this.queue.length < 2) {
      return;
    }

    const user1 = this.users.find((x) => x.socket.id === this.queue.pop());
    const user2 = this.users.find((x) => x.socket.id === this.queue.pop());

    if (!user1 || !user2) {
      return;
    }

    const room = this.roomManager.createRoom(user1, user2);
  }

  initHandlers(socket: Socket) {
    socket.on('offer', ({ sdp, roomId }: { sdp: string; roomId: string }) => {
      this.roomManager.onOffer(roomId, sdp);
    });
    socket.on('offer', ({ sdp, roomId }: { sdp: string; roomId: string }) => {
      this.roomManager.onAnswer(roomId, sdp);
    });
  }
}
```

```typescript
// RoomManager
import { User } from './UserManager';
let GLOBAL_ROOM_ID = 1;

interface Room {
  user1: User;
  user2: User;
}

export class RoomManager {
  private rooms: Map<string, Room>;
  constructor() {
    this.rooms = new Map<string, Room>();
  }

  createRoom(user1: User, user2: User) {
    const roomId = this.generate();
    this.rooms.set(roomId.toString(), {
      user1,
      user2,
    });

    user1?.socket.emit('send-offer', {
      roomId,
    });
  }

  onOffer(roomId: string, sdp: string) {
    const user2 = this.rooms.get(roomId)?.user2;
    user2?.socket.emit('offer', {
      sdp,
    });
  }

  onAnswer(roomId: string, sdp: string) {
    const user1 = this.rooms.get(roomId)?.user1;
    user1?.socket.emit('offer', {
      sdp,
    });
  }

  generate() {
    return GLOBAL_ROOM_ID++;
  }
}
```
