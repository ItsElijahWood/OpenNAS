import HeaderComponent from "../components/global/Header";
import Loader from "../components/global/Loader";
import FileContainer from "../components/pages/Files/FileContainer";
import "../styles/css/Files.css";

function Files() {
  return (
    <>
      <HeaderComponent />
      <Loader />
      <div className="files-centre">
        <FileContainer />
      </div>
    </>
  );
}

export default Files;
