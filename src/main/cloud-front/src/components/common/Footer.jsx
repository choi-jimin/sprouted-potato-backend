import React from "react";
import styled from 'styled-components';
import logo from "../../assets/potato-logo.png"

const FooterOutDiv = styled.div`
    width: 100%;
    height: 7rem;
    background-color: white;
    border-radius: 20px 20px 0 0;
    box-shadow: 1px 1px 1px 1px rgba(0,0,0,0.16);
    margin-top: 30px;
    ${(props) => ((props.SearchResultLength == 1 || props.SearchResultLength == 0) ? "position: absolute; bottom: 0" : "")}
`

const ImageTextOutDiv = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`

const FooterImage = styled.img`
    width: 4%;
    margin-top: 10px;
`

const FooterText = styled.div`
    margin-top: 10px;
`

function Footer(props) {
    return (
        <FooterOutDiv SearchResultLength={props.SearchResultLength}>
            <ImageTextOutDiv>
                <FooterImage src={logo}></FooterImage>
                <FooterText>&copy; cloud-potato</FooterText>    
            </ImageTextOutDiv>
        </FooterOutDiv>
    )
}

export default Footer;