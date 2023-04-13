import './App.css';
import React, { useEffect, useState, useRef } from "react"
import Peer from "peerjs"

function App() {

  const inputId = useRef()
  const localVideo = useRef()
  const remoteVideo = useRef()

  const myPeer = useRef()
  const [peerId, setPeerId] = useState()
  useEffect(() => {
    myPeer.current = new Peer(
      // {host:"/", port:3001}
    )
    console.log(myPeer.current)
    myPeer.current.on('open', id => {
      console.log("my id is", id)
      setPeerId(id)
    })

    myPeer.current.on('connection', function (conn) {
      conn.on('data', function (data) {
        // Will print 'hi!'
        console.log(data);
      });
    });

    myPeer.current.on("call", function (call) {
      const getUserMedia = navigator.getUserMedia = (
        navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia
      );

      getUserMedia({ video: true }, function (localStream) {
        call.answer(localStream);
        localVideo.current.srcObject = localStream
        localVideo.current.play()
        call.on('stream', function (remoteStream) {
          remoteVideo.current.srcObject = remoteStream
          remoteVideo.current.play()
        });
      })

    })
    // myPeer.current.on('call', function (call) {
    //   const getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

    //   getUserMedia({ video: true, audio: true }, function (stream) {
    //     call.answer(stream); // Answer the call with an A/V stream.
    //     call.on('stream', function (remoteStream) {
    //       console.log(remoteStream)
    //       // Show stream in some video/canvas element.
    //     });
    //   }, function (err) {
    //     console.log('Failed to get local stream', err);
    //   });
    // });

  }, [])


  function handleCall(e) {
    e.preventDefault()
    const idToCall = inputId.current.value;
    inputId.current.value = ""

    // const getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    const getUserMedia = navigator.getUserMedia = (
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia ||
      navigator.msGetUserMedia
    );
    getUserMedia({ video: true }, function (stream) {
      localVideo.current.srcObject = stream
      localVideo.current.play()
      const call = myPeer.current.call(idToCall, stream);
      call.on('stream', function (remoteStream) {
        remoteVideo.current.srcObject = remoteStream
        remoteVideo.current.play()

        // Show stream in some video/canvas element.
      });
    }, function (err) {
      console.log('Failed to get local stream', err);
    });
  }
  return (
    <div className="App">
      <div>{peerId}</div>

      <form>
        <input type="text" ref={inputId} />
        <button onClick={handleCall}> call </button>
      </form>
      local:
      <div>
        <video ref={localVideo} style={{ width: "500px", height: "200px" }} />
      </div>
      remote:
      <div>
        <video ref={remoteVideo} style={{ width: "500px", height: "200px" }} />
      </div>

    </div>
  );
}

export default App;
