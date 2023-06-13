import React,{useEffect, useRef} from 'react'
import {Box,Typography,Button} from "@mui/material"
import { addStyles, htmlElmStyles } from '../../styles/add-blog-styles'
import { useMutation, useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { GET_BLOG_BY_ID } from '../graphql/queries';
import { UPDATE_BLOG } from '../graphql/mutations';
import {toast} from "react-hot-toast"


const UpdateBlog  = () => {
    const id = useParams().id;
    const headingRef = useRef<HTMLHeadingElement | null >(null);
    const contentRef = useRef<HTMLParagraphElement | null>(null);
    const {data,error,loading,refetch} = useQuery(GET_BLOG_BY_ID,{variables:{id:id}});
    const [updateBlog] = useMutation(UPDATE_BLOG);

     const handleSubmit = async()=>{
           const title = headingRef.current?.innerText;
           const content = headingRef.current?.innerText;
        try{
             await updateBlog({variables:{id,title,content}});
           
            toast.promise(refetch(),{
                error: "Unexpected Error",
                success: "Blog Updated",
                loading: "Ruko Zara!"
              })
        }
        catch(err:any){
            console.log(err.message);
        }
     }

    useEffect(()=>{
            if(data && headingRef.current && contentRef.current){
               headingRef.current.innerHTML = data.blog.title;
               contentRef.current.innerHTML = data.blog.content;
            }
    },[id,data])

  return data &&  (
   <Box sx={addStyles.container}>
       <Box sx={addStyles.blogHeader}>
              <Typography>Authored By: Vishal</Typography>
              <Button onClick={handleSubmit}  color="success" variant='contained'>Publish</Button>
       </Box>
    
           <Box sx={addStyles.formContainer}>
               <h2 ref={headingRef} suppressContentEditableWarning={true} contentEditable style={htmlElmStyles.h2}>Post your Story Title</h2>
               <p ref={contentRef} suppressContentEditableWarning={true}  contentEditable style={htmlElmStyles.p}>Describe Your Story</p>

           </Box>
   </Box>
  )
}

export default UpdateBlog