import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Room } from './Room';

const Landing = () => {
  const [name, setName] = useState('');
  const [name2, setName2] = useState('');
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
      <div className='bg-black p-40'>
        <video autoPlay ref={videoRef} className='rounded-xl' />
        <input
          type='text'
          onChange={(e) => setName(e.target.value)}
          placeholder='Enter your name'
          className='mt-10 bg-white px-8 py-2 border border-slate-400 rounded-xl'
        />
        <button
          onClick={() => {
            setJoined(true);
          }}
          className='bg-blue-700 text-white px-10 p-4 m-6 rounded-xl'
        >
          Join
        </button>
      </div>
    );
  }

  return (
    <Room
      name={name}
      name2={name2}
      localAudioTrack={localAudioTrack}
      localVideoTrack={localVideoTrack}
    />
  );
};

export default Landing;
