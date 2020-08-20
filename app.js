function init(opt = {}) {
  const peer = new Peer();

  const btnCall = document.getElementById('call')
  const btnStopCall = document.getElementById('stopcall')
  const videoElem = document.getElementById('video')
  const status = document.getElementById('status')
  let call = null

  peer.on('open', (id) => {
    status.innerHTML = JSON.stringify({ myID: id, message: "Waiting for connection" }, " ", 4)
  })

  peer.on('error', (error) => {
    status.innerHTML = error
  })

  peer.on('connection', (peer) => {
    status.innerHTML = "Connected"
  })

  peer.on('call', (call) => {
    status.innerHTML = "Call received.."
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        status.innerHTML = "Connected"
        call.answer(stream); // Answer the call with an A/V stream.
        call.on('stream', (remoteStream) => {
          console.log('---remote streeam received', remoteStream);

          videoElem.srcObject = remoteStream
        });
        call.on('close', () => {
          videoElem.srcObject = null

        })
      })
      .catch(() => {
        status.innerHTML = "Permission rejected.."
      })
  });

  function doCall() {
    recipientId = document.getElementById('uid').value
    if (recipientId.length > 0) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          call = peer.call(recipientId, stream);
          call.on('stream', (remoteStream) => {
            status.innerHTML = "Connected"
            videoElem.srcObject = remoteStream
          });
        })
        .catch(console.log);
    } else {
      status.innerHTML = "Invalild ID !"
    }


  }

  function stopCall(params) {
    call.close()
    status.innerHTML = "Call ended"
    videoElem.srcObject = null
  }

  btnCall.addEventListener('click', doCall)
  btnStopCall.addEventListener('click', stopCall)
}


fetch('https://randomuser.me/api/')
  .then(resp => resp.json())
  .then(data => {
    let { title, first, last } = data.results[0].name
    document.getElementById('name').innerHTML = `${title} ${first} ${last}`
  })


init()

