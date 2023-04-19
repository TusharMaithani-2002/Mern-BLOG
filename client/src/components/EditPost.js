import React,{useState,useEffect} from 'react'
import { Navigate,useParams } from 'react-router-dom';
import ReactQuill from 'react-quill';


function EditPost() {
    const [title, setTitle] = useState("");
    const [summary, setSummary] = useState("");
    const [content, setContent] = useState("");
    const [files,setFiles] = useState('')
    const [redirect,setRedirect] = useState(false)

    const params = useParams();

    useEffect(() => {
        fetch(`http://localhost:4000/post/${params.id}`)
        .then(response => {
            response.json().then(postInfo => {
                setTitle(postInfo.title)
                setSummary(postInfo.summary)
                setContent(postInfo.content)
            })
        })

    },[])

    async function updatePost(e) {
        e.preventDefault()
        const data = new FormData()
        data.set('title',title)
        data.set('summary',summary)
        data.set('content',content)
        data.set('id',params.id)
        if (files && files[0]) data.set('files',files[0])
        const response = await fetch('http://localhost:4000/post', {
            method:'PUT',
            body:data,
            credentials:'include'
        })

        if (response.ok) {
            setRedirect(true)
        }
    }
  
    return (
        <div>
        {redirect &&   <Navigate to={`/post/${params.id}`}/>}
        <form onSubmit={updatePost} enctype="multipart/form-data">
          <input type="text" placeholder="title" value={title} onChange={e=> setTitle(e.target.value)}/>
          <input type="text" placeholder="summary" value={summary} onChange={e=>setSummary(e.target.value)}/>
          <input type="file" onChange={e=>setFiles(e.target.files)} name='file'/>
          <ReactQuill value={content} onChange={newValue=>setContent(newValue)}/>
          <button
            style={{
              marginTop: "5px",
            }}
          >
           Update Post
          </button>
        </form>
        </div>
      );
}

export default EditPost