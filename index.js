const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const session = require('express-session');
const path = require('path');
const cors = require('cors');

const sequelize = require('./Config/db');
//the attendance system is check for models
const User = require('./models/User');
const Course = require('./models/Course');
const Attendance = require('./models/Attendance');
const Enrollment = require('./models/Enrollment');

const graphqlHandler = require('./graphql');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: '*',
		methods: ['GET', 'POST'],
	},
});

/* ---------------- DATABASE RELATIONSHIPS ---------------- */

User.belongsToMany(Course, { through: Enrollment });
Course.belongsToMany(User, { through: Enrollment });

User.hasMany(Attendance);
Attendance.belongsTo(User);

Course.hasMany(Attendance);
Attendance.belongsTo(Course);

/* ---------------- DATABASE SYNC ---------------- */

sequelize
	.sync({ force: true, logging: console.log })
	.then(() => {
		console.log('✅ Database & tables created/ready (force recreated)');
	})
	.catch((err) => {
		console.error('❌ Database sync error:', err);
	});

/* ---------------- EXPRESS CONFIG ---------------- */

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

app.use(
	session({
		secret: 'your_secret_key',
		resave: false,
		saveUninitialized: true,
	}),
);

app.use(express.static(path.join(__dirname, 'public')));
app.use('/graphql', graphqlHandler);

app.set('io', io);

io.on('connection', (socket) => {
	console.log('👤 User connected:', socket.id);
	socket.on('disconnect', () => {
		console.log('👋 User disconnected:', socket.id);
	});
});

/* ---------------- AUTH MIDDLEWARE ---------------- */

function requireLogin(req, res, next) {
	if (!req.session.user) {
		return res.status(401).render('403', {
			errorMessage: 'You must be logged in',
		});
	}

	next();
}

/* ---------------- ROUTES ---------------- */

app.get('/', (req, res) => {
	res.render('landing');
});

app.get('/login', (req, res) => {
	res.render('login');
});

app.get('/attendance', requireLogin, (req, res) => {
	res.render('attendance', { username: req.session.user.username });
});

/* ---------------- SIGNUP ---------------- */

app.post('/signup', async (req, res) => {
	const { username, email, password } = req.body;

	if (!username || !email || !password) {
		return res.status(400).json({ message: 'All fields required' });
	}

	try {
		const existingUser = await User.findOne({
			where: { username },
		});

		if (existingUser) {
			return res.status(409).json({
				message: 'Username already exists',
			});
		}

		await User.create({
			username,
			email,
			password,
		});

		res.json({ message: 'User registered successfully' });
	} catch (error) {
		res.status(500).json({
			message: 'Database error',
			error,
		});
	}
});

/* ---------------- LOGIN ---------------- */

app.post('/login', async (req, res) => {
	const { username, password } = req.body;

	try {
		const user = await User.findOne({
			where: { username },
		});

		if (!user) {
			return res.status(404).json({
				message: 'User not found',
			});
		}

		if (user.password !== password) {
			return res.status(401).json({
				message: 'Incorrect password',
			});
		}

		req.session.user = {
			username: user.username,
			email: user.email,
		};

		res.json({
			message: 'Login successful',
			redirectUrl: `/attendance?username=${username}`,
		});
	} catch (error) {
		res.status(500).json({
			message: 'Login error',
			error,
		});
	}
});

/* ---------------- SAVE ATTENDANCE ---------------- */

app.post('/saveAttendance', async (req, res) => {
	const { username, courses } = req.body;

	try {
		const user = await User.findOne({
			where: { username },
		});

		if (!user) {
			return res.status(404).json({
				message: 'User not found',
			});
		}

		for (const course of courses) {
			const newAttendance = await Attendance.create({
				UserId: user.id,
				courseName: course.courseName,
				delivered: course.delivered,
				attended: course.attended,
				percentage: course.percentage,
			});

			// Emit real-time update
			io.emit('attendanceUpdated', {
				username,
				attendance: newAttendance,
			});
		}

		res.json({
			message: 'Attendance saved in database (real-time broadcasted)',
		});
	} catch (error) {
		res.status(500).json({
			message: 'Attendance save error',
			error,
		});
	}
});

/* ---------------- LOAD ATTENDANCE ---------------- */

app.get('/loadAttendance', async (req, res) => {
	const { username } = req.query;

	try {
		const user = await User.findOne({
			where: { username },
		});

		if (!user) {
			return res.status(404).json({
				message: 'User not found',
			});
		}

		const attendance = await Attendance.findAll({
			where: { UserId: user.id },
		});

		res.json({
			username,
			courses: attendance,
		});
	} catch (error) {
		res.status(500).json({
			message: 'Error loading attendance',
			error,
		});
	}
});

/* ---------------- ERROR HANDLING ---------------- */

app.use((req, res) => {
	res.status(404).render('404', {
		errorMessage: 'Page not found',
	});
});

/* ---------------- START SERVER ---------------- */

server.listen(PORT, () => {
	console.log(
		`🚀 Server + Socket.IO + GraphQL running on http://localhost:${PORT}`,
	);
	console.log(`📊 GraphQL Playground: http://localhost:${PORT}/graphql`);
});
