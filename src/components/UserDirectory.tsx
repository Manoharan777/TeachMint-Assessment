import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';


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

interface CardProps {
    user: User;
    postCount: number;
  }
  
  const Card: React.FC<CardProps> = ({ user, postCount }) => {
    return (
      <div className="card">
      <Link to={`/user-details/${user.id}`}>
        <div className="container">
          <div className="left-content">
            <h3>Name: {user.name}</h3>
          </div>
          <div className="right-content">
            <p>Posts: {postCount}</p>
          </div>
        </div>
      </Link>
    </div>
    );
  };
  
  const UserDirectory: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [userPosts, setUserPosts] = useState<Post[]>([]);
    
    useEffect(() => {
      const fetchUsers = async () => {
        try {
          const response = await fetch('https://jsonplaceholder.typicode.com/users');
          const data = await response.json();
          setUsers(data);
        } catch (error) {
          console.error('Error fetching users:', error);
        }
  
        try {
          const response = await fetch('https://jsonplaceholder.typicode.com/posts');
          const data = await response.json();
          setUserPosts(data);
        } catch (error) {
          console.error('Error fetching user posts:', error);
        }
      };
  
      fetchUsers();
    }, []);
  
    const getUserPostsCount = (userId: number): number => {
      // Filter user posts based on userId and get the count
      return userPosts.filter((post) => post.userId === userId).length;
    };
  
    return (
      <>
      <section>
      <div className="conatiner">
     <h1>User Directory</h1>
     <div className='cards'>
        <div className="card">
          {users.map((user) => (
            <Card key={user.id} user={user} postCount={getUserPostsCount(user.id)} />
          ))}
        </div>
        </div>
      </div>
      </section>
      </>
    );
  };
  
  export default UserDirectory;
  
