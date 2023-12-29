import { MovieList, getFilms } from "@/api";
import { Card } from "@/components/Card/Card";
import { useContext, useEffect, useState } from "react";
import { Hourglass } from "react-loader-spinner";
import { Header } from "@/components/Header/Header";
import { Theme } from "@/store/theme";
import { Footer } from "@/components/Footer";
import { genres, sortTypes } from "../constants";
import { useDebounce } from "../hooks/useDebounce";
import InfiniteScroll from "react-infinite-scroll-component";

export default function Home() {
  const [films, setFilms] = useState([]);
  const [currentPage, setCurrentPage] = useState(2);
  const [genre, setGenre] = useState("all");
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("date_added");
  const { currentTheme } = useContext(Theme);
  const debouncedQuery = useDebounce(query, 1000);

  useEffect(() => {
    const fetch = async () => {
      const response = await getFilms(String(1), genre, debouncedQuery, sortBy);
      setFilms(response.movies);
    };
    fetch();
  }, [genre, debouncedQuery, sortBy]);

  const fetchMoreData = async () => {
    setCurrentPage((prev) => prev + 1);
    const response = await getFilms(
      String(currentPage),
      genre,
      debouncedQuery,
      sortBy
    );

    if (response.movies) {
      setFilms((prev) => [...prev, ...response.movies]);
    }
  };

  return (
    <div
      className={`pt-20`}
      style={{
        backgroundColor: `${currentTheme == "black" ? "#191D46" : "#B3B8E3"}`,
      }}>
      <Header arrowBack={false} />

      <main className="min-h-screen flex justify-center">
        <section className="flex flex-col items-center container py-20">
          <div className="flex items-center justify-between w-full mb-10  max-lg:flex-col">
            <h1
              className={`text-5xl  justify-center max-sm:mb-7 ${
                currentTheme == "black" ? "text-white" : "text-black"
              } mb-2 font-extrabold`}>
              FILMS
            </h1>
            <div className="flex max-md:flex-col">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="film name"
                className="placeholder:text-white bg-transparent px-4 py-3 border w-60 border-white rounded-md text-white font-bold ml-5 max-md:ml-0 max-md:mb-5"
              />

              <select
                defaultValue={"All"}
                onChange={(e) => setGenre(e.target.value)}
                className="bg-transparent px-4 py-3 border w-60 border-white rounded-md text-white font-bold ml-5 max-md:ml-0 max-md:mb-5">
                {genres.map((genre, index) => (
                  <option
                    key={index}
                    style={{
                      backgroundColor: `blueviolet`,
                    }}>
                    {genre}
                  </option>
                ))}
              </select>
              <select
                defaultValue={"All"}
                onChange={(e) => {
                  let selectedIndex = e.target.selectedIndex;
                  let value = e.target.options[selectedIndex].value;
                  setSortBy(value);
                }}
                className="bg-transparent px-4 py-3 border w-60 border-white rounded-md text-white font-bold ml-5 max-md:ml-0">
                {sortTypes.map((type, index) => (
                  <option
                    style={{
                      backgroundColor: `blueviolet`,
                    }}
                    key={index}
                    value={type.value}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {films?.length > 0 ? (
            <InfiniteScroll
              dataLength={films.length}
              next={fetchMoreData}
              hasMore={true}
              loader={""}>
              <div className="flex flex-wrap justify-center mb-20">
                {films?.map((item: MovieList, index) => (
                  <Card
                    key={index}
                    id={item?.id}
                    rating={String(item?.rating)}
                    genre={genre == "all" ? item.genres[0] : genre}
                    description={item.description_full || item.summary}
                    title={item?.title}
                    year={item?.year}
                    medium_cover_image={item.medium_cover_image}
                  />
                ))}
              </div>
            </InfiniteScroll>
          ) : (
            <Hourglass
              height="300"
              width="300"
              radius="9"
              color="#4d50bf"
              ariaLabel="loading"
            />
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
