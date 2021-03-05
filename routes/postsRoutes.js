const express=require("express");
const knex=require("../db/client");

const router= express.Router();

router.get("/",(req,res)=>{ 
    knex("cohort")
     .then(posts=>{
        res.render("home",{posts: posts}) 
      })

})

router.get('/new',(req,res)=>{ 
      res.render("cohorts/new");
})

router.post("/",(req,res)=>{ 
     
      const formData =req.body;
      knex("cohort")
       .insert({ 
          name: formData.name,
          members: formData.members,
          logoUrl: formData.logo_url 
       })
      .returning('*')
      .then(posts=>{
          
          const [post]=posts;
          res.redirect(`/cohorts/${post.id}`) 
      })
})

router.get("/:id",(req,res)=>{ 
      const id=req.params.id;
      knex('cohort')
        .where("id",id)
        .first()
        .then(post=>{
          if(post){
            if(req.query){
                let names = post.members.split(",");
                let teams = splitTeams(names, req);
                post.teams = teams;
                post.quantity= req.query.quantity;
                console.log("method",req.query.method);
                post.method=req.query.method;
            }
            res.render("cohorts/show",{post: post});
          }else{
            res.redirect("/cohorts")
          }
        })
})
  

router.post("/assign",(req,res)=>{
      const formData= req.body;
      let exampleRadios=formData.exampleRadios;
      let quantity= formData.quantity;
      
      res.redirect(`/cohorts/${formData.id}/?method=${exampleRadios}&quantity=${quantity}`);
})

router.get("/:id/edit",(req,res)=>{

    const id=req.params.id;
    knex("cohort")
      .where("id",id)
      .first()
      .then(post=>{
         res.render("cohorts/edit",{post:post})
      })
})
  
router.patch("/:id",(req,res)=>{
    const updatedPost={
        name:req.body.name,
        members:req.body.members,
        logoUrl: req.body.logoUrl
    };
    knex("cohort")
      .where("id",req.params.id)
      .update(updatedPost)
      .then(()=>{
         res.redirect(`/cohorts/${req.params.id}`)
      })
})

router.delete("/:id",(req,res)=>{
    const id= req.body.id;
    knex("cohort")
      .where("id",id)
      .del()
      .then(()=>{
         res.redirect("/cohorts");
      });
 });


function splitTeams(names, req){
    if(req.query.quantity){
        let quantity= Number(req.query.quantity); 
        
        if(req.query.method == 'teamCount'){
            return createNTeams(names, quantity);
        }else if(req.query.method === 'numberPerTeam'  && quantity){
            return createNPerTeam(names, quantity);
        }

    }
}

function createNTeams(names, N){
    let teams = [];
    for(let j = 0;j < names.length;){
        for(let i = 0;i < N;i++){
            if(j >= names.length){
                break;
            }
            teams[i] = (teams[i] || '') + names[j] + ", " ;
            j++;
        }
    }
    return teams;
}

function createNPerTeam(names, N){
    let teams = [];
    let k = 0;
    for(let j = 0;j < names.length;){
        for(let i = 0;i < N;i++){
            if(j >= names.length){
                break;
            }
            teams[k] = (teams[k] || '') + names[j] + ", ";
            j++;
        }
        if(j >= names.length){
            break;
        }
        k++;
    }
    return teams;
}

module.exports=router;