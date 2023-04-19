import React,{useEffect,useState} from 'react'
import Post from './Post'

function IndexPage() {
  const [posts,setPosts] = useState([])
  const [filtered,setFilteredPost] = useState([])
  
  useEffect(()=>{
  const response = fetch('http://192.168.0.128:4000/post').then(response=>{
    response.json().then(posts => {
      setPosts(posts)
      setFilteredPost(posts)
    })
  })
  },[])

  

  function handleSearch(e) {
    e.preventDefault()
    const filtered = posts.filter(ele=>{
      return ele.title.includes(e.target.value) 
    })
    setFilteredPost(filtered)
  }
  return (
    <div>
       <input type="text" onChange={handleSearch}/>
        {filtered.length>0 && filtered.map(post => {
          return <Post {...post} />
        })}
    </div>
  )
}

export default IndexPage