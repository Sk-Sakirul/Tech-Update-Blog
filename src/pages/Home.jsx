import { useEffect } from "react";
import { PostCard, Signup } from "../components";
import dbService from "../appwrite/config";
import { useDispatch, useSelector } from "react-redux";
import { setPosts as setPostsInStore } from "../app/postSlice";

export default function Home() {
  const { status: authStatus, userData } = useSelector((state) => state.auth);
  const { posts, searchTerm } = useSelector((state) => state.post);
  const dispatch = useDispatch();

  useEffect(() => {
    if (authStatus && !posts.length) {
      dbService
        .getPosts()
        .then((postsFromDB) => {
          if (postsFromDB) {
            dispatch(setPostsInStore(postsFromDB.documents));
          }
        })
        .catch((error) => {
          console.error("Error fetching posts: ", error);
        });
    }
  }, [authStatus, dispatch, posts.length]);

  const filteredPosts = posts.filter((post) =>
    post?.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!filteredPosts.length && authStatus) {
    return (
      <div className="h-screen w-full flex justify-center items-center">
        <h1 className="text-2xl">Not found!</h1>
      </div>
    );
  }

  if (!filteredPosts.length && !authStatus) {
    return (
      <div className="w-full">
        <div className="hero bg-base-200 min-h-screen">
          <div className="hero-content flex-col lg:flex-row-reverse p-4 lg:p-8 lg:max-w-full">
            <img
              src="/assets/hero_section_img.svg"
              className="max-w-sm w-full lg:w-1/2 mb-8 lg:mb-0"
              alt="Illustration"
            />
            <div className="lg:w-1/2">
              <h1 className="text-3xl lg:text-5xl font-bold mb-4">
              Nurturing Writers, One Post at a Time
              </h1>
              <p className="mb-6">
                Whether you're a seasoned blogger or just starting out, our
                platform provides the tools and community you need to succeed.
              </p>
              <button
                className="btn btn-primary"
                onClick={() => document.getElementById("signup").showModal()}
              >
                Join Our Community
              </button>
              <dialog id="signup" className="modal">
                <div className="modal-box">
                  <Signup />
                </div>
                <form method="dialog" className="modal-backdrop">
                  <button>close</button>
                </form>
              </dialog>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 mx-auto max-w-7xl">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {filteredPosts.map(
          (post) =>
            post?.status === "active" && (
              <div key={post.$id}>
                <PostCard
                  {...post}
                  author={userData?.name ?? "Unknown Author"}
                />
              </div>
            )
        )}
      </div>
    </div>
  );
}
