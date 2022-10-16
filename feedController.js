const { PrismaClient } = require("@prisma/client");
const { StatusCodes } = require("http-status-codes");
const asyncHandler = require("express-async-handler");
const { Client } = require("pg");
const SAVEPOSTLIMIT = 20;

let adCount = 0; // total add count
let nextAdToDisplay = 0; //next advertisment to display

const {
  post,
  advertisement,
  comment,
  postReaction,
  commentReaction,
  postReport,
  advertisementReport,
  commentReport,
  postSave,
  postView,
  advertisementView,
  creator,
} = new PrismaClient();

//  upload a favorite post ***************
const uploadPostSave = asyncHandler(async (req, res) => {
  const Data = req.body;
  const userId = parseInt(req.headers.userid);
  // console.log(Data.postId,"userId:",userId);
  let createPostSave = {};

  const client = new Client({
    user: process.env.DATABASE_USER,
    host: process.env.DATABASE_HOST,
    database: process.env.DATABASE_DATABASE,
    password: process.env.DATABASE_PASSWORD,
    port: process.env.DATABASE_PORT,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  await client.connect();

  const isShowAd = await client.query(
    'SELECT "showAd" FROM public."premiumPackageSubscribe" WHERE "userId" = $1 AND "endDate" > Date(NOW());',
    [userId]
  );

  const isPostExist = await client.query(
    'SELECT "postSaveId" FROM public."postSave" WHERE ( "postId" =$1 and "userId" = $2);',
    [Data.postId, userId]
  );

  await client.end();
  // console.log(isPostExist.rowCount);
  if (isPostExist.rowCount !== 0) {
    res.json("post exits");
  }

  if (isShowAd.rows[0].showAd) {
    createPostSave = await postSave.create({
      data: {
        userId: userId,
        postId: Data.postId,
      },
    });
  } else {
    const savePostCount = await postSave.count({
      where: {
        userId: userId,
      },
    });
    if (savePostCount < SAVEPOSTLIMIT) {
      createPostSave = await postSave.create({
        data: {
          userId: userId,
          postId: Data.postId,
        },
      });
    }
  }

  res.status(StatusCodes.CREATED).json(createPostSave);
});

//  retrive  ad ************************************
const getAds = asyncHandler(async (req, res) => {
  const userId = parseInt(req.headers.userid);
  const take = parseInt(req.headers.take);

  let Ads = {};

  const client = new Client({
    user: process.env.DATABASE_USER,
    host: process.env.DATABASE_HOST,
    database: process.env.DATABASE_DATABASE,
    password: process.env.DATABASE_PASSWORD,
    port: process.env.DATABASE_PORT,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  await client.connect();

  const isShowAd = await client.query(
    'SELECT "showAd" FROM public."premiumPackageSubscribe" WHERE "userId" = $1 AND "endDate" > Date(NOW());',
    [userId]
  );

  adCount = await advertisement.count({
    where: {
      blockedStatus: false,
      paymentStatus: true,
      endDate: {
        gt: new Date(),
      },
    },
  });
  // console.log("before update :",nextAdToDisplay);

  nextAdToDisplay = nextAdToDisplay % adCount;
  // console.log("before after :",nextAdToDisplay);

  const adIds = await advertisement.findMany({
    select: {
      advertisementId: true,
    },
    where: {
      blockedStatus: false,
      paymentStatus: true,
      endDate: {
        gt: new Date(),
      },
    },
  });

  let adIdArray = [];
  adIds.map((ad) => {
    adIdArray.push(ad.advertisementId);
  });

  // console.log(nextAdToDisplay,nextAdToDisplay + take);

  adIdsTodisplay = adIdArray.slice(nextAdToDisplay, nextAdToDisplay + take);

  if (nextAdToDisplay + take >= adCount) {
    adIdsTodisplay = adIdsTodisplay.concat(
      adIdArray.slice(0, (nextAdToDisplay + take) % adCount)
    );
    // console.log(adIdsTodisplay)
    // console.log(true)
  }

  // console.log(adCount);
  // console.log(adIds);
  // console.log(adIdArray);
  // console.log(adIdsTodisplay);

  nextAdToDisplay = nextAdToDisplay + take;

  // console.log("nextAdToDisplay: " ,nextAdToDisplay + take);
  // console.log(isShowAd.rows[0] === undefined ? "true":"false");

  if (isShowAd.rows[0] === undefined || isShowAd.rows[0].showAd) {
    Ads = await advertisement.findMany({
      select: {
        advertisementId: true,
        creatorId: true,
        contentLink: true,
      },
      where: {
        advertisementId: {
          in: adIdsTodisplay,
        },
      },
    });

    Ads.map(async (ad) => {
      await advertisementView.create({
        data: {
          advertisementId: ad.advertisementId,
          followerCreatorId: userId,
        },
      });
    });
  }
  // console.log(isShowAd);
  await client.end();
  res.json(Ads);
});

//  upload a comment report ***************
const uploadCommentReport = asyncHandler(async (req, res) => {
  const Data = req.body;
  // console.log(Data);
  // const newCommentReport = await commentReport.create({
  //   data: {
  //     userId: Data.userId,
  //     reportedCommentId: parseInt(Data.commentId),
  //     reportCategory: parseInt(Data.category),
  //     description: Data.description,
  //   },
  // });
  // res.status(StatusCodes.CREATED).json(newCommentReport);
  // res.json("done");
  const client = new Client({
    user: process.env.DATABASE_USER,
    host: process.env.DATABASE_HOST,
    database: process.env.DATABASE_DATABASE,
    password: process.env.DATABASE_PASSWORD,
    port: process.env.DATABASE_PORT,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  await client.connect();
  const comments = await client.query({
    text: `INSERT INTO public."commentReport"
          ("userId", "reportedCommentId","reportCategory", description)
          VALUES ($1,$2,$3,$4);`,
    values: [
      Data.userId,
      parseInt(Data.commentId),
      parseInt(Data.category),
      Data.description,
    ],
  });
  await client.end();

  res.status(StatusCodes.CREATED).json(comments.rows);
});

//  upload a post report ***************
const uploadAdReport = asyncHandler(async (req, res) => {
  const Data = req.body;
  const CreateAdReport = await advertisementReport.create({
    data: {
      userId: Data.userId,
      advertisementId: Data.commentId,
      reportCategory: parseInt(Data.category),
      description: Data.description,
    },
  });
  res.status(StatusCodes.CREATED).json(CreateAdReport);
});

//  upload a post report ***************
const uploadPostReport = asyncHandler(async (req, res) => {
  const Data = req.body;
  // console.log(Data);
  const CreatepostReport = await postReport.create({
    data: {
      userId: Data.userId,
      reportedPostId: parseInt(Data.reportedpostid),
      reportCategory: parseInt(Data.category),
      description: Data.description,
    },
  });
  res.status(StatusCodes.CREATED).json(CreatepostReport);
});

//  upload a commentReaction ***************
const uploadCommentReaction = asyncHandler(async (req, res) => {
  const Data = req.body;
  // console.log(Data);
  const CreatecommentReaction = await commentReaction.create({
    data: {
      userId: Data.reactorId,
      commentId: Data.commentId,
    },
  });
  res.status(StatusCodes.CREATED).json(CreatecommentReaction);
});

//  upload a postReaction ***************
const uploadpostReaction = asyncHandler(async (req, res) => {
  const Data = req.body;
  // console.log(Data);
  const CreatepostReaction = await postReaction.create({
    data: {
      userId: Data.reactorId,
      postId: Data.postId,
    },
  });
  res.status(StatusCodes.CREATED).json(CreatepostReaction);
});

//  upload a comment ***************
const uploadComment = asyncHandler(async (req, res) => {
  const Data = req.body;
  // console.log(Data);
  const CreateComment = await comment.create({
    data: {
      userId: Data.commenterId,
      postId: Data.postId,
      description: Data.description,
    },
  });
  res.status(StatusCodes.CREATED).json(CreateComment);
});

//upload POST IMAGE start*************************************
const uploadPost = asyncHandler(async (req, res) => {
  const userId = parseInt(req.headers.userid);
  const CreatePost = await post.create({
    data: {
      creatorId: userId,
      imagevideo: req.file.filename,
      description: req.body.desc,
    },
  });
  res.status(StatusCodes.CREATED).json(CreatePost);
});

//  get a comments  ***************
const getComments = asyncHandler(async (req, res) => {
  const client = new Client({
    user: process.env.DATABASE_USER,
    host: process.env.DATABASE_HOST,
    database: process.env.DATABASE_DATABASE,
    password: process.env.DATABASE_PASSWORD,
    port: process.env.DATABASE_PORT,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  const postId = parseInt(req.headers.postid);

  await client.connect();
  const comments = await client.query({
    text: `SELECT comments.*,"user"."name","user"."profilePhoto" FROM 
            (SELECT comment.* 
              FROM comment
               WHERE
               (comment."postId" = $1 and comment."blockedStatus"= false)
            ) as comments
           LEFT OUTER JOIN
           "user" on ("user"."userId" = comments."userId" and "user"."blockedStatus"= false) ORDER BY "commentId" DESC`,
    values: [postId],
  });
  await client.end();

  res.json(comments.rows);
});

//  retrive  posts ************************************
const getPosts = asyncHandler(async (req, res) => {
  const client = new Client({
    user: process.env.DATABASE_USER,
    host: process.env.DATABASE_HOST,
    database: process.env.DATABASE_DATABASE,
    password: process.env.DATABASE_PASSWORD,
    port: process.env.DATABASE_PORT,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  const userId = parseInt(req.headers.userid);
  const skip = parseInt(req.headers.skip);
  const take = parseInt(req.headers.take);

  await client.connect();

  const posts = await client.query({
    // text: 'SELECT * FROM post WHERE "creatorId" IN (SELECT "creatorId" FROM "userSubscribe" WHERE "followerId"=$1 UNION SELECT $1 AS "creatorId") ORDER BY "postId" DESC LIMIT $2 OFFSET $3',
    text: `SELECT posts.*,"user"."name","user"."profilePhoto" FROM (
            SELECT * FROM post 
             WHERE 
              ("creatorId" IN (SELECT "creatorId" FROM "userSubscribe" WHERE "followerId"=$1 UNION SELECT $1 AS "creatorId") 
              AND 
              post."blockedStatus" = false)) as posts,"user" WHERE ("user"."userId" = posts."creatorId" and "user"."blockedStatus"= false) 
            ORDER BY "postId" DESC LIMIT $2 OFFSET $3`,
    values: [userId, take, skip],
  });

  posts.rows.map(async (post) => {
    // console.log(post.postId)
    await postView.create({
      data: {
        postId: post.postId,
        followerCreatorId: userId,
      },
    });
  });

  await client.end();

  res.json(posts.rows);
});

const deletePost = asyncHandler(async (req, res) => {
  const userId = parseInt(req.headers.userid);
  const postId = parseInt(req.headers.postid);
  const deletedPost = await post.delete({
    where: {
      postId,
    },
  });

  // console.log(deletedPost)
  res.json(deletedPost);
});

const deleteComment = asyncHandler(async (req, res) => {
  const userId = parseInt(req.headers.userid);
  const commentId = parseInt(req.headers.commentid);
  // console.log(userId,commentId,req.headers)
  const deletedComment = await comment.delete({
    where: {
      commentId,
    },
  });
  res.json(deletedComment);
});

const getFavourites = asyncHandler(async (req, res) => {
  const userId = parseInt(req.headers.userid);

  // const favorites = await post.findMany({
  //   where:{
  //     postId:1
  //   },
  //   include:{
  //     postSaves:true
  //   }
  // })

  // const posts = await creator.findMany({
  //   where:{
  //     userId:3
  //   },include:{
  //     posts:true
  //   }
  // })

  const postSaved = await postSave.findMany({
    where: {
      userId: userId,
    },
    include: {
      post: {
        include: {
          creator: {
            include:{
              followerCreator:{
                include:{
                  user:true
                }
              }
            }
          }
        },
      },
    },
  });
  // console.log(postSaved);
  // console.log("                     ");
  // Array.from(postSaved).map(item => console.log(item.post.blockedStatus));
  // Array.from(postSaved).filter((item) => item.post.blockedStatus !== false);
  // console.log("filterd", Array.from(postSaved).filter((item) => item.post.blockedStatus !== true));
  res.json(Array.from(postSaved).filter((item) => item.post.blockedStatus !== true));
});

const deleteSavePost = asyncHandler(async (req, res) => {
  const userId = parseInt(req.headers.userid);
  const postSaveId = parseInt(req.headers.postid);
  const deletedPost = await postSave.delete({
    where: {
      postId:postSaveId,
    },
  });

  res.json(deletedPost);
});


module.exports = {
  uploadPostSave,
  getAds,
  uploadCommentReport,
  uploadAdReport,
  uploadPostReport,
  uploadCommentReaction,
  uploadpostReaction,
  uploadComment,
  uploadPost,
  getComments,
  getPosts,
  deletePost,
  deleteComment,
  getFavourites,
  deleteSavePost
};
