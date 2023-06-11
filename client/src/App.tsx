import './App.css';
import Homepage from './components/home/Homepage';
import Header from './components/Header/Header';
import Footer from './components/Footer';
import {Routes,Route} from "react-router-dom"
import Blogs from './components/blogs/Blogs';
import Auth from './components/auth/Auth';

function App() {
  return (
    <div className="App">
      <Header/>
      <main>
        <Routes>
           <Route path="/" element={<Homepage/>}/>
           <Route path='/blogs' element={<Blogs/>}/>
           <Route path='/auth' element={<Auth/>}/>
        </Routes>
      </main>
      <Footer/>

    </div>
  );
}

export default App;
