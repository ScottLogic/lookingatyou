import WebcamFeed from "./WebcamFeed";
import shallow from "enzyme";

const props = {
  deviceId: 0,
  onUserMedia: () => { return 'webcam' },
  onUserMediaError: () => { return 'no webcam' },
}

describe('Get camera feed', () => {
  it('Should call onUserMediaError when no webcam detected', () => {
    const wraper = shallow(<WebcamFeed {...props} />)
  })
})



return {
  "person": {
    "bbox": [2 2 2 2],
    "face": {
      "bbox"
    }
  }
}
