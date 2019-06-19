import React from 'react';
import WebcamFeed from "./WebcamFeed";
import { mount, shallow } from "enzyme";
import jsdom from 'jsdom';

describe('WebcamFeed', () => {
  const streamSuccess = 'Stream received';
  const streamFailure = 'Unable to get stream';
  const myDeviceId = '123456';

  const mockOnUserMedia = jest.fn(() => streamSuccess);
  const mockOnUserMediaError = jest.fn().mockReturnValue(streamFailure);
  const mockMediaDevices = new jsdom.JSDOM().window.navigator.mediaDevices;
  const myMediaDevices: MediaDevices = {
    ondevicechange: () => { },
    dispatchEvent: (event: Event): boolean => { return false },
    addEventListener: () => { },
    removeEventListener: () => { },
    getSupportedConstraints: (): MediaTrackSupportedConstraints => { return {} },
    enumerateDevices: (): Promise<MediaDeviceInfo[]> => { return new Promise(() => []) },
    getUserMedia: (constraints?: MediaStreamConstraints | undefined): Promise<MediaStream> => {
      return new Promise((resolve) => {
        if (constraints && typeof constraints.video === 'object') {
          const deviceId = constraints.video.deviceId;
          if (deviceId === myDeviceId) {
            resolve();
          }
        }
      })
    },
  };
  console.log(myMediaDevices)

  const props = {
    deviceId: myDeviceId,
    onUserMedia: mockOnUserMedia,
    onUserMediaError: mockOnUserMediaError,
  }

  it('Should call onUserMediaError when no webcam detected', () => {
    mount(<WebcamFeed mediaDevices={mockMediaDevices} {...props} />);
    expect(mockOnUserMediaError.mock.results[0].value).toBe(streamFailure);
  });

  it('Should call onUserMedia when webcam detected', async () => {
    console.log(await myMediaDevices.getUserMedia());
    mount(<WebcamFeed mediaDevices={myMediaDevices} {...props} />);
    expect(mockOnUserMedia.mock.results[0].value).toBe(streamSuccess);
  })

  it('Should render video object', () => {
    const wrapper = shallow(<WebcamFeed mediaDevices={mockMediaDevices} {...props} />).debug();
    expect(wrapper).toMatchSnapshot();
  })
})
