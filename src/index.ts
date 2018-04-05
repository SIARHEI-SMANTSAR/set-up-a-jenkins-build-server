import * as express from 'express';
import * as expressSession from 'express-session';
import * as cookieParser from 'cookie-parser';
import * as hpp from 'hpp';
import * as logger from 'morgan';

const PORT = Number(process.env.PORT) || 4000;

const app: express.Application = express();

app.use(logger('dev'));

app.use(
  expressSession({
    secret: 'ssi',
    resave: true,
    saveUninitialized: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(hpp());

app.get('*', (req, res) => {
  return res.json({ query: req.query });
});

app.listen(PORT, () => {
  console.log(`Running server at ${PORT}`);
});
