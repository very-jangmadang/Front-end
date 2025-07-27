import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: "Pretendard";
    src: url("https://cdn.jsdelivr.net/gh/Project-Noonnu/noonfonts_2107@1.1/Pretendard-Regular.woff2") format("woff2");
    font-weight: 400;
    font-style: normal;
  }

  * {
    font-family: "Pretendard", sans-serif;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: "Pretendard", sans-serif;
    font-size: 16px;
    line-height: 1.5;
    background-color: #ffffff;
    color: #000000;
  }
`;

export default GlobalStyle;
