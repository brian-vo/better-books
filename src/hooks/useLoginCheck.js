import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginCheck = ({ redirectUrl, effectFunc }) => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, "$1");
        if (token) {
            navigate(redirectUrl);
        }
        effectFunc();
    }, []);
}

export default LoginCheck;