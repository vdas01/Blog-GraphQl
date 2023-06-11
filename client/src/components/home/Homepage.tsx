import React from 'react'
import {Box,Typography} from "@mui/material"
import { homepageStyles } from '../../styles/Homepage.styles'
import Footer from '../Footer'



const Homepage = () => {
  return (
    <Box sx={homepageStyles.container}>
          <Box sx={homepageStyles.wrapper}>
            <Typography sx={homepageStyles.text}>
                         Write and Share your Blog With Millions Of People
            </Typography>
            <img width="50%" height="50%" 
            //@ts-ignore
             style={homepageStyles.image} src="/blog.png" alt="Blog"  />
          </Box>
          <Box sx={homepageStyles.wrapper}>
          <img width="50%" height="50%"
           //@ts-ignore
           style={homepageStyles.image} src="/publish.png" alt="Publish"  />
          <Typography sx={homepageStyles.text}>
                         Write and Share your Blog With Millions Of People
            </Typography>
            
          </Box>
          <Box sx={homepageStyles.wrapper}>
               <img width="50%" height="50%"  
                 //@ts-ignore
                style={homepageStyles.image} src="/articles.png" alt="Blog"  />
               <Typography sx={homepageStyles.text}>
                         Write and Share your Blog With Millions Of People
               </Typography>
          </Box>
     
    </Box>
  )
}

export default Homepage