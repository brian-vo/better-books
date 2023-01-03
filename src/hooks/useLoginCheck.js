
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function useLoginCheck(tokenExists, tokenNotExist) {
const navigate = useNavigate();
  useEffect(() => {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    if (token) {
      navigate(tokenExists);
    } else {
      navigate(tokenNotExist);
    }
  }, []);
}

export default useLoginCheck;
