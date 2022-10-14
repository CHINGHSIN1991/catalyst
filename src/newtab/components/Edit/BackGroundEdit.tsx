import React, { useContext } from 'react';
import styled from "styled-components";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';

import AlertContext from '../../features/alertContext';
import { getEditPanelState, setEditPanel } from '../../features/reducers/editSlice';
import { loadBackgrounds } from '../../features/reducers/backgroundSlice';

import { EditPanelWrapper, EditPanelTitle, EditPanelTitleText, EditPanelTitleUnderLine, ScrollbarContainer } from '../../../static/styleSetting';
import { background, backgroundSetting, currentComparison, appliedComparison } from '../../../static/types';
import { PanelButton, ButtonContainer } from '../../../static/components';
import { deepCopy } from '../../../utils/functions';

type bg = { bg: string; };

const Wrapper = styled(EditPanelWrapper)`
  width: 738px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const BackgroundContainer = styled(ScrollbarContainer)`
  padding: 8px 10px;
  background-color: darkgray;
  border-radius: 0px 8px 8px 8px; 
  height: 400px;
  width: calc(100% - 120px);
  display: flex;
  align-items: flex-start;
  justify-content: start;
  align-content: flex-start;
  flex-wrap: wrap;
`;

const BackgroundListPanel = styled.div`
  width: 120px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  @media (max-width:768px) {
    width: 100px;
  }
`;

const BackgroundListOption = styled.div`
  cursor: pointer;
  border-radius: 8px 0px 0px 8px ;
  display: flex;
  flex-direction: column;
  margin-bottom: 3px;
  line-height: 24px;  
  width: ${(props: currentComparison) => props.index === props.current ? '120px' : '104px'};
  height: 60px;
  background-color: ${(props: currentComparison) => props.index === props.current ? 'darkgray' : 'lightgray'};
  transition: 0.2s;
  :hover{
    background-color: ${(props: currentComparison) => props.index === props.current ? 'darkgray' : 'darkgray'};
  }
  :last-child{
    margin-bottom: 0px;
  }

  @media (max-width:768px) {
    width: ${(props: currentComparison) => props.index === props.current ? '100px' : '80px'};
  } 
`;

const BackgroundImage = styled.div`
  cursor: pointer;
  border: solid 1px gray;
  border-radius: 4px;
  margin: 8px;
  width: 120px;
  height: 80px;
  background-image: url(${(props: bg) => props.bg});
  background-position: center;
  background-size: cover;
  overflow: hidden;
`;

const AddToCollectionOptionList = styled.div`
  padding-top: 8px;
  width: 100%;
  display: flex;
  justify-content: center;
  opacity: 0;
  transform: translateY(4px);
  transition: 0.1s;
  transition-delay: 0.1s;
`;

const AddToCollectionOption = styled.div`
  font-size: 12px;
  width: 16px;
  height: 16px;
  margin: 0 2px;
  border-radius: 4px;
  background-color: rgba(255,255,255,0.6);
  line-height: 16px;
  text-align: center;
  :hover {
    background-color: rgba(255,255,255,0.9);
  }
`;

const DeleteBtn = styled.div`
  margin-top: 8px;
  font-size: 12px;
  height: 16px;
  line-height: 12px;
  border-radius: 4px;
  padding: 2px 4px;
  background-color: rgba(255,255,255,0.6);
  opacity: 0;
  transform: translateY(4px);
  transition: 0.1s;
  transition-delay: 0.2s;
  :hover {
    background-color: rgba(255,255,255,0.9);
  }
`;

const AddToCollectionTitle = styled.div`
  width: 100%;
  color: white;
  font-size: 12px;
  text-align: center;
  opacity: 0;
  transform: translateY(4px);
  transition: 0.1s;
`;

const AddToCollectionPanel = styled.div`
  position: absolute;
  left: 0px;
  top: 0px;
  background-color: rgba(0,0,0,0);
  transition: 0.2s;
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 8px;
  :hover{
    background-color: rgba(0,0,0,0.7);
    ${AddToCollectionTitle} {
      opacity: 1;
      transform: translateY(0px);
    }
    ${AddToCollectionOptionList}{
      opacity: 1;
      transform: translateY(0px);
    }
    ${DeleteBtn}{
      opacity: 1;
      transform: translateY(0px);
    }
  }
`;

const Title = styled.div`
  width: 100%;
  padding-top: 8px;
  padding-left: 120px;
  color: rgb(160,160,160);
  font-size: 0.875rem;
  line-height: 20px;
  @media (max-width:768px) {
    padding-left: 100px;
  } 
`;

const BackgroundPanel = styled.div`
  margin-top: 0px;
  display: flex;
  width: 100%;
  height: auto;
`;

const ApplyButton = styled.div`
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
  line-height: 20px;
  width: ${(props: appliedComparison) => props.applied === props.index ? '72px' : '56px'};
  margin: 2px 0 8px 16px;
  text-align: center;
  color: ${(props: appliedComparison) => props.applied === props.index ? 'rgb(40,40,40)' : 'rgb(240,240,240)'};
  background-color: ${(props: appliedComparison) => props.applied === props.index ? 'rgb(124, 247, 216)' : 'rgb(120,120,120)'};
  white-space: nowrap;
  overflow: hidden;
  transition: 0.2s;
  :hover {
    background-color: ${(props: appliedComparison) => props.applied === props.index ? 'rgb(124, 247, 216)' : 'rgb(40,40,40)'};
    color: ${(props: appliedComparison) => props.applied === props.index ? 'rgb(40,40,40)' : 'rgb(250,250,250)'};
  }
  @media (max-width:768px) {
    margin: 2px 0 8px 8px;
  } 
