import React, { useContext, useEffect,useState } from 'react'
import {useParams} from 'react-router-dom'
import {UserContext} from '../UserContext'
import {Link}from 'react-router-dom'

function PostPage() {

    const {userInfo} = useContext(UserContext)
    const params = useParams();
    const [postInfo,setPostInfo] = useState(null)
    useEffect(() => {
        fetch(`http://localhost:4000/post/${params.id}`)
        .then(response => {
            response.json().then(postInfo => {
                setPostInfo(postInfo)
                console.log(postInfo)
                const date = new Date(postInfo.updatedAt)
                postInfo['date'] = String(date.getDate())+"-"+String(date.getMonth())+"-"+String(date.getFullYear())+" "+String(date.getHours())+":"+String(date.getMinutes()) + ":"+ String(date.getSeconds())
            })
        })

    },[])
    if (!postInfo) return ""
  return (
      <div className="post-page">
        <h1 className='post-title'>
            {postInfo.title}
        </h1>
        <p className='post-date'>{(postInfo.date)}</p>
        <p>{"by @"+postInfo.author.username}</p>
    {userInfo.id === postInfo.author._id && (
        <div className='edit-row'>
            <Link className='edit-btn' to = {`/edit/${postInfo._id}`}>update post</Link>
        </div>
    )}
        <div className="image">
        <img src={'http://localhost:4000/'+postInfo.cover} alt="" />
        </div>
        <div dangerouslySetInnerHTML={{__html:postInfo.content}}></div>
    </div>
  )
}

export default PostPage