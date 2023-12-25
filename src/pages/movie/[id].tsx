"use client";
import { getFilmById } from "@/api";
import { FC, useContext, useEffect, useState } from "react";
import { MovieList } from "@/api";
import { useParams } from "next/navigation";
import { Hourglass } from "react-loader-spinner";
import { Header } from "@/components/Header/Header";
import { Theme } from "@/store/theme";
import { useRouter } from "next/router";
import { Modal } from "../../components/Modal/Modal";
import { Footer } from "@/components/Footer";
import file from "../../../public/static/file.png";
import res from "../../../public/static/res.png";
import Image from "next/image";

const Details: FC = () => {
  const [movieDetails, setMovieDetails] = useState<MovieList>();
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);
  const [comment, setComment] = useState({
    name: "",
    text: "",
  });
  const id = useParams()?.id;
  const { currentTheme } = useContext(Theme);
  const router = useRouter();

  const onCommentChange = (e) => {
    setComment((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const deleteComment = (comment) => {
    const newComments = comments.filter((item) => item != comment);
    setComments(newComments);
    localStorage.setItem(id, JSON.stringify(newComments));
  };

  const [comments, setComments] = useState([]);

  useEffect(() => {
    const data = JSON.parse(window.localStorage.getItem(id));
    if (data?.length) {
      setComments(data);
    }
  }, [id]);

  const onSendComment = () => {
    setShow(true);
  };

  useEffect(() => {
    const fetch = async () => {
      if (id) {
        setLoading(true);
        const response: MovieList = await getFilmById(id);
        setMovieDetails(response);
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  return (
    <>
      <Modal
        id={id}
        show={show}
        setShow={setShow}
        setComments={setComments}
      />
      <div
        className={`pt-20`}
        style={{
          backgroundColor: `${currentTheme == "black" ? "#191D46" : "#B3B8E3"}`,
        }}>
        <Header arrowBack={true} />
        {!loading ? (
          <section className="min-h-screen flex items-center flex-col pb-20 px-4 relative ">
            <div className="container py-20 px-20 flex flex-col lg:flex-row items-start max-sm:px-3">
              <div>
                <div
                  style={{
                    minWidth: "300px",
                    maxWidth: "400px",
                    minHeight: "600px",
                    position: "relative",
                  }}
                  className="mb-5 justify-center flex w-full">
                  <Image
                    layout="fill"
                    loading="lazy"
                    src={movieDetails?.large_cover_image || ""}
                    alt={movieDetails?.title || ""}
                  />
                </div>
                <div className="flex justify-between">
                  <button
                    onClick={() => {
                      router.push(movieDetails?.url || "");
                    }}
                    className="mb-5 py-4 w-full px-6 lex items-center justify-center border text-white  font-extrabold cursor-pointer rounded-lg bg-gray-500 hover:bg-black">
                    Watch now
                  </button>
                </div>
              </div>

              <div className="flex  lg:pl-20 flex-col w-full z-index-5">
                <p className="text-white text-4xl mb-2">
                  {movieDetails?.title}
                </p>
                {movieDetails?.description_full && (
                  <p className="text-gray-400 text-2xl mb-2">
                    {movieDetails?.description_full}
                  </p>
                )}
                <p className="text-white mb-3 text-2xl flex flex-wrap  items-center">
                  Genres:
                  {movieDetails?.genres?.map((genre, index) => (
                    <b
                      className="bg-gray-800 p-2 text-xl rounded-lg ml-2 mb-3"
                      key={index}>
                      {genre}
                    </b>
                  ))}
                </p>
                <div className="flex bg-gray-800 rounded-md p-3 ">
                  <p className="text-white text-xl mb-2 mr-5 ">
                    <b>Language: {movieDetails?.language} </b>
                  </p>
                  <p className="text-white text-xl mb-2 mr-5">
                    <b>Rating: {movieDetails?.rating} </b>
                  </p>
                  <p className="text-white text-xl mb-2 mr-5">
                    <b>Runtime: {movieDetails?.runtime} </b>
                  </p>
                </div>
                <div className="flex flex-row justify-between flex-wrap mt-5 ">
                  {movieDetails?.torrents?.map((torrent, index) => (
                    <a
                      href={torrent.url}
                      key={index}
                      className="flex border-2  max-w-sm bg-black p-5 bg-gray-800 text-black mb-2 rounded-md items-center border-transparent hover:bg-black">
                      <Image
                        src={res}
                        alt="res"
                        className="mr-4 invert"
                      />
                      <span className="mr-4  font-extrabold text-white">
                        {torrent.quality}
                      </span>
                      <Image
                        src={file}
                        alt="file"
                        className="mr-4 invert"
                      />
                      <span className="mr-4  font-extrabold text-white">
                        {torrent.size}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
            <div className="container flex flex-col flex items-center flex-col w-full">
              <p className="text-3xl text-white mb-5 mr-auto">Comments</p>
              <button
                onClick={onSendComment}
                className=" border rounded-md p-3 mt-3 bg-none mr-auto"
                style={{
                  color: `${currentTheme == "black" ? "white" : "black"}`,
                  borderColor: `${currentTheme == "black" ? "white" : "black"}`,
                }}>
                Make review
              </button>
              <div className="flex flex-col mt-10 w-full">
                {comments?.length > 0 ? (
                  comments?.map((comment, index) => (
                    <div
                      key={index}
                      className="flex flex-col border bg-gray-800 w-full p-5 text-white rounded-md mb-3">
                      <p className="text-xl extrabold mb-2">{comment.name}</p>
                      <p className="text-gray-200">{comment.text}</p>
                      <button
                        onClick={() => deleteComment(comment)}
                        className="ml-auto font-extrabold hover:text-rose-200">
                        DELETE
                      </button>
                    </div>
                  ))
                ) : (
                  <p
                    className={`text-3xl ${
                      currentTheme == "black" ? "text-white" : "text-black"
                    }`}>
                    No comments yet
                  </p>
                )}
              </div>
            </div>
          </section>
        ) : (
          <div className="flex justify-center items-center min-w-full min-h-screen">
            <Hourglass
              height="80"
              width="80"
              radius="9"
              color="#4d50bf"
              ariaLabel="loading"
            />
          </div>
        )}
        <Footer />
      </div>
    </>
  );
};

export default Details;
