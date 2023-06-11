import {gql} from "@apollo/client";

export const GET_BLOGS = gql`
{
    blogs{
        date
        id
        title 
        user{
            name
        }
        content
    }
}
`