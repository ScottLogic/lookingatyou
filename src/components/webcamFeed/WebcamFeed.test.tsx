import React from 'react';
import WebcamFeed from "./WebcamFeed";
import { mount, shallow } from "enzyme";
import jsdom from 'jsdom';

describe('WebcamFeed', () => {
  const streamSuccess = 'Stream received';
  const streamFailure = 'Unable to get stream';
  const validDeviceId = '123456';

  const mockOnUserMedia = jest.fn().mockReturnValue(streamSuccess);
  const mockOnUserMediaError = jest.fn(() => { return streamFailure });
  const mockMediaDevices = new jsdom.JSDOM().window.navigator.mediaDevices;

  const props = {
    onUserMedia: mockOnUserMedia,
    onUserMediaError: mockOnUserMediaError,
    mediaDevices: mockMediaDevices,
  }

  it('Should call onUserMediaError when no webcam detected', async () => {
    mount(<WebcamFeed deviceId={validDeviceId} {...props} />);
    expect(mockOnUserMediaError.mock.results[0].value).toBe(streamFailure);
  });

  it('Should render video object', () => {
    const wrapper = shallow(<WebcamFeed deviceId={validDeviceId} {...props} />).debug();
    expect(wrapper).toMatchSnapshot();
  })
})
