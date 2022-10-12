const { PrismaClient } = require("@prisma/client");
const asyncHandler = require("express-async-handler");
const stripe = require("stripe")(process.env.SECRET_KEY);
const { v4: uuidv4 } = require("uuid");

const { user, transactionLog, billingAddress } = new PrismaClient();

const getPurchaseHistory = asyncHandler(async (req, res) => {
  const userId = parseInt(req.params.id);

  const history = await transactionLog.findMany({
    where: {
      userId: userId,
    },
    orderBy: {
      transactionDate: "desc",
    },
  });
  //
  const newHistory = history.map((item) => {
    const newItem = {
      ...item,
      transactionDate: item.transactionDate.toLocaleDateString(),
    };
    return newItem;
  });

  // console.log(history);

  // const convertedDate = history.transactionDate.toString("YYYY-MM-dd");
  // console.log(convertedDate);
  res.json(newHistory);
});

const registerBillingAddress = asyncHandler(async (req, res) => {
  const { userId, country, addressLine1, addressLine2, city, state, zipCode } =
    req.body;

  let { isDefault } = req.body;

  // check there exist any address, if not this one will be default address
  const addressStatus = await billingAddress.findFirst({
    where: {
      userId,
    },
  });

  if (!addressStatus) {
    isDefault = true;
  }

  if (isDefault) {
    await billingAddress.updateMany({
      where: {
        userId,
      },
      data: {
        isDefault: false,
      },
    });
  }

  let newBillingAddress = await billingAddress.create({
    data: {
      userId,
      country,
      addressLine1,
      addressLine2,
      city,
      state,
      zipCode,
      isDefault,
    },
  });

  const existUser = await user.findUnique({
    where: {
      userId,
    },
    select: {
      email: true,
      phone: true,
    },
  });

  newBillingAddress = {
    ...newBillingAddress,
    email: existUser.email,
    phone: existUser.phone,
  };

  res.json(newBillingAddress);
});

const getBillingAddresses = asyncHandler(async (req, res) => {
  const userId = parseInt(req.params.id);

  let address = await billingAddress.findMany({
    where: {
      userId: userId,
    },
    orderBy: {
      isDefault: "desc",
    },
  });

  const existUser = await user.findUnique({
    where: {
      userId,
    },
    select: {
      email: true,
      phone: true,
    },
  });

  address = address.map((item) => {
    const newItem = { ...item, email: existUser.email, phone: existUser.phone };
    return newItem;
  });

  res.json(address);
});

const getPremiumPackageStatus = asyncHandler(async (req, res) => {
  const userId = parseInt(req.headers.userid);

  const existUser = await user.findUnique({
    where: {
      userId,
    },
    select: {
      premiumUser: true,
      premiumPackageEndDate: true,
    },
  });

  res.json(existUser);
});

const payment = asyncHandler(async (req, res) => {
  const writeLog = async (userId, stripeId, premiumStatus, premiumEndDate) => {
    const transaction = await transactionLog.create({
      data: {
        userId,
        transactionType: 2,
        stripeId,
        amount: 5,
      },
    });

    //today
    const dateValue = new Date();

    if (premiumStatus) {
      const extendDate = new Date(premiumEndDate);
      extendDate.setDate(extendDate.getDate() + 30);

      const updateUser = await user.update({
        where: {
          userId,
        },
        data: {
          premiumPackageEndDate: extendDate,
        },
      });

      res.json({ premiumUser: true, premiumPackageEndDate: extendDate });
    } else {
      dateValue.setDate(dateValue.getDate() + 30);

      const updateUser = await user.update({
        where: {
          userId,
        },
        data: {
          premiumPackageEndDate: dateValue,
          premiumUser: true,
        },
      });

      res.json({ premiumUser: true, premiumPackageEndDate: dateValue });
    }
  };

  const { userId, token, premiumStatus, premiumEndDate } = req.body;
  const idempontencyKey = uuidv4();

  // console.log(userId);
  // console.log(token);
  // console.log(premiumStatus);
  // console.log(typeof premiumStatus);

  await stripe.customers
    .create({
      email: token.email,
      source: token.id,
    })
    .then((customer) => {
      return stripe.charges.create(
        {
          amount: 5 * 100,
          currency: "usd",
          customer: customer.id,
          receipt_email: token.email,
          description: "Premium package subscribed.",
        },
        { idempotencyKey: idempontencyKey }
      );
      // console.log(temp);
      // console.log(customer.id);
    })
    .then((result) => {
      // console.log(result);

      writeLog(userId, result.id, premiumStatus, premiumEndDate);
    })
    .catch((error) => console.error(error));

  // res.json("address");
});

const cryptoPaymentSubscription = asyncHandler(async (req, res) => {
  const { userId, premiumStatus, premiumEndDate } = req.body;

  const transaction = await transactionLog.create({
    data: {
      userId,
      transactionType: 2,
      amount: 5,
    },
  });

  //today
  const dateValue = new Date();

  if (premiumStatus) {
    const extendDate = new Date(premiumEndDate);
    extendDate.setDate(extendDate.getDate() + 30);

    const updateUser = await user.update({
      where: {
        userId,
      },
      data: {
        premiumPackageEndDate: extendDate,
      },
    });

    res.json({ premiumUser: true, premiumPackageEndDate: extendDate });
  } else {
    dateValue.setDate(dateValue.getDate() + 30);

    const updateUser = await user.update({
      where: {
        userId,
      },
      data: {
        premiumPackageEndDate: dateValue,
        premiumUser: true,
      },
    });

    res.json({ premiumUser: true, premiumPackageEndDate: dateValue });
  }
});

module.exports = {
  getPurchaseHistory,
  registerBillingAddress,
  getBillingAddresses,
  getPremiumPackageStatus,
  payment,
  cryptoPaymentSubscription,
};
