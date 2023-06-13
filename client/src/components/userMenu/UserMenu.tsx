import React,{useState} from 'react'
import {Box,IconButton,Typography,MenuItem,Menu} from "@mui/material";
import {FaUserNurse} from "react-icons/fa";
import { useDispatch } from 'react-redux';
import { authActions } from '../../store/auth-slice';
import { useNavigate } from 'react-router-dom';


const UserMenu = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate()
    const [anchorEl,setAnchorEl] = useState<Element | null>(null);

    const handleLogout = ()=>{
          dispatch(authActions.logout);
          navigate("/")
    }
    const onProfileClicked = ()=>{
      navigate("/profile");
    }
  return (
    <Box>
      <IconButton onClick={(e)=>setAnchorEl(e.currentTarget)} color='inherit'>
         <FaUserNurse/>
      </IconButton>
      <Menu onClose={()=>setAnchorEl(null)} anchorEl={anchorEl} open={Boolean(anchorEl)}>
         <MenuItem onClick={onProfileClicked}>
           <Typography>Profile</Typography>
         </MenuItem>
         <MenuItem onClick={handleLogout}>
           <Typography>Logout</Typography>
         </MenuItem>
      </Menu>
    </Box>
  )
}

export default UserMenu