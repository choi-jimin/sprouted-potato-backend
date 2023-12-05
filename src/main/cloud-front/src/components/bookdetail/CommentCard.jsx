import { React, useState, useEffect } from 'react';
import styled from 'styled-components';
import writeHand from "../../assets/write-hand.png";
import { NickNameList } from "../../assets/nickNameList";
import axios from "axios";
import swal from "sweetalert";

const BookReviewNameOutDiv = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 17px;
    margin-top: 50px;
    padding-top: 35px;
    border-top: 1px solid #D2D2D2
`

const WriteHandImg = styled.img`
    width: 2%;
    margin-right: 10px;
`

const BookReviewName = styled.div`
    font-size: 19px;
    font-weight: bold;
`

const BookReviewButtonOutDiv = styled.div`
    display: flex;
`

const ReviewBox = styled.div`
    width: 75%;
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
    width: 96%;
    height: 53%;
    resize: none;
    border: 1px solid #D2D2D2;
    border-radius: 8px;
    padding: 15px;
    font-size: 15px;
    font-family: "Pretendard-Regular";
`

const ReviewButtonOutDiv = styled.div`
    margin-left: 20px;
    padding-top: 7px;
`

const PasswordOutDiv = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 10px;
`

const PasswordName = styled.div`
    margin-right: 10px;
`

const PasswordInput = styled.input`
    width: 64%;
    height: 20px;
    border: 1px solid #D2D2D2;
    border-radius: 5px;
    padding: 5px;
`

const DoneButton = styled.div`
    border: 1px solid #D2D2D2;
    border-radius: 5px;
    width: 96%;
    height: 50px;
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


function CommentCard(props) {
    const [reviewerName, setReviewerName] = useState("독서하는 감자");
    const [clickEmojiNum, setClickEmojiNum] = useState("");
    const [saveContents, setSaveContents] = useState("");
    const [savePasswd, setSavePasswd] = useState("");
    const [reviewRequest, setReviewRequest] = useState({
        name: "",
        content: "",
        emoji: "",
        isbn: "",
        reviewPw: ""
    });

    const currentPath = window.location.pathname;
    const lastSegment = currentPath.substring(currentPath.lastIndexOf('/') + 1);

    const emojiOnClickHandle = (emoji) => {
        setClickEmojiNum(emoji);
    };

    const saveContentsHandle = event => {
        setSaveContents(event.target.value);
    }

    const savePasswdHandle = event => {
        setSavePasswd(event.target.value);
    }

    useEffect(() => {
        let nicknameNum = Math.floor(Math.random() * (NickNameList.length));
        setReviewerName(NickNameList[nicknameNum]);
    }, []);

    const handleDataUpload = () => {
        (async () => {
            if (saveContents === '' || clickEmojiNum === '' || savePasswd === '') {
                swal({
                    icon: "error",
                    title: "리뷰 등록 실패!",
                    text: "내용과 이모지, 비밀번호를 모두 채워주세요!"
                });
            } else {
                try {
                    const url = "http://localhost:8080/bookdetail/new";


                    const urlSentiment = "http://localhost:8080/sentiment";
                    const responseSentiment = await axios.get(urlSentiment, {
                        params: {
                            content: saveContents
                        }
                    });

                    const resultAI = responseSentiment.data.document.sentiment;

                    const response = await axios.post(url, {
                        name: reviewerName,
                        content: saveContents,
                        emoji: clickEmojiNum,
                        isbn: lastSegment,
                        reviewPw: savePasswd,
                        resultAI: resultAI
                    });
                    let posts = response.data.data;

                    if (posts === "create comment success") {
                        swal({
                            icon: "success",
                            title: "리뷰 등록 완료!",
                            text: "다른 사람들의 리뷰와 감정 분석을 확인해 보세요!"
                        }).then(() => {
                            fetchData();
                            fetchDataStats();
                            fetchDataResultAI();
                            setClickEmojiNum("");
                            setSaveContents("");
                            setSavePasswd("");
                            let nicknameNum = Math.floor(Math.random() * (NickNameList.length));
                            setReviewerName(NickNameList[nicknameNum]);
                        })
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        })();
    }

    const fetchData = async () => {
        try {
            const url = "http://localhost:8080/bookdetail/list/" + lastSegment;
            const response = await axios.get(url);
            props.setCommentList(response.data.data);
        } catch (error) {
            console.log(error);
        }
    };

    const fetchDataStats = async () => {
        try {
            const url = "http://localhost:8080/bookdetail/" + lastSegment;
            const response = (await axios.get(url)).data;
            props.setEmojiStats([response.emoji1, response.emoji2, response.emoji3,
                response.emoji4, response.emoji5, response.emoji6, response.emoji7]);
        } catch(error) {
            console.log(error);
        }
    };

    const fetchDataResultAI = async () => {
        try {
            const url = "http://localhost:8080/bookdetail/resultAI/stats/" + lastSegment;
            const response = (await axios.get(url)).data;
            props.setResultAI([response.positive, response.neutral, response.negative]);
        } catch(error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <>
            <BookReviewNameOutDiv>
                <WriteHandImg src={writeHand}></WriteHandImg>
                <BookReviewName>도서 리뷰</BookReviewName>
            </BookReviewNameOutDiv>
            <BookReviewButtonOutDiv>
                <ReviewBox>
                    <ReviewerNameEmojiOutDiv>
                        <ReviewerName>{reviewerName}</ReviewerName>
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
                <ReviewButtonOutDiv>
                    <PasswordOutDiv>
                        <PasswordName>비밀번호</PasswordName>
                        <PasswordInput type='password' onChange={savePasswdHandle} value={savePasswd}></PasswordInput>
                    </PasswordOutDiv>
                    <DoneButton onClick={handleDataUpload}>작성 완료!</DoneButton>
                </ReviewButtonOutDiv>
            </BookReviewButtonOutDiv>
        </>
    )
}

export default CommentCard;