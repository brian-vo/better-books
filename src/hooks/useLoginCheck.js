import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// useLoginCheck hook - used to check if user is logged in and redirect, if not, redirect to specific page, pass in tokenExists and tokenNotExist as props

function useLoginCheck(tokenExists, tokenNotExist) {
const navigate = useNavigate();
  useEffect(() => {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, "$1");
    if (token) {
      navigate(tokenExists);
    } else {
      navigate(tokenNotExist);
    }
  },  [navigate, tokenExists, tokenNotExist]);
}

export default useLoginCheck;

