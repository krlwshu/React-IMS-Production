import styled from "styled-components";

export const LoginWrapper = styled.div`
    .vid {
        background-size: cover;
        min-width: 100vw;
        background-position: left center;
        transform: scale(1.3);
        overflow: hidden;
        right: -9%;
        min-height: 100vh;
        position: fixed;
    }


      .box .center {
        background: #0000006e;
        max-width:50%;
        max-height:50%;
      }
      .overlay{
        background: rgb(198,237,244);
        background-image: url(/images/ims_stock_adobe.jpeg);
        position: fixed;
        left: 0;
        bottom: 0;
        width: 100%;
        min-height: 100%;
        background-size: cover;
        opacity: 0.5;
        background-position: right 136rem bottom 2px;
        transform:scale(1.5);
      }
      .overlay2{
        background: linear-gradient(272deg,rgb(0 0 0 / 0%) 0%,rgb(38 123 189 / 0%) 24%,rgb(0 0 0 / 71%) 100%);
        position: fixed;
        left: 0;
        bottom: 0;
        width: 100%;
        min-height: 100%;
      }

      .overlay3{
        width: 50%;
        min-height: 100%;
        right: 0;
        z-index: 1000;
        position: fixed;

      }
`;
