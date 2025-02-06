import React from "react";
import CollapsibleCaption from "./CollapsibleCaption";
import "./style/InstaPost.css";
import { Box, Typography } from "@mui/material";
import { ArrowRightAlt } from "@mui/icons-material";

const InstaPost = ({
  profileImageUrl = "https://avatar.iran.liara.run/public/boy?username=Ash",
  imageUrl = "https://avatar.iran.liara.run/public/boy?username=Ash",
  accountName = "Your_Account",
  location = "Location Here",
  likesCount = 12859,
  caption = "Enhance your Instagram with our UI Mockup ",
  hashtag = "#instagram #templates #beautiful",
  ctaButtonText = "",
  pdpLink = "",
}) => {
  caption = caption || "Enhance your Instagram with our UI Mockup ";
  hashtag = hashtag || "#instagram #templates #beautiful";

  return (
    <div className="insta-post">
      <div className="insta-header">
        <img src={profileImageUrl} alt="Profile" className="profile-pic" />
        <div className="insta-user-info">
          <span className="username">{accountName}</span>
          <span className="location">{location}</span>
        </div>
        <div className="insta-options">...</div>
      </div>
      <div className="insta-image">
        <img src={imageUrl} alt="Post" />
      </div>
      {ctaButtonText && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            px: 1.5,
            py: 1,
            background: "#604cd4 ",
            cursor: 'pointer'
          }}
          onClick={() => window.open(pdpLink)}
        >
          <Typography sx={{ color: "white" }} variant="subtitle2">
            {ctaButtonText}
          </Typography>
          <ArrowRightAlt sx={{ fill: "white" }} />
        </Box>
      )}
      <div className="insta-actions">
        <span className="like">❤️</span>
        <span className="comment">💬</span>
        <span className="share">🔗</span>
      </div>
      <div className="insta-likes">{likesCount.toString()} likes</div>
      <div className="insta-caption">
        <span className="username">{accountName}</span>
        <CollapsibleCaption text={caption} />
        {/* <CollapsibleCaption text={caption + " " + hashtag} /> */}
        <span className="hashtags">{hashtag}</span>
      </div>
    </div>
  );
};

export default InstaPost;