`;

const BackgroundListOptionTitle = styled.div`
  padding: 4px 0 0 16px;
  font-size: 0.875rem;
  font-weight: bold;
  color: ${(props: currentComparison) => props.current === props.index ? 'white' : 'rgb(40,40,40)'};
  transition: 0.2s;
  @media (max-width:768px) {
    font-size: 0.75rem;
    padding: 4px 0 0 8px;
  } 
`;

export const BackgroundEditPanel: React.FC<{}> = () => {
  const dispatch = useDispatch();
  const editPanelState = useSelector(getEditPanelState);
  const [alertState, setAlertState] = useContext(AlertContext);
  const [tempBackgroundSetting, setTempBackgroundSetting] = useState<backgroundSetting>(null);
  const [current, setCurrentSet] = useState(0);


  function addImgToCollection(image: background, collection: number) {
    let temp = deepCopy(tempBackgroundSetting);
    if (!temp.backgroundList[collection].find((item: background) => item.id === image.id)) {
      if (temp.backgroundList[collection].length >= 12) {
        setAlertState({
          title: 'Collection is full',
          message: `The number of images in collection ${collection} has reached the limit. Do you want to replace the first image with the selected image?`,
          function: () => replaceFirstImage(image, collection)
        });
      } else {
        temp.backgroundList[collection].push(image);
        setTempBackgroundSetting(temp);
      }
    } else {
      setAlertState({ title: 'Duplicate images', message: `This image is already in collection${collection}` });
    }
  }

  function replaceFirstImage(image: background, collection: number) {
    let temp = deepCopy(tempBackgroundSetting);
    temp.backgroundList[collection].shift();
    temp.backgroundList[collection].push(image);
    setTempBackgroundSetting(temp);
  }

  function delImgInCollection(image: background, collection: number) {
    let temp = JSON.parse(JSON.stringify(tempBackgroundSetting));
    temp.backgroundList[collection] = temp.backgroundList[collection].filter((item: background) => item.id !== image.id);
    setTempBackgroundSetting(temp);
  }

  function applyCollection(index: number) {
    if (tempBackgroundSetting.backgroundList[index].length > 0) {
      setTempBackgroundSetting({ ...tempBackgroundSetting, bgSetting: { ...tempBackgroundSetting.bgSetting, current: { setting: index, slice: 0 } } });
    }
  }

  useEffect(() => {
    if ('data' in editPanelState && editPanelState.name === 'BackgroundEdit') {
      setTempBackgroundSetting(JSON.parse(JSON.stringify(editPanelState.data)));
    }
  }, [editPanelState]);

  return (
    <Wrapper onClick={(e: Event) => e.stopPropagation()}>
      <EditPanelTitle>
        <EditPanelTitleText>
          Background setting
        </EditPanelTitleText>
        <EditPanelTitleUnderLine></EditPanelTitleUnderLine>
      </EditPanelTitle>
      <Title>{(current === 0 ? 'Get 10 random images everyday' : `You can add images from other collections ( max 12 images )`)}</Title>
      <BackgroundPanel>
        <BackgroundListPanel>
          {tempBackgroundSetting && [0, 1, 2, 3, 4, 5].map((item) => {
            return <BackgroundListOption
              key={'option' + item}
              current={current}
              index={item}
              onClick={() => setCurrentSet(item)}
              currentApplied={tempBackgroundSetting.bgSetting.current.setting}
            >
              <BackgroundListOptionTitle
                current={current}
                index={item}
              >{item === 0 ? 'Random' : `Collection ${item}`}
              </BackgroundListOptionTitle>
              {(item === tempBackgroundSetting.bgSetting.current.setting || item === current) &&
                <ApplyButton
                  onClick={() => applyCollection(item)}
                  applied={tempBackgroundSetting.bgSetting.current.setting}
                  index={item}
                  current={current}>
                  {tempBackgroundSetting.bgSetting.current.setting === item && 'Current'}
                  {tempBackgroundSetting.bgSetting.current.setting !== item && tempBackgroundSetting.backgroundList[item].length > 0 && 'Apply'}
                </ApplyButton>}
            </BackgroundListOption>;
          })}
        </BackgroundListPanel>
        <BackgroundContainer>
          {tempBackgroundSetting && tempBackgroundSetting.backgroundList[current].map((bg, index) => {
            return <BackgroundImage key={`${bg}+${index}`} bg={bg.smallUrl}>
              <AddToCollectionPanel>
                <AddToCollectionTitle>Add to Collection</AddToCollectionTitle>
                <AddToCollectionOptionList>
                  {[1, 2, 3, 4, 5].map((item) => { return item === current ? '' : <AddToCollectionOption key={bg.id + item} onClick={() => addImgToCollection(bg, item)}>{item}</AddToCollectionOption>; })}
                </AddToCollectionOptionList>
                {current !== 0 && <DeleteBtn onClick={() => delImgInCollection(bg, current)}>Delete</DeleteBtn>}
              </AddToCollectionPanel>
            </BackgroundImage>;
          })}
        </BackgroundContainer>
      </BackgroundPanel>
      <ButtonContainer>
        <PanelButton width={80} name='Save' onClick={() => { dispatch(loadBackgrounds(tempBackgroundSetting)); dispatch(setEditPanel({ name: '', data: '' })); }} />
        <PanelButton width={80} name='Cancel' onClick={() => dispatch(setEditPanel({ name: '', data: '' }))} />
      </ButtonContainer>
    </Wrapper>
  );
};