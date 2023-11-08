import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

const API_KEY = '2c9733a1dfd970b673bb7581b847a49b';
const RECENT_PHOTOS_URL = `https://www.flickr.com/services/rest/?method=flickr.photos.getRecent&api_key=${API_KEY}&format=json&nojsoncallback=1&safe_search=1`;
const SEARCH_PHOTOS_BASE_URL = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=${API_KEY}&format=json&nojsoncallback=1&text=your_search_query&safe_search=1`;

const ImageSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchPhotos, setSearchPhotos] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState({});

  useEffect(() => {
    const fetchRecentPhotos = async () => {
      try {
        const response = await fetch(RECENT_PHOTOS_URL);
        const data = await response.json();
        setSearchPhotos(data.photos.photo.filter(photo => photo.isfamily === 0 && photo.isfriend === 0 && photo.ispublic === 1)); // Filter inappropriate photos
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
        searchURL = `${SEARCH_PHOTOS_BASE_URL}${searchQuery}`;
        const response = await fetch(searchURL);
        const data = await response.json();
        setSearchPhotos(data.photos.photo.filter(photo => photo.isfamily === 0 && photo.isfriend === 0 && photo.ispublic === 1)); // Filter inappropriate photos
      }
    } catch (error) {
      console.error('Error fetching photos:', error);
    }
  };

  const openModal = (photo) => {
    setSelectedPhoto(photo);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
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
            <div key={photo.id} className="col" onClick={() => openModal(photo)}>
              <img
                src={`https://live.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}.jpg`}
                alt={photo.title}
                style={{ height: '200px', width: '200px', margin: "10px", cursor: 'pointer' }}
              />
            </div>
          ))}
        </div>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Photo Modal"
      >
        <img
          src={`https://live.staticflickr.com/${selectedPhoto.server}/${selectedPhoto.id}_${selectedPhoto.secret}.jpg`}
          alt={selectedPhoto.title}
          style={{ maxWidth: '100%', maxHeight: '100%' }}
        />
      </Modal>
    </div>
  );
};

export default ImageSearch;
