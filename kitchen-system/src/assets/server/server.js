const express = require('express');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();
// const WebSocket = require('ws');
const app = express();
const PORT = 3000;
const SECRET_KEY = process.env.SECRET_KEY;

app.use(cors());
app.use(express.json()); 

const USERS_FILE = path.join(__dirname, 'users.json');
// const ORDERS_FILE = path.join(__dirname, 'orders.json');


const readUsers = () => {
    if (fs.existsSync(USERS_FILE)) {
        try {
            const data = fs.readFileSync(USERS_FILE, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            console.error('Error reading or parsing users file:', error);
            return [];
        }
    }
    return [];
};



const writeUsers = (users) => {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
};



app.post('/register', async (req, res) => {

    const { firstName, lastName, email, phoneNumber, password } = req.body;

    if (!firstName || !lastName || !email || !phoneNumber || !password) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    const users = readUsers();
    const existingUser = users.find(user => user.email === email);

    if (existingUser) {
        return res.status(400).json({ message: 'User already exists with this email.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
        id: users.length + 1,
        firstName,
        lastName,
        email,
        phoneNumber,
        password: hashedPassword,
        role: email === 'aya@gmail.com' ? 'admin' : 'user',
    };

    users.push(newUser);
    writeUsers(users);

    res.status(201).json({ message: 'User registered successfully.' });
});




app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    const users = readUsers();
    const user = users.find(user => user.email === email);

    if (!user) {
        return res.status(400).json({ message: 'Invalid email or password.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(400).json({ message: 'Invalid email or password.' });
    }

    const token = jwt.sign({ userId: user.id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });

    res.status(200).json({
        message: 'Login successful.',
        token,
        user: {
            id: user.id,
            role: user.role
        }
    });
});



app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});




// const readOrders = () => {
//     if (fs.existsSync(ORDERS_FILE)) {
//         try {
//             const data = fs.readFileSync(ORDERS_FILE, 'utf8');
//             return JSON.parse(data);
//         } catch (error) {
//             console.error('Error reading or parsing orders file:', error);
//             return [];
//         }
//     }
//     return [];
// };



// const writeOrders = (orders) => {
//     fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));
// };



// app.post('/order', (req, res) => {
//     const order = req.body;

//     if (!order.userId || !order.orderItems || !order.totalPrice) {
//         return res.status(400).json({ message: 'Invalid order data.' });
//     }

//     const orders = readOrders();
//     order.id = orders.length + 1; 
//     orders.push(order);
//     writeOrders(orders);

 
//     wss.clients.forEach(client => {
//         if (client.readyState === WebSocket.OPEN) {
//             try {
//                 client.send(JSON.stringify(order));
//             } catch (error) {
//                 console.error('Error sending WebSocket message:', error);
//             }
//         }
//     });

//     res.status(201).json({ message: 'Order added successfully.' });
// });


// app.get('/order', (req, res) => {
//     const orders = readOrders();
//     res.status(200).json(orders);
// });


// const server = app.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
// });

// const wss = new WebSocket.Server({ server });

// wss.on('connection', ws => {
//     console.log('New client connected');

//     ws.on('message', message => {
//         console.log('Received:', message);
//         try {
//             const parsedMessage = JSON.parse(message);
          
//             wss.clients.forEach(client => {
//                 if (client.readyState === WebSocket.OPEN) {
//                     client.send(JSON.stringify(parsedMessage));
//                 }
//             });
//         } catch (error) {
//             console.error('Error parsing WebSocket message:', error);
//         }
//     });

//     ws.on('close', () => {
//         console.log('Client disconnected');
//     });
// });
