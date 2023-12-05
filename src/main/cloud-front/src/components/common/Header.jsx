import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import logo from "../../assets/header-potato-logo.png";

const HeaderOutDiv = styled.div`
    width: 100%;
    height: 7rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding-top: 15px;
    padding-bottom: 15px;
    margin-bottom: 30px;
    background-color: white;
    box-shadow: 1px 1px 1px 1px rgba(0,0,0,0.16);
    border-radius: 0 0 10px 10px;
`

const LogoImage = styled.img`
    width: 20%;
    &:hover {
        cursor: pointer;
    }
`

const SearchBarOutDiv = styled.div`
    display: flex;
    position: relative;
    >svg {
        width: 16px;
        height: 16px;
        position: absolute;
        color: #8C3839;
        top: 65.5%;
        left: 20px;
        transform: translateY(-50%);
    }
`

const SearchBarInput = styled.input`
    width: 620px;
    height: 42px;
    border-radius: 18px;
    border: 1px solid #DEDEDE;
    margin-top: 19px;
    padding-left: 45px;
    font-size: 14px;
    font-family: "Pretendard-Regular";
`

function Header() {
    const [searchValue, setSearchValue] = useState('');
    const navigate = useNavigate();

    const mainNavigateHandle = () => {
        navigate("/");
    }

    const searchInputValue = (e) => {
        setSearchValue(e.target.value);
    }

    const goSearchPage = () => {
        navigate("/search/" + searchValue, {state: {
            lastSegment: searchValue
        }});
    };

    const handleOnKeyPress = (e) => {
        if (e.key === 'Enter') {
            goSearchPage();
        }
    };

    return (
        <HeaderOutDiv>
            <LogoImage src={logo} onClick={mainNavigateHandle}></LogoImage>
            <SearchBarOutDiv>
                <SearchBarInput placeholder="책을 검색해 보세요!"
                    type="text"
                    value={searchValue}
                    onKeyDown={handleOnKeyPress} 
                    onChange={searchInputValue}>
                </SearchBarInput>
                <FontAwesomeIcon icon={faMagnifyingGlass} />
            </SearchBarOutDiv>
        </HeaderOutDiv>
    )
}

export default Header;