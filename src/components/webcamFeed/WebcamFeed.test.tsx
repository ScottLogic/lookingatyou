import React from 'react';
import WebcamFeed from "./WebcamFeed";
import { mount, shallow } from "enzyme";
import jsdom from 'jsdom';

describe('WebcamFeed', () => {
  const streamSuccess = 'Stream received';
  const streamFailure = 'Unable to get stream';
  const deviceId = '123456';

  const mockOnUserMedia = jest.fn(() => streamSuccess);
  const mockOnUserMediaError = jest.fn().mockReturnValue(streamFailure);
  const mockMediaDevices = new jsdom.JSDOM().window.navigator.mediaDevices;
  const myMediaDevices = jest.fn().mockImplementation(() => {
  });


  const props = {
    deviceId: deviceId,
    onUserMedia: mockOnUserMedia,
    onUserMediaError: mockOnUserMediaError,
  }


  it('Should call onUserMediaError when no webcam detected', () => {
    mount(<WebcamFeed mediaDevices={mockMediaDevices} {...props} />);
    expect(mockOnUserMediaError.mock.results[0].value).toBe(streamFailure);
  });

  it('Should call onUserMedia when webcam detected', () => {
    let myMockMediaDevices = new jsdom.JSDOM().window.navigator.mediaDevices;
    mount(<WebcamFeed mediaDevices={myMockMediaDevices} {...props} />);
    expect(mockOnUserMedia.mock.results[0].value).toBe(streamSuccess);
  })

  it('Should render video object', () => {
    const wrapper = shallow(<WebcamFeed mediaDevices={mockMediaDevices} {...props} />);
    expect(wrapper).toMatchSnapshot();
  })
})
