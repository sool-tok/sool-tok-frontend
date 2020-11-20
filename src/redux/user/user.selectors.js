import { createSelector } from 'reselect';

const selectUser = state => state.user;

export const selectCurrentUser = createSelector(
  selectUser,
  user => user.currentUser,
);

export const selectfriendList = createSelector(
  selectUser,
  user => user.currentUser.friendList,
);

export const selectFriendRequestList = createSelector(
  selectUser,
  user => user.currentUser.friendRequestList,
);

export const selectLoading = createSelector(selectUser, user => user.loading);

export const selectError = createSelector(selectUser, user => user.error);
