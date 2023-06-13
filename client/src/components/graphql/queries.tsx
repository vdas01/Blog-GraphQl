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

export const GET_USER_BLOGS = gql`
       query user($id: ID!){
        user(id: $id){
            blogs{
                title
                content
                date
                id
            }
        }
       }

`

export const GET_BLOG_BY_ID = gql`
  query blog($id:ID!){
    blog(id:$id){
        id
        title
        content
        date
        user{
            name
            email
        }
        comments{
            text
            id
            user{
                name
                id
            }
        }
    }
  }    

`