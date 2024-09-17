import { useEffect, useState } from "react";
import '../components/css/snackbar.css';

const Snackbar = ({ show, message, duration }) => {
    const [visible, setVisible] = useState(show);
  
    useEffect(() => {
      setVisible(show);
      if (show) {
        const timer = setTimeout(() => {
          setVisible(false);
        }, duration);
        return () => clearTimeout(timer);
      }
    }, [show, duration]);
  
    return (
      <div className={`snackbar ${visible ? 'show' : ''}`}>
        {message}
      </div>
    );
};

export default Snackbar;