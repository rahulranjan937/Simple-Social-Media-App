import { NextFunction, Request, Response } from 'express';
import { BlobSASPermissions, BlobServiceClient, HttpRequestBody } from '@azure/storage-blob';

import { AZURE_STORAGE_CONNECTION_STRING } from '@config';
import { PostService } from '@interfaces/IPost';

export class PostController {
  private postService = new PostService();

  public createPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const files = req.files as any;
      const containerName = 'images';

      const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING as string);

      const containerClient = blobServiceClient.getContainerClient(containerName);

      await containerClient.createIfNotExists();

      const imageUrls = [] as any;

      const uploadPromises = files.map(
        async (file: { originalname: string; buffer: HttpRequestBody; size: number }) => {
          const blobName = file.originalname;

          const blockBlobClient = containerClient.getBlockBlobClient(blobName);

          await blockBlobClient.upload(file.buffer, file.size);

          const url = blockBlobClient.url;

          imageUrls.push(url);
        }
      );

      await Promise.all(uploadPromises);

      const payload = {
        caption: req.body.caption,
        user: res.locals.user.id,
        imageUrls: imageUrls,
      };

      const post = await this.postService.createPost(payload);

      res.status(201).json({
        status: 'success',
        data: post,
      });
    } catch (err: any) {
      res.status(500).send('Internal Server Error');
      console.error(err.message);
    }
  };

  public getPosts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const posts = (await this.postService.getPostsByQuery({ user: res.locals.user.id })) as any;

      const containerName = 'images';

      const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING as string);

      const containerClient = blobServiceClient.getContainerClient(containerName);

      const imageUrls = [] as any;

      const downloadPromises = posts.map(async (post: any) => {
        const downloadPromises = post.imageUrls.map(async (imageUrl: string) => {
          const blobName = imageUrl.split('/').pop();

          const blockBlobClient = containerClient.getBlockBlobClient(blobName as string);
          console.log(blockBlobClient);

          const expiresOn = new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 7);

          const url = await blockBlobClient.generateSasUrl({
            expiresOn,
            permissions: BlobSASPermissions.parse('r'),
          });

          imageUrls.push(url);
        });

        await Promise.all(downloadPromises);
      });

      await Promise.all(downloadPromises);

      res.status(200).json({
        count: posts.length,
        data: {
          posts,
          imageUrls,
        },
      });
    } catch (err: any) {
      res.status(500).send('Internal Server Error');
      console.error(err.message);
    }
  };

  public getPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const post = await this.postService.getPostByQuery({ _id: req.params.id });

      if (!post) {
        return res.status(404).json({
          message: 'Post not found',
        });
      }

      const containerName = 'images';

      const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING as string);

      const containerClient = blobServiceClient.getContainerClient(containerName);

      const imageUrls = [] as any;

      const downloadPromises = post.imageUrls.map(async (imageUrl: string) => {
        const blobName = imageUrl.split('/').pop();

        const blockBlobClient = containerClient.getBlockBlobClient(blobName as string);

        const expiresOn = new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 7);

        const url = await blockBlobClient.generateSasUrl({
          expiresOn,
          permissions: BlobSASPermissions.parse('r'),
        });

        imageUrls.push(url);
      });

      await Promise.all(downloadPromises);

      res.status(200).json({
        data: {
          post,
          imageUrls,
        },
      });
    } catch (err: any) {
      res.status(500).send('Internal Server Error');
      console.error(err.message);
    }
  };

  public deletePost = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const post = await this.postService.getPostByQuery({ _id: req.params.id });

      if (!post) {
        return res.status(404).json({
          message: 'Post not found',
        });
      }

      const containerName = 'images';

      const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING as string);

      const containerClient = blobServiceClient.getContainerClient(containerName);

      const deletePromises = post.imageUrls.map(async (imageUrl: string) => {
        const blobName = imageUrl.split('/').pop();

        const blockBlobClient = containerClient.getBlockBlobClient(blobName as string);

        await blockBlobClient.delete();
      });

      await Promise.all(deletePromises);

      await this.postService.deletePost(post._id as string);

      res.status(200).json({
        message: 'Post deleted',
      });
    } catch (err: any) {
      res.status(500).send('Internal Server Error');
      console.error(err.message);
    }
  };
}
