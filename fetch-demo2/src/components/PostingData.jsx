// Display a list of posts
import Loading from "./Loading";
import usePost from "../hooks/usePost";
import React, { useState } from "react";



const PostingData = () => {
  const [userId, setUserId] = useState('');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  return <div className="container">
    <label className="form-label">User Id</label>
    <input
      type="text"
      value={userId}
      onChange={(event) => setUserId(event.target.value)}
    />
    <label className="form-label">Title</label>
    <input
      type="text"
      value={title}
      onChange={(event) => setTitle(event.target.value)}
    />
    <label className="form-label">Body</label>
    <input type="text" value={body} onChange={(event) => setBody(event.target.value)} />
    <button onClick={usePost(userId, title, body, 'posts/')}>
      Submit
    </button>
  </div>
};

export default PostingData;