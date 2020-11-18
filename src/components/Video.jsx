import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

export const StyledVideo = styled.video`
  background-color: blue;
  border-radius: 50px;
  width: 100%;
`;

function Video({ thumbnail, peer }) {
  const ref = useRef();

  useEffect(() => {
    if (!peer) return;

    peer.on('stream', stream => {
      ref.current.srcObject = stream;
    });
  }, [peer]);

  return <StyledVideo poster={thumbnail} ref={ref} autoPlay playsInline />;
}

export default Video;

Video.propTypes = {
  thumbnail: PropTypes.string.isRequired,
  peer: PropTypes.object,
};
