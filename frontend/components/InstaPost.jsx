import React from 'react';
import './style/InstaPost.css';

const InstaPost = ({
  profileImageUrl = "https://avatar.iran.liara.run/public/boy?username=Ash",
  imageUrl = "https://avatar.iran.liara.run/public/boy?username=Ash",
  accountName = "Your_Account",
  location = "Location Here",
  likesCount = 12859,
  caption = "Enhance your Instagram with our UI Mockup Download for instagram creativity.",
  hashtag = "#instagram #templates #beautiful #funny #dailypost"
}) => {
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
      <div className="insta-actions">
        <span className="like">❤️</span>
        <span className="comment">💬</span>
        <span className="share">🔗</span>
      </div>
      <div className="insta-likes">{likesCount.toString()} likes</div>
      <div className="insta-caption">
        <span className="username">{accountName}</span> {caption}
        <span className="hashtags">{hashtag}</span>
      </div>
    </div>
  );
};

export default InstaPost;
