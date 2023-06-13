import { Box, Typography,IconButton ,TextField,Avatar,LinearProgress,Dialog,DialogContent} from '@mui/material'
import { blogPageStyles } from '../../styles/view-styles'
import { FaComments } from 'react-icons/fa'
import {BsCalendar2DateFill} from "react-icons/bs";
import { BiSend } from 'react-icons/bi'
import { ImMail } from 'react-icons/im'
import { useMutation, useQuery } from '@apollo/client'
import { GET_BLOG_BY_ID } from '../graphql/queries'
import { useParams } from 'react-router-dom'
import {useForm} from "react-hook-form"
import { ADD_COMMENT, DELETE_COMMENT } from '../graphql/mutations';
import {AiOutlineDelete} from "react-icons/ai";
import {toast} from "react-hot-toast"

function getInitals(name:string){
    const nameAr = name.split(" ");
    if(nameAr.length > 1)
    return `${nameAr[0][0]} ${nameAr[1][0]}`

    return `${nameAr[0][0]}`
}
const ViewBlog = () => {
   const {register,handleSubmit} = useForm();
    const id = useParams().id;
    const [addCommentToBlog,addCommentResponse] = useMutation(ADD_COMMENT);
   const {data,error,loading,refetch} = useQuery(GET_BLOG_BY_ID,{variables:{id:id}});
   const user =   JSON.parse(localStorage.getItem("userData")as string).id;
   const [deleteComment,deleteCommentResponse] = useMutation(DELETE_COMMENT);

   if(loading){
    return <LinearProgress/>
   }
   if(error){
     return <Dialog open={true}>
              <DialogContent>Error Fetching Blog</DialogContent>
            </Dialog>
   }

   const commentHandler = async(data:any)=>{
      
      const date = new Date();
      const text = data.comment;
      try{
               await addCommentToBlog({variables:{text,date,blog:id,user}});
            
             toast.promise(refetch(),{
               error: "Unexpected Error",
               success: "Comment Added",
               loading: "Ruko Zara!"
             })
      }
      catch(err:any){
         return console.log(err.message);
      }
   }

   const handleCommentDelete = async(id:string) =>{
         try{
                     await deleteComment({variables:{id}})
                     toast.promise(refetch(),{
                        error: "Unexpected Error",
                        success: "Comment Deleted",
                        loading: "Ruko Zara!"
                      })
         }
         catch(err:any){
            return console.log(err.message);
         }
   }

  return (data && 
   <Box sx={blogPageStyles.container}>
        <Box sx={blogPageStyles.profileHeader}>
               <Typography sx={blogPageStyles.headerText}>{data.blog.user.name}</Typography>
               <Box sx={blogPageStyles.profileHeaderItems}>
                  {}
                  <ImMail size={20}/>
                  <Typography sx={blogPageStyles.headerText}>{data.blog.user.email}</Typography>
                  <Box sx={{marginLeft:"auto",display:"flex",gap:3,alignItems:"center"}}>
                        <BsCalendar2DateFill/>
                        <Typography fontFamily={"Work Sans"} fontWeight={500}>{new Date(Number(data.blog.date)).toDateString()}</Typography>
                  </Box>
               </Box>
        </Box>
        <Typography sx={blogPageStyles.blogTitle}>{data.blog.title}</Typography>
        <Typography sx={blogPageStyles.blogContent}>
           {data.blog.content}{" "}
        </Typography>
        <Box sx={blogPageStyles.commentBox}>
             Comments: {"  "}
             <IconButton>
                   <FaComments size={"30"}/>
             </IconButton>
        </Box>
        <Box sx={blogPageStyles.commentInputContainer}>
           <Typography margin={2} fontFamily={"Arvo"}>Add Your Comment</Typography>
           <Box sx={blogPageStyles.inputLayout}>
                <TextField {...register("comment")} type='textarea' sx={blogPageStyles.textField} 
                InputProps={{
                    style:{
                    width:"60vw",
                    borderRadius:"10px",
                    fontFamily:"Work Sans"
                   },
                   endAdornment:(
                       <IconButton onClick={handleSubmit(commentHandler)}>
                         <BiSend size="25"/>
                      </IconButton>
                   )
                }}/>
             
           </Box>
        </Box>

        {data.blog.comments.length > 0 && <Box sx={blogPageStyles.comments}>
           {data.blog.comments.map((comment:any,i:any)=>(
                <Box key={i} sx={blogPageStyles.commentItem}>
                       <Avatar sx={{padding:1,color:"red",bgColor:"transparent"}}>{getInitals(comment.user.name)}</Avatar>
                       <Typography sx={blogPageStyles.commentText}>{comment.text}</Typography>
                       {user === comment.user.id && 
                         <Typography>
                            <IconButton onClick={async()=> await handleCommentDelete(comment.id)} color='error' sx={{ml:"auto"}}>
                                    <AiOutlineDelete/>
                           </IconButton> 
                        </Typography>}
                </Box>
           ))

           }
        </Box>}
   </Box>
  )
}

export default ViewBlog