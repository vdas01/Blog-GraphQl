import {useQuery} from "@apollo/client";
import {GET_BLOGS} from "../graphql/queries"
import BlogList from "./BlogList";

const Blogs = () => {
    const {loading,data,error} = useQuery(GET_BLOGS);
    if(loading)
    return <p>Loading</p>
    if(error)
    return <p>Error</p>
    console.log(data);
  return (
    <div>
       <BlogList blogs={data.blogs}/>

    </div>
  )
}

export default Blogs