import { React, useState, useEffect } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo, faFolder } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const BookInfoOutDiv = styled.div`
    width: 47%;
`

const BookImgTitleOutDiv = styled.div`
    display: flex;
    margin-bottom: 25px;
`

const BookImg = styled.img`
    width: 25%;
    border-radius: 7px;
`

const BookTitleAuthorOutDiv = styled.div`
    margin-top: 3px;
    margin-left: 15px;
    letter-spacing:0.5px;
    line-height: 18px;
`

const BookTitle = styled.div`
    font-weight: bold;
    font-size: 19px;
    line-height: normal;
    margin-bottom: 5px;
`
const BookSubTitle = styled.div`
    font-weight: normal;
    font-size: 1em;
    line-height: normal;
    margin-bottom: 5px;
`

const BookAuthor = styled.div`
    font-size: 0.8em;
    margin-bottom: 3px;
`

const BookPublisher = styled.div`
    font-size: 0.8em;
    line-height: normal;
`

const CategoryName = styled.div`
    font-size: 19px;
    margin-bottom: 10px;
    font-weight: bold;
    >svg {
        width: 18px;
        height: 18px;
        margin-right: 10px;
    }
`

const BookCategory = styled.div`
    font-size: 18px;
    margin-bottom: 20px;
`

const DescriptionName = styled.div`
    font-size: 19px;
    font-weight: bold;
    margin-bottom: 10px;
    color: ${(props) => ((props.isInfoExpanded) ? "#8C3839" : "black")};
    >svg {
        width: 18px;
        height: 18px;
        margin-right: 10px;
    }
    &:hover {
        cursor: pointer;
    }
`

const BookDescription = styled.div`
    font-size: 18px;
    line-height: normal;
`


function BookInfo() {
    const [bookInfo, setBookInfo] = useState([]);
    const [firstPart, setFirstPart] = useState('');
    const [secondPart, setSecondPart] = useState('');

    const [originalString, setOriginalString] = useState("");

    // 대체할 기호들과 대체될 값들을 정의합니다.
    const replacements = {
      "&nbsp;": " ",
      "&lt;": "<",
      "&gt;": ">",
      "&amp;": "&",
      "&quot;": "\"",
      "&#035;": "#",
      "&#039;": "'"
    };


    const currentPath = window.location.pathname;
    const lastSegment = currentPath.substring(currentPath.lastIndexOf('/') + 1);

    // 문자열을 수정하는 함수
    const modifyString = (originalString) => {
        let modifiedString = originalString;

        // 대체 작업을 수행합니다.
        for (const key in replacements) {
            modifiedString = modifiedString.split(key).join(replacements[key]);
        }

        // 수정된 문자열을 설정합니다.
        setOriginalString(modifiedString);
    };


useEffect(() => {
    const BookData = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/booksDetail/` + lastSegment);
            const data = response.data.data;
            setBookInfo(data);

            const detail = data.description;
            modifyString(detail);

            const title = data.title;

            // "-"를 기준으로 나누기
            const firstHyphenIndex = title.indexOf(" - ");

            // "-"가 없는 경우
            if (firstHyphenIndex === -1) {
                setFirstPart(title);
                setSecondPart('');
            } else {
                // 첫 번째 부분 설정
                setFirstPart(title.slice(0, firstHyphenIndex));

                // 두 번째 부분 설정 (첫 번째 "-" 이후의 부분)
                setSecondPart(title.slice(firstHyphenIndex));
            }
        } catch (error) {
            console.error("Error fetching user data", error);
        }
    };

    BookData();
}, []);
const [isInfoExpanded, setIsInfoExpanded] = useState(false);

return (
    <BookInfoOutDiv>
        <BookImgTitleOutDiv>
            <BookImg src={bookInfo.cover}></BookImg>
            <BookTitleAuthorOutDiv>
                <BookTitle>{firstPart}</BookTitle>
                <BookSubTitle>{secondPart}</BookSubTitle>
                <BookAuthor>{bookInfo.author}</BookAuthor>
                <BookPublisher>{bookInfo.publisher}</BookPublisher>
            </BookTitleAuthorOutDiv>
        </BookImgTitleOutDiv>
        <CategoryName><FontAwesomeIcon icon={faFolder} />카테고리</CategoryName>
        <BookCategory>{bookInfo.categoryName}</BookCategory>
        <DescriptionName onClick={() => setIsInfoExpanded(!isInfoExpanded)} isInfoExpanded={isInfoExpanded}><FontAwesomeIcon icon={faCircleInfo} />책 정보</DescriptionName>
        {isInfoExpanded && <BookDescription>{originalString}</BookDescription>}
    </BookInfoOutDiv>
)
}

export default BookInfo;