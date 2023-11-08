import React, { useState, useEffect } from 'react';

const API_KEY = '2c9733a1dfd970b673bb7581b847a49b';
const RECENT_PHOTOS_URL = `https://www.flickr.com/services/rest/?method=flickr.photos.getRecent&api_key=${API_KEY}&format=json&nojsoncallback=1`;
const SEARCH_PHOTOS_BASE_URL = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=${API_KEY}&format=json&nojsoncallback=1&text=`;

const ImageSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchPhotos, setSearchPhotos] = useState([]);

  useEffect(() => {
    const fetchRecentPhotos = async () => {
      try {
        const response = await fetch(RECENT_PHOTOS_URL);
        const data = await response.json();
        setSearchPhotos(data.photos.photo);
      } catch (error) {
        console.error('Error fetching recent photos:', error);
      }
    };
    fetchRecentPhotos();
  }, []);

  const handleSearch = async () => {
    try {
      let searchURL = RECENT_PHOTOS_URL;
      if (searchQuery) {
        searchURL = SEARCH_PHOTOS_BASE_URL + searchQuery;
      }
      const response = await fetch(searchURL);
      const data = await response.json();
      setSearchPhotos(data.photos.photo);
    } catch (error) {
      console.error('Error fetching photos:', error);
    }
  };

  return (
    <div>
      <div className='bg-dark text-center text-white py-2'>
        <h1>Image Search</h1>
        <input className="mx-1 py-1" type="text" placeholder="Search Images" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        <button className='btn btn-primary' onClick={handleSearch}>Search</button>
      </div>
      <div className="container py-3">
        <div className="row row-cols-4">
          {searchPhotos.map((photo) => (
            <div key={photo.id} className="col">
              <img
                src={`https://live.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}.jpg`}
                alt={photo.title}
                style={{ height: '200px', width: '200px', margin: "10px" }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImageSearch;
