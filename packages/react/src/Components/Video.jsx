// Global imports
import React, { forwardRef, useEffect } from 'react';
import PropTypes from 'prop-types';

// Local imports
import { getCameraDevices } from '../helpers';

const electron = window.require('electron');
const { ipcRenderer } = electron;

const Video = forwardRef(({ captureOptions }, videoRef) => {
  const getVideoOptionsWithExactDeviceId = (webCam) => ({
    ...captureOptions,
    video: {
      ...(webCam ? { deviceId: { exact: webCam.deviceId } } : {}),
      ...captureOptions.video,
    },
  });

  const setupCamera = async (options) => {
    const stream = await navigator.mediaDevices.getUserMedia(options);
    const video = videoRef.current;
    video.srcObject = stream;
    video.play();
    video.addEventListener('pause', () =>
      stream.getTracks().forEach((track) => track.stop())
    );
  };

  ipcRenderer.on('webCamDevices', (event, data) => {
    const videoOptions = getVideoOptionsWithExactDeviceId(data);
    setupCamera(videoOptions);
  });

  useEffect(() => {
    (async () => {
      const cameraDevices = await getCameraDevices();
      ipcRenderer.send('webCamDevices', cameraDevices);
      const webCam = cameraDevices.find((device) =>
        device.label.includes(captureOptions.video.sourceModel)
      );
      const videoOptions = getVideoOptionsWithExactDeviceId(webCam);
      setupCamera(videoOptions);
    })();
  }, [videoRef]);

  return (
    <video
      ref={videoRef}
      width={captureOptions.video.width}
      height={captureOptions.video.height}
    />
  );
});

export default Video;
