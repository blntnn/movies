import { FC, useContext } from "react";
import { useRouter } from "next/router";
import { Theme } from "@/store/theme";
import moon from "../../../public/static/moon.svg";
import sun from "../../../public/static/sun.svg";
import Image from "next/image";
import arrow from "../../../public/static/arrow.png";

interface HeaderProps {
  arrowBack: boolean;
}

export const Header: FC<HeaderProps> = ({ arrowBack }) => {
  const router = useRouter();

  const { currentTheme, toggleTheme } = useContext(Theme);

  const onArrowClick = () => {
    router.push("/");
  };
  return (
    <header
      className={`flex px-20 py-3  w-full py-1 border-b-2 justify-between items-center fixed top-0 left-0`}
      style={{
        zIndex: 6,
        backgroundColor: `${currentTheme == "black" ? "#B3B8E3" : "#191D46"}`,
      }}>
      <h1 className="text-xl flex text-white leading-loose ">HD FILMS</h1>
      <div className="flex items-center">
        {arrowBack && (
          <Image
            src={arrow}
            alt="arrow"
            onClick={onArrowClick}
            className="invert cursor-pointer"
          />
        )}
        <Image
          width={40}
          height={40}
          src={sun}
          className={`cursor-pointer ml-4 ${
            currentTheme == "black" ? "invert" : ""
          }`}
          alt="theme switch p-2"
          onClick={toggleTheme}
        />
      </div>
    </header>
  );
};
