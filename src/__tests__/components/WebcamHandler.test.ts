import jsdom from 'jsdom';
import configureStream from '../../components/webcamHandler/WebcamHandler';

let mockMediaDevices: MediaDevices;
let mockOnUserMedia: jest.Mock;
let mockOnUserMediaError: jest.Mock;

describe('Webcam Handler', () => {
    beforeEach(() => {
        mockMediaDevices = new jsdom.JSDOM().window.navigator.mediaDevices;
        mockOnUserMedia = jest.fn();
        mockOnUserMediaError = jest.fn();
    });
    it('should call onUserMediaError when unable to get devices', async () => {
        await configureStream(
            mockMediaDevices,
            mockOnUserMedia,
            mockOnUserMediaError,
        );
        expect(mockOnUserMediaError).toHaveBeenCalled();
    });
});
