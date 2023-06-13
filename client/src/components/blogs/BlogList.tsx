import React from 'react'
import { BlogType } from '../../types/types'
import { blogStyles } from '../../styles/blog-list-styles'
import { Box } from '@mui/material'
import BlogItem from './BlogItem'

type Props  = {
  blogs:BlogType[],

}


const BlogList = (props:Props) => {
    
  return <Box sx={blogStyles.container}>
       {props.blogs.length >0 &&  props.blogs.map((blog:BlogType)=>( 
           <BlogItem blog={blog} key={blog.id}/>
           ))
       }
  </Box>
}

export default BlogList