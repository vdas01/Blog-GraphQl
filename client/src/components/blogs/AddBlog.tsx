import React,{useRef} from 'react'
import {Box,Typography,Button} from "@mui/material"
import { addStyles, htmlElmStyles } from '../../styles/add-blog-styles'
import { useMutation } from '@apollo/client';
import { ADD_BLOG } from '../graphql/mutations';

const AddBlog = () => {
    const headingRef = useRef<HTMLHeadingElement | null >(null);
    const contentRef = useRef<HTMLParagraphElement | null>(null);
    const [addblog]= useMutation(ADD_BLOG);
     const handleSubmit = async()=>{
           const title = headingRef.current?.innerText;
           const content = headingRef.current?.innerText;
           const date = new Date();
           const user =JSON.parse(localStorage.getItem("userData") as string).id;

        try{
            const res = await addblog({variables:{title,content,date,user}});
            const data = await res.data;
            console.log(data);
        }
        catch(err:any){
            console.log(err.message);
        }
     }


  return (
   <Box sx={addStyles.container}>
       <Box sx={addStyles.blogHeader}>
              <Typography>Authored By: Vishal</Typography>
              <Button onClick={handleSubmit} color="success" variant='contained'>Publish</Button>
       </Box>
    
           <Box sx={addStyles.formContainer}>
               <h2 ref={headingRef} suppressContentEditableWarning={true} contentEditable style={htmlElmStyles.h2}>Post your Story Title</h2>
               <p ref={contentRef} suppressContentEditableWarning={true}  contentEditable style={htmlElmStyles.p}>Describe Your Story</p>

           </Box>
   </Box>
  )
}

export default AddBlog