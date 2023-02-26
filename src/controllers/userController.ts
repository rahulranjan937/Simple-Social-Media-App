import { NextFunction, Request, Response } from 'express';
import { UserService } from '@interfaces/IUser';

export class UserController {
  private userService = new UserService();

  public getUserByUsername = async (req: Request, res: Response, next: NextFunction) => {
    console.log('Get user by username');

    console.log(req.params);

    try {
      const user = await this.userService.getUserByQuery({ username: req.params.username });

      if (!user) {
        return res.status(400).json({
          message: 'User does not exist',
        });
      }

      return res.status(200).json({
        data: {
          username: user.username,
          email: user.email,
          name: user.name,
          avatar: user.avatar,
          followers: user.followers ? user.followers.length : 0,
          following: user.following ? user.following.length : 0,
          verified: user.verified,
          registerDate: user.resgisteredDate,
        },
      });
    } catch (err: any) {
      res.status(500).send('Internal Server Error');
      console.error(err.message);
    }
  };

  public getUserFollowers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.userService.getUserByQuery({ username: req.params.username });
      console.log(user);

      if (!user) {
        return res.status(400).json({
          message: 'User does not exist',
        });
      }

      const followers = await this.userService.getUsersByQuery({ _id: { $in: user.followers } } as any);
      console.log(followers);

      return res.status(200).json({
        message: 'Followers',
        data: followers,
      });
    } catch (err: any) {
      res.status(500).send('Internal Server Error');
      console.error(err.message);
    }
  };

  public followUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.userService.getUserByQuery({ username: req.params.username });

      if (!user) {
        return res.status(400).json({
          message: 'User does not exist',
        });
      }

      const currentUser = await this.userService.getUserByQuery({ _id: res.locals.user.id });

      if (!currentUser) {
        return res.status(400).json({
          message: 'User does not exist',
        });
      }

      const isFollowing = currentUser.following ? currentUser.following.includes(user._id as string) : false;

      if (isFollowing) {
        return res.status(400).json({
          message: 'User already followed',
        });
      }

      const updatedUser = await this.userService.updateUser(currentUser._id as string, {
        $push: { following: user._id },
      });

      if (!updatedUser) {
        return res.status(400).json({
          message: 'User does not exist',
        });
      }

      const updatedCurrentUser = await this.userService.updateUser(user._id as string, {
        $push: { followers: currentUser._id },
      });

      if (!updatedCurrentUser) {
        return res.status(400).json({
          message: 'User does not exist',
        });
      }

      return res.status(200).json({
        message: 'User followed',
      });
    } catch (err: any) {
      res.status(500).send('Internal Server Error');
      console.error(err.message);
    }
  };

  public unfollowUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.userService.getUserByQuery({ username: req.params.username });

      if (!user) {
        return res.status(400).json({
          message: 'User does not exist',
        });
      }

      const currentUser = await this.userService.getUserByQuery({ _id: res.locals.user.id });

      if (!currentUser) {
        return res.status(400).json({
          message: 'User does not exist',
        });
      }

      const isFollowing = currentUser.following ? currentUser.following.includes(user._id as string) : false;

      if (!isFollowing) {
        return res.status(400).json({
          message: 'User is not followed',
        });
      }

      const updatedUser = await this.userService.updateUser(currentUser._id as string, {
        $pull: { following: user._id },
      });

      if (!updatedUser) {
        return res.status(400).json({
          message: 'User does not exist',
        });
      }

      const updatedCurrentUser = await this.userService.updateUser(user._id as string, {
        $pull: { followers: currentUser._id },
      });

      if (!updatedCurrentUser) {
        return res.status(400).json({
          message: 'User does not exist',
        });
      }

      return res.status(200).json({
        message: 'User unfollowed',
      });
    } catch (err: any) {}
  };

  public getUserFollowing = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.userService.getUserByQuery({ username: req.params.username });

      if (!user) {
        return res.status(400).json({
          message: 'User does not exist',
        });
      }

      const following = await this.userService.getUsersByQuery({ _id: { $in: user.following } } as any);

      return res.status(200).json({
        message: 'Following',
        data: following,
      });
    } catch (err: any) {
      res.status(500).send('Internal Server Error');
      console.error(err.message);
    }
  };
}
