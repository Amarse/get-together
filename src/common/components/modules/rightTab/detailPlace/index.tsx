import KeywordButton from '@components/elements/keyword-button/base';
import MoneyButton from '@components/elements/keyword-button/money';
import PeopleButton from '@components/elements/keyword-button/people';
import SubmitButton from '@components/elements/submitButton';
import BaseButton from '@components/elements/keyword-button/base';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import RightTabTitle from '../tab';
import Atmosphere from './atmosphere';
import Brightness from './brightness';
import Etc from './etc';
import PlaceKinds from './placeKinds';
import Satisfaction from './satisfaction';
import { placeExist, registerFirstPlace, registerReview } from '@api/mapApi';
import { PlaceRegister, registerReviewType } from 'src/types/registerType';

const DetailContainer = styled.section`
  overflow-y: auto;
  position: absolute;
  z-index: 26;
  clear: both;
  right: 0px;
  width: 380px;
  height: 100vh;
  background: ${({ theme }) => theme.color.white};

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 2px;
    background: #ccc;
  }
`;

const UlStyled = styled.ul`
  display: flex;
  width: 380px;
`;

const CardContainer = styled.form`
  width: 100%;
  padding: 45px 28px 35px 28px;
  border-bottom: 1px solid ${({ theme }) => theme.color.gray30};
`;

const CardHeader = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  padding-bottom: 0.8rem;

  .people {
    font-size: 1rem;
    color: ${({ theme }) => theme.color.black};
    font-weight: 600;
    padding-right: 4px;
  }
`;

const CardBody = styled.div`
  margin-bottom: 1rem;

  p {
    display: flex;
    justify-content: space-between;
    margin: 0.3rem 0.1rem;
  }
  .title {
    padding-bottom: 12px;
    .food {
      padding-right: 6px;
      font-size: ${({ theme }) => theme.fontSize.Stitle};
      // font-weight: 600;
      color: ${({ theme }) => theme.color.gray90};
      border-right: 1px solid ${({ theme }) => theme.color.gray40};
    }
    .address {
      padding-left: 6px;
      color: ${({ theme }) => theme.color.gray80};
    }
  }
  .body {
    align-items: center;
    display: flex;

    .star {
      color: ${({ theme }) => theme.color.gray90};
      font-size: 14px;
      padding: 0 18px 0 2px;
      font-weight: 700;
    }

    .review {
      color: ${({ theme }) => theme.color.gray80};
      font-size: 14px;
      padding-right: 10px;
    }
    .save {
      color: ${({ theme }) => theme.color.gray80};
      font-size: 14px;
      padding-right: 10px;
    }
  }
`;

const CardFooter = styled.div`
  width: 100%;
  align-items: center;
`;

const InputForm = styled.input`
  margin: 0;
  width: 100%;
  width: 324px;
  padding: 11px 0 8px 0;
  display: flex;
  border-bottom: 2px solid ${({ theme }) => theme.color.black};
  &::placeholder {
    color: ${({ theme }) => theme.color.gray40};
  }
  &:focus {
    border-bottom: 2px solid ${({ theme }) => theme.color.orange};
  }
  &:focus + button > svg {
    stroke: ${({ theme }) => theme.color.orange};
  }
