
const URL = "http://localhost:3000";
 
function generateSiteMap(posts) {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
     <!-- Add the static URLs manually -->
     <url>
       <loc>${URL}</loc>
     </url>
     <url>
       <loc>${URL}/portfolio</loc>
     </url>
      <url>
       <loc>${URL}/blog</loc>
     </url>
     ${posts
       .map(({ id }) => {
         return `
           <url>
               <loc>${`${URL}/blog/${id}`}</loc>
           </url>
         `;
       })
       .join("")}
   </urlset>
 `;
}


 
export async function getServerSideProps({ res }) {

 
const { data } = await fetch(`https://api.lifecarevengad.com/graphql`, {
  method: "POST",
  headers: {
      "Content-Type": "application/json",
  },
  body: JSON.stringify({
      query: `
  query Posts {
      posts(first: 5) {
          nodes {
              databaseId
            title
             date
             slug
            featuredImage {
              node {
                altText
                sourceUrl
              }
            }
          }
        }
}
`,
  }),
  next: { revalidate: 10 },
}).then((res) => res.json());



let blogPosts = data.posts.nodes

//console.log(data.posts.nodes[0].title)


const posts = blogPosts;
console.log(posts)

// Generate the XML sitemap with the blog data
const sitemap = generateSiteMap(posts);

res.setHeader("Content-Type", "text/xml");
// Send the XML to the browser
res.write(sitemap);
res.end();
 
  return {
    props: {},
  };
}
 
export default function SiteMap() {}