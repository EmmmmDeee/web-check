import { createGlobalStyle } from 'styled-components';
import PTMono from 'assets/fonts/PTMono.ttf';

const GlobalStyles = createGlobalStyle`
  @font-face {
    font-family: 'PT Mono';
    font-style: normal;
    font-weight: 400;
    src: local('PT Mono'), url(${PTMono}) format('truetype');
  }
  body {
    font-family: 'PT Mono', monospace;
    margin: 0;
    padding: 0;
  }
`;

export default GlobalStyles;
