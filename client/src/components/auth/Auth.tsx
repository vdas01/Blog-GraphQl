import {Box, Typography,TextField,InputLabel,Button,useTheme,useMediaQuery} from "@mui/material"
import { authStyles } from "../../styles/auth-styles"
import {useState} from "react"
import { ImBlogger } from "react-icons/im"
import {useForm} from "react-hook-form";
import { useMutation } from "@apollo/client";
import { USER_LOGIN, USER_SIGNUP } from "../graphql/mutations";

type Inputs = {
  name:string,
  email:string,
  password:string
}
const Auth = () => {
  const theme = useTheme();
  const {register,formState: {errors}, handleSubmit} = useForm<Inputs>();
 
  //loginResposne--> {data,loading,error}
  const [login,loginResponse] = useMutation(USER_LOGIN)
  const [signup,singupResponse] = useMutation(USER_SIGNUP);
  const [isSignUp, setIsSignUp] = useState(false);
  const isBelowMd = useMediaQuery(theme.breakpoints.down("md"));
   const onSubmit = async({name,email,password}:Inputs) => {
         if(isSignUp){
                await signup({variables:{name,email,password}}).then(()=>{
                  console.log(singupResponse);
                })
         }
         else{
            await login({variables:{email,password}}).then(()=>{
              console.log(loginResponse.data.login);
            })
         }
   }

  return <Box sx={authStyles.container}>
    <Box sx={authStyles.logoTitle}>
       <ImBlogger size={"30px"} style={{borderRadius:"50%",padding:"10px",background:"#6c5252"}} />
       <Typography sx={authStyles.logoText}>Vishal Blog</Typography>
    </Box>

    <Box sx={{...authStyles.formContainer,width:isBelowMd ? "50%" : "200px"}}>
         <Typography sx={authStyles.logoText}>{isSignUp ?"Signup" :"Login"}</Typography>
          {/**@ts-ignore */}
         <form style={authStyles.form} onSubmit={handleSubmit(onSubmit)}>
             {isSignUp &&  <><InputLabel aria-label="name">Name</InputLabel>
             <TextField  error={Boolean(errors.name)} margin="normal" InputProps={{style:{borderRadius:10}}} aria-label="name" label="Name" {...register("name",{required:true})}/>
             </>} 
            
              <TextField helperText={Boolean(errors.email) ? "Invalid email format" : ""} error={Boolean(errors.email)} margin="normal" InputProps={{style:{borderRadius:10}}} aria-label="email" label="Email" {...register("email",{required:true,validate:(val:string)=>/^\w+([.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(val)})}/>
             
              <TextField helperText={Boolean(errors.password) ? "Length should be greater than 6" : ""} error={Boolean(errors.password )} margin="normal" InputProps={{style:{borderRadius:10}}} aria-label="password" label="Password" {...register("password",{required:true,minLength:6})} type="password"/>
              <Button type="submit"  sx={authStyles.buttons} variant="contained">Submit</Button>
              <Button onClick={()=>setIsSignUp((prev)=>!prev)} variant="outlined" 
              //@ts-ignore
              sx={{...authStyles.buttons,...authStyles.submitBtn}}>Switch to {isSignUp ? "Login" : "SignUp"}</Button>

         </form>
    </Box>
  </Box>
}

export default Auth