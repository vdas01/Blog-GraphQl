import React, { useState } from 'react'
import {AppBar,Toolbar,Box,Tabs,Tab, Button,Typography,IconButton} from "@mui/material"
import {ImBlogger} from "react-icons/im"
import { headerStyles } from '../../styles/header-styles'
import {BiLogInCircle} from "react-icons/bi"
import {Link, useNavigate} from "react-router-dom"
import { useSelector } from 'react-redux'
import UserMenu from '../userMenu/UserMenu'
const Header = () => {
  const navigate = useNavigate()
  const [value,setValue] = useState(0);
const  isLoggedIn = useSelector((state:any)=>state.isLoggedIn);

const handleAddBlog = ()=>{
  navigate("/add");
}
  return (
    <AppBar sx={headerStyles.appBar}>
       <Toolbar>
          <ImBlogger size={"30px"} style={{borderRadius:"50%",padding:"10px",background:"#6c5252"}}/>
         
         <Box onClick={handleAddBlog} sx={headerStyles.addLink}>
               <Typography fontSize={20} fontFamily="Work Sans">Post New Blog</Typography>
                 <IconButton color='inherit'>
                    <ImBlogger/>
                 </IconButton>
         </Box>

          <Box sx={headerStyles.tabContainer}>
            <Tabs  indicatorColor="primary" TabIndicatorProps={{style:{background:"white"}}} value={value} textColor="inherit" onChange={(e,val)=>setValue(val)}>
                 {/* @ts-ignore */}
                 <Tab  LinkComponent={Link} to="/"  disableRipple label="Home"/>
                  {/* @ts-ignore */}
                 <Tab  LinkComponent={Link} to="/blogs" disableRipple label="Blogs"/>
                  {/* @ts-ignore */}
            </Tabs>
             {isLoggedIn ? <UserMenu/> :<> <Link style={{textDecoration:"none"}} to="/auth">
                  <Button endIcon={<BiLogInCircle/>} sx={headerStyles.authBtn}>
                      Auth
                  </Button>{" "}
                </Link>
                </>   }
          </Box>
       </Toolbar>
    </AppBar>
  )
}

export default Header