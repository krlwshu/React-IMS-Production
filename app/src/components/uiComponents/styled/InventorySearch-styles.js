import DeleteIcon from '@mui/icons-material/Delete';
import styled from "styled-components";
import {
    Card
} from "@mui/material";

export const Wrapper = styled.div`
    margin: 0 5rem 0;
    padding:3rem;
    background-color:white;
    min-height:100%;
    color:#616161;
`;


export const StyledDeleteIcon = styled(DeleteIcon)`
&&&{  
    
    color:red;
    opacity:0.5;

    :hover{
        cursor:pointer;
        opacity:0.8;
    }
}
`;
