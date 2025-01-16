import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AppService {
  private readonly apiKey = '6cac75f1damsh7b471e4721dcb97p18ceadjsndd00dd02cc1f';
  private readonly baseUrl = 'https://meme-generator6.p.rapidapi.com';

  constructor(private readonly httpService: HttpService) {}

  async generateMeme(topText: string, bottomText: string, imageUrl: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `${this.baseUrl}/generate-image`,
          {
            text_top: topText,
            text_bottom: bottomText,
            image_url: imageUrl,
          },
          {
            headers: {
              'x-rapidapi-key': this.apiKey,
              'x-rapidapi-host': 'meme-generator6.p.rapidapi.com',
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          }
        )
      );

      return response.data;
    } catch (error) {
      console.error('API Error:', error.response?.data || error.message);
      throw new HttpException(
        error.response?.data?.message || 'Failed to generate meme',
        error.response?.status || HttpStatus.BAD_REQUEST
      );
    }
  }
}
