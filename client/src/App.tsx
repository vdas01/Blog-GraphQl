import './App.css';
import Homepage from './components/home/Homepage';
import Header from './components/Header/Header';
import Footer from './components/Footer';
import {Routes,Route} from "react-router-dom"
import Blogs from './components/blogs/Blogs';
import Auth from './components/auth/Auth';
import {useDispatch, useSelector} from "react-redux";
import { useEffect } from 'react';
import { authActions } from './store/auth-slice';
import AddBlog from './components/blogs/AddBlog';
import Profile from './components/userMenu/Profile';
import ViewBlog from './components/blogs/ViewBlog';
import { Toaster } from 'react-hot-toast';
import UpdateBlog from './components/blogs/UpdateBlog';

function App() {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state:any)=>state.isLoggedIn)
 
   useEffect(()=>{
    const data:string = localStorage.getItem("userData") as string;
    if(JSON.parse(data) !== null){
       dispatch(authActions.login());
    }
   },[])

  return (
    <div className="App">
      <Toaster/>
      <Header/>
      <main>
        <Routes>
           <Route path="/" element={<Homepage/>}/>
           <Route path='/blogs' element={<Blogs/>}/>
           <Route path='/auth' element={<Auth/>}/>
           <Route path="/add" element={<AddBlog/>}/>
           <Route path='/profile' element={<Profile/>}/>
           <Route path="/blog/view/:id" element={<ViewBlog/>}/>
           <Route path='/blog/update/:id' element={<UpdateBlog/>}/>
        </Routes>
      </main>
      <Footer/>

    </div>
  );
}

export default App;
