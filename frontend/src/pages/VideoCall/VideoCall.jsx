import React, { useEffect, useRef, useState } from "react";
import { socket } from "../../socket";
import { useParams, useNavigate } from "react-router-dom";

import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import { BsCameraVideoFill, BsCameraVideoOffFill } from "react-icons/bs";
import { FcEndCall } from "react-icons/fc";

const VideoCall = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const localVideo = useRef();
  const remoteVideo = useRef();
  const peerConnection = useRef();

  const [stream, setStream] = useState(null);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [remoteConnected, setRemoteConnected] = useState(false);

  useEffect(() => {
    startCall();

    socket.on("user-joined", (count) => {
      if (count === 2) createOffer();
    });

    socket.on("offer", handleOffer);
    socket.on("answer", handleAnswer);
    socket.on("ice-candidate", handleCandidate);

    return () => {
      socket.emit("leave-room", roomId);

      socket.off("user-joined");
      socket.off("offer");
      socket.off("answer");
      socket.off("ice-candidate");

      if (peerConnection.current) {
        peerConnection.current.close();
      }
    };
  }, []);

  // START MEDIA + JOIN
  const startCall = async () => {
    const media = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    });

    setStream(media);
    localVideo.current.srcObject = media;

    createPeer(media);

    socket.emit("join-room", roomId);
  };

  // CREATE PEER
  const createPeer = (media) => {
    peerConnection.current = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" }
      ]
    });

    media.getTracks().forEach(track => {
      peerConnection.current.addTrack(track, media);
    });

    peerConnection.current.ontrack = (event) => {
      remoteVideo.current.srcObject = event.streams[0];
      setRemoteConnected(true);
    };

    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice-candidate", {
          roomId,
          candidate: event.candidate
        });
      }
    };
  };

  // OFFER
  const createOffer = async () => {
    const offer = await peerConnection.current.createOffer();
    await peerConnection.current.setLocalDescription(offer);

    socket.emit("offer", { roomId, offer });
  };

  // HANDLE OFFER
  const handleOffer = async (offer) => {
    await peerConnection.current.setRemoteDescription(offer);

    const answer = await peerConnection.current.createAnswer();
    await peerConnection.current.setLocalDescription(answer);

    socket.emit("answer", { roomId, answer });
  };

  // HANDLE ANSWER
  const handleAnswer = async (answer) => {
    await peerConnection.current.setRemoteDescription(answer);
  };

  // HANDLE ICE
  const handleCandidate = async (candidate) => {
    try {
      await peerConnection.current.addIceCandidate(candidate);
    } catch (err) {
      console.log(err);
    }
  };

  // MIC
  const toggleMic = () => {
    stream.getAudioTracks()[0].enabled = !micOn;
    setMicOn(!micOn);
  };

  // CAMERA
  const toggleCamera = () => {
    stream.getVideoTracks()[0].enabled = !camOn;
    setCamOn(!camOn);
  };

  // END CALL
  const endCall = () => {
    stream?.getTracks().forEach(track => track.stop());
    socket.emit("leave-room", roomId);
    navigate("/profile");
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center gap-5">

      <div className="flex gap-4">

        {/* REMOTE */}
        <div className="w-96 h-64 bg-gray-300 flex items-center justify-center">
          {!remoteConnected && <p>Waiting for participant...</p>}
          <video ref={remoteVideo} autoPlay className="w-full h-full" />
        </div>

        {/* LOCAL */}
        <video ref={localVideo} autoPlay muted className="w-96 h-64 bg-black" />

      </div>

      <div className="flex gap-5 text-xl">

        <button onClick={toggleMic}>
          {micOn ? <FaMicrophone /> : <FaMicrophoneSlash />}
        </button>

        <button onClick={toggleCamera}>
          {camOn ? <BsCameraVideoFill /> : <BsCameraVideoOffFill />}
        </button>

        <button onClick={endCall} className="text-red-500">
          <FcEndCall />
        </button>

      </div>
    </div>
  );
};

export default VideoCall;