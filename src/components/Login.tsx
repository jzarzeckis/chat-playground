import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import ChatIcon from '@material-ui/icons/Chat';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  form: { marginTop: theme.spacing(1) },
  submit: { margin: theme.spacing(3, 0, 2) }
}));

export const Login: React.FC = () => {
  const classes = useStyles();

  return <div className={classes.paper}>
    <Avatar className={classes.avatar}><ChatIcon /></Avatar>
    <Typography component="h1" variant="h5">Enter your nickname</Typography>
    <form onSubmit={(e) => e.preventDefault()} className={classes.form} noValidate>
      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        id="nick"
        label="Nickname"
        autoFocus
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        className="classes.submit"
      >Join</Button>
    </form>
  </div>
}

