import React from 'react'
import {Link} from 'react-router-dom'
// import img from '../../../server/uploads'

function Post({_id,title,summary,cover,content,createdAt,author}) {
  const date = new Date(createdAt)
  return (
    <div className="post">
      <Link to={`/post/${_id}`} className='Link'>
        <img src={"http://localhost:4000/"+cover} alt="" />
        </Link>
        <div className="text">
          <Link to={`/post/${_id}`} className ='Link'>
          <h2 className="title">
            {title}
          </h2>
          </Link>
          <p className='info'>
            <a href='/' className="author">{author.username}</a>
            <time>{date.getDate()+"-"+date.getMonth()+"-"+date.getFullYear()+" "+date.getHours()+":"+date.getMinutes()}</time>
          </p>
          <p className="summary">
            {summary}
          </p>
        </div>
      </div>
  )
}

export default Post