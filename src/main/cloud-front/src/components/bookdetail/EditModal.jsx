import { React, useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import writeHand from "../../assets/write-hand.png";
import axios from 'axios';
import swal from "sweetalert";
import { Navigate } from 'react-router-dom';
import { click } from '@testing-library/user-event/dist/click';

const BackgroundModal = styled.div`
    position: fixed; 
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);  
    display: flex;  
    justify-content: center;  
    align-items: center;  
    z-index: 1000; 
`

const ModalOutDiv = styled.div`
    position: relative;
    width: 850px;
    /* max-width: 90%; */
    padding: 50px;
    border: 1px solid #e0e0e0;
    border-radius: 10px;
    background-color: #ffffff;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    z-index: 1001;

    >svg {
        font-size: 30px;
        position: absolute;
        right: 40px;
        top: 30px;

        &:hover {
            cursor: pointer;
        }
    }
`

const TitleOutDiv = styled.div`
    display: flex;
    margin-top: 20px;
    margin-bottom: 15px;
    align-items: center;
    justify-content: center;
    >img {
        width: 3%;
        height: 3%;
        margin-right: 10px;
    }
`

const ModalTitle = styled.div`
    font-size: 20px;
    font-weight: bold;
`

const BookReviewButtonOutDiv = styled.div`
    display: flex;
`

const ReviewBox = styled.div`
    width: 100%;
    height: 150px;
    border: 1px solid #D2D2D2;
    border-radius: 8px;
    padding: 20px 30px;
`

const ReviewerNameEmojiOutDiv = styled.div`
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
`

const ReviewerName = styled.div`
    font-size: 18px;
    font-weight: bold;
`

const ReviewerEmoji = styled.div`
    font-size: 25px;
    >span {
        opacity: 0.5;
        margin-right: 10px;

        &:hover {
            opacity: 1.0;
            cursor: pointer;
        }
    }

    .clicked {
        opacity: 1.0;
    }
`

const ReviewerInput = styled.textarea`
    width: 95%;
    height: 53%;
    resize: none;
    border: 1px solid #D2D2D2;
    border-radius: 8px;
    padding: 15px;
    font-size: 15px;
    font-family: "Pretendard-Regular";
`

const ReviewButtonOutDiv = styled.div`
    margin-top: 5px;
    display: flex;
    justify-content: flex-end;
`

const DoneButton = styled.div`
    border: 1px solid #D2D2D2;
    border-radius: 5px;
    width: 15%;
    height: 5%;
    text-align: center;
    line-height: 50px;
    font-family: "Pretendard-Regular";
    font-size: 17px;

    &:hover {
        cursor: pointer;
        background-color: #FDF6C2;
        font-weight: bold;
    }
`

function EditModal(props) {
    const [clickEmojiNum, setClickEmojiNum] = useState("");
    const [saveContents, setSaveContents] = useState("");
    const [editForm, setEditForm] = useState({
        name: "",
        content: "",
        emoji: ""
    });

    const emojiOnClickHandle = (emoji) => {
        setClickEmojiNum(emoji);
    };

    const saveContentsHandle = event => {
        setSaveContents(event.target.value);
    }

    const modalHandle = () => {
        props.setIsOpen(false);
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const url = "http://localhost:8080/bookdetail/editForm/" + props.reviewId;
                const response = await axios.get(url);
                setEditForm(response.data);
            } catch (error) {
                console.log(error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        setSaveContents(editForm.content);
        setClickEmojiNum(editForm.emoji);
    }, [editForm]);

    const editCommentHandle = async () => {
        try {
            const url = "http://localhost:8080/bookdetail/edit/" + props.reviewId;

            const urlSentiment = "http://localhost:8080/sentiment";
            const responseSentiment = await axios.get(urlSentiment, {
                params: {
                    content: saveContents
                }
            });

            const resultAI = responseSentiment.data.document.sentiment;

            const response = await axios.put(url, {
                content: saveContents,
                emoji: clickEmojiNum,
                resultAI: resultAI
            })

            if (response.data.data === "edit comment success") {
                swal({
                    title: "리뷰 수정 완료!",
                    text: "리뷰 수정이 완료되었습니다.",
                    icon: "success",
                    buttons: "확인"
                }).then(() => {
                    fetchData();
                    modalHandle();
                })
            }
        } catch (error) {
            console.log(error);
        }
    }

    const currentPath = window.location.pathname;
    const lastSegment = currentPath.substring(currentPath.lastIndexOf('/') + 1);

    const fetchData = async () => {
        try {
            const url = "http://localhost:8080/bookdetail/list/" + lastSegment;
            const response = await axios.get(url);
            props.setCommentList(response.data.data);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <BackgroundModal>
            <ModalOutDiv>
                <FontAwesomeIcon icon={faXmark} onClick={modalHandle} />
                <TitleOutDiv>
                    <img src={writeHand}></img>
                    <ModalTitle>리뷰 수정하기</ModalTitle>
                </TitleOutDiv>
                <BookReviewButtonOutDiv>
                    <ReviewBox>
                        <ReviewerNameEmojiOutDiv>
                            <ReviewerName>{editForm.name}</ReviewerName>
                            <ReviewerEmoji>
                                <span value="😄" onClick={() => emojiOnClickHandle("😄")} key="1" className={`${(clickEmojiNum === "😄") ? 'clicked' : ''}`}>😄</span>
                                <span value="😭" onClick={() => emojiOnClickHandle("😭")} key="2" className={`${(clickEmojiNum === "😭") ? 'clicked' : ''}`}>😭</span>
                                <span value="🥹" onClick={() => emojiOnClickHandle("🥹")} key="3" className={`${(clickEmojiNum === "🥹") ? 'clicked' : ''}`}>🥹</span>
                                <span value="🥱" onClick={() => emojiOnClickHandle("🥱")} key="4" className={`${(clickEmojiNum === "🥱") ? 'clicked' : ''}`}>🥱</span>
                                <span value="😡" onClick={() => emojiOnClickHandle("😡")} key="5" className={`${(clickEmojiNum === "😡") ? 'clicked' : ''}`}>😡</span>
                                <span value="😔" onClick={() => emojiOnClickHandle("😔")} key="6" className={`${(clickEmojiNum === "😔") ? 'clicked' : ''}`}>😔</span>
                                <span value="😍" onClick={() => emojiOnClickHandle("😍")} key="7" className={`${(clickEmojiNum === "😍") ? 'clicked' : ''}`}>😍</span>
                            </ReviewerEmoji>
                        </ReviewerNameEmojiOutDiv>
                        <ReviewerInput onChange={saveContentsHandle} value={saveContents}></ReviewerInput>
                    </ReviewBox>
                </BookReviewButtonOutDiv>
                <ReviewButtonOutDiv>
                    <DoneButton onClick={editCommentHandle}>수정 완료!</DoneButton>
                </ReviewButtonOutDiv>
            </ModalOutDiv>
        </BackgroundModal>
    )
}

export default EditModal;