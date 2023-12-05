import React from "react";
import styled from 'styled-components';
import mainImage from "../assets/main-image (2).gif";
import Footer from "../components/common/Footer";
import EmojiReview from "../components/main/EmojiReview";

const MainImageReviewOutDiv = styled.div`
    box-shadow: 1px 1px 1px 1px rgba(0,0,0,0.16);
    margin: 0 auto;
    width: 60%;
    border-radius: 20px;
    background-color: white;
`

const MainImage = styled.img`
    width: 100%;
    border-radius: 20px 20px 0 0;
`

function MainPage() {
    return (
        <>
        <MainImageReviewOutDiv>
            <MainImage src={mainImage}></MainImage>
            <EmojiReview></EmojiReview>
        </MainImageReviewOutDiv>
        <Footer></Footer>
        </>
    )
    
}

export default MainPage;