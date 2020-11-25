let stream;

const initVideoStream = async () => {
  stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
  return stream;
};

const getVideoStream = () => stream;

const removeVideoStream = () => {
  if (!stream) return;

  stream.getVideoTracks().forEach(track => {
    track.stop();
    stream.removeTrack(track);
  });
};

const controlAudioOption = {
  on: () => {
    stream.getAudioTracks().forEach(track => (track.enabled = true));
  },
  off: () => {
    stream.getAudioTracks().forEach(track => (track.enabled = false));
  },
};

const controlVideoOption = {
  on: () => {
    stream.getVideoTracks().forEach(track => (track.enabled = true));
  },
  off: () => {
    stream.getVideoTracks().forEach(track => (track.enabled = false));
  },
};

export {
  initVideoStream,
  getVideoStream,
  removeVideoStream,
  controlAudioOption,
  controlVideoOption,
};
