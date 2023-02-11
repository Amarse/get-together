import React, { useState } from 'react';
import styled from 'styled-components';
import TopBadge from '../../elements/top-badge';
import { KeywordSearchDto, Place } from 'src/types/searchType';
import ComentBadge from '@components/elements/place-badge';
import Button from '@components/elements/Button';
import PeopleButton from '@components/elements/keyword-button/people';
import MoneyButton from '../../elements/keyword-button/money';
import KeywordButton from '@components/elements/keyword-button/keyword';
import SubmitButton from '@components/elements/submitButton';
import Atmosphere from '../rightTab/detailPlace/atmosphere';
import Brightness from '../rightTab/detailPlace/brightness';
import Etc from '../rightTab/detailPlace/etc';
import { getKeyword } from '@api/search';

const CardContainer = styled.form`
  width: 100%;
  padding: 45px 28px 35px 28px;
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
  .title {
    display: flex;
  }
  .comment {
    border-radius: 6px;
    margin-top: 14px;
    font-size: 14px;
  }
`;

const KeywordCard = (): JSX.Element => {
  //입력 데이터
  const [inputData, setInput] = useState({
    participants: '',
    price: '',
    mood: '',
    lighting: '',

    isCorkCharge: '',
    isRoom: '',
    isParking: '',
    isAdvancePayment: '',
    isRent: '',
    isReservation: '',
  });

  const onClick = () => {};

  //입력 폼 전체 상태 관리
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    setInput({
      ...inputData,
      [name]: value.trim(),
    });
  };

  const submitForm = async () => {
    console.log(inputData);
    let param = inputData.participants.split(',');
    const data: KeywordSearchDto = {
      participants: {
        min: Number(param[0]),
        max: Number(param[1]),
      },
      price: inputData.price,
      lighting: inputData.lighting,
      mood: inputData.mood,
      etc: {
        is_cork_charge: (inputData.isCorkCharge != '' ? true : false),
        is_rent: (inputData.isRent != '' ? true : false),
        is_room: (inputData.isRoom != '' ? true : false),
        is_reservation: (inputData.isReservation != '' ? true : false),
        is_parking: (inputData.isParking != '' ? true : false),
        is_advance_payment: (inputData.isAdvancePayment != '' ? true : false),
      },
    };
    console.log(data);
    getKeyword(data);
  };

  return (
    <CardContainer>
      <CardHeader>
        <h2 className="people">참석인원수</h2>
      </CardHeader>
      <CardBody>
        <PeopleButton onChange={onChange} name="participants" />
      </CardBody>
      <CardHeader>
        <h2 className="people">인당 가격대 </h2>
      </CardHeader>
      <CardBody>
        <MoneyButton onChange={onChange} name="price" />
      </CardBody>
      <CardHeader>
        <h2 className="people">분위기 </h2>
      </CardHeader>
      <CardBody>
        <Atmosphere onChange={onChange} name="mood" />
      </CardBody>
      <CardHeader>
        <h2 className="people">조명 밝기</h2>
      </CardHeader>
      <CardBody>
        <Brightness onChange={onChange} name="lighting" />
      </CardBody>
      <CardHeader>
        <h2 className="people">기타</h2>
      </CardHeader>
      <CardBody>
        <Etc onChange={onChange} />
      </CardBody>
      <CardFooter>
        <SubmitButton text="결과보기" onClick={submitForm} />
      </CardFooter>
    </CardContainer>
  );
};

export default KeywordCard;