`;

export interface placeDetail {
  placeId: string;
  placeName: string;
  address: string;
  roadAddress: string;
  category: string;//양식
  placeUrl: string;
  x: number;
  y: number;
}

const DetailPlace = (props: placeDetail) => {
  //입력 데이터
  const [inputData, setInput] = useState({
    placeId: props.placeId,
    placeName: props.placeName,
    address: props.address,
    roadAddress: props.roadAddress,
    category: props.category,
    url: props.placeUrl,
    x: props.x,
    y: props.y,
    placeKinds: '',
    satisfaction: 0,
    participants: 0,
    price: '',
    mood: '',
    light: '',
    isCorkCharge: false,
    isRoom: false,
    isReservation: false,
    isParking: false,
    isAdvancePayment: false,
    isRent: false,
    simpleReview: '',
  });

  //입력 폼 전체 상태 관리
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    console.log(e.target);
    setInput({
      ...inputData,
      [name]: value,
    });
    console.log(inputData);
  };

  //등록 버튼 클릭시 있는지 확인 후 없으면 새로 장소 등록 후 리뷰 등록
  const submitForm = async () => {
    const requestData = inputData;
    const existRes = await placeExist(requestData.placeId)
      .then(async (res) => {
        console.log(requestData.placeId);
        //없다면 장소 등록
        if (!res) {
          const requestD: PlaceRegister = {
            kakaoId: requestData.placeId,
            name: requestData.placeName,
            category: requestData.category,
            x: requestData.x,
            y: requestData.y,
            info: {
              url: requestData.url,
              address: requestData.address,
              roadAddress: requestData.roadAddress
            }
          }
          const firstPlaceres = await registerFirstPlace(requestD).then((ress) => {
            console.log(ress);
          });
        }

        //리뷰 등록
        const reqData: registerReviewType = {
          placeId: requestData.placeId,
          participants: requestData.participants,
          rating: requestData.satisfaction,
          price_range: requestData.price,
          is_cork_charge: requestData.isCorkCharge,
          is_room: requestData.isRoom,
          is_reservation: requestData.isReservation,
          is_parking: requestData.isParking,
          is_advance_payment: requestData.isAdvancePayment,
          is_rent: requestData.isRent,
          simple_review: requestData.simpleReview,
          reveiwMoodDto: [{
            mood_category: 'Mood',
            mood: requestData.mood
          },
          {
            mood_category: 'Lighting',
            mood: requestData.light
          }
          ]
        };

        const firstPlaceres = await registerReview(reqData).then((ress) => {
          console.log(ress);
        });
      });
  };

  return (
    <DetailContainer className="scrollBar">
      <UlStyled>
        <RightTabTitle title={inputData.placeName} />
      </UlStyled>
      <CardContainer>
        <CardHeader>
          <h2 className="people">장소 구분</h2>
          {/* <TopBadge /> */}
        </CardHeader>
        <CardBody>
          <PlaceKinds onChange={onChange} name='placeKinds' />
        </CardBody>
        <CardHeader>
          <h2 className="people">만족도 </h2>
          {/* <TopBadge /> */}
        </CardHeader>
        <CardBody>
          <Satisfaction onChange={onChange} name="satisfaction" />
        </CardBody>
        <CardHeader>
          <h2 className="people">참석인원수 </h2>
          {/* <TopBadge /> */}
        </CardHeader>
        <CardBody>
          <InputForm placeholder="0" onChange={onChange} name="participants" />
        </CardBody>
        <CardHeader>
          <h2 className="people">인당 가격대 </h2>
          {/* <TopBadge /> */}
        </CardHeader>
        <CardBody>
          <MoneyButton onChange={onChange} name="price" />
        </CardBody>
        <CardHeader>
          <h2 className="people">분위기 </h2>
          {/* <TopBadge /> */}
        </CardHeader>
        <CardBody>
          <Atmosphere onChange={onChange} name="mood" />
        </CardBody>
        <CardHeader>
          <h2 className="people">조명 밝기</h2>
          {/* <TopBadge /> */}
        </CardHeader>
        <CardBody>
          <Brightness onChange={onChange} name="light" />
        </CardBody>
        <CardHeader>
          <h2 className="people">기타</h2>
          {/* <TopBadge /> */}
        </CardHeader>
        <CardBody>
          <Etc onChange={onChange} name="" />
        </CardBody>
        <CardHeader>
          <h2 className="people">한 줄 리뷰</h2>
        </CardHeader>
        <CardBody>
          <InputForm placeholder="후기를 적어주세요." onChange={onChange} name='simpleReview' />
        </CardBody>
        <CardFooter>
          <SubmitButton text="등록하기" onClick={submitForm} />
        </CardFooter>
      </CardContainer>
    </DetailContainer>
  );
};
export default DetailPlace;
