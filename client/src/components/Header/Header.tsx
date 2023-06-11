import React, { useState } from 'react'
import {AppBar,Toolbar,Box,Tabs,Tab, Button} from "@mui/material"
import {ImBlogger} from "react-icons/im"
import { headerStyles } from '../../styles/header-styles'
import {BiLogInCircle} from "react-icons/bi"
import {Link} from "react-router-dom"
const Header = () => {
  const [value,setValue] = useState(0);

  return (
    <AppBar sx={headerStyles.appBar}>
       <Toolbar>
          <ImBlogger size={"30px"} style={{borderRadius:"50%",padding:"10px",background:"#6c5252"}}/>
          <Box sx={headerStyles.tabContainer}>
            <Tabs  indicatorColor="primary" TabIndicatorProps={{style:{background:"white"}}} value={value} textColor="inherit" onChange={(e,val)=>setValue(val)}>
                 {/* @ts-ignore */}
                 <Tab  LinkComponent={Link} to="/"  disableRipple label="Home"/>
                  {/* @ts-ignore */}
                 <Tab  LinkComponent={Link} to="/blogs" disableRipple label="Blogs"/>
                  {/* @ts-ignore */}
                 <Button style={{textDecoration:"none"}}  LinkComponent={Link} to="/auth"  endIcon={<BiLogInCircle/>} sx={headerStyles.authBtn}>Auth</Button>
            </Tabs>
          </Box>
          
       </Toolbar>
    </AppBar>
  )
}

export default Header