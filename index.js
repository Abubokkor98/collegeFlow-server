// server.js

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// JWT verify middleware
const verifyToken = (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) return res.status(401).send({ message: "unauthorized access" });

  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).send({ message: "unauthorized access" });
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
    app.post("/jwt", async (req, res) => {
      const email = req.body;
      const token = jwt.sign(email, process.env.SECRET_KEY, {
        expiresIn: "1d",
      });

      res
        .cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        })
        .send({ success: true });
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
    //  College Routes
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
