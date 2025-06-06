import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  
  html, body {
    max-width: 100%;
    overflow-x: hidden;
  }
  
  body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background-color: #f6f8fa;
    color: #24292e;
    line-height: 1.5;
  }

  button {
    cursor: pointer;
  }
  
  a {
    text-decoration: none;
    color: #0366d6;
    
    &:hover {
      text-decoration: underline;
    }
  }
  
  /* Responsive typography */
  html {
    font-size: 100%;
  }
  
  @media (max-width: 768px) {
    html {
      font-size: 95%;
    }
  }
  
  @media (max-width: 480px) {
    html {
      font-size: 90%;
    }
  }
`;

export default GlobalStyles;
