# Phase 3

### UserManager.ts 🥶 + RoomManager.ts 🥵 + Room.tsx 😈

- Added various state variables for maintaining states as we wanted to setup WebRTC Peer Connections and most of the code was to be written in the frontend.
- Added the sendingPc and receivingPc variables and states for localAudioTrack | localVideoTrack (own) and
  remoteAudioTrack | remoteVideoTrack (2nd person's).
- Added the 'add-ice-candidate' socket event for adding the ICE Candidates for sharing the IP's of each users in a PeerConnection fashion, as NAT helps in securing the network connection but ICE Candidates carry valuable socket and peer connection values to be passed.

```typescript
socket.on('add-ice-candidate', ({ candidate, roomId, type }) => {
  this.roomManager.onIceCandidates(roomId, socket.id, candidate, type);
});
```

- Added ref (reference) variables for our Video and Audio content to be displayed on the frontend, these ref values were then passsed to the video html tags.
- Added the onNegotitationNeeded and onIceCandidate functions which you can see below:

```typescript
pc.onicecandidate = async (e) => {
        console.log('receiving ice candidate locally');
        if (e.candidate) {
          socket.emit('add-ice-candidate', {
            candidate: e.candidate,
            type: 'sender',
            roomId,
          });
        }
      };

      pc.onnegotiationneeded = async () => {
        console.log('on negotiation neeeded, sending offer');
        const sdp = await pc.createOffer();
        //@ts-ignore
        pc.setLocalDescription(sdp);
        socket.emit('offer', {
          sdp,
          roomId,
        });
      };
    });

```

- Next we added the logic when 'offer' event is emitted. First created a new RTCPeerConnection(), then
  createdAnswer() and then setLocalDescription() to remoteSdp.

```typescript
  socket.on('offer', async ({ roomId, sdp: remoteSdp }) => {
        console.log('received offer');
        setLobby(false);
        const pc = new RTCPeerConnection();
        pc.setRemoteDescription(remoteSdp);
        const sdp = await pc.createAnswer();
        //@ts-ignore
        pc.setLocalDescription(sdp);
        const stream = new MediaStream();
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = stream;
        }

        setRemoteMediaStream(stream);
        // trickle ice
        setReceivingPc(pc);
        window.pcr = pc;
        pc.ontrack = (e) => {
          alert('ontrack');
        };
```

- Now we create the logic when we have to give back the answer when both the users are connected and we have to show the VideoTrack and AudioTrack.

```typescript
      socket.emit('answer', {
        roomId,
        sdp: sdp,
      });
      setTimeout(() => {
        const track1 = pc.getTransceivers()[0].receiver.track;
        const track2 = pc.getTransceivers()[1].receiver.track;
        console.log(track1);
        if (track1.kind === 'video') {
          setRemoteAudioTrack(track2);
          setRemoteVideoTrack(track1);
        } else {
          setRemoteAudioTrack(track1);
          setRemoteVideoTrack(track2);
        }
        //@ts-ignore
        remoteVideoRef.current.srcObject.addTrack(track1);
        //@ts-ignore
        remoteVideoRef.current.srcObject.addTrack(track2);
        //@ts-ignore
        remoteVideoRef.current.play();
      }, 5000);
    });

```

- Added useEffect() code for adding the localAudio and localVideo when the user1 gets in the Queue.

```typescript
useEffect(() => {
  if (localVideoRef.current) {
    if (localVideoTrack) {
      localVideoRef.current.srcObject = new MediaStream([localVideoTrack]);
      localVideoRef.current.play();
    }
  }
}, [localVideoRef]);
```
