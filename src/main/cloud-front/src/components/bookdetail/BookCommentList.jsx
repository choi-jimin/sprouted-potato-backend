import { React, useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from "axios";
import swal from "sweetalert";

const CommentCardOutDiv = styled.div`
    margin-top: 40px;
`

const ReviewerNameButtonOutDiv = styled.div`
    display: flex;
    justify-content: space-between;
`

const ReviewerName = styled.div`
    font-size: 18px;
    font-weight: bold;
    height: 29px;
    line-height: 29px;
    padding-left: 10px;
`

const PwdNameOutDiv = styled.div`
    display: flex;
    align-items: center;
    padding-right: 6px;
`

const PwdName = styled.div`
    width: 25%;
    height: 70%;
    margin-right: 5px;
`

const PwdInput = styled.input`
    width: 45%;
    height: 18px;
    border: 1px solid #D2D2D2;
    border-radius: 6px;
    padding: 5px;
    margin-right: 5px;
`

const EditButton = styled.div`
    width: 20%;
    height: 28px;
    border: 1px solid #D2D2D2;
    border-radius: 5px;
    text-align: center;
    line-height: 28px;
    margin-right: 5px;

    &:hover {
        cursor: pointer;
        background-color: #FDF6C2;
    }
`

const DeleteButton = styled.div`
    width: 20%;
    height: 28px;
    border: 1px solid #D2D2D2;
    border-radius: 5px;
    text-align: center;
    line-height: 28px;

    &:hover {
        cursor: pointer;
        background-color: #FDF6C2;
    }
`

const CommentBox = styled.div`
    width: 95%;
    border: 1px solid #D2D2D2;
    border-radius: 8px;
    margin-top: 10px;
    display: flex;
    justify-content: space-between;
    padding: 20px 30px;
`

const CommentContent = styled.div``

const CommentEmojiAIOutDiv = styled.div`
    display: flex;
`

const CommentEmojiBox = styled.div`
    display: flex;
    flex-direction: column;
    border: 1px solid #D2D2D2;
    border-radius: 8px;
    text-align: center;
    justify-content: center;
    padding: 10px 20px;
`

const CommentEmojiName = styled.div`
    font-size: 15px;
`

const CommentEmoji = styled.div`
    margin-top: 8px;
    font-size: 20px;
`

const CommentAIBox = styled.div`
    display: flex;
    flex-direction: column;
    border: 1px solid #D2D2D2;
    border-radius: 8px;
    text-align: center;
    justify-content: center;
    padding: 10px 20px;
    margin-left: 10px;
`

const CommentAIName = styled.div`
    font-size: 15px;
`

const CommentAIResult = styled.div`
    margin-top: 8px;
    font-size: 17px;
`


function BookCommentList(props) {
    const [savePasswd, setSavePasswd] = useState("");

    const currentPath = window.location.pathname;
    const lastSegment = currentPath.substring(currentPath.lastIndexOf('/') + 1);

    const savePasswdHandle = event => {
        setSavePasswd(event.target.value);
    }

    const fetchData = async () => {
        try {
            const url = "http://localhost:8080/bookdetail/list/" + lastSegment;
            const response = await axios.get(url);
            props.setCommentList(response.data.data);
        } catch(error) {
            console.log(error);
        }
    };

    const deleteData = (reviewId) => {
        (async () => {
            try {
                const url = "http://localhost:8080/bookdetail/delete/" + reviewId;
                const response = await axios.post(url, {
                    passwd: savePasswd
                });
                let posts = response.data.data;

                if (posts === "delete comment success") {
                    fetchData();
                    swal({
                        title: "리뷰 삭제 완료!",
                        text: "리뷰가 삭제되었습니다.",
                        icon: "success"
                    })
                } else if(posts === "passwd is wrong") {
                    swal({
                        title: "리뷰 삭제 불가",
                        text: "비밀번호가 틀렸습니다.",
                        icon: "error"
                    })
                }
            } catch (error) {
                console.log(error);
            }
        })();
    }

    const handleDataDelete = (reviewId) => {
        swal({
            icon: "warning",
            title: "리뷰를 삭제하시겠습니까?",
            text: "확인을 클릭할 시, 작성된 리뷰가 삭제됩니다.",
            buttons: true,
            dangerMode: true
        }).then((willDelete) => {
            if (willDelete) {
                deleteData(reviewId);
            }
        })
    }

    const passwdCheck = async (reviewId) => {
        try {
            const url = "http://localhost:8080/bookdetail/passwd";
            const response = await axios.get(url,{ params: {
                reviewId: reviewId,
                passwd: savePasswd
            }});
            if(response.data.data === "true") {
                setSavePasswd("");
                props.setReviewId(reviewId);
                props.setIsOpen(true);
            } else {
                setSavePasswd("");
                swal({
                    icon: "error",
                    title: "수정 불가",
                    text: "비밀번호가 맞지 않으므로 수정이 불가합니다."
                })
            }
        } catch(error) {
            console.log(error);
        }
    };

    return (
        props.commentList.map((comment) => {
            return (
                <CommentCardOutDiv key={comment.reviewId}>
                    <ReviewerNameButtonOutDiv>
                        <ReviewerName>{comment.name} 님</ReviewerName>
                        <PwdNameOutDiv>
                            <PwdName>비밀번호</PwdName>
                            <PwdInput type='password' onChange={savePasswdHandle}></PwdInput>
                            <EditButton onClick={() => passwdCheck(comment.reviewId)}>수정</EditButton>
                            <DeleteButton onClick={() => handleDataDelete(comment.reviewId)}>삭제</DeleteButton>
                        </PwdNameOutDiv>
                    </ReviewerNameButtonOutDiv>
                    <CommentBox>
                        <CommentContent>{comment.content}</CommentContent>
                        <CommentEmojiAIOutDiv>
                            <CommentEmojiBox>
                                <CommentEmojiName>이모티콘 리뷰</CommentEmojiName>
                                <CommentEmoji>{comment.emoji}</CommentEmoji>
                            </CommentEmojiBox>
                            <CommentAIBox>
                                <CommentAIName>AI가 분석한 리뷰</CommentAIName>
                                <CommentAIResult>{comment.resultAI}</CommentAIResult>
                            </CommentAIBox>
                        </CommentEmojiAIOutDiv>
                    </CommentBox>
                </CommentCardOutDiv>
            )
        })
    )
}

export default BookCommentList;