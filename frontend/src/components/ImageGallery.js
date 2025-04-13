import React from 'react';

function ImageGallery({ images, onDeleteImage }) {
  if (images.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Your Generated Images</h2>
        <p className="text-gray-500">No images generated yet. Try creating one!</p>
      </div>
    );
  }

  const downloadImage = async (imageUrl, prompt) => {
    try {
      // For data URLs (base64)
      if (imageUrl.startsWith('data:')) {
        const a = document.createElement('a');
        a.href = imageUrl;
        a.download = `image-${prompt.substring(0, 20).replace(/\s+/g, '-')}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } 
      // For remote URLs
      else {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `image-${prompt.substring(0, 20).replace(/\s+/g, '-')}.png`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Error downloading image:', error);
      alert('Failed to download image');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">Your Generated Images</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((image, index) => (
          <div key={image.id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="relative aspect-square bg-gray-100">
              <img 
                src={image.url} 
                alt={image.prompt}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            
            <div className="p-4">
              <p className="text-sm text-gray-500 mb-1">
                {new Date(image.timestamp).toLocaleString()}
              </p>
              <p className="font-medium mb-2 line-clamp-2" title={image.prompt}>
                {image.prompt}
              </p>
              <p className="text-xs text-gray-500 mb-3">
                Model: {image.model === 'stable-diffusion' ? 'Stable Diffusion' : 'DALL-E'}
              </p>
              
              <div className="flex justify-between">
                <button
                  onClick={() => downloadImage(image.url, image.prompt)}
                  className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                >
                  Download
                </button>
                <button
                  onClick={() => onDeleteImage(index)}
                  className="text-red-600 hover:text-red-800 text-sm font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ImageGallery; 