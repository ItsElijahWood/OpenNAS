import { useEffect, useState } from "react";
import { PulseLoader } from "react-spinners";

function Loader() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (visible) {
      document.body.style.overflow = "hidden";
    }

    const timer = setTimeout(() => {
      setVisible(false);
    }, 5000);

    return () => {
      clearTimeout(timer);

      document.body.style.overflow = "";
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      id="global-component-loader-div"
      className="global-component-loader-div">
      <div>
        <PulseLoader size={20} color="rgb(253, 127, 102)" />
      </div>
    </div>
  );
}

export default Loader;
