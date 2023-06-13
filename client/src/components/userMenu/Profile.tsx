//@ts-nocheck
import { Box ,Typography,Avatar,LinearProgress} from '@mui/material'
import React from 'react'
import { profileStyles } from '../../styles/profile-styles'
import BlogItem from '../blogs/BlogItem'
import { useQuery } from '@apollo/client'
import { GET_USER_BLOGS } from '../graphql/queries'



const Profile = () => {
   const {loading,data,error} = useQuery(GET_USER_BLOGS,{
    variables:{
      id: JSON.parse(localStorage.getItem("userData") as string).id,
    }
   })


  if(error){
    return <p>Error</p>
  }

  return loading ? <LinearProgress/> :data && (
    <Box sx={profileStyles.container}>
           <Box sx={profileStyles.blogsContainer}>
                 <Typography sx={profileStyles.text}>My Posts</Typography>
                 <Box sx={profileStyles.cardsContainer}>
                      {data.user.blogs.map((item,i)=> (
                        <BlogItem key={i} blog={{title:item.title,content:item.content,date:item.date,id:item.id}} showAction={true}/>
                      ))

                      }

                 </Box>
           </Box>
           <Box sx={profileStyles.profileContainer}>
               <Box sx={profileStyles.userContainer}>
               <Avatar sx={profileStyles.avatar}></Avatar>
               <Typography variant='h3' fontFamily="Work Sans">Vishal Das</Typography>
               <Typography variant='h4' fontFamily="Work Sans">Email: vdas@gmail.com</Typography>
               <Typography variant='h4' fontFamily="monospace">You wrote {data.user.blogs?.length} {data.user.blogs?.length > 1 ? "Blogs":"Blog"} 🎉🎊</Typography>
               </Box>
           </Box>
    </Box>
  )
}

export default Profile