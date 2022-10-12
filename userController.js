const { PrismaClient } = require("@prisma/client");
const asyncHandler = require("express-async-handler");
const { Client } = require("pg");

const { user, followerCreator, userSubscribe } = new PrismaClient();

//upload profile photos --------------------------------------------------
const uploadProfileOrCoverPicture = asyncHandler(async (req, res) => {
  //   console.log(req.file);
  //   res.send("Single FIle upload success");
  const userId = parseInt(req.headers.userid);
  const uploadFileType = req.headers.uploadfiletype;

  if (uploadFileType === "1") {
    const updateUser = await user.update({
      where: {
        userId: userId,
      },
      data: {
        profilePhoto: req.file.filename,
      },
    });
    res.json({
      statusCode: 1,
      msg: "Profile picture upload success",
    });
  } else if (uploadFileType === "2") {
    const updateUser = await followerCreator.update({
      where: {
        userId: userId,
      },
      data: {
        coverPhoto: req.file.filename,
      },
    });
    res.json({
      statusCode: 1,
      msg: "Cover picture upload success",
    });
  }
});
//end upload profile photos ----------------------------------


//get user details --------------------------------------------
const getUserDetails = asyncHandler(async (req, res) => {
  const userId = parseInt(req.params.id);

  const existUser = await user.findUnique({
    where: {
      userId: userId,
    },
    include: {
      followerCreator: true,
    },
  });

  res.json(existUser);
});
//end get user details ----------------------------------------



//check username-----------------------------------------------
const checkUserName = asyncHandler(async (req, res) => {
  const userName = req.params.name;
  const userId = parseInt(req.headers.userid);

  const existUser = await user.findMany({
    where: {
      AND: [
        { username: userName },
        { NOT: { userId: userId, } }
      ],
    },

    include: {
      followerCreator: true,
    },
  });

  //console.log(existUser);

  if (existUser.length !== 0) {
    res.json({
      status: "NO"
    });
  } else {
    res.json({
      status: "YES"
    });
  }
});
//end check username--------------------------------------------------------



//update user details ------------------------------------------------------
const updateUserDetails = asyncHandler(async (req, res) => {
  const userId = parseInt(req.headers.userid);

  let { name, username, bio } = req.body;

  const updateUser = await user.findUnique({
    where: {
      userId: userId,
    },
  });

  if (updateUser) {
    await user.update({
      where: {
        userId: userId,
      },
      data: {
        name: name,
        username: username,
        bio: bio,
      },
    });
    res.json({
      msg: "Profile details updated",
    });
  }
  else {
    res.json({
      msg: "Error!",
    });
  }
});
//  end update user details --------------------------------------------


//  upload a user report ---------------------------------------------
const uploadUserReport = asyncHandler(async (req, res) => {
  const Data = req.body;
  console.log(Data);
  // const CreateAdReport = await userReport.create({
  //   data: {
  //     userId: Data.userId,
  //     reportedUserId: Data.reportedUserId,
  //     reportCategory: parseInt(Data.category),
  //     description: Data.description,
  //   },
  // });
  // res.status(StatusCodes.CREATED).json(CreateAdReport);
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
    text: `INSERT INTO public."userReport"
    ("userId", "reportedUserId","reportCategory", description)
    VALUES ($1,$2,$3,$4);`,
    values: [
      Data.userId,
      Data.reportedUserId,
      parseInt(Data.category),
      Data.description,
    ],
  });
  await client.end();

  res.status(StatusCodes.CREATED)
});
//  end  upload a user report ---------------------------------------------


//  get followers details --------------------------------------------
const getFollowersDetails = asyncHandler(async (req, res) => {
  const userId = parseInt(req.params.id);


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

  const result = await client.query(
    'SELECT "user"."userId", "user"."type","name","profilePhoto","coverPhoto" FROM "userSubscribe" INNER JOIN "user" ON "user"."userId"="userSubscribe"."followerId" INNER JOIN "followerCreator" ON "user"."userId"="followerCreator"."userId" WHERE "userSubscribe"."creatorId"=$1',
    [userId]
  );

  res.json(result.rows);
  await client.end();


  // const followers = await userSubscribe.findMany({
  //   where: {
  //     creatorId: userId,
  //   },
  //   include: {
  //     user: true,
  //   },
  // });

  // res.json(followers);
});
//  end get followers details ----------------------------------------


