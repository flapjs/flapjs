import React from 'react';
import { shallow } from 'enzyme';

import { testComponentProps } from 'ComponentTests';

import JPGFileIcon from './flat/JPGFileIcon';
import JSONFileIcon from './flat/JSONFileIcon';
import PNGFileIcon from './flat/PNGFileIcon';
import XMLFileIcon from './flat/XMLFileIcon';

import AddIcon from './AddIcon';
import BoxAddIcon from './BoxAddIcon';
import BugIcon from './BugIcon';
import CheckCircleIcon from './CheckCircleIcon';
import CrossCircleIcon from './CrossCircleIcon';
import CrossIcon from './CrossIcon';
import DownArrowIcon from './DownArrowIcon';
import DownloadIcon from './DownloadIcon';
import EditPencilIcon from './EditPencilIcon';
import ExpandDownIcon from './ExpandDownIcon';
import FullscreenExitIcon from './FullscreenExitIcon';
import FullscreenIcon from './FullscreenIcon';
import HelpIcon from './HelpIcon';
import InfoIcon from './InfoIcon';
import MenuIcon from './MenuIcon';
import MoreIcon from './MoreIcon';
import MoveIcon from './MoveIcon';
import MoveOutIcon from './MoveOutIcon';
import NoticeCircleIcon from './NoticeCircleIcon';
import NoticeTriangleIcon from './NoticeTriangleIcon';
import OfflineCheckIcon from './OfflineCheckIcon';
import OfflineIcon from './OfflineIcon';
import PageAddIcon from './PageAddIcon';
import PageContentIcon from './PageContentIcon';
import PageEmptyIcon from './PageEmptyIcon';
import PauseIcon from './PauseIcon';
import PendingIcon from './PendingIcon';
import PinpointIcon from './PinpointIcon';
import PlayIcon from './PlayIcon';
import RedoIcon from './RedoIcon';
import RunningManIcon from './RunningManIcon';
import SaveDiskIcon from './SaveDiskIcon';
import SettingsIcon from './SettingsIcon';
import StopIcon from './StopIcon';
import SubtractIcon from './SubtractIcon';
import TinyDownIcon from './TinyDownIcon';
import TinyUpIcon from './TinyUpIcon';
import TrashCanDetailedIcon from './TrashCanDetailedIcon';
import TrashCanIcon from './TrashCanIcon';
import TriangleIcon from './TriangleIcon';
import UndoIcon from './UndoIcon';
import UploadIcon from './UploadIcon';
import WorldIcon from './WorldIcon';
import ZoomInIcon from './ZoomInIcon';
import ZoomOutIcon from './ZoomOutIcon';

testIconClass(JPGFileIcon);
testIconClass(JSONFileIcon);
testIconClass(PNGFileIcon);
testIconClass(XMLFileIcon);

testIconClass(AddIcon);
testIconClass(BoxAddIcon);
testIconClass(BugIcon);
testIconClass(CheckCircleIcon);
testIconClass(CrossCircleIcon);
testIconClass(CrossIcon);
testIconClass(DownArrowIcon);
testIconClass(DownloadIcon);
testIconClass(EditPencilIcon);
testIconClass(ExpandDownIcon);
testIconClass(FullscreenExitIcon);
testIconClass(FullscreenIcon);
testIconClass(HelpIcon);
testIconClass(InfoIcon);
testIconClass(MenuIcon);
testIconClass(MoreIcon);
testIconClass(MoveIcon);
testIconClass(MoveOutIcon);
testIconClass(NoticeCircleIcon);
testIconClass(NoticeTriangleIcon);
testIconClass(OfflineCheckIcon);
testIconClass(OfflineIcon);
testIconClass(PageAddIcon);
testIconClass(PageContentIcon);
testIconClass(PageEmptyIcon);
testIconClass(PauseIcon);
testIconClass(PendingIcon);
testIconClass(PinpointIcon);
testIconClass(PlayIcon);
testIconClass(RedoIcon);
testIconClass(RunningManIcon);
testIconClass(SaveDiskIcon);
testIconClass(SettingsIcon);
testIconClass(StopIcon);
testIconClass(SubtractIcon);
testIconClass(TinyDownIcon);
testIconClass(TinyUpIcon);
testIconClass(TrashCanDetailedIcon);
testIconClass(TrashCanIcon);
testIconClass(TriangleIcon);
testIconClass(UndoIcon);
testIconClass(UploadIcon);
testIconClass(WorldIcon);
testIconClass(ZoomInIcon);
testIconClass(ZoomOutIcon);

function testIconClass(IconClass)
{
  //Test props
  testComponentProps(IconClass);

  test("check container component type", () =>
  {
    const wrapper = shallow(<IconClass />);

    expect(wrapper.type()).toBe('svg');
  });
}
