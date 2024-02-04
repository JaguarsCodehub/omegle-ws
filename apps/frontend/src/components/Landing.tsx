import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Room } from './Room';

const Landing = () => {
  const [name, setName] = useState('');
  const [joined, setJoined] = useState(false);
  const [localVideoTrack, setLocalVideoTrack] =
    useState<MediaStreamTrack | null>(null);
  const [localAudioTrack, setlocalAudioTrack] =
    useState<MediaStreamTrack | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);

  const getCam = async () => {
    // Whenever we run this, we will get access to the users MEDIASTREAMS.
    // Video and Audio
    const stream = await window.navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    // A person can have multiple audio mics or multiple videos so, we are accesssing only the first [0]th index mic
    const audioTrack = stream.getAudioTracks()[0];
    const videoTrack = stream.getVideoTracks()[0];
    setlocalAudioTrack(audioTrack);
    setLocalVideoTrack(videoTrack);

    if (!videoRef.current) {
      return;
    }
    videoRef.current.srcObject = new MediaStream([videoTrack]);
    videoRef.current.play();
  };

  useEffect(() => {
    if (videoRef && videoRef.current) {
      getCam();
    }
  }, [videoRef]);

  if (!joined) {
    return (
      <div>
        <video autoPlay ref={videoRef}></video>
        <input type='text' onChange={(e) => setName(e.target.value)} />
        <button
          onClick={() => {
            setJoined(true);
          }}
        >
          Join
        </button>
      </div>
    );
  }

  return (
    <Room
      name={name}
      localAudioTrack={localAudioTrack}
      localVideoTrack={localVideoTrack}
    />
  );
};

export default Landing;
