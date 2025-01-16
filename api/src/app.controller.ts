import { Controller, Get, Post, Query, Body, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  root(@Res() res: Response) {
    const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Meme Generator</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
        <style>
            .meme-preview {
                max-width: 100%;
                height: auto;
                margin-top: 20px;
            }
            .loading {
                display: none;
            }
        </style>
    </head>
    <body>
        <div class="container py-5">
            <h1 class="text-center mb-4">Meme Generator</h1>
            
            <div class="row justify-content-center">
                <div class="col-md-8">
                    <div class="card shadow-sm">
                        <div class="card-body">
                            <div class="mb-4">
                                <div class="mb-3">
                                    <label for="imageUrl" class="form-label">Image URL</label>
                                    <input type="url" class="form-control" id="imageUrl" 
                                           placeholder="Enter image URL" required>
                                </div>
                                <div class="mb-3">
                                    <label for="topText" class="form-label">Top Text</label>
                                    <input type="text" class="form-control" id="topText" 
                                           placeholder="Enter top text" required>
                                </div>
                                <div class="mb-3">
                                    <label for="bottomText" class="form-label">Bottom Text</label>
                                    <input type="text" class="form-control" id="bottomText" 
                                           placeholder="Enter bottom text" required>
                                </div>
                                <button id="generateButton" class="btn btn-primary w-100">Generate Meme</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div id="loading" class="text-center my-4 loading">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div>

            <div id="result" class="row justify-content-center mt-4">
                <!-- Meme will be displayed here -->
            </div>
        </div>

        <script>
            const generateButton = document.getElementById('generateButton');
            const loading = document.getElementById('loading');
            const result = document.getElementById('result');

            generateButton.onclick = async () => {
                const topText = document.getElementById('topText').value.trim();
                const bottomText = document.getElementById('bottomText').value.trim();
                const imageUrl = document.getElementById('imageUrl').value.trim();

                if (!topText || !bottomText || !imageUrl) {
                    result.innerHTML = '<div class="col-12"><div class="alert alert-warning">Please fill in all fields</div></div>';
                    return;
                }

                loading.style.display = 'block';
                result.innerHTML = '';

                try {
                    const response = await fetch('/api/generate-meme', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            top_text: topText,
                            bottom_text: bottomText,
                            image_url: imageUrl
                        })
                    });

                    if (!response.ok) {
                        throw new Error('Failed to generate meme');
                    }

                    const data = await response.json();
                    
                    result.innerHTML = \`
                        <div class="col-md-8 text-center">
                            <img src="\${data.url}" alt="Generated Meme" class="meme-preview">
                            <a href="\${data.url}" download="meme.jpg" class="btn btn-success mt-3">Download Meme</a>
                        </div>
                    \`;
                } catch (error) {
                    console.error('Error:', error);
                    result.innerHTML = \`
                        <div class="col-12">
                            <div class="alert alert-danger">
                                Error: \${error.message}
                            </div>
                        </div>
                    \`;
                } finally {
                    loading.style.display = 'none';
                }
            };
        </script>
    </body>
    </html>
    `;

    res.send(html);
  }

  @Post('api/generate-meme')
  async generateMeme(
    @Body('top_text') topText: string,
    @Body('bottom_text') bottomText: string,
    @Body('image_url') imageUrl: string,
    @Res() res: Response,
  ) {
    try {
      const result = await this.appService.generateMeme(topText, bottomText, imageUrl);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}
