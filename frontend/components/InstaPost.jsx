import React from 'react';
import './style/InstaPost.css';

const InstaPost = () => {
  return (
    <div className="insta-post">
      <div className="insta-header">
        <img src="profile-pic-url" alt="Profile" className="profile-pic" />
        <div className="insta-user-info">
          <span className="username">youraccount</span>
          <span className="location">Location Here</span>
        </div>
        <div className="insta-options">...</div>
      </div>
      <div className="insta-image">
        <img src="image-url" alt="Post" />
      </div>
      <div className="insta-actions">
        <span className="like">❤️</span>
        <span className="comment">💬</span>
        <span className="share">🔗</span>
      </div>
      <div className="insta-likes">12,853 likes</div>
      <div className="insta-caption">
        <span className="username">youraccount</span> Enhance your Instagram with our UI Mockup Download for instagram creativity.
        <span className="hashtags">#instagram #templates #beautiful #funny #dailypost</span>
      </div>
    </div>
  );
};

export default InstaPost;
