import {SxProps} from "@mui/material";

 export type Styles = {
   [key: string] : SxProps
}

export const homepageStyles: Styles = {
    container:{
        display:"flex",
        flexDirection:"column",
        
        gap:10,
    },
    wrapper:{
        display:"flex",
        justifyContent:"center",
        gap:4,
        padding:6,
        alignItems:"center"
    },
    text:{
        fontfamily: 'Work Sans',
        fontSize:{lg:50,md:40,sm:35,xs:20},
        textShadow:"12px 10px 8px #ccc"
    },
    image:{
        boxShadow:"10px 10px 25px #000",
        borderRadius:20,
    },
    footerContainer:{
        display:"flex",
        alignItems:"center",
        height:"20vh",
        justifyContent:"center",
        gap:20,
        bgcolor:"#404040",
    },
    footerBtn :{
        borderRadius:10,
        bgcolor:"blueviolet",
        width:200,
        ":hover":{
            bgcolor:"#bd63fa"
        }
    },
    footerText:{
        fontFamily:"Work Sans",
        fontWeight:"500",
        fontSize:20,
        color:"white"
    }
};