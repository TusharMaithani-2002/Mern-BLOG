import "./App.css";
import { Route, Routes} from "react-router-dom";
import Login from "./components/Login";
import { BrowserRouter as Router } from "react-router-dom";
import Layout from "./components/Layout";
import IndexPage from "./components/IndexPage";
import Register from "./components/Register";
import { UserContextProvider } from "./UserContext";
import CreatePost from "./components/CreatePost";
import PostPage from "./components/PostPage";
import EditPost from './components/EditPost'

function App() {
  return (
    <UserContextProvider>
    <Router>
      <Routes>
        <Route path="" element={<Layout />}>
          <Route index element={<IndexPage />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/register" element={<Register />} />
          <Route exact path="/create" element={<CreatePost />} />
          <Route exact path='/post/:id' element={<PostPage />} />
          <Route path='/edit/:id' element={<EditPost />} />
        </Route>
      </Routes>
    </Router>
    </UserContextProvider>
  );
}

export default App;
