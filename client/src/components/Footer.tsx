import React from 'react'
import {Box,Button,Typography} from "@mui/material"
import { homepageStyles } from '../styles/Homepage.styles'

const Footer = () => {
  return (
    <Box sx={homepageStyles.footerContainer}>
         <Button variant="contained" sx={homepageStyles.footerBtn}>View Articles</Button>
         <Typography sx={homepageStyles.footerText}>Made With &#x1F498; By  Vishal </Typography>
         <Button variant="contained" sx={homepageStyles.footerBtn}>Publish One</Button>
    </Box>
  )
}

export default Footer