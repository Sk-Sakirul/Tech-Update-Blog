import { useNavigate } from "react-router-dom";
import { Input, RTE, Button } from "../";
import { useForm, Controller } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import dbService from "../../appwrite/config";
import { useCallback, useEffect, useState } from "react";
import { setPosts } from "../../app/postSlice";
import { toast } from "react-toastify";

const Post = ({ post }) => {
  const { register, watch, handleSubmit, setValue, control, getValues } = useForm({
    defaultValues: {
      title: post?.title || "",
      slug: post?.$id || "",
      content: post?.content || "",
      status: post?.status || "inactive",
    },
  });
  
  const currentTheme = localStorage.getItem("theme");
  const toastTheme =
    ["light", "cupcake", "aqua", "cyberpunk", "wireframe"].includes(currentTheme)
      ? "light"
      : "dark";

  const notifyOnUpdate = () =>
    toast.success("Updated Post Successfully", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      theme: toastTheme,
    });

  const notifyOnCreate = () =>
    toast.success("Post published successfully", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      theme: toastTheme,
    });

  const notifyAfterError = () =>
    toast.error("Something went wrong!!!", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      theme: toastTheme,
    });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.userData);
  const posts = useSelector((state) => state.post.posts);
  const [loading, setLoading] = useState(false);

  const submit = async (data) => {
    setLoading(true);
    data.slug = slugTransform(data.title);

    try {
      let dbPost;

      if (post) {
        const file = data.image?.[0] ? await dbService.uploadFile(data.image[0]) : null;
        if (file) dbService.deleteFile(post.featuredImage);

        dbPost = await dbService.updatePost(post.$id, {
          ...data,
          featuredImage: file ? file.$id : post.featuredImage,
        });

        if (dbPost) {
          const updatedPosts = posts.map((p) => (p.$id === dbPost.$id ? dbPost : p));
          dispatch(setPosts(updatedPosts));
          notifyOnUpdate();
        }
      } else {
        const file = await dbService.uploadFile(data.image?.[0]);
        if (file) {
          data.featuredImage = file.$id;
          dbPost = await dbService.createPost({
            ...data,
            userId: userData.$id,
          });

          if (dbPost) {
            dispatch(setPosts([dbPost, ...posts]));
            notifyOnCreate();
          }
        }
      }

      setLoading(false);
      if (dbPost) navigate(`/post/${dbPost.$id}`);
      else navigate("/");
    } catch (error) {
      notifyAfterError();
      setLoading(false);
      navigate("/");
    }
  };

  const slugTransform = useCallback((value) => {
    return value
      ?.trim()
      .toLowerCase()
      .replace(/[^a-zA-Z\d\s]+/g, "-")
      .replace(/\s/g, "-")
      .slice(0, 32) || "";
  }, []);

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "title") setValue("slug", slugTransform(value.title));
    });
    return () => subscription.unsubscribe();
  }, [watch, slugTransform, setValue]);

  return (
    <>
      <form onSubmit={handleSubmit(submit)} className="space-y-2">
        {post?.featuredImage && (
          <img
            src={dbService.getFilePreview(post.featuredImage)}
            alt={post.title}
            className="aspect-auto"
          />
        )}

        <div className="flex flex-wrap justify-between items-center">
          <Input
            type="file"
            accept="image/png, image/jpg, image/jpeg, image/gif, image/webp"
            {...register("image", { required: !post })}
          />
          <span className="flex space-x-2 items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
              />
            </svg>
            <p className="text-lg">Add cover image</p>
          </span>
        </div>

        <Input
          placeholder="Post Title Here..."
          {...register("title", { required: true })}
        />

        <RTE
          name="content"
          control={control}
          defaultValue={getValues("content") || ""}
        />

        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <div className="form-control p-4">
              <label className="label cursor-pointer">
                <span className="label-text">Publish/Update as Draft</span>
                <input
                  type="checkbox"
                  className={`toggle ${
                    field.value === "active" ? "bg-green-500" : "bg-red-500"
                  }`}
                  id={field.name}
                  {...field}
                  checked={field.value === "inactive"}
                  onChange={(e) => field.onChange(e.target.checked ? "inactive" : "active")}
                />
              </label>
            </div>
          )}
        />

        <Button type="submit" disabled={loading}>
          {loading ? (
            <span className="loading loading-spinner"></span>
          ) : post ? (
            "Update"
          ) : (
            "Publish"
          )}
        </Button>
      </form>
    </>
  );
};

export default Post;
