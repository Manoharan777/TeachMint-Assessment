import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import './userdetails.css';

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    };
  };
  phone: string;
  website: string;
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
}

interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

interface CustomModalProps {
  title: string;
  content: string;
  isOpen: boolean;
  closeModal: () => void;
}

const CustomModal: React.FC<CustomModalProps> = ({ title, content, isOpen, closeModal }) => {
  const modalStyle = {
    display: isOpen ? 'block' : 'none',
  };

  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent modal from closing when clicked inside
  };

  useEffect(() => {
    console.log('Modal isOpen:', isOpen);
  }, [isOpen]);

  return (
    <div className="modal" style={modalStyle} onClick={closeModal}>
      <div className="modal-content" onClick={handleModalClick}>
        <h1>{title}</h1>
        <p>{content}</p>
        <button className="btn cancel" onClick={closeModal}>
          Close
        </button>
      </div>
    </div>
  );
};



const UserDetails: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [countries, setCountries] = useState<string[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [clockTime, setClockTime] = useState<number>(0);
  const [isClockPaused, setIsClockPaused] = useState<boolean>(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Fetch data and set states
    fetch('https://worldtimeapi.org/api/timezone')
    .then((response) => response.json())
    .then((data) => setCountries(data))
    .catch((error) => console.error('Error fetching countries:', error));

  const fetchUsers = () => {
    // Fetch user details
    fetch(`https://jsonplaceholder.typicode.com/users/${userId}`)
      .then((response) => response.json())
      .then((data) => {
        setUser(data);
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
      });

    // Fetch user posts
    fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`)
      .then((response) => response.json())
      .then((data) => {
        setUserPosts(data);
      })
      .catch((error) => {
        console.error('Error fetching user posts:', error);
      });
  };

  fetchUsers();
  }, [userId]);

  useEffect(() => {
    // Fetch time and set clock
    const fetchTime = async () => {
      try {
        const response = await fetch(`https://worldtimeapi.org/api/timezone/${selectedCountry}`);
        const data = await response.json();
        const initialTimeInSeconds = Math.floor(new Date(data.datetime).getTime() / 1000);
        setClockTime(initialTimeInSeconds);
      } catch (error) {
        console.error('Error fetching time:', error);
      }
    };

    fetchTime();
  }, [selectedCountry]);

  useEffect(() => {
    // Set interval for clock
    let intervalId: NodeJS.Timeout;

    if (!isClockPaused) {
      intervalId = setInterval(() => {
        setClockTime((prevTime) => prevTime + 1);
      }, 1000);
    }

    return () => clearInterval(intervalId);
  }, [isClockPaused]);

  const handlePauseResume = () => {
    setIsClockPaused((prevIsClockPaused) => !prevIsClockPaused);
  };

  const formatTime = (totalSeconds: number): string => {
    if (isNaN(totalSeconds)) {
      return '00:00:00';
    }
    // Format time logic
    const hours = Math.floor(totalSeconds / 3600) % 24;
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const formatDigit = (digit: number): string => (digit < 10 ? `0${digit}` : `${digit}`);

    return `${formatDigit(hours)}:${formatDigit(minutes)}:${formatDigit(seconds)}`;
  };

  const openModal = (post: Post) => {
    console.log("modal open",post)
    setSelectedPost(post);
    setIsModalOpen(true);
    console.log("modal open set ",selectedPost)
  };

  const closeModal = () => {
    setSelectedPost(null);
    setIsModalOpen(false);
  };

  return (
    <>
      {user && (
        <div className="box">
          <div className="head">
            <Link to="/">
              <div>
                <button className="btnn">back</button>
              </div>
            </Link>
            <br />
            <h4 className='profile title'>Profile page</h4>
            <div className="dropdown">
              <label>Select Country: </label>
              <select value={selectedCountry} onChange={(e) => setSelectedCountry(e.target.value)}>
                <option value="">Select Country</option>
                {countries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>
            <div className="clock">
              <h3>Digital clock: <h1 className='clock-text'> {formatTime(clockTime)}</h1></h3>
              <button className="pausebtn" onClick={handlePauseResume}>
                {isClockPaused ? 'Start' : 'Pause'}
              </button>
            </div>
          </div>
          <div className='userinfo'>
  <div className='left-side'>
    <h3 className='name'>Name: {user.name}</h3>
    <h3 className='username'>Username: {user.username}</h3>
    <h3 className='cp'>Catch phrase: {user.company.catchPhrase}</h3>
  </div>
  <div className='right-side'>
    <h3 className='addd'>Address: {user.address.street} ,  {user.address.city}, {user.address.zipcode}</h3>
    <h3 className='email'>Email: {user.email}</h3>
    <h3 className='phn'>Phone: {user.phone}</h3>
  </div>
</div>


<div className="postsbox">
            {userPosts.map((post) => (
              <div key={post.id} className='post'>
                <div className='post-card' onClick={() => openModal(post)}>
                  <h4>{post.title}</h4>
                  <p>{post.body}</p>
                </div>
              </div>
            ))}
          </div>

          {isModalOpen && selectedPost && (
            <CustomModal
              title={selectedPost.title}
              content={selectedPost.body}
              isOpen={isModalOpen}
              closeModal={closeModal}
            />
          )}
        </div>
      )}
    </>
  );
};

export default UserDetails;
