import React from 'react';
import WebcamFeed from "./WebcamFeed";
import { mount } from "enzyme";
import jsdom from 'jsdom';

const webcamDetected = 'webcam detected';
const noWebcam = 'no webcam';


const mockOnUserMedia = jest.fn(x => webcamDetected);
const mockOnUserMediaError = jest.fn(() => noWebcam);

const props = {
  deviceId: "12345",
  onUserMedia: mockOnUserMedia,
  onUserMediaError: mockOnUserMediaError,
}

describe('Get camera feed', () => {
  it('Should call onUserMediaError when no webcam detected', () => {
    const navigator = new jsdom.JSDOM().window.navigator;
    mount(<WebcamFeed navigator={navigator} {...props} />);
    expect(mockOnUserMediaError.mock.results[0].value).toBe(noWebcam);
  });

  it('Should call onUserMedia when webcam detected', () => {
    let navigator = new jsdom.JSDOM().window.navigator;
    Object.defineProperty(navigator, 'mediaDevices', { value: jest.fn(), writable: true});
    Object.defineProperty(navigator.mediaDevices, 'getUserMedia', { value: jest.fn(x => new Promise((resolver) => { return }))})
    console.log(navigator.mediaDevices);
    // navigator.mediaDevices = jest.fn();
    // navigator.mediaDevices.getUserMedia = jest.fn(x => new Promise((resolve) => { resolve(new MediaStream)}));
    mount(<WebcamFeed navigator={navigator} {...props} />);
    console.log(mockOnUserMedia.mock);
    expect(mockOnUserMedia.mock.results[0].value).toBe(webcamDetected);
  })
})
