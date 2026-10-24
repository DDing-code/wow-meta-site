const {request}=require('C:/wowmeta/site/artifacts/chaeyong-wcl.cjs');
(async()=>{
 const d=await request(`{rateLimitData{limitPerHour pointsSpentThisHour pointsResetIn} worldData{encounter(id:3420){id name zone{id name partitions{id name compactName default} difficulties{id name}}}}}`);
 console.log(JSON.stringify(d,null,1));
})().catch(e=>{console.error(e.message);process.exitCode=1});
