import React from 'react';
import WebcamFeed, { IWebcamFeedProps } from "./WebcamFeed";
import { mount, shallow } from "enzyme";
import jsdom from 'jsdom';

let streamSuccess: string;
let streamFailure: string;
let validDeviceId: string;

let mockOnUserMedia: jest.Mock;
let mockOnUserMediaError: jest.Mock;
let mockMediaDevices: MediaDevices;
let props: IWebcamFeedProps;

describe('WebcamFeed', () => {
  beforeEach(() => {
    streamSuccess = 'Stream received';
    streamFailure = 'Unable to get stream';
    validDeviceId = '123456';

    mockOnUserMedia = jest.fn().mockReturnValue(streamSuccess);
    mockOnUserMediaError = jest.fn().mockReturnValue(streamFailure);
    mockMediaDevices = new jsdom.JSDOM().window.navigator.mediaDevices;

    props = {
      onUserMedia: mockOnUserMedia,
      onUserMediaError: mockOnUserMediaError,
      mediaDevices: mockMediaDevices,
      deviceId: validDeviceId,
    }

  });

  it('Should call onUserMediaError when no webcam detected', async () => {
    mount(<WebcamFeed {...props} />);
    expect(mockOnUserMediaError).toHaveBeenCalled();
  });

  it('Should render video object', () => {
    const wrapper = shallow(<WebcamFeed {...props} />).debug();
    expect(wrapper).toMatchSnapshot();
  })
})
