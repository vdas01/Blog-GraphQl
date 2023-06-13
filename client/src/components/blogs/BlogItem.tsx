import { Box, Card, Typography,CardActions,IconButton } from "@mui/material";
import { BlogType } from "../../types/types";
import { blogStyles, randomBgColor } from "../../styles/blog-list-styles";
import {FcCalendar} from "react-icons/fc"
import {AiOutlineEdit,AiOutlineDelete} from "react-icons/ai"
import { useNavigate } from "react-router-dom";
import { DELETE_BLOG } from "../graphql/mutations";
import { useMutation } from "@apollo/client";
type Props = {
    blog: BlogType;
    showAction?:Boolean;
}

const BlogItem = (props:Props) =>{
   const navigate = useNavigate();
   const [deleteBlog] = useMutation(DELETE_BLOG);


   const handleClick = ()=>{
          return navigate(`/blog/view/${props.blog.id}`)
   }

   const editHandler = ()=>{
           return navigate(`/blog/update/${props.blog.id}`)
   }
   const deleteHandler = async() =>{
        try{
                  await deleteBlog({variables:{id:props.blog.id}});
                  navigate("/profile")
        }
        catch(err:any){
         return console.log(err.message);
        }
   }
  
    return <Card  sx={blogStyles.card}>
      {props.showAction && 
      <CardActions>
         <IconButton onClick={editHandler}>
              <AiOutlineEdit/>
         </IconButton>
         <IconButton onClick={deleteHandler}>
            <AiOutlineDelete/>
         </IconButton>
      </CardActions>
     }
          <Box onClick={handleClick} sx={{...blogStyles.cardHeader,bgcolor: randomBgColor()}}>
             <Box sx={blogStyles.dateContainer}>
                <FcCalendar size={"30px"}/>
                <Typography variant="caption" fontSize={"20px"}>{new Date(Number(props.blog.date)).toDateString()}</Typography>
             </Box>
             <Typography variant="h4" sx={blogStyles.title}>{props.blog.title}</Typography>
          </Box>
          <Box sx={blogStyles.cardContent}>
                <Typography sx={blogStyles.contentText}>{props.blog.content}</Typography>
             </Box>

    </Card>
}

export default BlogItem;