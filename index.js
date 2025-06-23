// server.js

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
// const cookieParser = require("cookie-parser");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: ["https://college-flow.vercel.app", "http://localhost:5173"],
    credentials: true,
  })
);

app.use(express.json());
// app.use(cookieParser());

// JWT verify middleware
// const verifyToken = (req, res, next) => {
//   const token = req.cookies?.token;
//   if (!token) return res.status(401).send({ message: "unauthorized access" });

//   jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
//     if (err) return res.status(401).send({ message: "unauthorized access" });
//     req.user = decoded;
//     next();
//   });
// };

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send({ message: "unauthorized access" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).send({ message: "unauthorized access" });
  }

  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "unauthorized access" });
    }
    req.user = decoded;
    next();
  });
};

// MongoDB connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4nvaj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const collegeCollection = client.db("collegeFlowDB").collection("colleges");
    const admissionCollection = client
      .db("collegeFlowDB")
      .collection("admissions");
    const reviewCollection = client.db("collegeFlowDB").collection("reviews");
    const userCollection = client.db("collegeFlowDB").collection("users");

    // JWT
    // app.post("/jwt", async (req, res) => {
    //   const email = req.body;
    //   const token = jwt.sign(email, process.env.SECRET_KEY, {
    //     expiresIn: "1d",
    //   });

    //   res
    //     .cookie("token", token, {
    //       httpOnly: true,
    //       secure: process.env.NODE_ENV === "production",
    //       sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    //     })
    //     .send({ success: true });
    // });
    app.post("/jwt", async (req, res) => {
      const user = req.body;
      const token = jwt.sign(user, process.env.SECRET_KEY, {
        expiresIn: "1h", // Standard practice
      });
      res.send({ token }); // Send token in response body
    });

    // Logout
    app.get("/logout", async (req, res) => {
      res
        .clearCookie("token", {
          httpOnly: true,
          maxAge: 0,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        })
        .send({ success: true });
    });

    // =============================
    // College Routes
    // =============================

    // Get all colleges
    app.get("/colleges", async (req, res) => {
      const result = await collegeCollection.find().toArray();
      res.send(result);
    });

    // Search college by name (optional: ?search=Name)
    app.get("/search-college", async (req, res) => {
      const search = req.query.search;
      const query = search ? { name: { $regex: search, $options: "i" } } : {};
      const result = await collegeCollection.find(query).toArray();
      res.send(result);
    });

    // Get single college
    app.get("/college/:id", async (req, res) => {
      const id = req.params.id;
      const result = await collegeCollection.findOne({ _id: new ObjectId(id) });
      res.send(result);
    });

    // Get gallery images from all colleges
    app.get("/gallery-images", async (req, res) => {
      const colleges = await collegeCollection.find().toArray();
      const galleryImages = colleges.flatMap(
        (college) => college.gallery || []
      );
      res.send(galleryImages);
    });

    // Get research papers from all colleges
    app.get("/research-papers", async (req, res) => {
      const colleges = await collegeCollection.find().toArray();
      const researchPapers = colleges.flatMap((college) =>
        (college.researchPapers || []).map((paper) => ({
          ...paper,
          collegeName: college.name,
        }))
      );
      res.send(researchPapers);
    });

    // =============================
    // Admission Routes
    // =============================

    app.post("/add-admission", verifyToken, async (req, res) => {
      const data = req.body;
      const result = await admissionCollection.insertOne(data);
      res.send(result);
    });

    // app.get("/admissions/:email", verifyToken, async (req, res) => {
    //   const decodedEmail = req.user?.email;
    //   const email = req.params.email;
    //   if (decodedEmail !== email)
    //     return res.status(401).send({ message: "unauthorized access" });

    //   const result = await admissionCollection.find({ email }).toArray();
    //   res.send(result);
    // });

  app.get("/my-admissions", verifyToken, async (req, res) => {
  const email = req.user.email; // Get email from token
  const result = await admissionCollection.find({ candidate_email: email }).toArray();
  res.send(result);
});

    // =============================
    // Review Routes
    // =============================

    app.post("/add-review", verifyToken, async (req, res) => {
      const review = req.body;
      const result = await reviewCollection.insertOne(review);
      res.send(result);
    });

    app.get("/reviews", async (req, res) => {
      const result = await reviewCollection.find().sort({ _id: -1 }).toArray();
      res.send(result);
    });

    // =============================
    // User Profile Routes
    // =============================

    app.post("/users", async (req, res) => {
      const user = req.body;
      // check if user exists
      const query = { email: user.email };
      const existingUser = await userCollection.findOne(query);
      if (existingUser) {
        return res.send({ message: "user already exists", insertedId: null });
      }
      const result = await userCollection.insertOne(user);
      res.send(result);
    });

    app.get("/user/:email", verifyToken, async (req, res) => {
      const email = req.params.email;
      const result = await userCollection.findOne({ email });
      res.send(result);
    });

    app.put("/user/:email", verifyToken, async (req, res) => {
      const email = req.params.email;
      const userInfo = req.body;

      const result = await userCollection.updateOne(
        { email },
        { $set: userInfo },
        { upsert: true }
      );
      res.send(result);
    });

    console.log("Connected to collegeFlowDB successfully");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}
run();

app.get("/", (req, res) => {
  res.send("collegeFlow server is running");
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
