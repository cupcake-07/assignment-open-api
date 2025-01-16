import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpModule } from '@nestjs/axios';
import { Response } from 'express';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
    appService = app.get<AppService>(AppService);
  });

  describe('root', () => {
    it('should return HTML content', () => {
      const mockResponse = {
        send: jest.fn(),
      } as unknown as Response;

      appController.root(mockResponse);
      expect(mockResponse.send).toHaveBeenCalled();
    });
  });

  describe('generateMeme', () => {
    it('should generate a meme', async () => {
      const mockResponse = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      } as unknown as Response;

      const mockMemeData = {
        url: 'https://example.com/meme.jpg',
        success: true
      };

      jest.spyOn(appService, 'generateMeme').mockResolvedValue(mockMemeData);

      await appController.generateMeme(
        'top text',
        'bottom text',
        'https://example.com/image.jpg',
        mockResponse
      );

      expect(mockResponse.json).toHaveBeenCalledWith(mockMemeData);
    });

    it('should handle errors', async () => {
      const mockResponse = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      } as unknown as Response;

      const mockError = new Error('Failed to generate meme');
      jest.spyOn(appService, 'generateMeme').mockRejectedValue(mockError);

      await appController.generateMeme(
        'top text',
        'bottom text',
        'https://example.com/image.jpg',
        mockResponse
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: mockError.message });
    });
  });
});
