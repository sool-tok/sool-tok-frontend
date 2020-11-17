import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

const flexConfig = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
};

const videoStyle = {
  width: '340px',
  height: '340px',
  borderRadius: '50%',
  backgroundColor: 'green',
};

function Video({ id, src, username, photoUrl }) {
  const ref = useRef();

  // useEffect(() => {
  //   peer.on('stream', stream => {
  //     ref.current.srcObject = stream;
  //   });
  // }, []);

  return (
    <div style={flexConfig}>
      <video id={id} src={src} poster={photoUrl} style={videoStyle} ref={ref} autoPlay />
      <p>{username}</p>
    </div>
  );
}

export default Video;

Video.propTypes = {
  id: PropTypes.string.isRequired,
  src: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  photoUrl: PropTypes.string.isRequired,
};
