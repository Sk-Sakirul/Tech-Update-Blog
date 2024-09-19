import { useState } from 'react';
import { Link } from 'react-router-dom';
import dbService from '../appwrite/config';
import { useSelector } from 'react-redux';

const PostCard = ({ $id, title, featuredImage, $createdAt, author }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  const posts = useSelector((state) => state.post.posts)
  const post = posts.find((post) => post.$id === $id)
  const userData = useSelector((state) => state.auth.userData)
  const isAuthor = post && userData ? post.userId === userData.$id : false

  const getRelativeDate = (date) => {
    const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
    const now = new Date();
    const diff = now - date;
    const diffDays = Math.round(diff / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 30) return rtf.format(-diffDays, 'day');
    if (diffDays < 365) return rtf.format(-Math.round(diffDays / 30), 'month');
    return rtf.format(-Math.round(diffDays / 365), 'year');
  };

  return (
    <Link to={`/post/${$id}`} className="block h-full">
      <article className="bg-base-100 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden h-full flex flex-col">
        <div className="relative pt-[56.25%] bg-gray-200">
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="loading loading-spinner loading-md"></div>
            </div>
          )}
          <img
            src={dbService.getFilePreview(featuredImage)}
            alt={title}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
          />
        </div>
        <div className="p-4 flex-grow flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-semibold mb-2 line-clamp-2 hover:underline" title={title}>
              {title}
            </h2>
            <div className="flex items-center space-x-4 mb-4">
              <div className="avatar">
                <div className="w-9 h-9 rounded-full">
                  <img
                    src="https://thispersondoesnotexist.com/"
                    alt={`${author}'s avatar`}
                    className="object-cover"
                  />
                </div>
              </div>
              <span className="text-sm font-medium text-gray-700">{isAuthor ? userData.name : 'Anonymous'}</span>
            </div>
          </div>
          <time className="text-xs text-gray-500">
            {getRelativeDate(new Date($createdAt))}
          </time>
        </div>
      </article>
    </Link>
  );
};

export default PostCard;

