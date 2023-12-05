import { React, useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import styled from 'styled-components';
import BookInfo from '../components/bookdetail/BookInfo';
import ReviewStatistics from "../components/bookdetail/ReviewStatistics";
import CommentCard from "../components/bookdetail/CommentCard";
import BookCommentList from '../components/bookdetail/BookCommentList';
import EditModal from '../components/bookdetail/EditModal';
import Footer from '../components/common/Footer';

const BookDetailOutDiv = styled.div`
    width: 78%;
    background-color: white;
    margin: 0 auto;
    border-radius: 20px;
    box-shadow: 1px 1px 1px 1px rgba(0,0,0,0.16);
    padding: 42px 50px;
`

const BookInfoStatisticsOutDiv = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
`

function BookDetailPage() {
    const [commentList, setCommentList] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [reviewId, setReviewId] = useState();
    const [emojiStats, setEmojiStats] = useState([]);
    const [resultAI, setResultAI] = useState({
        "positive": 0,
        "neutral": 0,
        "negative": 0
    });

    return (
        <>
        <BookDetailOutDiv>
            <BookInfoStatisticsOutDiv>
                <BookInfo />
                <ReviewStatistics emojiStats={emojiStats} setEmojiStats={setEmojiStats} resultAI={resultAI} setResultAI={setResultAI} />
            </BookInfoStatisticsOutDiv>
            <CommentCard setCommentList={setCommentList} setEmojiStats={setEmojiStats} setResultAI={setResultAI} />
            <BookCommentList commentList={commentList} setCommentList={setCommentList} 
                setIsOpen={setIsOpen} setReviewId={setReviewId}/>
            {isOpen && <EditModal setIsOpen={setIsOpen} reviewId={reviewId} setCommentList={setCommentList} />}
        </BookDetailOutDiv>
        <Footer />
        </>
    )
}

export default BookDetailPage;