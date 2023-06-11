import { Styles } from "./Homepage.styles"
const colors = [
   "#FF9800",
   "#FF5722",
   "#607D88",
   "#4CAF50",
   "#BBC34A",
   "#40C4FF",
   "#0277BD",
   "#4DB6AC",
   "#009688",
   "#448AFF",
   "#42A5F5",
   "#7E57C2",
   "#D32F2F",
   "#AB47BC",
];
export function randomBgColor(){
   return colors[Math.floor(Math.random()*colors.length)];
}

export const blogStyles:Styles = {
   container:{
    display:'flex',
    justifyContent:'flex-start',
    gap:10,
    flexWrap:'wrap',
    m:"10px"
   },
   card:{
      display:'flex',
      flexDirection:'column',
      height:'60vh',
      transition:"transform 1s",
      width:"400px",

      ":hover":{
        transform:"scale(1.02)",
        boxShadow:"10px 10px 20px #ccc",
      }
   },
   cardHeader:{
    fontFamily:"Work Sans",
    fontSize:"72px",
    height:"35%",
    padding:1,
    mb:2,
   },
   dateContainer:{
         display:"flex",
         alignItems:"center",
         gap:2,
   },
   cardContent:{
         width:"100%",
         height:"100%",
         fontSize:"20px",
         fontWeight:"500"
   },
   title:{
    fontWeight:"600",
    m:1,
    color:"white",
    textTransform:"uppercase",
    textDecoration:"underline",
    textUnderlineOffset:"5px",
    fontFamily:"Work Sans",
    textShadow:"2px 7px 20px #000"
   },
   contentText:{
      padding:2,
      fontSize:"20px",
      fontWeight:"500",
   }
}