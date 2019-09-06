import { Color } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import * as colors from '@material-ui/core/colors';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';

import { IBroadcastMessage } from '../../interfaces/common';

type AvatarClass = Exclude<keyof typeof colors, 'common'>;

type AvatarStyles = { [k in AvatarClass ]: { backgroundColor: string } };

// Avatars can be any collor except for those in common (black & white)
const avatarColors: AvatarStyles = Object.entries(colors)
  .filter(([ key ]) => key !== 'common')
  .reduce((acc: AvatarStyles, [ key, color ]) => {
    acc[key as AvatarClass] = { backgroundColor: (color as Color)[400] };
    return acc;
  }, {} as AvatarStyles);

const possibleAvatarClasses = Object.keys(avatarColors) as AvatarClass[];

/**
 * Maps the name to one of the avatar classes (chosen semi-randomly),
 * so that the same person would always get in the same color
 * @param name Name of the message author
 */
function memberAvatarClass(name: string): AvatarClass {
  return possibleAvatarClasses[name
    .split('')
    .reduce((acc, char) => acc + char.charCodeAt(0), 0) % possibleAvatarClasses.length
  ];
}

const useStyles = makeStyles(avatarColors);

export const ChatMessage: React.FC<IBroadcastMessage> = ({ author, message }) => {
  const classes = useStyles();
  return <ListItem>
    <ListItemAvatar>
      <Avatar className={classes[memberAvatarClass(author)]}>{author.slice(0, 2).toUpperCase()}</Avatar>
    </ListItemAvatar>
    <ListItemText primary={message} secondary={author} />
  </ListItem>;
};
