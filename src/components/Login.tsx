import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import ChatIcon from '@material-ui/icons/Chat';
import React, { FormEvent, useState } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from '../interfaces/client';
import { login } from '../state/actions';

function dispatchProps(dispatch: Dispatch) {
  return { login(name: string) { return dispatch(login(name)); } };
}

const useStyles = makeStyles((theme) => ({
  avatar: {
    backgroundColor: theme.palette.secondary.main,
    margin: theme.spacing(1),
  },
  form: { marginTop: theme.spacing(1) },
  paper: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    marginTop: theme.spacing(8),
  },
  submit: { margin: theme.spacing(3, 0, 2) },
}));

const LoginPure: React.FC<ReturnType<typeof dispatchProps>> = ({ login: dispatchLogin }) => {
  const classes = useStyles();
  const [ name, setName ] = useState<string>('');

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (name) {
      dispatchLogin(name);
      setName('');
    }
  }

  return <div className={classes.paper}>
    <Avatar className={classes.avatar}><ChatIcon /></Avatar>
    <Typography component='h1' variant='h5'>Enter your nickname</Typography>
    <form onSubmit={submit} className={classes.form}>
      <TextField
        variant='outlined'
        margin='normal'
        required
        fullWidth
        id='nick'
        label='Nickname'
        autoFocus
        value={name}
        onChange={(ref) => setName(ref.target.value) }
      />
      <Button
        type='submit'
        fullWidth
        variant='contained'
        color='primary'
        className='classes.submit'
        disabled={!name}
      >Join</Button>
    </form>
  </div>;
};

export const Login = connect(null, dispatchProps)(LoginPure);
