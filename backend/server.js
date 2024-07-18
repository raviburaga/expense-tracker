const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const mongodbURI = 'mongodb+srv://buragaravi:qzlCHauz9boCgeCK@cluster0.aow0j7e.mongodb.net/';
const databaseName = 'Cluster0';

const JWT_SECRET = 'raviburaga'; // Replace with a secure secret

const dbConnection = new MongoClient(mongodbURI, { useNewUrlParser: true, useUnifiedTopology: true });

dbConnection.connect()
  .then(() => {
    console.log('Connected to MongoDB');
    const database = dbConnection.db(databaseName);
    const usersCollection = database.collection('users');
    const expensesCollection = database.collection('Expenses');

    // Function to generate JWT token
    const generateToken = (user) => {
      const payload = {
        userId: user._id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        // Add any other relevant user data
      };
      return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' }); // Adjust expiration as needed
    };

    // Middleware to verify JWT token
    const verifyToken = (req, res, next) => {
      const token = req.headers.authorization;
      if (!token) {
        return res.status(401).json({ message: 'Unauthorized - No token provided' });
      }

      jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
        if (err) {
          return res.status(401).json({ message: 'Unauthorized - Invalid token' });
        }
        req.user = decodedToken; // Attach decoded token to request object
        next();
      });
    };

    // Login endpoint
    app.post('/login', async (req, res) => {
      const { email, password } = req.body;
      try {
        const user = await usersCollection.findOne({ email });
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = generateToken(user); // Generate JWT token
        res.status(200).json({ message: 'Login successful', token, user });
      } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Internal Server Error' });
      }
    });

    // Signup endpoint
    app.post('/signup', async (req, res) => {
      const { name, email, phone, password } = req.body;
      try {
        const existingUser = await usersCollection.findOne({ email });
        if (existingUser) {
          return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = { name, email, phone, password: hashedPassword, salary: 0, expenses: [] };

        const result = await usersCollection.insertOne(newUser);
        const token = generateToken(newUser); // Generate JWT token
        res.status(201).json({ message: 'User created successfully', token, user: newUser });
      } catch (error) {
        console.error('Error signing up:', error);
        res.status(500).json({ message: 'Internal Server Error' });
      }
    });

    // Update salary endpoint
    app.put('/salary', verifyToken, async (req, res) => {
      try {
        const userId = req.user.userId;
        const { salary } = req.body;
        const filter = { _id: new ObjectId(userId) };
        const updateDoc = {
          $set: { salary }
        };
        const result = await usersCollection.updateOne(filter, updateDoc);
        if (result.modifiedCount === 1) {
          res.status(200).json({ message: 'Salary updated successfully' });
        } else {
          res.status(404).json({ message: 'User not found or no changes made' });
        }
      } catch (error) {
        console.error('Error updating salary:', error.message);
        res.status(500).json({ message: 'Internal Server Error' });
      }
    });

    // Get user's salary endpoint
    app.get('/salary', verifyToken, async (req, res) => {
      try {
        const userId = req.user.userId; // Extract userId from token payload
        const user = await usersCollection.findOne({ _id: new ObjectId(userId) }, { projection: { salary: 1 } });
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user.salary);
      } catch (error) {
        console.error('Error fetching user salary:', error.message);
        res.status(500).send('Internal Server Error');
      }
    });

    // Protected route to fetch expenses
    app.get('/expenses', verifyToken, async (req, res) => {
      try {
        const userId = req.user.userId; // Extract userId from token payload
        const expenses = await expensesCollection.find({ userId: new ObjectId(userId) }).toArray();
        res.status(200).json(expenses);
      } catch (error) {
        console.error('Error fetching expenses:', error.message);
        res.status(500).send('Internal Server Error');
      }
    });

    // Protected route to add expenses
    app.post('/expenses', verifyToken, async (req, res) => {
      try {
        const { amount, category, date } = req.body;
        const userId = req.user.userId; // Extract userId from token payload
        await expensesCollection.insertOne({ userId: new ObjectId(userId), amount, category, date });

        // Add expense to user's expenses array
        await usersCollection.updateOne(
          { _id: new ObjectId(userId) },
          { $push: { expenses: { amount, category, date } } }
        );

        res.status(201).send('Expense added successfully');
      } catch (error) {
        console.error('Error adding expense:', error.message);
        res.status(500).send('Internal Server Error');
      }
    });

    // Protected route to delete an expense
    app.delete('/expenses/:id', verifyToken, async (req, res) => {
      try {
        const expenseId = req.params.id;
        const userId = req.user.userId;
        const result = await expensesCollection.deleteOne({ _id: new ObjectId(expenseId), userId: new ObjectId(userId) });
        if (result.deletedCount === 1) {
          // Remove expense from user's expenses array
          await usersCollection.updateOne(
            { _id: new ObjectId(userId) },
            { $pull: { expenses: { _id: new ObjectId(expenseId) } } }
          );
          res.status(200).json({ message: 'Expense deleted successfully' });
        } else {
          res.status(404).json({ message: 'Expense not found' });
        }
      } catch (error) {
        console.error('Error deleting expense:', error.message);
        res.status(500).send('Internal Server Error');
      }
    });

    // Protected route to update an expense
    app.put('/expenses/:id', verifyToken, async (req, res) => {
      try {
        const expenseId = req.params.id;
        const userId = req.user.userId;
        const { amount, category, date } = req.body;
        const filter = { _id: new ObjectId(expenseId), userId: new ObjectId(userId) };
        const updateDoc = {
          $set: { amount, category, date }
        };
        const result = await expensesCollection.updateOne(filter, updateDoc);
        if (result.modifiedCount === 1) {
          // Update expense in user's expenses array
          await usersCollection.updateOne(
            { _id: new ObjectId(userId), 'expenses._id': new ObjectId(expenseId) },
            { $set: { 'expenses.$.amount': amount, 'expenses.$.category': category, 'expenses.$.date': date } }
          );
          res.status(200).json({ message: 'Expense updated successfully' });
        } else {
          res.status(404).json({ message: 'Expense not found or no changes made' });
        }
      } catch (error) {
        console.error('Error updating expense:', error.message);
        res.status(500).json({ message: 'Internal Server Error' });
      }
    });

  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
  });

const port = 5000;
app.listen(port, () => {
  console.log(`Server started at port: ${port}`);
});
