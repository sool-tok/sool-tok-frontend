import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

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

export const StyledVideo = styled.video`
  object-fit: cover;
  background-color: #FF3CAC;
  background-image: linear-gradient(225deg, #FF3CAC 0%, #784BA0 50%, #2B86C5 100%);
  border-radius: 160px;
  width: 320px;
  height: 320px;
`;

export default Video;

Video.propTypes = {
  thumbnail: PropTypes.string.isRequired,
  peer: PropTypes.object,
};
