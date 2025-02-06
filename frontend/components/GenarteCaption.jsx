import InstaPost from "./InstaPost";
import "./style/GenerateCaption.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const GenerateCaption = ({
  moveToNextStep = () => {},
  moveToBackStep = () => {},
}) => {
  return (
    <div className="generate-caption-conatiner">
      <div className="navigation-container">
        <span className="back-icon-container" onClick={moveToBackStep}>
          <ArrowBackIcon />
        </span>
      </div>
      <div className="caption-container">
        <div className="caption-description-conatiner">
            <div className="caption-description">
                Product-Description
            </div>
            <div className="caption-description">
                Caption
            </div>
        </div>
        <div className="instagram-post-previw-container">
          <InstaPost />
        </div>
      </div>
    </div>
  );
};

export default GenerateCaption;
