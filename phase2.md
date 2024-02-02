# Phase 1

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

# Phase 2

### UserManager.ts 🥶 + RoomManager.ts 🥵 + Room.tsx 😈

**: User Manager**

- Added the "send lobby" event to add the users in the waiting lobby or waiting queue, until another user joins the room
- Nothing much done here except taking the ids of users and removing them (this.quueue.pop) id1 and id2.

**: Room Manager**

- Added the toString functionality for the room Id to be generated in string because the GLOBAL_ROOM_ID was declared as 1 which is an integer.
- Added some console logs in both UserManager and RoomManager for debugging session.

```typescript
const roomId = this.generate().toString();
```

**: Room.tsx**

- Added socket states and initalised some socket events like "offer, send-offer, send-answer and lobby"
- Added the lobby state, so that if 1 user comes inside the queue he has to wait in the lobby for the other person to be coming in that room or queue.
- After the 2nd user tries to get inside the room, he will send an offer to the 1st user and the 1st user to recive that offer and give an answer back to the 2nd user, and the connection will be established.
- If user close their respective browser they will be removed from the queue and server and the user will get disconnected.
- We also defined the URL for cross proxy as our frontend (room.tsx) which is running on :5173 needs to establish a connection with our socket server which is running on :3000, A hell lot of time went in debugging this.
- This Phase 2 implementation showcased the implementation of SDP priniciple, Session Description Protocol.

A detailed explanation is given in the end of this **documentation**

```typescript
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Socket, io } from 'socket.io-client';

const URL = 'http://localhost:3000';

export const Room = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [socket, setSocket] = useState<null | Socket>(null);

  const [lobby, setLobby] = useState(true);
  const name = searchParams.get('name');

  useEffect(() => {
    // Logic to init user to the room
    const socket = io(URL);
    socket.on('send-offer', ({ roomId }) => {
      alert('send offer please');
      setLobby(false);
      socket.emit('offer', {
        roomId,
        sdp: '',
      });
    });
    socket.on('offer', ({ roomId, offer }) => {
      alert('send answer please');
      setLobby(false);
      socket.emit('answer', {
        roomId,
        sdp: '',
      });
    });
    socket.on('answer', ({ roomId, answer }) => {
      setLobby(false);
      alert('Connection done');
    });

    socket.on('lobby', () => {
      setLobby(true);
    });
    setSocket(socket);
  }, [name]);

  if (lobby) {
    return <div>Waiting to connect you to someone</div>;
  }

  return (
    <div>
      Hi {name}
      <video width={400} height={400} />
      <video width={400} height={400} />
    </div>
  );
};
```

![alt text](image.png)
![alt text](image-1.png)
![alt text](image-2.png)
![alt text](image-3.png)
![alt text](image-4.png)
![alt text](image-5.png)