//  get followings details --------------------------------------------
const getFollowingsDetails = asyncHandler(async (req, res) => {
  const userId = parseInt(req.params.id);


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

  const result = await client.query(
    'SELECT "user"."userId", "user"."type","name","profilePhoto", "coverPhoto" FROM "userSubscribe" INNER JOIN "user" ON "user"."userId"="userSubscribe"."creatorId" INNER JOIN "followerCreator" ON "user"."userId"="followerCreator"."userId" WHERE "userSubscribe"."followerId"=$1',
    [userId]
  );

  res.json(result.rows);
  await client.end();

  // const followings = await userSubscribe.findMany({
  //   where: {
  //     followerId: userId,
  //   },
  //   // include: {
  //   //   followerCreator: true,
  //   // },
  // });

  // res.json(followings);
});
//  end get followings details ----------------------------------------


//  get top creators details --------------------------------------------
const getTopCreatorsDetails = asyncHandler(async (req, res) => {
  const userId = parseInt(req.params.id);


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

  const result = await client.query(
    'SELECT "user"."userId", "name", "profilePhoto", "joinedDate", COUNT("creatorId") AS "subCount" FROM "userSubscribe" INNER JOIN "user" ON "user"."userId"="userSubscribe"."creatorId" INNER JOIN "followerCreator" ON "followerCreator"."userId" = "user"."userId" WHERE "user"."blockedStatus" = FALSE GROUP BY "user"."userId" ORDER BY "subCount" DESC LIMIT 9',

  );

  res.json(result.rows);
  await client.end();


});
//  end get top creators details ---------------------------------------------


//  get all creators details -------------------------------------------------
const getAllCreatorsDetails = asyncHandler(async (req, res) => {
  const name = req.headers.name

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

  const serchName = "%" + name + "%";
  const result = await client.query(
    'SELECT "user"."userId", "name", "profilePhoto", "joinedDate", "coverPhoto" FROM "user" INNER JOIN "followerCreator" ON "user"."userId"="followerCreator"."userId" WHERE "user"."blockedStatus" = FALSE AND "user"."type" = 3 AND LOWER("user"."name") LIKE LOWER($1)',
    [serchName]
  );

  res.json(result.rows);
  await client.end();

});
//  end get all creators details ---------------------------------------------


//follow Unfollow check Creator-----------------------------------------------
const followUnfollowCreator = asyncHandler(async (req, res) => {

  const follower = parseInt(req.body.follower);
  const creator = parseInt(req.body.creator);
  const status = req.body.status;
  // status = 1 do 
  // status = 0 check

  const existUser = await userSubscribe.findFirst({
    where: {
      AND: [
        { creatorId: creator },
        { followerId: follower }
      ],
    },
  });

  if (existUser) {
    if (status == "1") { //do unfollow
      const unfolow = await userSubscribe.deleteMany({
        where: {
          AND: [
            { creatorId: creator },
            { followerId: follower }
          ],
        },
      })
      res.json({
        status: "delete",
        data: "Unfollowed!",
        msg: "Follow"
      });
    }
    else {
      res.json({
        status: "check",
        data: "Unfollow"
      });
    }
  } else {
    if (status == "1") {
      const folow = await userSubscribe.create({
        data: {
          followerId: follower,
          creatorId: creator,
        },
      })
      res.json({
        status: "create",
        data: "Followed!",
        msg: "Unfollow"
      });
    }
    else {
      res.json({
        status: "check",
        data: "Follow"
      });
    }
  }
});
//end follow Unfollow check Creator--------------------------------------------------------


//Ad Free Feature-------------------------------------------------------------------------
const adFreeFeature = asyncHandler(async (req, res) => {

  const state = req.body.data.state;
  const userId = parseInt(req.body.data.userId);

  const existUser = await user.update({
    where: {
      userId,
    },
    data: {
      advertisementVisibility: state,
    },
  });

  if (state) {
    res.json({
      msg: "Advertisments enabled"
    });
  }
  else {
    res.json({
      msg: "Advertisments disabled"
    });
  }

});
//End Ad Free Feature------------------------------------------------------------------------



module.exports = {
  uploadProfileOrCoverPicture,
  getUserDetails,
  checkUserName,
  updateUserDetails,
  uploadUserReport,
  getFollowersDetails,
  getFollowingsDetails,
  getTopCreatorsDetails,
  getAllCreatorsDetails,
  followUnfollowCreator,
  adFreeFeature,
};
