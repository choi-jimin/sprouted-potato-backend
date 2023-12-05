import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router";
import styled from 'styled-components';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import Footer from "../components/common/Footer";
import axios from "axios";

const SearchPageOutDiv = styled.div`
    background-color: white;
    width: 53%;
    border-radius: 20px;
    box-shadow: 1px 1px 1px 1px rgba(0,0,0,0.16);
    margin: 0 auto;
    padding: 20px 50px;
`

const SearchMent = styled.div`
    font-size: 19px;
    padding-top: 30px;
    padding-bottom: 30px;
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-all;
    text-align: center;
    
    >svg {
        width: 17px;
        height: 17px;
        margin-right: 10px;
    }
    >span {
        font-weight: bold;
    }
`

const SearchListDiv = styled.div`
    display: flex;
    padding: 20px;
    border-bottom: 1px solid #D6D6D6;

    &:hover {
        background-color: #EFEFEF;
        cursor: pointer;
        border-radius: 20px;
    }
`
const SearchImg = styled.img`
    width: 15%;
    border-radius: 7px;
    margin-right: 20px;
`

const SearchTitleAuthorOutDiv = styled.div`
    margin-top: 3px;
    
    width: 80%;

`

const SearchTitle = styled.div`
    margin-bottom: 8px;
    font-weight: bold;
    font-size: 17px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-all;
`

const SearchAuthor = styled.div`
    margin-bottom: 3px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-all;
`

const SearchPublisher = styled.div``

function SearchPage() {
    const [SearchValue, setSearchValue] = useState('');
    const [SearchResult, setSearchResult] = useState([]);
    const navigate = useNavigate();
    const { state } = useLocation();

    let lastSegment = state.lastSegment;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const stringWithoutSpaces = lastSegment.replace(/\s/g, '');
                const url = "http://localhost:8080/search/" + stringWithoutSpaces;
                const response = await axios.get(url);
                setSearchValue(lastSegment);
                setSearchResult(response.data.data);
            } catch(error) {
                console.log(error);
            }
        };

        fetchData();
    }, [lastSegment]);
    
    const goBookDetailPage = (isbn) => {
        window.scrollTo(0, 0);
        navigate(`/bookdetail/${isbn}`);
    }

    return (
        <>
        <SearchPageOutDiv>
            <SearchMent><FontAwesomeIcon icon={faMagnifyingGlass} />검색하신 '<span>{SearchValue}</span>'에 관한 검색 결과입니다. </SearchMent>
            {SearchResult.map((book) => {
                return (
                    <SearchListDiv onClick={() => goBookDetailPage(book.isbn)}>
                        <SearchImg src={book.cover}></SearchImg>
                        <SearchTitleAuthorOutDiv>
                            <SearchTitle>{book.title}</SearchTitle>
                            <SearchAuthor>{book.author}</SearchAuthor>
                            <SearchPublisher>{book.publisher}</SearchPublisher>
                        </SearchTitleAuthorOutDiv>
                    </SearchListDiv>
                )
            })}
        </SearchPageOutDiv>
        <Footer SearchResultLength={SearchResult.length} />
        </>
    )
}

export default SearchPage;